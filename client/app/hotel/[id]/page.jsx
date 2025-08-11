'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Star, Phone, Mail, Home, Wifi, Car, Coffee, Waves, Dumbbell, 
  Tv, Shield, Users, GlassWater, Calendar, Clock, Heart, Share2, Camera, 
  ChevronLeft, ChevronRight, Award, CheckCircle, MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import HotelService from '@/services/hotelService'

export default function HotelDetailsPage() {
  const params = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Loading hotel details...</p>
        </motion.div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl p-12 shadow-xl max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel Not Found</h1>
          <p className="text-gray-600 mb-6">The hotel you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </Link>
        </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-all duration-300 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Hotels
            </Link>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isFavorited 
                    ? 'bg-red-100 text-red-500' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Enhanced Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl shadow-2xl bg-white"
            >
              {hotel.images?.length > 0 ? (
                <>
                  {/* Main Image with Navigation */}
                  <div className="relative h-[500px] bg-gradient-to-br from-gray-100 to-gray-200">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        src={hotel.images[activeImageIndex]}
                        alt={`${hotel.name} - Image ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                    
                    {/* Image Navigation */}
                    {hotel.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex(prev => 
                            prev === 0 ? hotel.images.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        
                        <button
                          onClick={() => setActiveImageIndex(prev => 
                            prev === hotel.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {activeImageIndex + 1} / {hotel.images.length}
                    </div>
                    
                    {/* View All Photos Button */}
                    <button
                      onClick={() => setIsImageModalOpen(true)}
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      View All Photos
                    </button>
                  </div>
                  
                  {/* Enhanced Thumbnail Gallery */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {hotel.images.map((img, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                            activeImageIndex === index 
                              ? 'ring-3 ring-blue-500 shadow-lg' 
                              : 'ring-2 ring-gray-200 hover:ring-gray-300'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <span className="text-gray-500 text-lg">No images available</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Enhanced Hotel Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {hotel.name}
                    </h1>
                    {hotel.rating && (
                      <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {hotel.rating}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    <span className="text-lg">{hotel.location?.cities?.[0] || 'Unknown city'}, {hotel.location?.state || 'Unknown state'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Verified
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4 inline mr-1" />
                    Premium
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {hotel.description || 'Experience luxury and comfort at this exceptional hotel, where every detail is designed to provide you with an unforgettable stay.'}
              </p>
              
              {/* Enhanced Price Range */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Pricing Information
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(hotel.priceRange?.min || 0)} - {formatPrice(hotel.priceRange?.max || 0)}
                    </div>
                    <span className="text-gray-600">per night</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Best Rate Guaranteed</div>
                    <div className="text-sm text-green-600 font-medium">Free Cancellation</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Rooms Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8 flex items-center">
                <Home className="w-8 h-8 mr-3 text-blue-500" />
                Available Rooms
              </h2>
              {hotel.rooms?.length > 0 ? (
                <div className="grid gap-6">
                  {hotel.rooms.map((room, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {room.type}
                          </h3>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatPrice(room.price)}
                            </div>
                            <span className="text-gray-500">per night</span>
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs hidden sm:block font-medium">
                              Best Price
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              2-4 Guests
                            </div>
                            <div className="flex items-center">
                              <Wifi className="w-4 h-4 mr-1" />
                              Free WiFi
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No room information available</p>
                </div>
              )}
            </motion.div>

            {/* Enhanced Amenities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8 flex items-center">
                <Award className="w-8 h-8 mr-3 text-purple-500" />
                Hotel Amenities
              </h2>
              {hotel.amenities?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {amenity}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No amenities information available</p>
                </div>
              )}
            </motion.div>
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