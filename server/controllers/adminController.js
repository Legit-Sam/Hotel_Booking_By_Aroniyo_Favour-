// controllers/userController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

/**
 * @desc    Create a new user (Admin only)
 * @route   POST /api/users
 * @access  Admin
 */
export const createUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating user',
      error: error.message
    });
  }
});

/**
 * @desc    Get all users with pagination (excluding current user)
 * @route   GET /api/users
 * @access  Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { limit = 20, page = 1, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = User.find({ _id: { $ne: req.user.id } }).select('-password');
    
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
 * @desc    Get user by ID (cannot fetch yourself)
 * @route   GET /api/users/:id
 * @access  Admin
 */
export const getUserById = asyncHandler(async (req, res) => {
  try {
    // Prevent fetching your own account
    if (req.params.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot fetch your own account via this endpoint'
      });
    }

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
 * @desc    Update user by ID (cannot update yourself)
 * @route   PUT /api/users/:id
 * @access  Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const userId = req.params.id;
    
    // Prevent updating your own account
    if (userId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot update your own account via this endpoint'
      });
    }
    
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
    
    // Handle password update if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    
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
 * @desc    Delete user by ID (cannot delete yourself)
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

/**
 * @desc    Update user password (for own account)
 * @route   PUT /api/users/update-password
 * @access  Private
 */
export const updateUserPassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating password',
      error: error.message
    });
  }
});

// Add this new method to your existing controller
/**
 * @desc    Reset user password (Admin only - no current password required)
 * @route   PUT /api/users/:id/reset-password
 * @access  Admin
 */
export const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.params.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Find user and update password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // This will trigger the pre-save hook to hash the password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error in resetUserPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: error.message
    });
  }
});