import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("dara-lang") || "EN");
  const [theme, setTheme] = useState(localStorage.getItem("dara-theme") || "dark");
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [isVeraOpen, setIsVeraOpen] = useState(false);
  const [veraMessage, setVeraMessage] = useState("");

  // Wizard state (starts fresh each session)
  const [wizardStep, setWizardStep] = useState(0);

  const [wizardData, setWizardData] = useState({
    region: "US",
    levels: { ground: true },
    rooms: {},
    services: {},
    dims: {},
    dimExtras: [],
    uploads: {},
    pkgExtras: {},
  });

  useEffect(() => {
    localStorage.setItem("dara-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("dara-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = theme;
  }, [theme]);

  // No persistence for wizard state as per requirement to start fresh
  /* 
  useEffect(() => {
    localStorage.setItem("dara-wizard-step", wizardStep.toString());
  }, [wizardStep]);

  useEffect(() => {
    try {
      localStorage.setItem("dara-wizard-data", JSON.stringify(wizardData));
    } catch (e) {
      console.error("Failed to persist wizard data:", e);
    }
  }, [wizardData]);
  */

  const toggleLang = () => setLang(prev => (prev === "EN" ? "PT" : "EN"));
  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));
  const openEstimateModal = () => setIsEstimateModalOpen(true);
  const closeEstimateModal = () => setIsEstimateModalOpen(false);
  
  const openVera = (customMessage = "") => {
    setIsVeraOpen(true);
    if (customMessage) setVeraMessage(customMessage);
  };
  const closeVera = () => setIsVeraOpen(false);

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
      isEstimateModalOpen, openEstimateModal, closeEstimateModal,
      isVeraOpen, openVera, closeVera, veraMessage, setVeraMessage,
      wizardStep, setWizardStep,
      wizardData, setWizardData,
      resetWizard
    }}>
      {children}
    </AppContext.Provider>
  );
};
