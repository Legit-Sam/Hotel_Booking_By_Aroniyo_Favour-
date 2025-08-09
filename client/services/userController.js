// controllers/userController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Get all users with pagination
 * @route   GET /api/users
 * @access  Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { limit = 20, page = 1, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = User.find().select('-password');
    
    // Add search functionality
    if (search) {
      query = query.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
    }
    
    const [users, total] = await Promise.all([
      query.skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      User.countDocuments(query.getFilter())
    ]);
    
    res.json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users
    });
    
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching users',
      error: error.message 
    });
  }
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Admin
 */
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .lean()
      .exec();
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching user',
      error: error.message 
    });
  }
});

/**
 * @desc    Update user by ID
 * @route   PUT /api/users/:id
 * @access  Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const userId = req.params.id;
    
    // Validate input
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid email format' 
        });
      }
      
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use by another account' 
        });
      }
    }
    
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role specified' 
      });
    }
    
    // Prepare update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (typeof isActive === 'boolean') updateFields.isActive = isActive;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating user',
      error: error.message 
    });
  }
});

/**
 * @desc    Delete user by ID
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot delete your own account' 
      });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting user',
      error: error.message 
    });
  }
});