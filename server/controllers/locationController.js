import Location from '../models/Location.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Get all unique states
 * @route   GET /api/locations/states
 * @access  Public
 */
export const getStates = asyncHandler(async (req, res) => {
  const states = await Location.distinct('state');
  res.json(states.sort()); // Return sorted list
});

/**
 * @desc    Get cities by state
 * @route   GET /api/locations/cities
 * @access  Public
 */
export const getCities = asyncHandler(async (req, res) => {
  const { state } = req.query;
  
  if (!state) {
    return res.status(400).json({ message: 'State parameter is required' });
  }

  const location = await Location.findOne({ state });
  
  if (!location) {
    return res.json([]); // Return empty array instead of error
  }

  res.json(location.cities.sort());
});

/**
 * @desc    Create new location or add city to existing state
 * @route   POST /api/locations
 * @access  Admin
 */
export const createOrUpdateLocation = asyncHandler(async (req, res) => {
  const { state, city } = req.body;

  if (!state || !city) {
    return res.status(400).json({ 
      message: 'Both state and city are required' 
    });
  }

  // Check if state exists
  let location = await Location.findOne({ state });

  if (location) {
    // State exists, check if city already exists
    if (location.cities.includes(city)) {
      return res.status(400).json({ 
        message: 'City already exists in this state' 
      });
    }
    
    // Add new city
    location.cities.push(city);
    await location.save();
  } else {
    // Create new state with city
    location = await Location.create({ 
      state, 
      cities: [city] 
    });
  }

  res.status(201).json(location);
});

/**
 * @desc    Get all locations (for admin)
 * @route   GET /api/locations/all
 * @access  Admin
 */
export const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find().sort({ state: 1 });
  res.json(locations);
});

/**
 * @desc    Delete a city from state
 * @route   DELETE /api/locations/city
 * @access  Admin
 */
export const deleteCity = asyncHandler(async (req, res) => {
  const { state, city } = req.query;

  if (!state || !city) {
    return res.status(400).json({ 
      message: 'Both state and city parameters are required' 
    });
  }

  const location = await Location.findOne({ state });
  if (!location) {
    return res.status(404).json({ message: 'State not found' });
  }

  location.cities = location.cities.filter(c => c !== city);
  await location.save();

  res.json({ 
    success: true, 
    message: `City ${city} removed from ${state}` 
  });
});