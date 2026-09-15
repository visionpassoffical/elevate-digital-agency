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
const STORAGE_KEY_AUTH = 'elevate_admin_session';

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    // Initial hydration from cache if available, else defaults
    if (typeof window !== 'undefined') {
      try {
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

  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_AUTH);
        if (raw) {
          const parsed: AdminSession = JSON.parse(raw);
          if (parsed && parsed.expiresAt > Date.now()) {
            return parsed;
          }
          localStorage.removeItem(STORAGE_KEY_AUTH);
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  // Fetch fresh content from server API
  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
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

  // Validate admin session with server
  useEffect(() => {
    refreshContent();

    if (adminSession?.token) {
      fetch('/api/admin/session', {
        headers: { Authorization: `Bearer ${adminSession.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.valid) {
            setAdminSession(null);
            localStorage.removeItem(STORAGE_KEY_AUTH);
          }
        })
        .catch(() => {
          // offline or error
        });
    }
  }, [adminSession?.token, refreshContent]);

  // Login handler
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        const session: AdminSession = {
          token: data.token,
          user: data.user,
          expiresAt: data.expiresAt,
        };
        setAdminSession(session);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection failed' };
    }
  };

  // Logout handler
  const logout = async () => {
    if (adminSession?.token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminSession.token}` },
        });
      } catch (e) {
        // ignore
      }
    }
    setAdminSession(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // Change Password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!adminSession?.token) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
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
      const token = adminSession?.token;
      if (!token) {
        throw new Error('You must be logged in as an administrator to save changes');
      }

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save content to server');
      }

      const resData = await res.json();
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
    if (!adminSession?.token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/reset-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminSession.token}` },
      });
      if (res.ok) {
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
    if (!adminSession?.token) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminSession.token}`,
            },
            body: JSON.stringify({
              filename: file.name,
              dataUrl,
            }),
          });
          const json = await res.json();
          if (res.ok && json.success && json.url) {
            resolve({ url: json.url });
          } else {
            reject(new Error(json.error || 'Upload failed'));
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
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
