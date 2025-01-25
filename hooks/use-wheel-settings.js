"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "wheel-settings";

const defaultSettings = {
  ipsFilterEnabled: true,
  showBorder: true,
  borderThickness: 2,
  showShadow: true,
  centerSize: 15,
  arrowOffset: 0, // Y-axis offset for the arrow indicator
};

export function useWheelSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
    isLoaded,
  };
}
