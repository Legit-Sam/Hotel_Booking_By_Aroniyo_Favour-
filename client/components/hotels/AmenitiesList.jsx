'use client'
import { motion } from 'framer-motion'
import { 
  Wifi, Car, Coffee, Waves, Dumbbell, Utensils, 
  Wind, Tv, Shield, Users, Bath, Star 
} from 'lucide-react'

export default function AmenitiesList({ amenities }) {
  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <Wifi className="w-5 h-5" />,
      'Free WiFi': <Wifi className="w-5 h-5" />,
      'Parking': <Car className="w-5 h-5" />,
      'Free Parking': <Car className="w-5 h-5" />,
      'Restaurant': <Utensils className="w-5 h-5" />,
      'Pool': <Waves className="w-5 h-5" />,
      'Swimming Pool': <Waves className="w-5 h-5" />,
      'Gym': <Dumbbell className="w-5 h-5" />,
      'Fitness Center': <Dumbbell className="w-5 h-5" />,
      'Bar': <Coffee className="w-5 h-5" />,
      'Air Conditioning': <Wind className="w-5 h-5" />,
      'TV': <Tv className="w-5 h-5" />,
      'Cable TV': <Tv className="w-5 h-5" />,
      'Security': <Shield className="w-5 h-5" />,
      '24/7 Security': <Shield className="w-5 h-5" />,
      'Conference Room': <Users className="w-5 h-5" />,
      'Spa': <Bath className="w-5 h-5" />,
      'Room Service': <Star className="w-5 h-5" />,
    }
    return icons[amenity] || <Star className="w-5 h-5" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="text-primary-600">
              {getAmenityIcon(amenity)}
            </div>
            <span className="text-gray-800 font-medium">{amenity}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
