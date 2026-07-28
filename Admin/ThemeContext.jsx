import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "admin_theme";

export const DEFAULT_THEME = {
  sidebarBg:     "#ffffff",
  sidebarText:   "#475569",
  sidebarActive: "#E8611A",
  headerBg:      "#ffffff",
  pageBg:        "#f8fafc",
  cardBg:        "#ffffff",
  accentColor:   "#E8611A",
  textPrimary:   "#0f172a",
  textSecondary: "#64748b",
  borderColor:   "#e2e8f0",
  darkMode:      false,
};

export function applyCSS(t) {
  const r = document.documentElement;
  r.style.setProperty("--admin-sidebar-bg",     t.sidebarBg     ?? DEFAULT_THEME.sidebarBg);
  r.style.setProperty("--admin-sidebar-text",   t.sidebarText   ?? DEFAULT_THEME.sidebarText);
  r.style.setProperty("--admin-sidebar-active", t.sidebarActive ?? DEFAULT_THEME.sidebarActive);
  r.style.setProperty("--admin-header-bg",      t.headerBg      ?? DEFAULT_THEME.headerBg);
  r.style.setProperty("--admin-page-bg",        t.pageBg        ?? DEFAULT_THEME.pageBg);
  r.style.setProperty("--admin-card-bg",        t.cardBg        ?? DEFAULT_THEME.cardBg);
  r.style.setProperty("--admin-accent",         t.accentColor   ?? DEFAULT_THEME.accentColor);
  r.style.setProperty("--admin-text-primary",   t.textPrimary   ?? DEFAULT_THEME.textPrimary);
  r.style.setProperty("--admin-text-secondary", t.textSecondary ?? DEFAULT_THEME.textSecondary);
  r.style.setProperty("--admin-border",         t.borderColor   ?? DEFAULT_THEME.borderColor);
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const t = saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
      // Apply immediately — before first render paint
      applyCSS(t);
      return t;
    } catch {
      applyCSS(DEFAULT_THEME);
      return DEFAULT_THEME;
    }
  });

  // Re-apply whenever theme object changes
  useEffect(() => {
    applyCSS(theme);
  }, [theme]);

  const updateTheme = (key, value) => {
    setTheme((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyCSS(next); // apply immediately, don't wait for useEffect
      return next;
    });
  };

  const resetTheme = () => {
    localStorage.removeItem(STORAGE_KEY);
    applyCSS(DEFAULT_THEME);
    setTheme({ ...DEFAULT_THEME });
  };

  const applyPreset = (preset) => {
    const next = { ...DEFAULT_THEME, ...preset };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    applyCSS(next); // apply immediately
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, applyPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
