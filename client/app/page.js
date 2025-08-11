'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/home/HeroSection'
import FilterPanel from '@/components/filters/FilterPanel'
import HotelGrid from '@/components/hotels/HotelGrid'
import HotelService from '@/services/hotelService'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
    priceRange: [0, 1000]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHotels()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [hotels, filters])

  const loadHotels = async () => {
    try {
      setLoading(true)
      const response = await HotelService.getAllHotels()
      const hotelsArray = (response.hotels || []).slice(0, 10)

      setHotels(hotelsArray)
      setLoading(false)
    } catch (error) {
      console.error('Error loading hotels:', error)
      setHotels([])
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const noFiltersSet = !filters.search && !filters.state && !filters.city &&
      filters.priceRange[0] === 0 && filters.priceRange[1] === 1000

    if (noFiltersSet) {
      setFilteredHotels(hotels.slice(0, 10))
      return
    }

    let filtered = [...hotels]

    if (filters.search) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        hotel.location?.cities?.some(city =>
          city.toLowerCase().includes(filters.search.toLowerCase())
        ) ||
        hotel.location?.state?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.state) {
      filtered = filtered.filter(hotel => hotel.location?.state === filters.state)
    }

    if (filters.city) {
      filtered = filtered.filter(hotel => hotel.location?.cities?.includes(filters.city))
    }

    filtered = filtered.filter(hotel => {
      const minPrice = Math.min(...hotel.rooms.map(room => room.price))
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
    })

    setFilteredHotels(filtered)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with enhanced backdrop */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none" />
        <HeroSection onSearch={(search) => handleFilterChange({ search })} />
      </div>

      {/* Decorative separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white px-6">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-20 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full mb-4 shadow-lg">
                ✨ Premium Collection
              </span>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight"
            >
              Featured Hotels
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover extraordinary accommodations that redefine luxury and comfort. 
              Each hotel is carefully curated to provide you with an unforgettable experience.
            </motion.p>

            {/* Stats Section */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center items-center space-x-8 mt-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{hotels.length}+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Premium Hotels</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Destinations</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <FilterPanel 
                filters={filters}
                onFilterChange={handleFilterChange}
                hotels={hotels}
              />
            </div>
          </motion.div>

          {/* Hotel Grid with Loading Animation */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-20"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse" />
                  </div>
                  <p className="text-gray-600 font-medium">Discovering amazing hotels for you...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <HotelGrid 
                  hotels={filteredHotels}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <h3 className="text-3xl font-bold mb-4">Ready to Book Your Perfect Stay?</h3>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied travelers who have found their ideal accommodation through our platform.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore All Hotels
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}