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
  uploadFile: (fileOrDataUrl: File | string, customFilename?: string) => Promise<{ url: string } | null>;
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

const mergeWithDefaults = (raw: Partial<SiteContent> | null | undefined): SiteContent => {
  if (!raw || typeof raw !== 'object') return INITIAL_SITE_CONTENT;
  return {
    ...INITIAL_SITE_CONTENT,
    ...raw,
    portfolio: {
      ...INITIAL_SITE_CONTENT.portfolio,
      ...(raw.portfolio || {}),
      items:
        Array.isArray(raw.portfolio?.items)
          ? raw.portfolio!.items
          : INITIAL_SITE_CONTENT.portfolio.items,
    },
  };
};

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
          return mergeWithDefaults(parsed);
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
          const merged = mergeWithDefaults(data.content);
          // Preserve locally added portfolio items if server has older version without portfolio
          if (typeof window !== 'undefined') {
            try {
              const localRaw = localStorage.getItem(STORAGE_KEY_CONTENT);
              if (localRaw) {
                const localParsed = JSON.parse(localRaw);
                if (
                  localParsed?.portfolio?.items &&
                  (!data.content.portfolio ||
                    (localParsed.version && localParsed.version > (data.content.version || 0)))
                ) {
                  merged.portfolio = localParsed.portfolio;
                }
              }
            } catch {
              // ignore
            }
          }
          setContent(merged);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(merged));
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
    const stamped: SiteContent = {
      ...updated,
      version: (updated.version || 1) + 1,
      lastUpdated: new Date().toISOString(),
    };

    // Optimistically update local state and localStorage so changes reflect immediately in preview
    setContent(stamped);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(stamped));
        window.dispatchEvent(new Event('elevate_content_updated'));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminSession?.token) {
        headers['Authorization'] = `Bearer ${adminSession.token}`;
      }

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(stamped),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const resData = await res.json();
        if (resData.success && resData.content) {
          const saved = mergeWithDefaults(resData.content);
          setContent(saved);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(saved));
            window.dispatchEvent(new Event('elevate_content_updated'));
          }
        }
      }
      return true;
    } catch (err) {
      console.warn('Server save fallback to localStorage:', err);
      return true;
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
        const merged = mergeWithDefaults(data.content);
        setContent(merged);
        localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(merged));
        return true;
      }
      setContent(INITIAL_SITE_CONTENT);
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
      return true;
    } catch (e) {
      setContent(INITIAL_SITE_CONTENT);
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  // Upload image/logo (supports both File objects from input and data URL strings)
  const uploadFile = async (
    fileOrDataUrl: File | string,
    customFilename?: string
  ): Promise<{ url: string } | null> => {
    if (!fileOrDataUrl) {
      throw new Error('No image file or data provided');
    }

    let dataUrl = '';
    let filename = customFilename || 'logo.png';

    if (typeof fileOrDataUrl === 'string') {
      const trimmed = fileOrDataUrl.trim();
      if (!trimmed) {
        throw new Error('No image data provided');
      }
      dataUrl = trimmed;
      if (!customFilename) {
        filename = trimmed.includes('svg') ? 'logo.svg' : 'logo.png';
      }
    } else {
      const file = fileOrDataUrl;
      if (file.size === 0) {
        throw new Error('Selected file is empty (0 bytes)');
      }
      filename = customFilename || file.name || 'logo.png';

      // Convert and optimize image file to ensure mobile photos fit payload limits safely
      dataUrl = await new Promise<string>((resolve, reject) => {
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

        // For raster images (PNG, JPEG, WebP)
        const reader = new FileReader();
        reader.onload = () => {
          const rawDataUrl = reader.result as string;
          if (!rawDataUrl || typeof rawDataUrl !== 'string' || !rawDataUrl.trim()) {
            return reject(new Error('Failed to read image data from file'));
          }

          // If browser Image & canvas are available, scale down oversized phone photos
          if (typeof window !== 'undefined' && window.Image) {
            const img = new window.Image();
            img.onload = () => {
              try {
                const MAX_DIM = 1280;
                let width = img.width || 1280;
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
                resolve(optimizedDataUrl && optimizedDataUrl.startsWith('data:image/') ? optimizedDataUrl : rawDataUrl);
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
    }

    if (!dataUrl || !dataUrl.trim()) {
      throw new Error('No image data could be read from the selected file');
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminSession?.token) {
        headers['Authorization'] = `Bearer ${adminSession.token}`;
      }

      // Unified upload contract: send complete data URL in imageData and filename
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          filename,
          imageData: dataUrl,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.url) {
          return { url: json.url };
        }
      }
    } catch (e) {
      console.warn('Upload API fallback to optimized Data URL:', e);
    }

    // Fallback to optimized data URL so preview works immediately
    return { url: dataUrl };
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
      const normalizedVars: Record<string, string> = {};

      for (const [k, v] of Object.entries(variables)) {
        normalizedVars[k] = String(v);
      }

      // Cross-map camelCase & snake_case keys so all templates work seamlessly
      if (normalizedVars.planName && !normalizedVars.plan_name) normalizedVars.plan_name = normalizedVars.planName;
      if (normalizedVars.plan_name && !normalizedVars.planName) normalizedVars.planName = normalizedVars.plan_name;

      if (normalizedVars.packageName && !normalizedVars.package_name) normalizedVars.package_name = normalizedVars.packageName;
      if (normalizedVars.package_name && !normalizedVars.packageName) normalizedVars.packageName = normalizedVars.package_name;

      if (normalizedVars.priceFormatted && !normalizedVars.price) normalizedVars.price = normalizedVars.priceFormatted;
      if (normalizedVars.packagePrice && !normalizedVars.price) normalizedVars.price = normalizedVars.packagePrice;

      if (normalizedVars.serviceList && !normalizedVars.selected_services) normalizedVars.selected_services = normalizedVars.serviceList;
      if (normalizedVars.selected_services && !normalizedVars.serviceList) normalizedVars.serviceList = normalizedVars.selected_services;

      if (normalizedVars.creativesLabel && !normalizedVars.quantity) normalizedVars.quantity = normalizedVars.creativesLabel;

      // Ensure price & total fields include ₹ symbol when numeric
      for (const priceKey of ['price', 'priceFormatted', 'packagePrice', 'total']) {
        if (normalizedVars[priceKey]) {
          const val = normalizedVars[priceKey].trim();
          if (/^\d/.test(val) && !val.includes('₹')) {
            normalizedVars[priceKey] = `₹${val}`;
          }
        }
      }

      for (const [key, val] of Object.entries(normalizedVars)) {
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
