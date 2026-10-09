import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "aura", toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("pp_theme") || "aura");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pp_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "aura" ? "dark" : "aura"));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
