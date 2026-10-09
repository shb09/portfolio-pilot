import { createContext, useContext, useEffect, useState } from "react";

/** Porcelain light is the default; midnight emerald preserved as an option. */
const THEMES = ["porcelain", "emerald"];
const ThemeContext = createContext({ theme: "porcelain", toggle: () => {}, setTheme: () => {} });

function stored() {
  const raw = localStorage.getItem("pp_theme") || "porcelain";
  return THEMES.includes(raw) ? raw : "porcelain"; // migrate old aura/dark/mist/ivory values
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(stored);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pp_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "porcelain" ? "emerald" : "porcelain"));

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
