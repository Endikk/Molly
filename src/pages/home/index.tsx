import { Button } from "@/components/ui/button";
import WeatherCow from "@/components/WeatherCow";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";

function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  
  const { todayWeather, currentLocation, isLoading } = useWeather();
  
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

  return (
    <div 
      ref={bgRef}
      className={`flex flex-col items-center justify-center h-screen relative z-10 transition-all duration-700 
                ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
      style={{ 
        backgroundImage: "url('/src/assets/background/b-sun.png')", 
        backgroundSize: "1920px 1080px",
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
      
      {/* Titre principal avec animation */}
      <div className="absolute top-10 left-10 md:left-20 text-white text-shadow-lg z-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-fadeIn">Météo Vache</h1>
        <p className="text-xl md:text-2xl font-light opacity-90 slide-in" 
           style={{ animationDelay: '0.3s' }}>
          {currentLocation || "Votre bulletin météo quotidien"}
        </p>
      </div>
      
      {/* Contenu principal */}
      <div className="flex flex-col-reverse md:flex-row w-full h-full relative z-10">
        {/* Section info météo */}
        <div className="md:w-1/3 h-full flex items-center justify-center px-4 md:px-10">
          {todayWeather ? (
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md p-6 rounded-2xl 
                          shadow-xl border border-white border-opacity-25 text-white max-w-md w-full
                          slide-in" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-2xl font-bold mb-4">Météo du jour</h2>
              <div className="text-sm text-white/80 mb-4">{todayWeather.date}</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Température</span>
                  <span className="font-semibold">{todayWeather.temperature_c}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Précipitations</span>
                  <span className="font-semibold">{todayWeather.pluie_mm} mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Nuages</span>
                  <span className="font-semibold">{todayWeather.taux_de_nuage}%</span>
                </div>
                <div className="w-full bg-white/30 h-1 rounded-full my-2"></div>
                <div className="flex justify-center">
                  <Link to="/stats">
                    <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-lg transition-all hover:scale-105">
                      Voir plus de détails
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md p-6 rounded-2xl 
                          shadow-xl border border-white border-opacity-25 text-white max-w-md w-full
                          slide-in" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-2xl font-bold mb-4">Météo du jour</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Température</span>
                  <span className="font-semibold">21°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Précipitations</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vent</span>
                  <span className="font-semibold">12 km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Humidité</span>
                  <span className="font-semibold">45%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section vache météo */}
        <div className="md:w-2/3 flex justify-end items-center pr-0 md:pr-12 lg:pr-24">
          <div className="w-full max-w-3xl transform scale-125 md:scale-150 transition-transform hover:scale-[1.52] duration-500
                          slide-in" style={{ animationDelay: '0.7s' }}>
            <WeatherCow cycleTime={9000} showDebug={false} />
          </div>
        </div>
      </div>

      {/* Boutons d'action améliorés */}
      <div className="absolute bottom-6 right-6 flex gap-4 z-20">
        <Link to="/stats">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg px-8 py-2.5 transition-all hover:scale-105 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiques
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;