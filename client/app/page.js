'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
      const hotelsArray = response.hotels || []
      setHotels(hotelsArray)
      setLoading(false)
    } catch (error) {
      console.error('Error loading hotels:', error)
      setHotels([])
      setLoading(false)
    }
  }
const applyFilters = () => {
  // If no filters are set, just show all hotels
  const noFiltersSet = !filters.search && !filters.state && !filters.city &&
    filters.priceRange[0] === 0 && filters.priceRange[1] === 10000000

  if (noFiltersSet) {
    setFilteredHotels(hotels)
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

  // Make sure this is properly defined as a function
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={(search) => handleFilterChange({ search })} />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-center mb-2">Featured Hotels</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Discover amazing hotels with the best amenities and locations
            </p>
          </motion.div>

          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}  // Pass the function reference
            hotels={hotels}
          />

          <HotelGrid 
            hotels={filteredHotels}
            loading={loading}
          />
        </div>
      </section>
      <Footer />
    </div>
  )
}