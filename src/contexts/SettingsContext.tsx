
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  geminiApiKey: string;
  serpApiKey: string;
  setGeminiApiKey: (key: string) => void;
  setSerpApiKey: (key: string) => void;
}

const defaultSettings: SettingsContextType = {
  geminiApiKey: '',
  serpApiKey: '',
  setGeminiApiKey: () => {},
  setSerpApiKey: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [serpApiKey, setSerpApiKey] = useState<string>('');

  // Load saved settings from localStorage
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedSerpKey = localStorage.getItem('serp_api_key');
    
    if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    if (savedSerpKey) setSerpApiKey(savedSerpKey);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (geminiApiKey) localStorage.setItem('gemini_api_key', geminiApiKey);
    if (serpApiKey) localStorage.setItem('serp_api_key', serpApiKey);
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
