import Hotel from '../models/Hotel.js';
import Location from '../models/Location.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import asyncHandler from 'express-async-handler';

// Define enums for consistent data
const ROOM_TYPES = [
  'Standard Room',
  'Deluxe Room',
  'Suite',
  'Presidential Suite',
  'Executive Room',
  'Family Room'
];

const AMENITIES = [
  'Free WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Bar',
  'Room Service', 'Spa', 'Air Conditioning', 'Cable TV',
  '24/7 Security', 'Conference Room', 'Laundry Service'
];

/**
 * @desc    Upload images to Cloudinary and return URLs
 */
const handleImageUploads = async (files) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    try {
      const result = await uploadToCloudinary(file.path, 'hotel_images');
      return result?.url || null;
    } catch (error) {
      console.error(`Error uploading image ${file.originalname}:`, error);
      return null;
    } finally {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error(`Error deleting temp file ${file.path}:`, err);
      }
    }
  });

  const results = await Promise.all(uploadPromises);
  return results.filter(url => url !== null);
};

/**
 * @desc    Create new hotel with enhanced validation
 * @route   POST /api/hotels
 * @access  Admin
 */
export const createHotel = asyncHandler(async (req, res) => {
  try {
    const { name, state, city, description, address, phone, whatsappMessageTemplate } = req.body;

    // Validate required fields
    const requiredFields = { name, state, city, description, address, phone };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Please fill all required fields',
        missingFields,
        example: {
          name: "Grand Hotel",
          state: "California",
          city: "Los Angeles",
          description: "Luxury hotel with ocean view",
          address: "123 Beachfront Ave",
          phone: "+1234567890"
        }
      });
    }

    // Validate phone format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: 'Invalid phone number format',
        validFormat: 'International E.164 format with country code',
        example: '+2341234567890',
        received: phone
      });
    }

    // Find or create location
    let location = await Location.findOne({ state, cities: city });
    if (!location) {
      location = await Location.create({ state, cities: [city] });
    }

    // Upload images
    const imageUrls = req.files?.length > 0 
      ? await handleImageUploads(req.files)
      : [];

    // Parse and validate rooms
    let rooms = [];
    try {
      rooms = JSON.parse(req.body.rooms || '[]');
      
      if (rooms.length === 0) {
        return res.status(400).json({ 
          message: 'At least one room type is required',
          validRoomTypes: ROOM_TYPES,
          example: [{ type: "Standard Room", price: 100 }]
        });
      }

      const invalidRooms = rooms.filter(room => 
        !room.type || !ROOM_TYPES.includes(room.type) || 
        isNaN(room.price) || room.price < 0
      );

      if (invalidRooms.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid room data',
          requirements: {
            type: `Must be one of: ${ROOM_TYPES.join(', ')}`,
            price: 'Must be a positive number'
          },
          invalidRooms
        });
      }

      if (rooms.length > 10) {
        return res.status(400).json({
          message: 'Maximum 10 room types allowed',
          roomsCount: rooms.length
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        message: 'Invalid room data format',
        requiredFormat: 'Array of { type: string, price: number }',
        error: error.message
      });
    }

    // Validate amenities
    let amenities = [];
    try {
      amenities = JSON.parse(req.body.amenities || '[]');
      
      const invalidAmenities = amenities.filter(
        amenity => !AMENITIES.includes(amenity)
      );
      
      if (invalidAmenities.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid amenities',
          validAmenities: AMENITIES,
          invalidAmenities
        });
      }

      if (amenities.length > 20) {
        return res.status(400).json({
          message: 'Maximum 20 amenities allowed',
          amenitiesCount: amenities.length
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        message: 'Invalid amenities format',
        requiredFormat: 'Array of strings',
        error: error.message
      });
    }

    // Create default whatsapp template if not provided
    const defaultTemplate = `Hello, I'm interested in booking a room at ${name}. Can you provide more information?`;

    // Create hotel
    const hotel = await Hotel.create({
      name,
      location: location._id,
      description,
      contact: { 
        phone,
        address,
        whatsapp: req.body.whatsapp || undefined 
      },
      whatsappMessageTemplate: whatsappMessageTemplate || defaultTemplate,
      amenities,
      rooms,
      images: imageUrls,
    });

    const populatedHotel = await Hotel.findById(hotel._id)
      .populate('location')
      .lean()
      .exec();

    res.status(201).json({
      success: true,
      hotel: {
        ...populatedHotel,
        priceRange: {
          min: Math.min(...rooms.map(r => r.price)),
          max: Math.max(...rooms.map(r => r.price))
        }
      }
    });

  } catch (error) {
    console.error('Error in createHotel:', error);
    res.status(500).json({ 
      message: 'Server error creating hotel',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @desc    Get all hotels with advanced filtering
 * @route   GET /api/hotels
 * @access  Public
 */
export const getAllHotels = asyncHandler(async (req, res) => {
  try {
    const { 
      state, 
      city, 
      minPrice, 
      maxPrice, 
      amenities,
      q: searchQuery,
      limit = 20,
      page = 1
    } = req.query;
    
    const skip = (page - 1) * limit;
    let query = Hotel.find().populate('location');

    // Location filter
    if (state || city) {
      const locationQuery = {};
      if (state) locationQuery.state = state;
      if (city) locationQuery.cities = city;
      
      const locations = await Location.find(locationQuery);
      query = query.where('location').in(locations.map(loc => loc._id));
    }
    
    // Price filter
    if (minPrice || maxPrice) {
      query = query.where('rooms').elemMatch({
        price: {
          ...(minPrice && { $gte: Number(minPrice) }),
          ...(maxPrice && { $lte: Number(maxPrice) })
        }
      });
    }
    
    // Amenities filter
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) 
        ? amenities 
        : amenities.split(',');
      query = query.where('amenities').all(amenitiesArray);
    }
    
    // Search filter
    if (searchQuery) {
      query = query.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      });
    }

    const [hotels, total] = await Promise.all([
      query.sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      Hotel.countDocuments(query.getFilter())
    ]);

    // Add price range to each hotel
    const hotelsWithPriceRange = hotels.map(hotel => ({
      ...hotel,
      priceRange: {
        min: Math.min(...hotel.rooms.map(r => r.price)),
        max: Math.max(...hotel.rooms.map(r => r.price))
      }
    }));

    res.json({
      success: true,
      count: hotels.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hotels: hotelsWithPriceRange
    });

  } catch (error) {
    console.error('Error in getAllHotels:', error);
    res.status(500).json({ 
      message: 'Server error fetching hotels',
      error: error.message 
    });
  }
});

