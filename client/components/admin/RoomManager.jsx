'use client';
import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import HotelService from '@/services/hotelService';

export default function RoomManager({ 
  rooms = [], 
  setRooms, 
  minRooms = 1, 
  maxRooms = 10 
}) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await HotelService.getEnums();
        setRoomTypes(res?.data?.roomTypes || []);
        console.log(res)
      } catch (error) {
        console.error('Error fetching room types:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomTypes();
  }, []);

  const addRoom = () => {
    if (rooms.length >= maxRooms) return;
    setRooms([...rooms, { type: '', price: '' }]);
  };

  const removeRoom = (index) => {
    if (rooms.length <= minRooms) return;
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index, field, value) => {
    const updatedRooms = rooms.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    );
    setRooms(updatedRooms);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Room Types & Prices *
        </label>
        <button
          type="button"
          onClick={addRoom}
          disabled={rooms.length >= maxRooms}
          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room</span>
        </button>
      </div>

     <div className="space-y-4">
        {rooms.map((room, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <select
                value={room.type}
                onChange={(e) => updateRoom(index, 'type', e.target.value)}
                className="input-field"
                disabled={loading}
              >
                <option value="">{loading ? 'Loading room types...' : 'Select Room Type'}</option>
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="number"
                placeholder="Price per night"
                value={room.price}
                onChange={(e) => updateRoom(index, 'price', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>

            <button
              type="button"
              onClick={() => removeRoom(index)}
              className="text-red-600 hover:text-red-700 p-2"
              disabled={rooms.length <= minRooms}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      {rooms.length >= maxRooms && (
        <p className="mt-2 text-sm text-gray-500">
          Maximum {maxRooms} rooms allowed
        </p>
      )}
    </div>
  );
}