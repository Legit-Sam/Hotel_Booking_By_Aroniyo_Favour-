import api from '@/utils/api';

const LocationService = {
  /**
   * Get all states
   * @returns Promise with states data
   */
  getStates: async () => {
    try {
      const response = await api.get('/locations/states');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch states');
    }
  },

  /**
   * Get cities by state
   * @param {string} state - State name
   * @returns Promise with cities data
   */
  getCities: async (state) => {
    try {
      const response = await api.get(`/locations/cities?state=${encodeURIComponent(state)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cities');
    }
  },

  /**
   * Add new location or city to state
   * @param {Object} data - { state, city }
   * @returns Promise with updated location
   */
  addLocation: async ({ state, city }) => {
    try {
      const response = await api.post('/locations', { state, city });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add location');
    }
  },

  /**
   * Get all locations (admin only)
   * @returns Promise with all locations data
   */
  getAllLocations: async () => {
    try {
      const response = await api.get('/locations/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch locations');
    }
  },

  /**
   * Delete a city from state
   * @param {Object} data - { state, city }
   * @returns Promise with success message
   */
  deleteCity: async ({ state, city }) => {
    try {
      const response = await api.delete(`/locations/city?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete city');
    }
  }
};

export default LocationService;