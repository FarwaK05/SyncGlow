// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

// Import the new Layout component
import Layout from './layouts/Layout';

// Import all your page components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SkinAnalyzer from './pages/SkinAnalyzer';
import History from './pages/History';
import Profile from './pages/Profile';
import Consultation from './pages/Consultation';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Protected Route component - This logic remains unchanged
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray"></div>
        </div>
      );
    }
    return user ? children : <Navigate to="/login" />;
  };

  // Public Route component - This logic remains unchanged
  const PublicRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray"></div>
        </div>
      );
    }
    return !user ? children : <Navigate to="/dashboard" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* The main wrapper div and conditional Navbar are removed from here */}
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        {/* These routes are for users who are NOT logged in. They do not have the Navbar or Footer. */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* --- PROTECTED ROUTES --- */}
        {/* This single parent route is protected. If the user is logged in, it renders the Layout. */}
        {/* The Layout then renders the specific page (e.g., Dashboard) inside its <Outlet>. */}
        <Route
          element={
            <ProtectedRoute>
              <Layout user={user} />
            </ProtectedRoute>
          }
        >
          {/* All routes nested here will automatically have the Navbar and Footer */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/analyzer" element={<SkinAnalyzer user={user} />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/consultation" element={<Consultation user={user} />} />
          <Route path="/products" element={<Products user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/orders" element={<Orders user={user} />} />
        </Route>

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;