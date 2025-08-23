// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserAnalyses } from '../services/supabaseClient';
import Card from '../components/Card';
import Button from '../components/Button';

const Dashboard = ({ user }) => {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecentAnalyses();
    }
  }, [user]);

  const loadRecentAnalyses = async () => {
    const { data, error } = await getUserAnalyses(user.id);
    if (!error && data) {
      setRecentAnalyses(data.slice(0, 3)); // Show only 3 most recent
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // This loading state is for the initial user check, handled by App.jsx, but good to keep as a fallback.
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cool-gray"></div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gradient-daylight min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 animate-on-load">
            Welcome back, {user.user_metadata?.full_name || 'User'}!
          </h1>
          <p className="text-lg text-gray-600 mt-2 animate-on-load" style={{ animationDelay: '150ms' }}>
            Glow starts here — analyze your skin, track your journey.
          </p>
        </div>

        {/* --- TOP NAVIGATION CARDS (ALL 5) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {/* Card: Skin Analyzer */}
          <Link to="/analyzer" className="group animate-on-load" style={{ animationDelay: '300ms' }}>
            <Card className="h-full text-center card-hover">
              <div className="w-16 h-16 bg-gradient-aurora rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Skin Analyzer</h3>
              <p className="text-sm text-gray-600">Get an AI analysis</p>
            </Card>
          </Link>

          {/* Card: History */}
          <Link to="/history" className="group animate-on-load" style={{ animationDelay: '400ms' }}>
            <Card className="h-full text-center card-hover">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">History</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </Card>
          </Link>

          {/* Card: Products */}
          <Link to="/products" className="group animate-on-load" style={{ animationDelay: '500ms' }}>
            <Card className="h-full text-center card-hover">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Products</h3>
              <p className="text-sm text-gray-600">Shop recommendations</p>
            </Card>
          </Link>

          {/* Card: Orders */}
          <Link to="/orders" className="group animate-on-load" style={{ animationDelay: '600ms' }}>
            <Card className="h-full text-center card-hover">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Orders</h3>
              <p className="text-sm text-gray-600">View your purchases</p>
            </Card>
          </Link>

          {/* Card: Profile */}
          <Link to="/profile" className="group animate-on-load" style={{ animationDelay: '700ms' }}>
            <Card className="h-full text-center card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-misty-rose to-lavender rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </Card>
          </Link>
        </div>

        {/* --- CONSULTATION CARD --- */}
        <Card className="consultation-card mb-12 animate-on-load" style={{ animationDelay: '800ms' }}>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 mb-6 lg:mb-0 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900">Expert Consultation</h2>
              <p className="text-gray-700 mt-2 mb-6">
                Discuss your results with a board-certified dermatologist.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/consultation">
                  <Button variant="consultation" size="md" className="btn-animate">Book Now</Button>
                </Link>
                <Link to="/consultation#doctors">
                  <Button variant="outline" size="md" className="btn-animate">View Doctors</Button>
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 lg:ml-8">
              <div className="w-32 h-32 bg-gradient-full rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
            </div>
          </div>
        </Card>

        {/* --- BOTTOM SECTION: RECENT ANALYSIS & STATS --- */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="animate-on-load" style={{ animationDelay: '900ms' }}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Analysis</h2>
            {loading ? (
              <div className="text-center py-8"><div className="spinner mx-auto"></div></div>
            ) : recentAnalyses.length > 0 ? (
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-4 bg-pale-purple/50 rounded-lg border border-thistle/50">
                    <p className="text-sm text-gray-500 mb-1">{formatDate(analysis.created_at)}</p>
                    <p className="text-gray-800 font-medium">{analysis.result_summary}</p>
                  </div>
                ))}
                <Link to="/history">
                  <Button variant="outline" size="sm" className="w-full mt-4 btn-animate">View All History</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No analysis results yet.</p>
                <Link to="/analyzer">
                  <Button size="sm" className="btn-animate btn-gradient-shimmer bg-gradient-aurora">Start Your First Analysis</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card className="animate-on-load" style={{ animationDelay: '1000ms' }}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-pale-purple/50 rounded-lg border border-thistle/50">
                <span className="text-gray-700 font-medium">Total Analyses</span>
                <span className="text-2xl font-bold text-cool-gray">{recentAnalyses.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-lavender/50 rounded-lg border border-thistle/50">
                <span className="text-gray-700 font-medium">This Month</span>
                <span className="text-2xl font-bold text-thistle">
                  {recentAnalyses.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-misty-rose/50 rounded-lg border border-thistle/50">
                <span className="text-gray-700 font-medium">Account Status</span>
                <span className="text-sm font-medium text-cool-gray bg-pale-purple px-3 py-1 rounded-full">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;