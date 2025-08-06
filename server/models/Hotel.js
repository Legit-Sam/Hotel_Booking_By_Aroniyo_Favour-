import mongoose from 'mongoose';

// Define enums for validation
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

const roomSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ROOM_TYPES,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { _id: false }); // No need for separate IDs for rooms

const hotelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: 100
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Location is required'],
    index: true // For faster queries
  },
  description: { 
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 2000
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    whatsapp: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid WhatsApp number!`
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: 500
    }
  },
  whatsappMessageTemplate: { 
    type: String,
    trim: true
  },
  amenities: {
    type: [{
      type: String,
      enum: AMENITIES,
      trim: true
    }],
    validate: {
      validator: function(v) {
        return v.length <= 20; // Max 20 amenities
      },
      message: 'Cannot have more than 20 amenities'
    }
  },
  rooms: {
    type: [roomSchema],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 10; // 1-10 room types
      },
      message: 'Hotel must have 1-10 room types'
    }
  },
  images: {
    type: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\..+/.test(v); // Basic URL validation
        },
        message: props => `${props.value} is not a valid image URL!`
      }
    }],
    validate: {
      validator: function(v) {
        return v.length <= 20; // Max 20 images
      },
      message: 'Cannot have more than 20 images'
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});

// Virtual for dynamic price range (removes need to store redundant priceRange)
hotelSchema.virtual('priceRange').get(function() {
  if (!this.rooms || this.rooms.length === 0) return null;
  
  const prices = this.rooms.map(room => room.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Indexes for faster search
hotelSchema.index({ name: 'text', description: 'text' });
hotelSchema.index({ 'rooms.price': 1 });
hotelSchema.index({ amenities: 1 });

// Auto-populate location in queries
hotelSchema.pre(/^find/, function(next) {
  this.populate('location');
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;