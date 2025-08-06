// components/hotels/HotelCard.js
'use client'
import Link from 'next/link'
import { MapPin, Star, Wifi, Car, Coffee, Waves } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HotelCard({ hotel }) {
  // Get price range
  const minPrice = Math.min(...hotel.rooms.map(room => room.price))
  const maxPrice = Math.max(...hotel.rooms.map(room => room.price))
  
  // Format price in Naira
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price).replace('NGN', '₦')
  }

  // Get first available image or placeholder
  const mainImage = hotel.images?.[0] || '/placeholder-hotel.jpg'

  // Amenity icons mapping
  const getAmenityIcon = (amenity) => {
    const icons = {
      'Free WiFi': <Wifi className="w-4 h-4" />,
      'Parking': <Car className="w-4 h-4" />,
      'Restaurant': <Coffee className="w-4 h-4" />,
      'Spa': <Waves className="w-4 h-4" />,
      'Gym': <Waves className="w-4 h-4" />,
      'Air Conditioning': <Waves className="w-4 h-4" />,
      '24/7 Security': <Star className="w-4 h-4" />,
      'Conference Room': <Star className="w-4 h-4" />,
      'Bar': <Coffee className="w-4 h-4" />,
      'Laundry Service': <Waves className="w-4 h-4" />,
      'Cable TV': <Wifi className="w-4 h-4" />
    }
    return icons[amenity] || <Star className="w-4 h-4" />
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card group overflow-hidden h-full flex flex-col"
    >
      {/* Hotel Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={mainImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-hotel.jpg'
          }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-800">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </span>
        </div>
      </div>

      {/* Hotel Info */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
          {hotel.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {hotel.location?.city || 'Lokoja'}, {hotel.location?.state || 'Unknown State'}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description || 'No description available'}
        </p>

        {/* Amenities */}
        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
                title={amenity}
              >
                {getAmenityIcon(amenity)}
                <span>{amenity.split(' ')[0]}</span>
              </div>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-xs text-gray-500 self-center">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Link
          href={`/hotel/${hotel._id}`} 
          className="mt-auto block w-full text-center btn-primary"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}