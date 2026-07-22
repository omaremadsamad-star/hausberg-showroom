import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      setLoading(true);
      const [settingsRes, categoriesRes, bannerRes] = await Promise.all([
        api.getSettings(),
        api.getCategories(),
        api.getBanner()
      ]);
      
      setSettings(settingsRes.data);
      setCategories(categoriesRes.data);
      setBanner(bannerRes.data);
    } catch (error) {
      console.error("Failed to load application data from APIs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  return (
    <AppContext.Provider value={{ settings, categories, banner, loading, refreshData: fetchAppData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
