import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("dara-lang") || "EN");
  const [theme, setTheme] = useState(localStorage.getItem("dara-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("dara-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("dara-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    // Apply theme class to body for global styles
    document.body.className = theme;
  }, [theme]);

  const toggleLang = () => setLang(prev => (prev === "EN" ? "PT" : "EN"));
  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, toggleLang, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};
