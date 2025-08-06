'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, Search } from 'lucide-react'
import LocationService from '@/services/locationService'

export default function FilterPanel({ filters, onFilterChange, hotels = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [isDesktop, setIsDesktop] = useState(false)
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [priceMax, setPriceMax] = useState(1000000) // Default max of 1 million Naira

  useEffect(() => {
    // Calculate realistic max price from available hotels
    const maxHotelPrice = Math.max(
      ...hotels.map(hotel => 
        Math.max(...hotel.rooms.map(room => room.price))
      ),
      1000000 // Fallback to 1 million if no hotels
    )
    setPriceMax(Math.ceil(maxHotelPrice / 100000) * 100000) // Round up to nearest 100k
  }, [hotels])

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await LocationService.getStates()
        setStates(statesData)
      } catch (error) {
        const uniqueStates = [...new Set(hotels.map(hotel => hotel.location?.state).filter(Boolean))]
        setStates(uniqueStates)
      } finally {
        setLoadingStates(false)
      }
    }
    fetchStates()
  }, [hotels])

  // Fetch cities when state changes
  useEffect(() => {
    if (filters.state) {
      setLoadingCities(true)
      const fetchCities = async () => {
        try {
          const citiesData = await LocationService.getCities(filters.state)
          setCities(citiesData)
        } catch (error) {
          const uniqueCities = [
            ...new Set(
              hotels
                .filter(hotel => hotel.location?.state === filters.state)
                .map(hotel => hotel.location?.city)
                .filter(Boolean)
            )
          ]
          setCities(uniqueCities)
        } finally {
          setLoadingCities(false)
        }
      }
      fetchCities()
    } else {
      setCities([])
    }
  }, [filters.state, hotels])

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value)
    onFilterChange({ priceRange: [filters.priceRange[0], value] })
  }

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value)
    onFilterChange({ priceRange: [value, filters.priceRange[1]] })
  }

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: '',
      state: '',
      city: '',
      priceRange: [0, priceMax]
    })
  }

  // Format price in Naira
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price).replace('NGN', '₦')
  }

  return (
    <div className="mb-8">
      {/* Search Bar - Always visible */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search hotels by name, city or state..."
          className="input-field pl-10 w-full"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 w-full justify-center"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen || isDesktop ? 'auto' : 0,
          opacity: isOpen || isDesktop ? 1 : 0
        }}
        className="overflow-hidden"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Filter Hotels</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <div className="relative">
                <select
                  value={filters.state}
                  onChange={(e) => onFilterChange({ state: e.target.value, city: '' })}
                  className="input-field w-full pr-10"
                  disabled={loadingStates}
                >
                  <option value="">{loadingStates ? 'Loading...' : 'All States'}</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {loadingStates && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="loading loading-spinner loading-xs"></span>
                  </div>
                )}
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => onFilterChange({ city: e.target.value })}
                  className="input-field w-full pr-10"
                  disabled={!filters.state || loadingCities}
                >
                  <option value="">{loadingCities ? 'Loading...' : 'All Cities'}</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {loadingCities && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="loading loading-spinner loading-xs"></span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Range - Now with dual inputs */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Min</label>
                    <input
                      type="number"
                      min="0"
                      max={priceMax}
                      value={filters.priceRange[0]}
                      onChange={(e) => onFilterChange({ 
                        priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] 
                      })}
                      className="input-field w-full"
                      placeholder="Min price"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Max</label>
                    <input
                      type="number"
                      min="0"
                      max={priceMax}
                      value={filters.priceRange[1]}
                      onChange={(e) => onFilterChange({ 
                        priceRange: [filters.priceRange[0], parseInt(e.target.value) || priceMax] 
                      })}
                      className="input-field w-full"
                      placeholder="Max price"
                    />
                  </div>
                </div>
              </div>
              
              {/* Visual range slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max={priceMax}
                  step={priceMax > 100000 ? 10000 : 1000}
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="range range-sm range-primary w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatPrice(0)}</span>
                  <span>{formatPrice(priceMax/2)}</span>
                  <span>{formatPrice(priceMax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}