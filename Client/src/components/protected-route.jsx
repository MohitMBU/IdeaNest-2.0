import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser()
  const { pathname } = useLocation()

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to='/?sign-in=true' />
  }

  if (
    user !== undefined &&
    !user?.unsafeMetadata?.role &&
    pathname !== '/select-role'
  )
    return <Navigate to='/select-role' />

  return children
}

export default ProtectedRoute