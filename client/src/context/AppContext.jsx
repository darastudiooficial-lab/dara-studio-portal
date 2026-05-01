import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("dara-lang") || "EN");
  const [theme, setTheme] = useState(localStorage.getItem("dara-theme") || "dark");

  // Wizard state persistence
  const [wizardStep, setWizardStep] = useState(() => {
    return parseInt(localStorage.getItem("dara-wizard-step") || "0", 10);
  });

  const [wizardData, setWizardData] = useState(() => {
    const saved = localStorage.getItem("dara-wizard-data");
    return saved ? JSON.parse(saved) : {
      region: "US",
      levels: { ground: true },
      rooms: {},
      services: {},
      dims: {},
      dimExtras: [],
      uploads: {},
      pkgExtras: {},
    };
  });

  useEffect(() => {
    localStorage.setItem("dara-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("dara-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("dara-wizard-step", wizardStep.toString());
  }, [wizardStep]);

  useEffect(() => {
    localStorage.setItem("dara-wizard-data", JSON.stringify(wizardData));
  }, [wizardData]);

  const toggleLang = () => setLang(prev => (prev === "EN" ? "PT" : "EN"));
  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const resetWizard = () => {
    setWizardStep(0);
    setWizardData({
      region: "US",
      levels: { ground: true },
      rooms: {},
      services: {},
      dims: {},
      dimExtras: [],
      uploads: {},
      pkgExtras: {},
    });
    localStorage.removeItem("dara-wizard-step");
    localStorage.removeItem("dara-wizard-data");
  };

  return (
    <AppContext.Provider value={{ 
      lang, setLang, 
      theme, setTheme, 
      toggleLang, toggleTheme,
      wizardStep, setWizardStep,
      wizardData, setWizardData,
      resetWizard
    }}>
      {children}
    </AppContext.Provider>
  );
};
