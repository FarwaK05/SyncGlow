import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'

const Consultation = ({ user }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [consultationType, setConsultationType] = useState('video')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // --- UPDATED DOCTORS LIST WITH PKR PRICING ---
  const doctors = [
    {
      id: 1,
      name: 'Prof. Dr. Ikram Ullah Khan | Best Dermatologist in Islamabad | Best Skin Specialist',
      specialty: 'Dermatology',
      experience: '20+ years',
      rating: 4.9,
      availability: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      price: '15,000 PKR' // Changed from $200
    },
    {
      id: 2,
      name: 'DR AASMA TAYYAB KHAN | Best dermatologist in Islamabad',
      specialty: 'Cosmetic Dermatology',
      experience: '15 years',
      rating: 4.8,
      availability: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
      price: '12,000 PKR' // Changed from $180
    },
    {
      id: 3,
      name: 'Dr Mahvish Zahra (Best Dermatologist, Skin Specialist In Islamabad/Rawalpindi)',
      specialty: 'Pediatric Dermatology',
      experience: '12 years',
      rating: 4.9,
      availability: ['8:00 AM', '12:00 PM', '2:30 PM', '4:30 PM'],
      price: '10,000 PKR' // Changed from $160
    }
  ]

  const handleBookConsultation = async (e) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedTime) {
      alert('Please select a doctor and time slot')
      return
    }

    setLoading(true)
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-secondary py-8">
        <div className="max-w-4xl mx-auto container-responsive-padding">
          <Card className="text-center consultation-card">
            <div className="w-20 h-20 bg-gradient-accent rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Consultation Booked!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Your consultation with {selectedDoctor?.name.split('|')[0].trim()} has been successfully scheduled.
            </p>
            <div className="bg-pale-purple rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
              <p className="text-gray-700">Doctor: {selectedDoctor?.name.split('|')[0].trim()}</p>
              <p className="text-gray-700">Time: {selectedTime}</p>
              <p className="text-gray-700">Type: {consultationType === 'video' ? 'Video Call' : 'In-Person'}</p>
              <p className="text-gray-700">Price: {selectedDoctor?.price}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setSuccess(false)}>
                Book Another Consultation
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="max-w-6xl mx-auto container-responsive-padding">
        <div className="mb-8">
          <h1 className="text-responsive-h1 mb-2">Expert Consultation</h1>
          <p className="text-gray-600 text-responsive-p">
            Connect with board-certified dermatologists for personalized advice and treatment plans
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <Card id = "doctors">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Dermatologist</h2>
              <div className="space-y-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-cool-gray bg-pale-purple'
                        : 'border-thistle hover:border-cool-gray bg-white'
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full border-2 border-cool-gray flex-shrink-0 flex items-center justify-center bg-white">
                        <svg className="w-8 h-8 text-cool-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                          <span className="text-xl font-bold text-cool-gray ml-4 whitespace-nowrap">{doctor.price}</span>
                        </div>
                        <p className="text-thistle font-medium mb-1">{doctor.specialty}</p>
                        <p className="text-gray-600 mb-2">{doctor.experience} experience</p>
                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">{doctor.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {doctor.availability.map((time) => (
                            <button
                              key={time}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTime(time)
                              }}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                selectedTime === time && selectedDoctor?.id === doctor.id
                                  ? 'bg-cool-gray text-white'
                                  : 'bg-lavender text-cool-gray hover:bg-thistle'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Consultation</h2>
              <form onSubmit={handleBookConsultation} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="video"
                        checked={consultationType === 'video'}
                        onChange={(e) => setConsultationType(e.target.value)}
                        className="mr-2 text-cool-gray focus:ring-cool-gray"
                      />
                      <span className="text-gray-700">Video Call</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="inperson"
                        checked={consultationType === 'inperson'}
                        onChange={(e) => setConsultationType(e.target.value)}
                        className="mr-2 text-cool-gray focus:ring-cool-gray"
                      />
                      <span className="text-gray-700">In-Person</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-thistle rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-gray focus:border-transparent bg-white"
                    placeholder="Describe your skin concerns or questions..."
                  />
                </div>

                {selectedDoctor && selectedTime && (
                  <div className="bg-pale-purple rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                    <p className="text-gray-700 text-sm">Doctor: {selectedDoctor.name.split('|')[0].trim()}</p>
                    <p className="text-gray-700 text-sm">Time: {selectedTime}</p>
                    <p className="text-gray-700 text-sm">Type: {consultationType === 'video' ? 'Video Call' : 'In-Person'}</p>
                    <p className="text-gray-700 text-sm font-semibold">Total: {selectedDoctor.price}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  disabled={!selectedDoctor || !selectedTime}
                  className="w-full"
                  variant="consultation"
                >
                  Book Consultation
                </Button>
              </form>
            </Card>

            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Experts?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-cool-gray mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Board-certified dermatologists
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-cool-gray mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Personalized treatment plans
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-cool-gray mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure video consultations
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-cool-gray mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Follow-up care included
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Consultation