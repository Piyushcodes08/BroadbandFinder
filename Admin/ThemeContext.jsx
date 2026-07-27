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

/** Inject theme as CSS custom properties on :root so every admin page
 *  can use var(--admin-*) without needing useTheme() everywhere */
function applyCSS(t) {
  const root = document.documentElement;
  root.style.setProperty("--admin-sidebar-bg",     t.sidebarBg);
  root.style.setProperty("--admin-sidebar-text",   t.sidebarText);
  root.style.setProperty("--admin-sidebar-active", t.sidebarActive);
  root.style.setProperty("--admin-header-bg",      t.headerBg);
  root.style.setProperty("--admin-page-bg",        t.pageBg);
  root.style.setProperty("--admin-card-bg",        t.cardBg);
  root.style.setProperty("--admin-accent",         t.accentColor);
  root.style.setProperty("--admin-text-primary",   t.textPrimary);
  root.style.setProperty("--admin-text-secondary", t.textSecondary);
  root.style.setProperty("--admin-border",         t.borderColor);
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  // Apply CSS vars whenever theme changes
  useEffect(() => { applyCSS(theme); }, [theme]);

  const updateTheme = (key, value) => {
    setTheme((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem(STORAGE_KEY);
  };

  const applyPreset = (preset) => {
    const next = { ...DEFAULT_THEME, ...preset };
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
