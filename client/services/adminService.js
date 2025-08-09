// services/userService.js
import api from '@/utils/api';

const UserService = {
  /**
   * Create a new user (Admin only)
   * @param {Object} userData - User data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.role - User's role (user/admin)
   * @returns {Promise<Object>} Response data
   */
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return {
        success: true,
        user: response.data.user,
        message: response.data.message || 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
        error: error.response?.data || error
      };
    }
  },

  /**
   * Get all users with pagination and search (excluding current user)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @returns {Promise<Object>} Response data
   */
  async getAllUsers({ page = 1, limit = 20, search = '' } = {}) {
    try {
      const response = await api.get('/users', {
        params: { page, limit, search }
      });
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        error: error.response?.data || error
      };
    }
  },

  /**
   * Get user by ID (cannot fetch yourself)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
        error: error.response?.data || error
      };
    }
  },

  /**
   * Update user by ID (cannot update yourself)
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @param {string} [userData.name] - Updated name
   * @param {string} [userData.email] - Updated email
   * @param {string} [userData.role] - Updated role
   * @param {string} [userData.password] - New password
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        message: response.data.message,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
        error: error.response?.data || error
      };
    }
  },

  /**
   * Delete user by ID (cannot delete yourself)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        error: error.response?.data || error
      };
    }
  },
  // ... (keep existing methods)

  /**
   * Reset user password (Admin only)
   * @param {string} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Response data
   */
  async resetUserPassword(userId, newPassword) {
    try {
      const response = await api.put(`/users/${userId}/reset-password`, {
        newPassword
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password',
        error: error.response?.data || error
      };
    }
  },
  /**
   * Update current user's password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Response data
   */
  async updatePassword(passwordData) {
    try {
      const response = await api.put('/users/update-password', passwordData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update password',
        error: error.response?.data || error
      };
    }
  }
};

export default UserService;