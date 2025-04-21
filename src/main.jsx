import { StrictMode, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.js";

import HomePage from "./pages/home/index.tsx";
import StatsPage from "./pages/stats/index.tsx";
import ThemeToggle from "./components/ThemeToggle.tsx";
import KeyboardHelp from "./components/KeyboardHelp.tsx";

// Logo SVG simplifié représentant une vache météo
const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V4M12 20V21M4 12H3M5.5 5.5L4.8 4.8M18.5 5.5L19.2 4.8M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 18H14C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="font-bold text-xl">Météo Vache</span>
  </div>
);

// Navigation améliorée avec effets
const Navigation = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-gray-800 dark:to-gray-900 py-3 px-4 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="hover:text-blue-200 transition-colors relative group"
            activeProps={{ className: "text-white font-medium" }}
          >
            <span>Accueil</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/stats" 
            className="hover:text-blue-200 transition-colors relative group"
            activeProps={{ className: "text-white font-medium" }}
          >
            <span>Statistiques</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

// Pied de page professionnel
const Footer = () => (
  <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 py-4 text-center text-sm">
    <p>© {new Date().getFullYear()} Météo Vache - Tous droits réservés</p>
  </footer>
);

// Composant interne pour utiliser les hooks après le ThemeProvider
const AppContent = ({ router }) => {
  const { toggleTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  
  // Définition des raccourcis clavier
  const shortcuts = {
    "Navigation": {
      "h": {
        handler: () => router.navigate({ to: "/" }),
        description: "Aller à l'accueil"
      },
      "s": {
        handler: () => router.navigate({ to: "/stats" }),
        description: "Aller aux statistiques"
      }
    },
    "Interface": {
      "t": {
        handler: toggleTheme,
        description: "Changer de thème (clair/sombre)"
      },
      "?": {
        handler: () => setShowHelp(true),
        description: "Afficher cette aide"
      }
    }
  };
  
  // Activer les raccourcis clavier
  useKeyboardShortcuts(shortcuts);
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <KeyboardHelp shortcuts={shortcuts} isOpen={showHelp} onClose={() => setShowHelp(false)} />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </div>
  );
};

// Layout principal de l'application
const AppLayout = ({ router }) => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <AppContent router={router} />
      </WeatherProvider>
    </ThemeProvider>
  );
};

const rootRoute = createRootRoute({
  component: ({ router }) => <AppLayout router={router} />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: StatsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, statsRoute]);

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

reportWebVitals();
