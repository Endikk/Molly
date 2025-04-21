import { useState, useEffect } from "react";
import { useWeather } from "@/context/WeatherContext";

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

const WeatherCow: React.FC<WeatherCowProps> = ({ cycleTime = 6000, showDebug = false }) => {
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.PRESENTATION);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [weatherImages, setWeatherImages] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  
  const { todayWeather, weatherType, currentLocation } = useWeather();
  
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
  
  // Cycle through animation states with smooth transitions
  useEffect(() => {
    const timePerState = cycleTime / 4;
    
    const animationTimer = setInterval(() => {
      // Start transition animation
      setTransitioning(true);
      
      // After transition out completes, change state
      setTimeout(() => {
        setAnimationState(prevState => {
          if (prevState === AnimationState.WEATHER) {
            return AnimationState.PRESENTATION;
          }
          return prevState + 1;
        });
        
        // Start transition in
        setTransitioning(false);
      }, 300); // Match this with the CSS transition duration
      
    }, timePerState);
    
    return () => clearInterval(animationTimer);
  }, [cycleTime]);

  // Handle image error
  const handleImgError = (imgPath: string) => {
    console.error(`Failed to load image: ${imgPath}`);
    setImgError(prev => ({ ...prev, [imgPath]: true }));
  };
  
  // Get animation state text for accessibility and display
  const getStateDescription = () => {
    switch (animationState) {
      case AnimationState.PRESENTATION: return "Présentation";
      case AnimationState.QUESTION: return `Question sur la météo à ${currentLocation}`;
      case AnimationState.SOLUTION: return `Révélation de la météo pour ${currentLocation}`;
      case AnimationState.WEATHER: return `Météo: ${weatherType}`;
    }
  };
  
  // Render different images based on the state with transitions
  const renderCowImage = () => {
    const transitionClasses = transitioning ? 
      'opacity-0 transform translate-y-4' : 
      'opacity-100 transform translate-y-0';
    
    switch (animationState) {
      case AnimationState.PRESENTATION:
        return (
          <div className={`flex flex-col items-center transition-all duration-300 ${transitionClasses}`}>
            {imgError["presentation"] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border rounded-lg">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : ( 
              <div className="relative">
                <img 
                  src={presentationImg}
                  alt="La vache se présente" 
                  className="w-64 h-64 object-contain filter drop-shadow-lg" 
                  onError={() => handleImgError("presentation")}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-white opacity-25 rounded-full"></div>
              </div>
            )}
            <div className="mt-4 text-center bg-white bg-opacity-75 px-4 py-2 rounded-full shadow-md">
              <p className="text-lg font-bold text-blue-800">Bonjour ! Je suis votre vache météorologue !</p>
            </div>
          </div>
        );

      case AnimationState.QUESTION:
        return (
          <div className={`flex flex-col items-center transition-all duration-300 ${transitionClasses}`}>
            {imgError["question"] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border rounded-lg">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : ( 
              <div className="relative">
                <img 
                  src={questionImg}
                  alt="La vache réfléchit à la météo" 
                  className="w-64 h-64 object-contain filter drop-shadow-lg" 
                  onError={() => handleImgError("question")}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-white opacity-25 rounded-full"></div>
              </div>
            )}
            <div className="mt-4 text-center bg-white bg-opacity-75 px-4 py-2 rounded-full shadow-md">
              <p className="text-lg font-bold text-blue-800">Quelle météo aujourd'hui à {currentLocation} ?</p>
            </div>
          </div>
        );

      case AnimationState.SOLUTION:
        return (
          <div className={`flex flex-col items-center transition-all duration-300 ${transitionClasses}`}>
            {imgError["solution"] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border rounded-lg">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={solutionImg}
                  alt="La vache révèle la météo" 
                  className="w-64 h-64 object-contain filter drop-shadow-lg" 
                  onError={() => handleImgError("solution")}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-white opacity-25 rounded-full"></div>
              </div>
            )}
            <div className="mt-4 text-center bg-white bg-opacity-75 px-4 py-2 rounded-full shadow-md">
              <p className="text-lg font-bold text-blue-800">Voici la météo pour {currentLocation} !</p>
            </div>
          </div>
        );
        
      case AnimationState.WEATHER:
        const weatherImg = weatherImages[weatherType];
        return (
          <div className={`flex flex-col items-center transition-all duration-300 ${transitionClasses}`}>
            {!weatherImg || imgError[weatherType] ? (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border rounded-lg">
                <p className="text-red-500">Image non trouvée: {weatherType}.png</p>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={weatherImg}
                  alt={`La vache dans une météo ${weatherType}`} 
                  className="w-64 h-64 object-contain filter drop-shadow-lg" 
                  onError={() => handleImgError(weatherType)}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-white opacity-25 rounded-full"></div>
              </div>
            )}
            <div className="mt-4 text-center bg-white bg-opacity-75 px-4 py-2 rounded-full shadow-md">
              {todayWeather ? (
                <>
                  <p className="font-bold text-lg text-blue-800">{todayWeather.date}</p>
                  <p>{todayWeather.temperature_c}°C | {weatherType}</p>
                  <p>Précipitations: {todayWeather.pluie_mm}mm</p>
                  <p>Nuages: {todayWeather.taux_de_nuage}%</p>
                </>
              ) : (
                <p className="text-blue-800">Données météo non disponibles</p>
              )}
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
          <li>src/assets/image/{weatherType}.png</li>
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
    <div className="weather-cow-container relative">
      {/* Current state indicator */}
      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg">
        {getStateDescription()}
      </div>
      
      {renderCowImage()}
      {showDebug && renderDebugInfo()}
    </div>
  );
};

export default WeatherCow;
