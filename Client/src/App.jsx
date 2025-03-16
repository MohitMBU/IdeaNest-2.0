import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import AppLayout from './layout/AppLayout'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Community from './pages/Community'
import ProtectedRoute from './components/protected-route'
import RoleSelection from './pages/RoleSelection'
import IdeaListing from './pages/ideaListing'
import CreateIdea from './pages/CreateIdea'
import ShowIdeas from './pages/ShowIdeas'
import MyPosts from './pages/MyPosts'
import IdeaDetails from './pages/IdeaDetails'
import ProjectSection from './pages/ProjectSection'
import SyncUser from "./auth/SyncUser.jsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element: <LandingPage />,
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
        path: "/ideas",
        element: (
          <ProtectedRoute>
            <ShowIdeas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-posts",
        element: (
          <ProtectedRoute>
            <MyPosts />
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
            <IdeaListing />
          </ProtectedRoute>
        )
      },
      {
        path: '/ideas/:id',
        element: (
          <ProtectedRoute>
            <IdeaDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/projects',
        element: (
          <ProtectedRoute>
            <ProjectSection />
          </ProtectedRoute>
        )
      }
    ]
  }
])
    

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SyncUser />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
