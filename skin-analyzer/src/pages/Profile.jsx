// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, signOut } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Your robust logic for checking changes is preserved
    const updates = {};
    if (name !== (user.user_metadata?.full_name || '')) {
      updates.data = { full_name: name };
    }
    if (email !== user.email) {
      updates.email = email;
    }
    if (Object.keys(updates).length === 0) {
      setError('No changes to save.');
      setLoading(false);
      return;
    }

    const { data, error: updateError } = await updateProfile(updates);
    
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('Profile updated successfully!');
      if (setUser && data.user) {
        setUser(data.user);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    } else {
      setError('Failed to sign out');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  // --- IMPROVED LOGIC FOR THE INITIAL ---
  // This safely gets the initial from the name, then email, then defaults to 'U'
  const initial = name ? name.charAt(0).toUpperCase() : (user.email?.charAt(0).toUpperCase() || 'U');

  return (
    // --- UPDATED: Modern UI with gradient background ---
    <div className="py-12 bg-gradient-daylight min-h-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 animate-on-load">
            Profile Settings
          </h1>
          <p className="text-lg text-gray-600 mt-2 animate-on-load" style={{ animationDelay: '150ms' }}>
            Manage your account information and preferences.
          </p>
        </div>

        {/* --- MAIN PROFILE CARD --- */}
        <Card className="animate-on-load card-hover" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col items-center text-center">
            {/* The Avatar with correct initial logic */}
            <div className="w-24 h-24 bg-gradient-aurora rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-4xl font-bold text-white">
                {initial}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{name || 'User'}</h2>
            <p className="text-gray-500">{email}</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-8 space-y-6">
            {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cool-gray focus:border-cool-gray sm:text-sm"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cool-gray focus:border-cool-gray sm:text-sm"
              />
               <p className="text-xs text-gray-500 mt-1">Changing your email may require re-verification.</p>
            </div>

            <div>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full bg-gradient-primary text-white font-bold py-3 btn-animate btn-gradient-shimmer"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* --- ACCOUNT STATS CARD --- */}
        <Card className="mt-8 animate-on-load" style={{ animationDelay: '450ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-lavender/50 rounded-lg border border-thistle/50">
              <span className="font-medium text-gray-700">Account Created</span>
              <span className="font-semibold text-cool-gray">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-misty-rose/50 rounded-lg border border-thistle/50">
              <span className="font-medium text-gray-700">Last Sign In</span>
              <span className="font-semibold text-cool-gray">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* --- ACCOUNT ACTIONS CARD --- */}
        <Card className="mt-8 animate-on-load" style={{ animationDelay: '600ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-lg border border-red-200">
            <div>
              <h3 className="font-medium text-red-900">Sign Out</h3>
              <p className="text-sm text-red-700">Sign out of your account on this device.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout} className="btn-animate">
              Sign Out
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Profile;