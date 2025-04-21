import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherService, WeatherData } from '@/services/weatherService';

interface WeatherContextProps {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
  weatherData: WeatherData[];
  todayWeather: WeatherData | null;
  weatherType: 'sunny' | 'rainy' | 'cloudy' | 'mild';
  locations: string[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState('Rouen, France');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [todayWeather, setTodayWeather] = useState<WeatherData | null>(null);
  const [locations] = useState<string[]>(WeatherService.getLocations());
  const [isLoading, setIsLoading] = useState(true);

  // Détermine le type de météo actuel
  const weatherType = WeatherService.getWeatherType(todayWeather);

  // Charger les données météo
  const loadWeatherData = async (location: string) => {
    setIsLoading(true);
    try {
      const data = await WeatherService.fetchWeatherData(location);
      setWeatherData(data);
      setTodayWeather(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Erreur lors du chargement des données météo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Rafraîchir les données
  const refreshData = async () => {
    await loadWeatherData(currentLocation);
  };

  // Charger les données initiales et lors du changement de location
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation]);

  return (
    <WeatherContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      weatherData,
      todayWeather,
      weatherType,
      locations,
      isLoading,
      refreshData
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
