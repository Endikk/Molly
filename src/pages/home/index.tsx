import { Button } from "@/components/ui/button";
import WeatherCow from "@/components/WeatherCow";
import { Link } from "@tanstack/react-router";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-red-600 relative z-10">
      {/* Full-height content without header */}
      <div className="flex w-full h-full justify-end items-center pr-0 md:pr-12 lg:pr-24">
        {/* Enlarged WeatherCow animation positioned to the right */}
        <div className="w-full max-w-3xl transform scale-125 md:scale-150">
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