/**
 * @desc    Get hotel by ID with enhanced data
 * @route   GET /api/hotels/:id
 * @access  Public
 */
export const getHotelById = asyncHandler(async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('location')
      .lean()
      .exec();
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hotel not found' 
      });
    }
    
    // Add price range
    const hotelWithPriceRange = {
      ...hotel,
      priceRange: {
        min: Math.min(...hotel.rooms.map(r => r.price)),
        max: Math.max(...hotel.rooms.map(r => r.price))
      }
    };

    res.json({
      success: true,
      hotel: hotelWithPriceRange
    });

  } catch (error) {
    console.error('Error in getHotelById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching hotel',
      error: error.message 
    });
  }
});

/**
 * @desc    Search hotels with text index
 * @route   GET /api/hotels/search
 * @access  Public
 */
export const searchHotels = asyncHandler(async (req, res) => {
  try {
    const { q: searchQuery, limit = 10 } = req.query;
    
    if (!searchQuery || searchQuery.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a search query' 
      });
    }

    const hotels = await Hotel.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .populate('location')
    .limit(Number(limit))
    .lean()
    .exec();

    const hotelsWithPriceRange = hotels.map(hotel => ({
      ...hotel,
      priceRange: {
        min: Math.min(...hotel.rooms.map(r => r.price)),
        max: Math.max(...hotel.rooms.map(r => r.price))
      }
    }));

    res.json({
      success: true,
      count: hotels.length,
      hotels: hotelsWithPriceRange
    });

  } catch (error) {
    console.error('Error in searchHotels:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error searching hotels',
      error: error.message 
    });
  }
});

/**
 * @desc    Update hotel with validation
 * @route   PUT /api/hotels/:id
 * @access  Admin
 */
