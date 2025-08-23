// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    e.target.reset();
  };

  return (
    <footer className="bg-gradient-to-br from-[#B8BAC8] to-[#AA78A6] text-white mt-auto">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Brand & Links */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white">SkinAI</h3>
              <p className="mt-2 text-sm text-gray-200">
                AI-powered insights for healthier skin.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white tracking-wide">Navigate</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="/analyzer" className="text-gray-200 hover:text-white font-medium transition-colors">Analyzer</a></li>
                <li><a href="/history" className="text-gray-200 hover:text-white font-medium transition-colors">History</a></li>
                <li><a href="/profile" className="text-gray-200 hover:text-white font-medium transition-colors">Profile</a></li>
              </ul>
            </div>
          </div>

          {/* Right Side: Newsletter */}
          <div className="lg:col-span-5">
            <h4 className="font-semibold text-white tracking-wide">Subscribe to our newsletter</h4>
            <p className="mt-2 text-sm text-gray-200">
              Get the latest tips and product recommendations.
            </p>
            <form className="mt-4 flex" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-gray-300 shadow-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm"
                placeholder="Enter your email"
              />
              <div className="ml-3 flex-shrink-0">
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-md border border-transparent bg-[#B4D6D3] px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#AA78A6] btn-animate"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Privacy & Copyright Section */}
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-gray-200">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* --- THIS IS THE CORRECTED LINE --- */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>
              Your privacy is our priority. Uploaded images are used only for analysis and are never stored.
            </span>
          </div>
          <p className="text-gray-300">&copy; {new Date().getFullYear()} SkinAI. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;