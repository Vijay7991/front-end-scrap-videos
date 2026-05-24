import { createContext, useContext, useState, useEffect } from "react";

const ThemeCtx = createContext();

// Apply immediately so there's no flash on load
const saved = localStorage.getItem("sj-theme") || "dark";
document.body.setAttribute("data-theme", saved);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(saved);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("sj-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeCtx);
