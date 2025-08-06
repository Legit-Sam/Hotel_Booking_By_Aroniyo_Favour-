'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function HeroSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
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
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-full p-2 flex items-center max-w-2xl mx-auto shadow-2xl"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by hotel name, city, or state..."
            className="flex-1 px-6 py-4 text-gray-800 bg-transparent outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full transition-colors duration-200"
          >
            <Search className="w-6 h-6" />
          </button>
        </motion.form>
      </div>
    </section>
  )
}