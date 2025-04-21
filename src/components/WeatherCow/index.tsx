import { useState, useEffect, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";

// Import images directly - Vite will handle the bundling
import questionImg from "@/assets/image/question.png";
import solutionImg from "@/assets/image/solution.png";
import presentationImg from "@/assets/image/presentation.png";
// Weather images will be imported dynamically

// Helper function to get the appropriate weather gradient based on weather type
const getWeatherGradient = () => {
  const { weatherType } = useWeather();
  switch (weatherType) {
    case 'sunny':
      return 'from-yellow-300 to-amber-500';
    case 'rainy':
      return 'from-blue-400 to-indigo-600';
    case 'cloudy':
      return 'from-gray-300 to-gray-500';
    case 'mild':
      return 'from-green-300 to-teal-500';
    default:
      return 'from-blue-300 to-indigo-400';
  }
};

// Animation states
enum AnimationState {
  PRESENTATION,
  QUESTION,
  SOLUTION,
  WEATHER,
  GOODBYE
}

interface WeatherCowProps {
  cycleTime?: number; // Base time in ms for states
  goodbyeTime?: number; // Extended time for the goodbye state in ms
  showDebug?: boolean; // Whether to show debug info
  onAnimationComplete?: () => void; // Callback when animation completes one cycle
}

const WeatherCow: React.FC<WeatherCowProps> = ({ 
  cycleTime = 10000, // 10 seconds per state by default
  goodbyeTime = 30000, // 30 seconds for goodbye state
  showDebug = false, 
  onAnimationComplete 
}) => {
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.PRESENTATION);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [weatherImages, setWeatherImages] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [bounceEffect, setBounceEffect] = useState(false);
  const [specialEffect, setSpecialEffect] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  
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
  
  // Modified cycle through animation states with state-specific durations
  useEffect(() => {
    // Function to handle state transition
    const transitionToNextState = () => {
      // Start transition animation
      setTransitioning(true);
      
      // Apply special effect based on current state
      if (animationState === AnimationState.QUESTION) {
        setSpecialEffect("thinking");
      } else if (animationState === AnimationState.SOLUTION) {
        setSpecialEffect("reveal");
      } else if (animationState === AnimationState.WEATHER) {
        setSpecialEffect("weather-info");
      } else if (animationState === AnimationState.GOODBYE) {
        setSpecialEffect("wave");
      }
      
      // After transition out completes, change state
      setTimeout(() => {
        setAnimationState(prevState => {
          if (prevState === AnimationState.GOODBYE) {
            if (onAnimationComplete) onAnimationComplete();
            setBounceEffect(true);
            setTimeout(() => setBounceEffect(false), 800);
            return AnimationState.PRESENTATION;
          }
          // Apply bounce effect on state change
          setBounceEffect(true);
          setTimeout(() => setBounceEffect(false), 800);
          return prevState + 1;
        });
        
        // Start transition in
        setTransitioning(false);
        
        // Schedule the next transition with the appropriate time
        scheduleNextTransition();
      }, 500); // Longer transition for smoother effect
    };
    
    // Function to schedule the next transition with the appropriate time
    const scheduleNextTransition = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Determine the duration for the current state
      const nextStateDuration = animationState === AnimationState.GOODBYE ? goodbyeTime : cycleTime;
      
      timerRef.current = window.setTimeout(transitionToNextState, nextStateDuration);
    };
    
    // Initial scheduling
    scheduleNextTransition();
    
    // Add random floating movement to the container
    const floatAnimation = () => {
      if (containerRef.current) {
        const randomX = Math.random() * 6 - 3; // -3 to +3px
        const randomY = Math.random() * 6 - 3; // -3 to +3px
        containerRef.current.style.transform = `translate(${randomX}px, ${randomY}px)`;
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.transform = `translate(0px, 0px)`;
          }
        }, 1500);
      }
    };
    
    // Create subtle floating animation at intervals
    const floatTimer = setInterval(floatAnimation, 3000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      clearInterval(floatTimer);
    };
  }, [cycleTime, goodbyeTime, onAnimationComplete, animationState]);

  // Handle image error
  const handleImgError = (imgPath: string) => {
    console.error(`Failed to load image: ${imgPath}`);
    setImgError(prev => ({ ...prev, [imgPath]: true }));
  };
  
  // Get special animation classes for the current animation state
  const getSpecialAnimationClass = () => {
    if (bounceEffect) return 'animate-bounce-custom';
    
    switch (specialEffect) {
      case 'thinking': return 'animate-thinking';
      case 'reveal': return 'animate-reveal';
      case 'weather-info': return 'animate-weather';
      case 'wave': return 'animate-wave';
      default: return '';
    }
  };
  
  // Render different images based on the state with transitions
  const renderCowImage = () => {
    const transitionClasses = transitioning ? 
      'opacity-0 transform translate-y-8 rotate-3' : 
      'opacity-100 transform translate-y-0 rotate-0';
      
    const specialAnimationClass = getSpecialAnimationClass();
    
    switch (animationState) {
      case AnimationState.PRESENTATION:
        return (
          <div className={`flex flex-col items-center transition-all duration-500 ${transitionClasses}`}>
            {imgError["presentation"] ? (
              <div className="w-96 h-96 bg-gray-200 flex items-center justify-center border rounded-lg shadow-inner">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : ( 
              <div className={`relative ${specialAnimationClass}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-indigo-200 rounded-full blur opacity-70"></div>
                <img 
                  src={presentationImg}
                  alt="La vache se présente" 
                  className="relative w-96 h-96 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300" 
                  onError={() => handleImgError("presentation")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full"></div>
              </div>
            )}
            <div className="mt-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all">
              <p className="text-xl font-bold text-white">Bonjour ! Je suis votre vache météorologue !</p>
            </div>
          </div>
        );

      case AnimationState.QUESTION:
        return (
          <div className={`flex flex-col items-center transition-all duration-500 ${transitionClasses}`}>
            {imgError["question"] ? (
              <div className="w-96 h-96 bg-gray-200 flex items-center justify-center border rounded-lg shadow-inner">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : ( 
              <div className={`relative ${specialAnimationClass}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur opacity-70"></div>
                <img 
                  src={questionImg}
                  alt="La vache réfléchit à la météo" 
                  className="relative w-96 h-96 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300" 
                  onError={() => handleImgError("question")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full"></div>
                <div className="absolute -top-5 -right-5">
                  <div className="animate-pulse bg-yellow-400 rounded-full p-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 text-center bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all">
              <p className="text-xl font-bold text-white">Quelle météo aujourd'hui à {currentLocation} ?</p>
            </div>
          </div>
        );

      case AnimationState.SOLUTION:
        return (
          <div className={`flex flex-col items-center transition-all duration-500 ${transitionClasses}`}>
            {imgError["solution"] ? (
              <div className="w-96 h-96 bg-gray-200 flex items-center justify-center border rounded-lg shadow-inner">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : (
              <div className={`relative ${specialAnimationClass}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur opacity-70"></div>
                <img 
                  src={solutionImg}
                  alt="La vache révèle la météo" 
                  className="relative w-96 h-96 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300" 
                  onError={() => handleImgError("solution")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-5">
                  <div className="animate-bounce bg-white rounded-full p-2 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 text-center bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all">
              <p className="text-xl font-bold text-white">Voici la météo pour {currentLocation} !</p>
            </div>
          </div>
        );
        
      case AnimationState.WEATHER:
        const weatherImg = weatherImages[weatherType];
        const weatherGradient = getWeatherGradient();
        
        return (
          <div className={`flex flex-col items-center transition-all duration-500 ${transitionClasses}`}>
            {!weatherImg || imgError[weatherType] ? (
              <div className="w-96 h-96 bg-gray-200 flex items-center justify-center border rounded-lg shadow-inner">
                <p className="text-red-500">Image non trouvée: {weatherType}.png</p>
              </div>
            ) : (
              <div className={`relative ${specialAnimationClass}`}>
                <div className={`absolute -inset-1 bg-gradient-to-r ${weatherGradient} rounded-full blur opacity-70`}></div>
                <img 
                  src={weatherImg}
                  alt={`La vache dans une météo ${weatherType}`} 
                  className="relative w-96 h-96 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300" 
                  onError={() => handleImgError(weatherType)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full"></div>
                
                {/* Weather-specific floating icons */}
                {weatherType === 'sunny' && (
                  <div className="absolute top-0 right-0 animate-spin-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
                {weatherType === 'rainy' && (
                  <div className="absolute bottom-10 left-0 right-0 flex justify-around">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-raindrop" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="h-4 w-1.5 bg-blue-400 rounded-full transform rotate-15"></div>
                      </div>
                    ))}
                  </div>
                )}
                {weatherType === 'cloudy' && (
                  <div className="absolute top-5 left-5 animate-float">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                )}
              </div>
            )}
            <div className={`mt-6 text-center bg-gradient-to-r from-violet-500 to-purple-500 p-5 rounded-2xl shadow-lg`}>
              {todayWeather ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-white/80">Date</span>
                    <span className="font-bold text-lg text-white">{todayWeather.date}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-white/80">Température</span>
                    <span className="font-bold text-lg text-white">{todayWeather.temperature_c}°C</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-white/80">Précipitations</span>
                    <span className="font-bold text-lg text-white">{todayWeather.pluie_mm} mm</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-white/80">Nuages</span>
                    <span className="font-bold text-lg text-white">{todayWeather.taux_de_nuage}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-white font-medium">Données météo non disponibles</p>
              )}
            </div>
          </div>
        );
      
      case AnimationState.GOODBYE:
        return (
          <div className={`flex flex-col items-center transition-all duration-500 ${transitionClasses}`}>
            {imgError["solution"] ? (
              <div className="w-96 h-96 bg-gray-200 flex items-center justify-center border rounded-lg shadow-inner">
                <p className="text-red-500">Image non trouvée</p>
              </div>
            ) : (
              <div className={`relative ${specialAnimationClass}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur opacity-70"></div>
                <img 
                  src={presentationImg} // Réutilisation de l'image de présentation
                  alt="La vache dit au revoir" 
                  className="relative w-96 h-96 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300" 
                  onError={() => handleImgError("presentation")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full"></div>
                
                {/* Floating stars and hearts */}
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} 
                         className="absolute animate-float-up" 
                         style={{
                           left: `${10 + i * 20}%`, 
                           bottom: `${10 + Math.random() * 40}%`,
                           animationDelay: `${i * 0.3}s`
                         }}>
                      {i % 2 === 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 text-center bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all">
              <p className="text-xl font-bold text-white">À demain pour de nouvelles prévisions !</p>
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
        <p>Current animation state: {AnimationState[animationState]}</p>
        <p>Special effect: {specialEffect || 'none'}</p>
        <p>Duration: {animationState === AnimationState.GOODBYE ? goodbyeTime/1000 : cycleTime/1000}s</p>
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
    <div 
      ref={containerRef}
      className="weather-cow-container relative transition-transform duration-[3s] ease-in-out"
    >
      {renderCowImage()}
      {showDebug && renderDebugInfo()}
    </div>
  );
};

export default WeatherCow;
