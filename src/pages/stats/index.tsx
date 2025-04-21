import { useState, useEffect } from "react";
import meteoData from "./components/meteo.json";

interface MeteoData {
  date: string;
  pluie_mm: number;
  temperature_c: number;
  taux_de_nuage: number;
}

function StatsPage() {
  const [data, setData] = useState<MeteoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Rouen, France");
  
  useEffect(() => {
    // Simuler un chargement de données
    setLoading(true);
    setTimeout(() => {
      const location = meteoData.find(loc => loc.location === selectedLocation);
      setData(location?.data || []);
      setLoading(false);
    }, 800);
  }, [selectedLocation]);

  // Calcul des statistiques
  const avgTemp = data.length ? data.reduce((sum, day) => sum + day.temperature_c, 0) / data.length : 0;
  const avgCloud = data.length ? data.reduce((sum, day) => sum + day.taux_de_nuage, 0) / data.length : 0;
  const totalPrecip = data.length ? data.reduce((sum, day) => sum + day.pluie_mm, 0) : 0;
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 md:mb-0">Dashboard Météo</h1>
        <div className="flex items-center">
          <label htmlFor="location" className="mr-2 font-medium">Emplacement:</label>
          <select
            id="location"
            className="bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {meteoData.map((loc) => (
              <option key={loc.location} value={loc.location}>{loc.location}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-blue-400 bg-opacity-30 rounded-full mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10a7 7 0 0114 0 7 7 0 01-7 7m7-7a7 7 0 00-7-7m7 7H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Température moyenne</p>
              <p className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-orange-400 bg-opacity-30 rounded-full mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Nuages moyens</p>
              <p className="text-2xl font-bold">{avgCloud.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-green-400 bg-opacity-30 rounded-full mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Total précipitations</p>
              <p className="text-2xl font-bold">{totalPrecip.toFixed(1)} mm</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tableau de données */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Prévisions détaillées</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Température (°C)</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Précipitations (mm)</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Couverture nuageuse (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="py-3 px-4 border-b">{item.date}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${item.temperature_c > 20 ? 'bg-red-500' : item.temperature_c > 15 ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
                        {item.temperature_c}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b">{item.pluie_mm}</td>
                    <td className="py-3 px-4 border-b">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[150px]">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.taux_de_nuage}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{item.taux_de_nuage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
