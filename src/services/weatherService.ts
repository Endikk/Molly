import meteoData from "@/pages/stats/components/meteo.json";

export interface WeatherData {
  date: string;
  pluie_mm: number;
  temperature_c: number;
  taux_de_nuage: number;
}

export interface LocationData {
  location: string;
  data: WeatherData[];
}

/**
 * Service pour récupérer les données météo
 */
export class WeatherService {
  /**
   * Récupère toutes les locations disponibles
   */
  static getLocations(): string[] {
    return meteoData.map(loc => loc.location);
  }
  
  /**
   * Récupère les données météo pour une location spécifique
   */
  static getWeatherForLocation(location: string): WeatherData[] {
    const locationData = meteoData.find(loc => loc.location === location);
    return locationData?.data || [];
  }
  
  /**
   * Récupère les données météo pour aujourd'hui
   */
  static getTodaysWeather(location: string = "Rouen, France"): WeatherData | null {
    const data = this.getWeatherForLocation(location);
    return data.length > 0 ? data[0] : null;
  }
  
  /**
   * Détermine le type de météo selon les données
   */
  static getWeatherType(data: WeatherData | null): 'sunny' | 'rainy' | 'cloudy' | 'mild' {
    if (!data) return 'sunny';
    
    const { temperature_c, pluie_mm, taux_de_nuage } = data;
    
    if (pluie_mm > 5) return "rainy";
    if (taux_de_nuage > 70) return "cloudy";
    if (temperature_c > 20) return "sunny";
    return "mild";
  }
  
  /**
   * Calcule des statistiques à partir des données
   */
  static getWeatherStats(location: string): {avgTemp: number, avgCloud: number, totalPrecip: number} {
    const data = this.getWeatherForLocation(location);
    
    const avgTemp = data.length ? data.reduce((sum, day) => sum + day.temperature_c, 0) / data.length : 0;
    const avgCloud = data.length ? data.reduce((sum, day) => sum + day.taux_de_nuage, 0) / data.length : 0;
    const totalPrecip = data.length ? data.reduce((sum, day) => sum + day.pluie_mm, 0) : 0;
    
    return { avgTemp, avgCloud, totalPrecip };
  }

  /**
   * Simule un appel API avec un délai
   */
  static async fetchWeatherData(location: string): Promise<WeatherData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getWeatherForLocation(location));
      }, 800);
    });
  }
}
