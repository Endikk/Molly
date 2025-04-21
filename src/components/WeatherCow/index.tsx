import { useState, useEffect } from "react";
import meteoData from "@/pages/stats/components/meteo.json";

// Import images directly - Vite will handle the bundling
import questionImg from "@/assets/image/question.png";
import solutionImg from "@/assets/image/solution.png";
import presentationImg from "@/assets/image/presentation.png";
// Weather images will be imported dynamically

// Animation states
enum AnimationState {
  PRESENTATION,
  QUESTION,
  SOLUTION,
  WEATHER
}

interface WeatherCowProps {
  cycleTime?: number; // Time in ms for the full animation cycle
  showDebug?: boolean; // Whether to show debug info
}

const WeatherCow: React.FC<WeatherCowProps> = ({ cycleTime = 6000, showDebug = true }) => {
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.PRESENTATION);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState<number>(0);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [weatherImages, setWeatherImages] = useState<Record<string, string>>({});
  
  // Load weather images dynamically
  useEffect(() => {
    const loadWeatherImages = async () => {
      try {
        // Try to dynamically import weather images
        const sunny = (await import("@/assets/image/sunny.png")).default;
        const rainy = (await import("@/assets/image/rainy.png")).default;
        const cloudy = (await import("@/assets/image/cloudy.png")).default;
        const mild = (await import("@/assets/image/mild.png")).default;
        
        setWeatherImages({
          sunny,
          rainy,
          cloudy,
          mild
        });
      } catch (err) {
        console.error("Failed to load weather images:", err);
      }
    };
    
    loadWeatherImages();
  }, []);
  
  // Get today's forecast (using the first entry of our data for demo)
  const todayForecast = meteoData[currentWeatherIndex];
  
  // Determine weather type based on data
  const getWeatherType = () => {
    const { temperature_c, pluie_mm, taux_de_nuage } = todayForecast;
    
    if (pluie_mm > 5) return "rainy";
    if (taux_de_nuage > 70) return "cloudy";
    if (temperature_c > 20) return "sunny";
    return "mild";
  };
  
  // Cycle through animation states
  useEffect(() => {
    const timePerState = cycleTime / 4; // Divide cycle time equally between 4 states now
    
    const animationTimer = setInterval(() => {
      setAnimationState(prevState => {
        if (prevState === AnimationState.WEATHER) {
          // When completing a cycle, move to next weather data
          setCurrentWeatherIndex(prev => (prev + 1) % meteoData.length);
          return AnimationState.PRESENTATION;
        }
        return prevState + 1;
      });
    }, timePerState);
    
    return () => clearInterval(animationTimer);
  }, [cycleTime]);

  // Handle image error
  const handleImgError = (imgPath: string) => {
    console.error(`Failed to load image: ${imgPath}`);
    setImgError(prev => ({ ...prev, [imgPath]: true }));
  };
  
  // Render different images based on the state
  const renderCowImage = () => {
    const weatherType = getWeatherType();
    
    switch (animationState) {
      case AnimationState.PRESENTATION:
        return (
          <div className="flex flex-col items-center">
            {imgError["presentation"] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border">
                <p className="text-red-500">Image not found</p>
              </div>
            ) : ( 
              <img 
                src={presentationImg}
                alt="The cow saying hello" 
                className="w-64 h-64 object-contain" 
                onError={() => handleImgError("presentation")}
              />
            )}
            <p className="text-lg mt-2 font-bold">Bonjour ! Je suis votre vache météorologue !</p>
          </div>
        );

      case AnimationState.QUESTION:
        return (
          <div className="flex flex-col items-center">
            {imgError["question"] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border">
                <p className="text-red-500">Image not found</p>
              </div>
            ) : ( 
              <img 
                src={questionImg}
                alt="The cow thinking about weather" 
                className="w-64 h-64 object-contain" 
                onError={() => handleImgError("question")}
              />
            )}
            <p className="text-lg mt-2 font-bold">Quelle météo aujourd'hui ?</p>
          </div>
        );
      
      case AnimationState.SOLUTION:
        return (
          <div className="flex flex-col items-center">
            {imgError["solution"] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border">
                <p className="text-red-500">Image not found</p>
              </div>
            ) : (
              <img 
                src={solutionImg}
                alt="Cow about to reveal the weather" 
                className="w-64 h-64 object-contain" 
                onError={() => handleImgError("solution")}
              />
            )}
            <p className="text-lg mt-2 font-bold">Voici la météo !</p>
          </div>
        );
        
      case AnimationState.WEATHER:
        const weatherImg = weatherImages[weatherType];
        return (
          <div className="flex flex-col items-center">
            {!weatherImg || imgError[weatherType] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border">
                <p className="text-red-500">Image not found: {weatherType}.png</p>
              </div>
            ) : (
              <img 
                src={weatherImg}
                alt={`Cow in ${weatherType} weather`} 
                className="w-64 h-64 object-contain" 
                onError={() => handleImgError(weatherType)}
              />
            )}
            <div className="mt-2 text-center">
              <p className="font-bold text-lg">{todayForecast.date}</p>
              <p>{todayForecast.temperature_c}°C | {weatherType}</p>
              <p>Précipitations: {todayForecast.pluie_mm}mm</p>
              <p>Nuages: {todayForecast.taux_de_nuage}%</p>
            </div>
          </div>
        );
    }
  };
  
  // Create a debug section
  const renderDebugInfo = () => {
    if (!showDebug) return null;
    
    return (
      <div className="mt-4 p-3 bg-gray-100 border rounded text-xs">
        <h3 className="font-bold text-sm mb-1">Debug Info:</h3>
        <p>Images being imported from:</p>
        <ul className="list-disc pl-4 mb-2">
          <li>src/assets/image/presentation.png</li>
          <li>src/assets/image/question.png</li>
          <li>src/assets/image/solution.png</li>
          <li>src/assets/image/{getWeatherType()}.png</li>
        </ul>
        <p>Make sure these files exist in your <strong>src/assets/image</strong> directory!</p>
        <button 
          className="mt-2 bg-blue-500 text-white px-2 py-1 text-xs rounded"
          onClick={() => setImgError({})}
        >
          Reset Image Errors
        </button>
      </div>
    );
  };
  
  return (
    <div className="weather-cow-container">
      {renderCowImage()}
      {renderDebugInfo()}
    </div>
  );
};

export default WeatherCow;
