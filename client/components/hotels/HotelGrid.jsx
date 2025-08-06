'use client'
import { motion } from 'framer-motion'
import HotelCard from './HotelCard'

export default function HotelGrid({ hotels, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-6 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded mb-4"></div>
            <div className="bg-gray-300 h-10 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hotels found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hotels.map((hotel, index) => (
        <motion.div
          key={hotel._id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <HotelCard hotel={hotel} />
        </motion.div>
      ))}
    </div>
  )
}