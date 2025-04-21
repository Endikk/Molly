import { StrictMode } from "react";
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

import "./styles.css";
import reportWebVitals from "./reportWebVitals.js";

import HomePage from "./pages/home/index.tsx";
import StatsPage from "./pages/stats/index.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <nav className="bg-blue-800 p-4 text-white">
        <div className="max-w-7xl mx-auto flex justify-between">
          <span className="font-bold text-xl">Météo Vache</span>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Accueil</Link>
            <Link to="/stats" className="hover:underline">Statistiques</Link>
          </div>
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
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
