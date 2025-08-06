'use client'
import { motion } from 'framer-motion'
import RoomItem from './RoomItem'

export default function RoomsList({ rooms }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Rooms</h2>
      
      <div className="space-y-4">
        {rooms.map((room, index) => (
          <RoomItem key={index} room={room} />
        ))}
      </div>
    </motion.div>
  )
}
