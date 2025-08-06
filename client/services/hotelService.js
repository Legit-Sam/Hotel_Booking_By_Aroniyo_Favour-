import api from '@/utils/api';

const HotelService = {
  /**
   * Get all hotels with optional filters
   * @param {Object} filters - { state, city, minPrice, maxPrice, amenities }
   * @returns Promise with hotel data
   */
  getAllHotels: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Convert frontend filters to backend format
      if (filters.state) params.append('state', filters.state);
      if (filters.city) params.append('city', filters.city);
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange[0]);
        params.append('maxPrice', filters.priceRange[1]);
      }
      if (filters.search) params.append('q', filters.search);

      const response = await api.get(`/hotels?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', {
        error: error.message,
        filters,
        response: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch hotels');
    }
  },

  /**
   * Get hotel by ID
   * @param {string} id - Hotel ID
   * @returns Promise with hotel details
   */
  getHotelById: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotel ${id}:`, error.message);
      throw new Error(error.response?.data?.message || 'Hotel not found');
    }
  },
  /**
   * Create new hotel with enhanced image handling
   * @param {FormData} formData - Hotel data including images
   * @returns Promise with created hotel
   */
  createHotel: async (formData) => {
    try {
      // Format phone number if exists
      const phoneValue = formData.get('phone') || '';
      if (phoneValue) {
        const formattedPhone = phoneValue.toString().startsWith('+') 
          ? '+' + phoneValue.toString().slice(1).replace(/\D/g, '')
          : '+' + phoneValue.toString().replace(/\D/g, '');
        formData.set('phone', formattedPhone);
      }

      // Add whatsapp template if exists
      const whatsappTemplate = formData.get('whatsappMessageTemplate');
      if (!whatsappTemplate) {
        formData.append('whatsappMessageTemplate', 
          `Hello, I'm interested in booking a room at ${formData.get('name')}. Can you provide more information?`);
      }

      const response = await api.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', {
        error: error.message,
        response: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to create hotel'
      );
    }
  },
  /**
   * Update hotel with potential image updates
   * @param {string} id - Hotel ID
   * @param {Object} updates - Fields to update
   * @returns Promise with updated hotel
   */
  updateHotel: async (id, updates) => {
    try {
      // Handle case where updates might include new images
      if (updates.images && updates.images.length > 0) {
        const formData = new FormData();
        
        // Append all update fields
        Object.entries(updates).forEach(([key, value]) => {
          if (key !== 'images' && value !== undefined) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });

        // Append new images
        updates.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image, `update-image-${index}-${Date.now()}`);
          }
        });

        const response = await api.put(`/hotels/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Regular JSON update if no images
        const response = await api.put(`/hotels/${id}`, updates);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating hotel ${id}:`, error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to update hotel'
      );
    }
  },

  /**
   * Delete hotel
   * @param {string} id - Hotel ID
   * @returns Promise with success message
   */
  deleteHotel: async (id) => {
    try {
      const response = await api.delete(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting hotel ${id}:`, error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to delete hotel'
      );
    }
  },

  /**
   * Get enums for room types and amenities
   * @returns Promise with enums data
   */
  getEnums: async () => {
    try {
      const response = await api.get('/hotels/enums');
      return response.data;
    } catch (error) {
      console.error('Error fetching enums:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch enums');
    }
  },

  /**
   * Search hotels by name or description
   * @param {string} query - Search term
   * @param {Object} options - { limit, minRating, location }
   * @returns Promise with search results
   */
  searchHotels: async (query, options = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      // Add optional parameters
      if (options.limit) params.append('limit', options.limit);
      if (options.minRating) params.append('minRating', options.minRating);
      if (options.location) params.append('location', options.location);

      const response = await api.get(`/hotels/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', {
        query,
        options,
        error: error.message
      });
      throw new Error(
        error.response?.data?.message || 'Failed to search hotels'
      );
    }
  },
};

export default HotelService;