import { createContext, useContext, useEffect, useState } from "react";

const THEMES = ["emerald", "mist"];
const ThemeContext = createContext({ theme: "emerald", toggle: () => {}, setTheme: () => {} });

function stored() {
  const raw = localStorage.getItem("pp_theme") || "emerald";
  return THEMES.includes(raw) ? raw : "emerald"; // migrate old aura/dark values
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(stored);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pp_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "emerald" ? "mist" : "emerald"));

  return <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
