'use client'
import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BookingButton({ hotel }) {
  const whatsappMessageTemplate = `Hi! I'm interested in booking a room at ${hotel.name} in ${hotel.city}, ${hotel.state}. Can you please provide more details about availability and rates?`
  
  const handleWhatsAppClick = () => {
    // Remove any non-digit characters from phone number
    const phoneNumber = hotel.phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessageTemplate)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Book?</h3>
      <p className="text-gray-600 mb-6">
        Contact us directly via WhatsApp to check availability and make your reservation.
      </p>
      
      <button
        onClick={handleWhatsAppClick}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Book via WhatsApp</span>
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Quick response • Instant confirmation
      </div>
    </motion.div>
  )
}
