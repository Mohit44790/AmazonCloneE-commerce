import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Sticky Navbar at top */}
      <header className="sticky top-0 z-50 w-full">
        <Navbar />
      </header>

      {/* Main content grows to fill space between Navbar & Footer */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
        <Outlet />
      </main>

      {/* Footer always at bottom */}
      <footer className="w-full mt-auto">
        <Footer />
      </footer>

    </div>
  )
}

export default Layout