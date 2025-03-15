import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import AppLayout from './layout/AppLayout'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Community from './pages/Community'
import ProtectedRoute from './components/protected-route'
import RoleSelection from './pages/RoleSelection'
import IdeaListing from './pages/ideaListing'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/select-role',
        element: (
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        )
      },
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: '/community',
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        )
      },
      {
        path: '/ideas',
        element: (
          <ProtectedRoute>
            <IdeaListing />
          </ProtectedRoute>
        )
      }
    ]
  }
])

function App () {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
