import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/supabaseClient'
import Button from '../components/Button'
import Card from '../components/Card'

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [showAuthMessage, setShowAuthMessage] = useState(false); // State for the message
  const navigate = useNavigate()

  const aboutSectionRef = useRef(null);
  const heroSectionRef = useRef(null); // Ref for the top "hero" section

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { user } = await getCurrentUser()
    if (user) {
      navigate('/dashboard')
    }
    setLoading(false)
  }
  
  const handleLearnMoreClick = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handler for the "Book Consultation" button
  const handleBookConsultationClick = () => {
    // Scroll to the top section
    heroSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Show the authentication message
    setShowAuthMessage(true);

    // Hide the message after 5 seconds
    setTimeout(() => {
      setShowAuthMessage(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center" ref={heroSectionRef}> {/* Attach ref here */}
         <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
              SG
          </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            SyncGlow
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Advanced AI-powered skin analysis to help you understand and improve your skin health.
            Get personalized insights, track your progress over time, and discover the right skincare
            products tailored to your needs
          </p>
          
          {/* Conditionally render the authentication message */}
          {showAuthMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-md mx-auto animate-pulse">
              <p className="font-semibold">Sign-in required to book a consultation.</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <Card className="text-center">
            <div className="w-12 h-12 bg-pale-purple rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload & Analyze</h3>
            <p className="text-gray-600">Simply upload a photo of your skin and get instant AI-powered analysis results.</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-lavender rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your skin health journey with detailed history and progress tracking.</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-misty-rose rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Consultation</h3>
            <p className="text-gray-600">Connect with certified dermatologists for professional advice and treatment plans.</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Products</h3>
            <p className="text-gray-600">Find skincare products curated by experts, perfectly matched to your skin's needs.</p>
          </Card>
        </div>
        
        <div className="mt-20">
          <Card className="consultation-card text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Professional Advice?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Connect with board-certified dermatologists for personalized consultations, 
                treatment recommendations, and expert guidance on your skin health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="consultation" size="lg" className="w-full sm:w-auto" onClick={handleBookConsultationClick}> {/* Attach onClick handler here */}
                  Book Consultation
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleLearnMoreClick}>
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <section ref={aboutSectionRef} className="mt-20 py-16">
            <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Personal Skincare Journey, Simplified
                </h2>
                <p className="text-lg text-gray-700 mb-12">
                    SyncGlow leverages cutting-edge AI to provide you with a deep understanding of your skin.
                    Our platform is designed to be your trusted partner, guiding you every step of the way
                    towards healthier, glowing skin.
                </p>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
                        <p className="text-gray-600">Our AI analyzes your photo to identify key skin concerns like acne, pigmentation, and wrinkles, providing you with a detailed report.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Routines</h3>
                        <p className="text-gray-600">Based on your analysis, we recommend a personalized skincare routine with product suggestions that fit your skin type and goals.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Your Transformation</h3>
                        <p className="text-gray-600">Regularly upload photos to track your skin's progress. Our visual timeline makes it easy to see the effectiveness of your routine.</p>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  )
}

export default Home