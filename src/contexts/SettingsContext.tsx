
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  geminiApiKey: string;
  serpApiKey: string;
  setGeminiApiKey: (key: string) => void;
  setSerpApiKey: (key: string) => void;
}

// Default environment variables (if defined in build time)
const ENV_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ENV_SERP_API_KEY = import.meta.env.VITE_SERP_API_KEY || '';

const defaultSettings: SettingsContextType = {
  geminiApiKey: '',
  serpApiKey: '',
  setGeminiApiKey: () => {},
  setSerpApiKey: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with environment variables if available
  const [geminiApiKey, setGeminiApiKey] = useState<string>(ENV_GEMINI_API_KEY);
  const [serpApiKey, setSerpApiKey] = useState<string>(ENV_SERP_API_KEY);

  // Load saved settings from localStorage as fallback
  useEffect(() => {
    // Only load from localStorage if environment variables are not provided
    if (!ENV_GEMINI_API_KEY) {
      const savedGeminiKey = localStorage.getItem('gemini_api_key');
      if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    }
    
    if (!ENV_SERP_API_KEY) {
      const savedSerpKey = localStorage.getItem('serp_api_key');
      if (savedSerpKey) setSerpApiKey(savedSerpKey);
    }
  }, []);

  // Save settings to localStorage when they change (only if they're not from env vars)
  useEffect(() => {
    if (geminiApiKey && geminiApiKey !== ENV_GEMINI_API_KEY) {
      localStorage.setItem('gemini_api_key', geminiApiKey);
    }
    
    if (serpApiKey && serpApiKey !== ENV_SERP_API_KEY) {
      localStorage.setItem('serp_api_key', serpApiKey);
    }
  }, [geminiApiKey, serpApiKey]);

  return (
    <SettingsContext.Provider 
      value={{ 
        geminiApiKey, 
        serpApiKey, 
        setGeminiApiKey, 
        setSerpApiKey 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
