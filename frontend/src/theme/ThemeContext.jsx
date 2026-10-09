import { createContext, useContext, useEffect, useState } from "react";

/** Light ivory is the default; midnight emerald preserved as an option. */
const THEMES = ["ivory", "emerald"];
const ThemeContext = createContext({ theme: "ivory", toggle: () => {}, setTheme: () => {} });

function stored() {
  const raw = localStorage.getItem("pp_theme") || "ivory";
  return THEMES.includes(raw) ? raw : "ivory"; // migrate old aura/dark/mist values
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(stored);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pp_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "ivory" ? "emerald" : "ivory"));

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
