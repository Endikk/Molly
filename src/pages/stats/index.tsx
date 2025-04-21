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

  useEffect(() => {
    setData(meteoData);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Météo</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left border-b">Date</th>
              <th className="py-3 px-4 text-left border-b">Température (°C)</th>
              <th className="py-3 px-4 text-left border-b">Précipitations (mm)</th>
              <th className="py-3 px-4 text-left border-b">Couverture nuageuse (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-4 border-b">{item.date}</td>
                <td className="py-2 px-4 border-b">{item.temperature_c}</td>
                <td className="py-2 px-4 border-b">{item.pluie_mm}</td>
                <td className="py-2 px-4 border-b">{item.taux_de_nuage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatsPage;
