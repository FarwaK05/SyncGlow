import React from 'react'

const Card = ({ children, className = '', padding = 'lg' }) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}

export default Card