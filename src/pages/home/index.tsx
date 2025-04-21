import { Button } from "@/components/ui/button";
import WeatherCow from "@/components/WeatherCow";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";

// Helper function to get the appropriate weather gradient based on weather type
const getWeatherGradient = (weatherType: string) => {
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

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  
  const { todayWeather, currentLocation, isLoading, weatherType } = useWeather();
  
  useEffect(() => {
    // Préchargement de l'image de fond pour éviter le flash
    const img = new Image();
    img.src = '/src/assets/background/b-sun.png';
    img.onload = () => {
      setImageLoaded(true);
      // Animation d'entrée après chargement de l'image
      setTimeout(() => setIsLoaded(true), 100);
    };
    
    // Fallback si l'image prend trop de temps
    const timeout = setTimeout(() => {
      if (!imageLoaded) {
        setIsLoaded(true);
      }
    }, 1500);
    
    // Animation parallaxe au survol
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        bgRef.current.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [imageLoaded]);

  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
    // Reset animation completion status after a delay
    setTimeout(() => setAnimationCompleted(false), 1000);
  };

  return (
    <div 
      ref={bgRef}
      className={`flex flex-col items-center justify-center min-h-screen relative z-10 transition-all duration-700 
                ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
      style={{ 
        backgroundImage: "url('/src/assets/background/b-sun.png')", 
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        transition: "background-position 0.3s ease-out"
      }}
    >
      {/* Effet de chargement progressif */}
      <div className={`absolute inset-0 bg-blue-500 z-30 transition-opacity duration-700 pointer-events-none
                      ${isLoaded && !isLoading ? 'opacity-0' : 'opacity-70'}`}>
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
        </div>
      </div>

      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-0"></div>
      
      {/* Titre principal avec animation */}
      <div className="absolute top-4 left-0 right-0 text-center text-white text-shadow-lg z-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-fadeIn">Météo Vache</h1>
        <p className="text-xl md:text-2xl font-light opacity-90 animate-fadeIn" 
           style={{ animationDelay: '0.3s' }}>
          {currentLocation || "Votre bulletin météo quotidien"}
        </p>
      </div>
      
      {/* Contenu principal - Format interview */}
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center mt-24 mb-10 relative z-10">
        {/* Section vache météo - Centrée */}
        <div className="w-full max-w-xl transform transition-all duration-500 
                      hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <WeatherCow 
            cycleTime={5000} // 10 secondes pour chaque état standard
            goodbyeTime={10000} // 30 secondes pour l'état au revoir
            showDebug={false}
            onAnimationComplete={handleAnimationComplete} 
          />
        </div>
        
        {/* Section info météo - Sous la vache */}
        <div className={`mt-8 w-full max-w-md transform transition-all duration-500 
                      ${animationCompleted ? 'scale-105' : 'scale-100'}`}>
          {todayWeather ? (
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md p-6 rounded-2xl 
                          shadow-xl border border-white border-opacity-25 text-white w-full
                          animate-fadeIn" style={{ animationDelay: '0.7s' }}>
              <h2 className="text-2xl font-bold mb-4 text-center">Résumé du jour</h2>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 bg-opacity-30 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Température</div>
                      <div className="font-bold">{todayWeather.temperature_c}°C</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 bg-opacity-30 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Précipitations</div>
                      <div className="font-bold">{todayWeather.pluie_mm} mm</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 bg-opacity-30 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Nuages</div>
                      <div className="font-bold">{todayWeather.taux_de_nuage}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 bg-opacity-30 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Date</div>
                      <div className="font-bold">{todayWeather.date}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-center">
                <Link to="/stats">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-lg 
                                   transition-all hover:scale-105 px-6 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Voir toutes les prévisions
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md p-6 rounded-2xl 
                        shadow-xl border border-white border-opacity-25 text-white
                        animate-fadeIn" style={{ animationDelay: '0.7s' }}>
              <p className="text-center">Chargement des données météo...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Citation du jour - Style interview */}
      <div className="absolute bottom-6 w-full text-center z-20">
        <div className="inline-block bg-white/30 backdrop-filter backdrop-blur-md px-6 py-3 rounded-full 
                      shadow-lg border border-white/40 text-white text-shadow-lg animate-fadeIn"
             style={{ animationDelay: '1s' }}>
          <p className="italic">
            "Le temps change, mais notre météo reste précise !"
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;