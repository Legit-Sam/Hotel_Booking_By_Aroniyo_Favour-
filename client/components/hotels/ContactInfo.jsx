'use client'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock } from 'lucide-react'

export default function ContactInfo({ hotel }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-800">{hotel.phone}</div>
            <div className="text-sm text-gray-600">Phone Number</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-800">{hotel.address}</div>
            <div className="text-sm text-gray-600">Address</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-800">24/7 Reception</div>
            <div className="text-sm text-gray-600">Available Hours</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
