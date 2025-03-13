import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'

function AppLayout () {
  return (
    <div>
      <div className='grid-background'></div>
      <main className="min-h-screen container pl-10 pr-10">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Code Hawks
      </div>
    </div>
  )
}

export default AppLayout
