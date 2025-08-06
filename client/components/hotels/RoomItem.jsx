'use client'
import { Bed, Users } from 'lucide-react'

export default function RoomItem({ room }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{room.type}</h3>
          <div className="flex items-center space-x-4 text-gray-600 text-sm">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>1-2 Guests</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Room for {room.type.includes('Suite') ? '4' : '2'}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">${room.price}</div>
          <div className="text-sm text-gray-500">per night</div>
        </div>
      </div>
    </div>
  )
}