export const updateHotel = asyncHandler(async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hotel not found' 
      });
    }

    // Handle phone update
    if (req.body.phone) {
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
      if (!phoneRegex.test(req.body.phone)) {
        return res.status(400).json({ 
          message: 'Invalid phone number format',
          validFormat: 'International format with country code',
          example: '+1234567890'
        });
      }
      hotel.contact.phone = req.body.phone;
    }

    // Handle rooms update
    if (req.body.rooms) {
      try {
        const rooms = JSON.parse(req.body.rooms);
        
        if (rooms.length === 0) {
          return res.status(400).json({ 
            message: 'At least one room type is required',
            validRoomTypes: ROOM_TYPES
          });
        }

        const invalidRooms = rooms.filter(
          room => !ROOM_TYPES.includes(room.type) || isNaN(room.price)
        );
        
        if (invalidRooms.length > 0) {
          return res.status(400).json({ 
            message: 'Invalid room data',
            validRoomTypes: ROOM_TYPES,
            invalidRooms
          });
        }

        hotel.rooms = rooms;
      } catch (error) {
        return res.status(400).json({ 
          message: 'Invalid room data format',
          error: error.message
        });
      }
    }

    // Handle amenities update
    if (req.body.amenities) {
      try {
        const amenities = JSON.parse(req.body.amenities);
        
        const invalidAmenities = amenities.filter(
          amenity => !AMENITIES.includes(amenity)
        );
        
        if (invalidAmenities.length > 0) {
          return res.status(400).json({ 
            message: 'Invalid amenities',
            validAmenities: AMENITIES,
            invalidAmenities
          });
        }

        hotel.amenities = amenities;
      } catch (error) {
        return res.status(400).json({ 
          message: 'Invalid amenities format',
          error: error.message
        });
      }
    }

    // Handle other updates
    const updatableFields = ['name', 'description', 'whatsappMessageTemplate'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        hotel[field] = req.body[field];
      }
    });

    // Handle contact updates
    if (req.body.address) {
      hotel.contact.address = req.body.address;
    }
    if (req.body.whatsapp !== undefined) {
      hotel.contact.whatsapp = req.body.whatsapp || undefined;
    }

    // Handle location update
    if (req.body.state && req.body.city) {
      let location = await Location.findOne({ 
        state: req.body.state, 
        cities: req.body.city 
      });
      
      if (!location) {
        location = await Location.create({ 
          state: req.body.state, 
          cities: [req.body.city] 
        });
      }
      
      hotel.location = location._id;
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const newImageUrls = await handleImageUploads(req.files);
      hotel.images = [...hotel.images, ...newImageUrls];
    }

    const updatedHotel = await hotel.save();
    const populatedHotel = await Hotel.findById(updatedHotel._id)
      .populate('location')
      .lean()
      .exec();

    res.json({
      success: true,
      hotel: {
        ...populatedHotel,
        priceRange: {
          min: Math.min(...populatedHotel.rooms.map(r => r.price)),
          max: Math.max(...populatedHotel.rooms.map(r => r.price))
        }
      }
    });

  } catch (error) {
    console.error('Error in updateHotel:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating hotel',
      error: error.message 
    });
  }
});

/**
 * @desc    Delete hotel and associated data
 * @route   DELETE /api/hotels/:id
 * @access  Admin
 */
export const deleteHotel = asyncHandler(async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hotel not found' 
      });
    }
    
    // Delete associated images from Cloudinary
    if (hotel.images && hotel.images.length > 0) {
      const deletePromises = hotel.images.map(async (imageUrl) => {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`hotel_images/${publicId}`);
        } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
        }
      });
      await Promise.all(deletePromises);
    }

    await hotel.deleteOne();
    
    res.json({ 
      success: true, 
      message: 'Hotel deleted successfully' 
    });

  } catch (error) {
    console.error('Error in deleteHotel:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting hotel',
      error: error.message 
    });
  }
});

/**
 * @desc    Get enums for frontend with metadata
 * @route   GET /api/hotels/enums
 * @access  Public
 */
export const getEnums = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      roomTypes: ROOM_TYPES.map(type => ({
        value: type,
        label: type,
        description: `${type} accommodation`
      })),
      amenities: AMENITIES.map(amenity => ({
        value: amenity,
        label: amenity,
        category: amenity.includes('Service') ? 'Services' : 'Facilities'
      }))
    }
  });
});