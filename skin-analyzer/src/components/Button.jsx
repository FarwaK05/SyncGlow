import React from 'react'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  type = 'button',
  icon = null // This prop will accept 'hamburger' to show the icon
}) => {
  // Base classes that apply to all buttons
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center'
  
  // Style variants based on the 'variant' prop
  const variants = {
    primary: 'bg-gradient-primary hover:bg-gradient-accent text-white focus:ring-cool-gray shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-pale-purple hover:bg-thistle text-cool-gray focus:ring-thistle',
    outline: 'border-2 border-cool-gray text-cool-gray hover:bg-pale-purple focus:ring-cool-gray',
    danger: 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white focus:ring-red-500',
    consultation: 'consultation-button' // Make sure this class is defined in your CSS
  }
  
  // Size variants based on the 'size' prop
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    icon: 'p-2' // A special size for icon-only buttons
  }
  
  // Classes to apply when the button is disabled or loading
  const disabledClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-none' 
    : ''

  // Function to render an SVG icon based on the 'icon' prop
  const renderIcon = () => {
    switch (icon) {
      case 'hamburger':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        );
      // You can add more icons here in the future, e.g., case 'close':
      default:
        return null;
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {loading ? (
        // Loading state with spinner
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        // If not loading, check if an icon should be rendered. If not, render the text children.
        icon ? renderIcon() : children
      )}
    </button>
  )
}

export default Button