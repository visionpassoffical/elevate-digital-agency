import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { SiteContent, AdminSession, AdminUser } from '../types';
import { INITIAL_SITE_CONTENT } from '../data/defaultSiteContent';

interface ContentContextValue {
  content: SiteContent;
  isLoading: boolean;
  isSaving: boolean;
  adminSession: AdminSession | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveContent: (updated: SiteContent) => Promise<boolean>;
  saveSection: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => Promise<boolean>;
  resetContent: () => Promise<boolean>;
  uploadFile: (file: File) => Promise<{ url: string } | null>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  // WhatsApp & Pricing Helpers
  getWhatsAppDigits: () => string;
  getWhatsAppNumber: () => string;
  getWhatsAppUrl: (messageText: string) => string;
  openWhatsAppMessage: (messageText: string) => boolean;
  formatWhatsAppTemplate: (
    templateKey: keyof SiteContent['whatsappSettings']['templates'],
    variables: Record<string, string | number>
  ) => string;
}

const STORAGE_KEY_CONTENT = 'elevate_site_content_cache';

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    // Initial hydration from cache if available, else defaults
    if (typeof window !== 'undefined') {
      try {
        // Clean up any legacy credential tokens from older versions
        localStorage.removeItem('elevate_admin_session');
        localStorage.removeItem('elevate_admin_token');

        const cached = localStorage.getItem(STORAGE_KEY_CONTENT);
        if (cached) {
          const parsed = JSON.parse(cached);
          return {
            ...INITIAL_SITE_CONTENT,
            ...parsed,
          };
        }
      } catch (e) {
        console.warn('Could not read cached site content:', e);
      }
    }
    return INITIAL_SITE_CONTENT;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  // Fetch fresh content from server API
  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.content) {
          setContent(data.content);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(data.content));
          }
        }
      }
    } catch (e) {
      console.warn('Using cached content (server unreachable):', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate admin session with server using secure HTTP-only cookie
  useEffect(() => {
    refreshContent();

    fetch('/api/admin/session', {
      credentials: 'include',
    })
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        return ct.includes('application/json') ? res.json() : null;
      })
      .then((data) => {
        if (data && data.valid && data.user) {
          setAdminSession({
            token: '',
            user: data.user,
            expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
        } else {
          setAdminSession(null);
        }
      })
      .catch(() => {
        setAdminSession(null);
      });
  }, [refreshContent]);

  // Login handler (authenticates on server, server sets secure HTTP-only cookie)
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        return {
          success: false,
          error: text
            ? (text.length > 150 ? `Server returned HTTP ${res.status}` : text)
            : `Server returned empty or non-JSON response (${res.status})`,
        };
      }

      const data = await res.json();
      if (res.ok && data.success) {
        const session: AdminSession = {
          token: data.token || '',
          user: data.user,
          expiresAt: data.expiresAt,
        };
        setAdminSession(session);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection failed' };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // ignore
    }
    setAdminSession(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Change Password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminSession?.token) {
        headers['Authorization'] = `Bearer ${adminSession.token}`;
      }
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        return { success: false, error: text || `Server error (${res.status})` };
      }

      const data = await res.json();
      return { success: res.ok && data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Save full content
  const saveContent = async (updated: SiteContent): Promise<boolean> => {
    setIsSaving(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminSession?.token) {
        headers['Authorization'] = `Bearer ${adminSession.token}`;
      }

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(updated),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || `Server returned non-JSON response (${res.status})`);
      }

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to save content to server');
      }

      const saved = resData.content || updated;
      setContent(saved);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(saved));
        window.dispatchEvent(new Event('elevate_content_updated'));
      }
      return true;
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Save specific section
  const saveSection = async <K extends keyof SiteContent>(section: K, data: SiteContent[K]): Promise<boolean> => {
    const updated: SiteContent = {
      ...content,
      [section]: data,
    };
    return saveContent(updated);
  };

  // Reset to approved defaults
  const resetContent = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const headers: Record<string, string> = {};
      if (adminSession?.token) {
        headers['Authorization'] = `Bearer ${adminSession.token}`;
      }
      const res = await fetch('/api/admin/reset-content', {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setContent(data.content);
        localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(data.content));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Upload image/logo
  const uploadFile = async (file: File): Promise<{ url: string } | null> => {
    if (!file) {
      throw new Error('No image file selected');
    }
    if (file.size === 0) {
      throw new Error('Selected file is empty (0 bytes)');
    }

    // Convert and optimize image file to ensure mobile photos (< 800px) fit payload limits comfortably
    const convertFileToOptimizedDataUrl = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        // For SVG files, preserve raw vector data URL directly
        if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result as string;
            if (res && res.trim()) {
              resolve(res);
            } else {
              reject(new Error('Selected SVG file is empty'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read SVG file'));
          reader.readAsDataURL(file);
          return;
        }

        // For raster images (PNG, JPEG, WebP), scale to max 800x800 to avoid payload bloating
        const reader = new FileReader();
        reader.onload = () => {
          const rawDataUrl = reader.result as string;
          if (!rawDataUrl || typeof rawDataUrl !== 'string' || !rawDataUrl.trim()) {
            return reject(new Error('Failed to read image data from file'));
          }

          // If browser Image & canvas are available, optimize dimensions
          if (typeof window !== 'undefined' && window.Image) {
            const img = new window.Image();
            img.onload = () => {
              try {
                const MAX_DIM = 800;
                let width = img.width || 800;
                let height = img.height || 800;

                if (width > MAX_DIM || height > MAX_DIM) {
                  if (width > height) {
                    height = Math.round((height * MAX_DIM) / width);
                    width = MAX_DIM;
                  } else {
                    width = Math.round((width * MAX_DIM) / height);
                    height = MAX_DIM;
                  }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  return resolve(rawDataUrl);
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const isPng = file.type.includes('png') || file.name.toLowerCase().endsWith('.png');
                const isWebp = file.type.includes('webp') || file.name.toLowerCase().endsWith('.webp');
                const outType = isPng ? 'image/png' : (isWebp ? 'image/webp' : 'image/jpeg');
                const quality = isPng ? undefined : 0.88;

                const optimizedDataUrl = canvas.toDataURL(outType, quality);
                resolve(optimizedDataUrl || rawDataUrl);
              } catch {
                resolve(rawDataUrl);
              }
            };
            img.onerror = () => resolve(rawDataUrl);
            img.src = rawDataUrl;
          } else {
            resolve(rawDataUrl);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file from your device'));
        reader.readAsDataURL(file);
      });
    };

    const dataUrl = await convertFileToOptimizedDataUrl();
    if (!dataUrl || !dataUrl.trim()) {
      throw new Error('No image data could be read from the selected file');
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminSession?.token) {
      headers['Authorization'] = `Bearer ${adminSession.token}`;
    }

    // Unified upload contract: send filename, imageData, dataUrl, image
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        filename: file.name,
        imageData: dataUrl,
        dataUrl,
        image: dataUrl,
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(text || `Upload error: server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (res.ok && json.success && json.url) {
      return { url: json.url };
    }

    throw new Error(json.error || 'Upload failed');
  };

  // WhatsApp Helpers
  const getWhatsAppDigits = useCallback(() => {
    return content.contact.whatsappDigits || '919497122397';
  }, [content.contact.whatsappDigits]);

  const getWhatsAppNumber = useCallback(() => {
    return content.contact.whatsappNumber || '+91 94971 22397';
  }, [content.contact.whatsappNumber]);

  const getWhatsAppUrl = useCallback(
    (messageText: string) => {
      const cleanMessage = (messageText || '').trim();
      const encoded = encodeURIComponent(cleanMessage);
      const digits = getWhatsAppDigits();
      return `https://wa.me/${digits}?text=${encoded}`;
    },
    [getWhatsAppDigits]
  );

  const openWhatsAppMessage = useCallback(
    (messageText: string): boolean => {
      try {
        const cleanMessage = (messageText || '').trim();
        if (!cleanMessage) return false;
        const url = getWhatsAppUrl(cleanMessage);
        if (typeof window !== 'undefined') {
          const win = window.open(url, '_blank', 'noopener,noreferrer');
          if (!win) {
            window.location.href = url;
          }
        }
        return true;
      } catch {
        return false;
      }
    },
    [getWhatsAppUrl]
  );

  const formatWhatsAppTemplate = useCallback(
    (
      templateKey: keyof SiteContent['whatsappSettings']['templates'],
      variables: Record<string, string | number>
    ): string => {
      let tmpl = content.whatsappSettings.templates[templateKey] || '';
      for (const [key, val] of Object.entries(variables)) {
        tmpl = tmpl.replaceAll(`{${key}}`, String(val));
      }
      return tmpl;
    },
    [content.whatsappSettings.templates]
  );

  const contextValue = useMemo<ContentContextValue>(
    () => ({
      content,
      isLoading,
      isSaving,
      adminSession,
      isAuthenticated: Boolean(adminSession && adminSession.expiresAt > Date.now()),
      login,
      logout,
      saveContent,
      saveSection,
      resetContent,
      uploadFile,
      changePassword,
      getWhatsAppDigits,
      getWhatsAppNumber,
      getWhatsAppUrl,
      openWhatsAppMessage,
      formatWhatsAppTemplate,
    }),
    [
      content,
      isLoading,
      isSaving,
      adminSession,
      getWhatsAppDigits,
      getWhatsAppNumber,
      getWhatsAppUrl,
      openWhatsAppMessage,
      formatWhatsAppTemplate,
    ]
  );

  return <ContentContext.Provider value={contextValue}>{children}</ContentContext.Provider>;
};

export const useContent = (): ContentContextValue => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
};
