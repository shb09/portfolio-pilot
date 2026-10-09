import { createContext, useContext, useEffect, useState } from "react";

/**
 * Porcelain light is the default; charcoal dark is the option.
 * Any stored legacy value (emerald/ivory/mist/aura/dark) migrates to
 * porcelain — this is what finally clears stuck green sessions.
 */
const THEMES = ["porcelain", "charcoal"];
const ThemeContext = createContext({ theme: "porcelain", toggle: () => {}, setTheme: () => {} });

function stored() {
  try {
    const raw = localStorage.getItem("pp_theme") || "porcelain";
    return THEMES.includes(raw) ? raw : "porcelain";
  } catch {
    return "porcelain";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(stored);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("pp_theme", theme);
    } catch {
      /* private mode: theme just won't persist */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "porcelain" ? "charcoal" : "porcelain"));

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
