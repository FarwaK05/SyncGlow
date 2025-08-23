// src/layouts/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar'; // Import the Navbar

// The Layout now accepts the user object as a prop
const Layout = ({ user }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* The Navbar is now part of the layout */}
      <Navbar user={user} />
      
      <main className="flex-grow">
        {/* The Outlet renders the active page component (e.g., Dashboard, History) */}
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;