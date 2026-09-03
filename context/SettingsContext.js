import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMiles, setIsMiles] = useState(false);

  // Student Profile State (Default Values)
  const [userProfile, setUserProfile] = useState({
    name: "Susindu Saksew",
    studentId: "80001370",
    phone: "0771234567",
    email: "susindu@student.edu",
    route: "Route 01 - Kandy to Campus",
    busStop: "Peradeniya Junction",
    gender: "Male"
  });

  
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('@user_profile');
      const savedTheme = await AsyncStorage.getItem('@theme_key');
      const savedUnit = await AsyncStorage.getItem('@unit_key');

      if (savedProfile !== null) setUserProfile(JSON.parse(savedProfile));
      if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
      if (savedUnit !== null) setIsMiles(JSON.parse(savedUnit));
    } catch (error) {
      console.error('Failed to load settings from AsyncStorage:', error);
    }
  };

  // Profile Update & Save
  const updateUserProfile = async (updatedData) => {
    try {
      setUserProfile(updatedData);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to save profile to AsyncStorage:', error);
    }
  };

  // Dark Mode Toggle & Save
  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('@theme_key', JSON.stringify(newMode));
    } catch (error) {
      console.error('Failed to save theme to AsyncStorage:', error);
    }
  };

  // Distance Unit Toggle & Save
  const toggleMiles = async () => {
    try {
      const newUnit = !isMiles;
      setIsMiles(newUnit);
      await AsyncStorage.setItem('@unit_key', JSON.stringify(newUnit));
    } catch (error) {
      console.error('Failed to save unit to AsyncStorage:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      isDarkMode, 
      setIsDarkMode,
      toggleDarkMode, 
      isMiles, 
      setIsMiles,
      toggleMiles, 
      userProfile, 
      updateUserProfile 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};