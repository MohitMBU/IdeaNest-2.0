import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/protected-route";
import RoleSelection from "./pages/RoleSelection";
import CreateIdea from "./pages/home/subpages/CreateIdea";
import Ideas from "./pages/home/subpages/Ideas";
import IdeaDetails from "./components/IdeaDetails";
import ProjectSection from "./pages/home/subpages/Projects";
import SyncUser from "./auth/SyncUser.jsx";
import Community from "./pages/Community/Community.jsx";
import SearchPage from "./pages/searchPage/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import ProfilePage from "./pages/Profile/ProfilePage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <SignedIn>
              <Navigate to="/home" />
            </SignedIn>
            <SignedOut>
              <LandingPage />
            </SignedOut>
          </>
        ),
      },
      {
        path: "/select-role",
        element: (
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-idea",
        element: (
          <ProtectedRoute>
            <CreateIdea />
          </ProtectedRoute>
        ),
      },
      {
        path: "/community",
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ideas",
        element: (
          <ProtectedRoute>
            <Ideas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/*",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ideas/:id",
        element: (
          <ProtectedRoute>
            <IdeaDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects",
        element: (
          <ProtectedRoute>
            <ProjectSection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*", // Wildcard route for 404 page
        element: <PageNotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SignedIn>
        <SyncUser />
      </SignedIn>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
