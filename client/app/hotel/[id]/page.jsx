'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Star, Phone, Mail, Home, Wifi, Car, Coffee, Waves, Dumbbell, Tv, Shield, Users, GlassWater } from 'lucide-react'
import Link from 'next/link'
import HotelService from '@/services/hotelService'

export default function HotelDetailsPage() {
  const params = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      loadHotel()
    }
  }, [params.id])

  const loadHotel = async () => {
    try {
      setLoading(true)
      const data = await HotelService.getHotelById(params.id)
      console.log(data)
      setHotel(data.hotel)

    } catch (error) {
      console.error('Error loading hotel:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel not found</h1>
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  // Format price in Naira
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price).replace('NGN', '₦')
  }

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const icons = {
      'Free WiFi': <Wifi className="w-5 h-5" />,
      'Parking': <Car className="w-5 h-5" />,
      'Restaurant': <Coffee className="w-5 h-5" />,
      'Spa': <Waves className="w-5 h-5" />,
      'Gym': <Dumbbell className="w-5 h-5" />,
      'Air Conditioning': <Waves className="w-5 h-5" />,
      '24/7 Security': <Shield className="w-5 h-5" />,
      'Conference Room': <Users className="w-5 h-5" />,
      'Bar': <GlassWater className="w-5 h-5" />,
      'Laundry Service': <Waves className="w-5 h-5" />,
      'Cable TV': <Tv className="w-5 h-5" />
    }
    return icons[amenity] || <Star className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Hotels
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              {hotel.images?.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={hotel.images[activeImageIndex]}
                      alt={`${hotel.name} - Image ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
                    {hotel.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-20 bg-gray-200 overflow-hidden rounded-md ${activeImageIndex === index ? 'ring-2 ring-primary-600' : ''}`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>

            {/* Hotel Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{hotel.location?.cities?.[0] || 'Unknown city'}, {hotel.location?.state || 'Unknown state'}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {hotel.description || 'No description available'}
              </p>
              
              {/* Price Range */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-600 font-medium">
                    {formatPrice(hotel.priceRange?.min || 0)} - {formatPrice(hotel.priceRange?.max || 0)}
                  </span>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </div>
            </motion.div>

            {/* Rooms */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Rooms</h2>
              {hotel.rooms?.length > 0 ? (
                <div className="space-y-6">
                  {hotel.rooms.map((room, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{room.type}</h3>
                          <p className="text-gray-600 mt-1">{formatPrice(room.price)} per night</p>
                        </div>
                        <button className="btn-primary px-4 py-2">
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No room information available</p>
              )}
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>
              {hotel.amenities?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-2"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No amenities listed</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-gray-800">
                      {hotel.contact?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-800">
                      {hotel.contact?.email || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Home className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="text-gray-800">
                      {hotel.contact?.address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="card p-6 bg-primary-50 border border-primary-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book Your Stay</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select className="input-field w-full">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>3 Adults</option>
                    <option>4 Adults</option>
                  </select>
                </div>
                <button className="btn-primary w-full py-3 text-lg">
                  Check Availability
                </button>
              </div>
            </div>

            {/* WhatsApp Button */}
            {hotel.whatsappMessageTemplate && hotel.contact?.phone && (
              <a
                href={`https://wa.me/${hotel.contact.phone.replace('+', '')}?text=${encodeURIComponent(hotel.whatsappMessageTemplate)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-success w-full flex items-center justify-center py-3 text-lg"
              >
                <span className="mr-2">Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}