'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Hotel, MapPin } from 'lucide-react'
import HotelService from '@/services/hotelService'
import LocationService from '@/services/locationService'

export default function HeroSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

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
      isHotel: true
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

  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Find Your Perfect
            <span className="block text-primary-400">Hotel Stay</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover amazing hotels with the best amenities and locations worldwide
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto relative"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-full p-2 flex items-center shadow-2xl relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search by hotel name, city, or state..."
              className="flex-1 px-6 py-4 text-gray-800 bg-transparent outline-none text-lg"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full transition-colors duration-200"
            >
              <Search className="w-6 h-6" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {(suggestions.length > 0 && isFocused) && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white text-black rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {suggestions.map((sug, idx) => (
                  <motion.li
                    key={`${sug.id}-${idx}`}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleSelect(sug)}
                    className="px-6 py-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Hotel className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{sug.label}</p>
                        <div className="flex items-center text-gray-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{sug.location}</span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}