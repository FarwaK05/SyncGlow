// src/components/Navbar.jsx

import React, { useState } from 'react'; // Corrected import
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from '../services/supabaseClient';
import Button from './Button';

const Navbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      setIsMobileMenuOpen(false); // Close menu on logout
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                SG
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">SyncGlow</span>
            </Link>
          </div>
          
          {/* --- DESKTOP MENU --- */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>Dashboard</Link>
              <Link to="/analyzer" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/analyzer') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>Skin Analyzer</Link>
              <Link to="/history" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/history') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>History</Link>
              <Link to="/products" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/products') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>Products</Link>
              <Link to="/orders" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/orders') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>Orders</Link>
              <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>Profile</Link>
              <Link to="/consultation" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/consultation') ? 'text-cool-gray bg-pale-purple' : 'text-gray-700 hover:text-cool-gray hover:bg-pale-purple'}`}>Consultation</Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          )}
          
          {/* --- MOBILE MENU BUTTON --- */}
          {user && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cool-gray"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU PANEL --- */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-100" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">Dashboard</Link>
            <Link to="/analyzer" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">Skin Analyzer</Link>
            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">History</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">Products</Link>
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">Orders</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">Profile</Link>
            <Link to="/consultation" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-cool-gray hover:bg-pale-purple">Consultation</Link>
            <div className="border-t border-gray-200 my-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar;