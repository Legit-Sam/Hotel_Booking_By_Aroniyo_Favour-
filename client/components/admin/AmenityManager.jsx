'use client';
import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import HotelService from '@/services/hotelService';

export default function AmenityManager({ amenities = [], setAmenities = () => {} }) {
  const [newAmenity, setNewAmenity] = useState('');
  const [predefinedAmenities, setPredefinedAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await HotelService.getEnums();
        console.log('Amenities response:', res);
        // Corrected data access path
        setPredefinedAmenities(res?.data?.amenities || []);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenities();
  }, []);

  const addAmenity = (amenity) => {
    if (amenity && !amenities.includes(amenity.value)) {
      setAmenities([...amenities, amenity.value]);
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter((a) => a !== amenityToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAmenity({ value: newAmenity, label: newAmenity });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Amenities
      </label>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Popular Amenities</h4>
        {loading ? (
          <div className="text-gray-500">Loading amenities...</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(predefinedAmenities || []).map((amenity) => (
              <button
                key={amenity.value}
                type="button"
                onClick={() => addAmenity(amenity)}
                disabled={amenities.includes(amenity.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  amenities.includes(amenity.value)
                    ? 'bg-primary-100 text-primary-600 border-primary-200 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {amenity.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add custom amenity"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 input-field"
          />
          <button
            type="button"
            onClick={() => addAmenity({ value: newAmenity, label: newAmenity })}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {amenities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Selected Amenities ({amenities.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center space-x-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => removeAmenity(amenity)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}