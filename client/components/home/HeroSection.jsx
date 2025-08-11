'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Hotel, MapPin, Star, Calendar, Users, Award, Shield, Globe } from 'lucide-react'
import HotelService from '@/services/hotelService'
import LocationService from '@/services/locationService'

export default function HeroSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Background images carousel
  const backgroundImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ]

  // Trust indicators data
  const trustIndicators = [
    { icon: Shield, label: 'Secure Booking', value: '100%' },
    { icon: Award, label: 'Verified Hotels', value: '5000+' },
    // { icon: Globe, label: 'Global Reach', value: '50+ Countries' },
    { icon: Star, label: 'Average Rating', value: '4.8/5' }
  ]

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await HotelService.getAllHotels()
        setAllHotels(response.hotels || [])
      } catch (error) {
        console.error('Error loading hotels:', error)
      }
    }
    fetchHotels()
  }, [])

  // Background image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    const lowerSearch = searchTerm.toLowerCase()

    const matchedHotels = allHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(lowerSearch) ||
      hotel.location?.city?.toLowerCase().includes(lowerSearch) ||
      hotel.location?.state?.toLowerCase().includes(lowerSearch)
    )

    const results = matchedHotels.map(hotel => ({
      label: hotel.name,
      location: `${hotel.location?.cities[0] || 'Unknown'}, ${hotel.location?.state || 'Unknown'}`,
      id: hotel._id,
      isHotel: true,
      rating: hotel.rating || 4.5,
      price: hotel.rooms?.[0]?.price || 'N/A'
    }))

    setSuggestions(results.slice(0, 5))
  }, [searchTerm, allHotels])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
    }
  }

  const handleSelect = (suggestion) => {
    if (suggestion.isHotel) {
      router.push(`/hotel/${suggestion.id}`)
    } else {
      setSearchTerm(suggestion.label)
      onSearch(suggestion.label)
    }
    setIsFocused(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Images with Parallax Effect */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${image}")` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto h-full flex flex-col justify-center py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 md:space-y-6"
        >
          {/* Premium Badge */}
          <motion.div variants={itemVariants} className="inline-block">
            <span className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full text-sm font-semibold text-white shadow-lg">
              <Award className="w-4 h-4 mr-2" />
              World's #1 Hotel Booking Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Discover
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Extraordinary
              </span>
              <span className="block text-white">
                Stays
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            From luxury resorts to boutique hotels, find your perfect accommodation 
            with exclusive deals and instant booking confirmation.
          </motion.p>

          {/* Enhanced Search Bar */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto relative z-20"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Where would you like to stay? (City, hotel name, or destination)"
                    className="w-full pl-12 pr-6 py-4 text-white bg-transparent placeholder-gray-300 outline-none text-lg font-medium"
                  />
                </div>
                
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                  <Calendar className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-300 text-sm">Check-in</span>
                </div>
                
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                  <Users className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-300 text-sm">Guests</span>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </form>
            </div>

            {/* Enhanced Suggestions Dropdown */}
            <AnimatePresence>
              {(suggestions.length > 0 && isFocused) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md text-black rounded-2xl shadow-2xl z-40 overflow-hidden border border-white/20"
                >
                  {suggestions.map((sug, idx) => (
                    <motion.div
                      key={`${sug.id}-${idx}`}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      onClick={() => handleSelect(sug)}
                      className="px-6 py-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                            <Hotel className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left flex gap-3 items-center">
                            <p className="font-semibold text-gray-900 text-lg">{sug.label}</p>
                            <div className="flex items-center text-gray-500 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{sug.location}</span>
                            </div>
                            <div className="flex items-center mt-2 gap-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm font-medium">{sug.rating}</span>
                              </div>
                              {sug.price !== 'N/A' && (
                                <span className="text-sm font-semibold text-blue-600">
                                  ₦{sug.price}/night
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center"
              >
                <indicator.icon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white mb-1">{indicator.value}</div>
                <div className="text-xs text-gray-300">{indicator.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {['Last Minute Deals', 'Business Travel', 'Family Vacation', 'Luxury Stays'].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 text-xs md:text-sm font-medium"
              >
                {action}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-300">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}