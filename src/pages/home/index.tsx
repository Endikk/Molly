import { Button } from "@/components/ui/button";
import WeatherCow from "@/components/WeatherCow";
import { Link } from "@tanstack/react-router";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center min-h-[90vh] gap-8">
        {/* Text content in white block on left */}
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center md:text-left order-2 md:order-1">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Météo de Molly</h1>
          <p className="text-lg text-blue-600">
            Découvrez les prévisions météorologiques présentées par notre vache météorologue Molly.
            Elle vous informe sur le temps qu'il fait aujourd'hui avec son style unique !
          </p>
        </div>
        
        {/* Large central WeatherCow animation on right */}
        <div className="w-full max-w-lg order-1 md:order-2">
          <WeatherCow cycleTime={9000} showDebug={false} />
        </div>
      </div>

      {/* Stats button in bottom right corner */}
      <div className="absolute bottom-6 right-6">
        <Link to="/stats">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg px-6">
            Statistiques
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;