"use client"
import React, { useState, useEffect } from 'react';
import UserService from '@/services/adminService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Chip,
  Avatar,
  Backdrop
} from '@mui/material';
import { Edit, Delete, Add, LockReset } from '@mui/icons-material';

// Custom Modal Components
const StatusModal = ({ open, onClose, status, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <CircularProgress size={60} />,
          color: 'primary',
          title: 'Processing...'
        };
      case 'success':
        return {
          icon: (
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✓
            </Box>
          ),
          color: '#4caf50',
          title: 'Success!'
        };
      case 'error':
        return {
          icon: (
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#f44336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </Box>
          ),
          color: '#f44336',
          title: 'Error!'
        };
      default:
        return {};
    }
  };

  const config = getStatusConfig();

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(5px)'
      }}
      open={open}
      onClick={status !== 'loading' ? onClose : null}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          minWidth: 300,
          maxWidth: 400,
          boxShadow: 24
        }}
      >
        <Box sx={{ mb: 2 }}>{config.icon}</Box>
        <Typography variant="h6" sx={{ mb: 1, color: config.color }}>
          {config.title}
        </Typography>
        <Typography variant="body1">{message}</Typography>
        {status !== 'loading' && (
          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: config.color }}
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </Box>
    </Backdrop>
  );
};

const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(5px)'
      }}
      open={open}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          minWidth: 300,
          maxWidth: 400,
          boxShadow: 24
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Backdrop>
  );
};

const UsersPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // Modal states
  const [statusModal, setStatusModal] = useState({
    open: false,
    status: '', // 'loading', 'success', 'error'
    message: ''
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Show status modal
  const showStatusModal = (status, message) => {
    setStatusModal({
      open: true,
      status,
      message
    });
  };

  // Close status modal
  const closeStatusModal = () => {
    setStatusModal({ ...statusModal, open: false });
  };

  // Show confirm modal
  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, open: false });
        onConfirm();
      }
    });
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await UserService.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search
      });

      if (result.success) {
        setUsers(result.users);
        setPagination({
          ...pagination,
          total: result.total,
          pages: result.pages
        });
      } else {
        showStatusModal('error', result.message || 'Failed to fetch users');
      }
    } catch (error) {
      showStatusModal('error', 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search]);

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, page: value });
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle dialog open for create/edit
  const handleOpenDialog = (user = null) => {
    setCurrentUser(user);
    setFormData(
      user
        ? {
            name: user.name,
            email: user.email,
            role: user.role,
            password: ''
          }
        : {
            name: '',
            email: '',
            role: 'user',
            password: ''
          }
    );
    setOpenDialog(true);
  };

  // Handle password dialog open
  const handleOpenPasswordDialog = (user) => {
    setCurrentUser(user);
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  // Handle password dialog close
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setCurrentUser(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    showStatusModal('loading', currentUser ? 'Updating user...' : 'Creating user...');
    try {
      let result;
      if (currentUser) {
        // Update existing user
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        result = await UserService.updateUser(currentUser._id, updateData);
      } else {
        // Create new user
        result = await UserService.createUser(formData);
      }

      if (result?.success) {
        showStatusModal('success', result.message || 'Operation successful');
        fetchUsers();
        handleCloseDialog();
      } else {
        showStatusModal('error', result?.message || 'Operation failed');
      }
    } catch (error) {
      showStatusModal('error', 'An error occurred');
    }
  };

  // Handle password reset (admin)
  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showStatusModal('error', 'New passwords do not match');
      return;
    }

    showStatusModal('loading', 'Resetting password...');
    try {
      const result = await UserService.resetUserPassword(
        currentUser._id,
        passwordData.newPassword
      );

      if (result.success) {
        showStatusModal('success', result.message || 'Password reset successfully');
        handleClosePasswordDialog();
      } else {
        showStatusModal('error', result.message || 'Failed to reset password');
      }
    } catch (error) {
      showStatusModal('error', 'An error occurred while resetting password');
    }
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    showConfirmModal(
      'Confirm Deletion',
      'Are you sure you want to delete this user? This action cannot be undone.',
      async () => {
        showStatusModal('loading', 'Deleting user...');
        try {
          const result = await UserService.deleteUser(userId);
          if (result.success) {
            showStatusModal('success', result.message || 'User deleted successfully');
            fetchUsers();
          } else {
            showStatusModal('error', result.message || 'Failed to delete user');
          }
        } catch (error) {
          showStatusModal('error', 'An error occurred while deleting user');
        }
      }
    );
  };

  // Generate avatar color based on user name
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Management
      </Typography>

      {/* Search and Add User */}
      <Box display="flex" justifyContent="space-between" mb={3} gap={2}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: '350px' }}
          placeholder="Search by name or email"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: '150px' }}
        >
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '180px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ 
                            bgcolor: stringToColor(user.name),
                            width: 36, 
                            height: 36 
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography>{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(user)}
                            title="Edit user"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleOpenPasswordDialog(user)}
                            title="Reset password"
                          >
                            <LockReset fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user._id)}
                            title="Delete user"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={currentUser ? 'New Password (leave blank to keep current)' : 'Password'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required={!currentUser}
              helperText={currentUser ? '' : 'Password must be at least 6 characters'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={!formData.name || !formData.email || (!currentUser && !formData.password)}
          >
            {currentUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Password Reset Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password for {currentUser?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
              error={passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.newPassword !== passwordData.confirmPassword 
                  ? 'Passwords do not match' 
                  : ''
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancel</Button>
          <Button 
            onClick={handlePasswordReset} 
            color="primary" 
            variant="contained"
            disabled={
              !passwordData.newPassword || 
              !passwordData.confirmPassword || 
              passwordData.newPassword !== passwordData.confirmPassword
            }
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Modal */}
      <StatusModal
        open={statusModal.open}
        onClose={closeStatusModal}
        status={statusModal.status}
        message={statusModal.message}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
};

export default UsersPage;