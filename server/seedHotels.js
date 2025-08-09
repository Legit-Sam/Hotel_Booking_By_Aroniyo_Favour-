// seedHotels.js
import mongoose from 'mongoose';
import Hotel from './models/Hotel.js';
import Location from './models/Location.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate 7 stable image URLs per hotel using picsum.photos seeded images
const getHotelImages = (hotelName) => {
  const base = hotelName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return Array.from({ length: 7 }, (_, i) =>
    `https://picsum.photos/seed/${encodeURIComponent(base + '-' + (i + 1))}/800/600`
  );
};

const lokojaHotels = [
  {
    name: "Grand Hotel Lokoja",
    description: "A luxurious hotel with modern amenities and excellent service located in the heart of Lokoja.",
    contact: {
      phone: "+2348031234567",
      whatsapp: "+2348031234567",
      address: "1 Ibrahim Babangida Way, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Bar',
      'Room Service', 'Air Conditioning', 'Cable TV', '24/7 Security', 'Laundry Service'
    ],
    rooms: [
      { type: 'Standard Room', price: 15000 },
      { type: 'Deluxe Room', price: 25000 },
      { type: 'Suite', price: 40000 }
    ],
    images: getHotelImages("Grand Hotel Lokoja")
  },
  {
    name: "Confluence Hotel",
    description: "Situated near the famous River Niger and Benue confluence with beautiful views and comfortable rooms.",
    contact: {
      phone: "+2348052345678",
      whatsapp: "+2348052345678",
      address: "12 Ganaja Road, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Restaurant', 'Bar',
      'Room Service', 'Air Conditioning', '24/7 Security'
    ],
    rooms: [
      { type: 'Standard Room', price: 12000 },
      { type: 'Deluxe Room', price: 20000 }
    ],
    images: getHotelImages("Confluence Hotel")
  },
  {
    name: "Kogi Hotels Limited",
    description: "Government-owned hotel offering comfortable accommodation and conference facilities.",
    contact: {
      phone: "+2348073456789",
      whatsapp: "+2348073456789",
      address: "Lokoja-Abuja Road, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Restaurant', 'Conference Room',
      'Air Conditioning', '24/7 Security'
    ],
    rooms: [
      { type: 'Standard Room', price: 10000 },
      { type: 'Executive Room', price: 18000 },
      { type: 'Presidential Suite', price: 35000 }
    ],
    images: getHotelImages("Kogi Hotels Limited")
  },
  {
    name: "The Palace Hotel Lokoja",
    description: "Modern hotel offering royal treatment, spacious rooms, and premium services for guests.",
    contact: {
      phone: "+2348098765432",
      whatsapp: "+2348098765432",
      address: "3 Marine Road, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Pool', 'Spa', 'Restaurant', 'Bar',
      'Room Service', 'Air Conditioning', '24/7 Security'
    ],
    rooms: [
      { type: 'Standard Room', price: 18000 },
      { type: 'Deluxe Room', price: 28000 },
      { type: 'Suite', price: 45000 }
    ],
    images: getHotelImages("The Palace Hotel Lokoja")
  },
  {
    name: "River View Hotel",
    description: "A scenic hotel overlooking the River Niger with peaceful surroundings and excellent facilities.",
    contact: {
      phone: "+2347012345678",
      whatsapp: "+2347012345678",
      address: "8 Old Market Road, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Restaurant', 'Bar',
      'Air Conditioning', '24/7 Security', 'Laundry Service'
    ],
    rooms: [
      { type: 'Standard Room', price: 14000 },
      { type: 'Executive Room', price: 22000 }
    ],
    images: getHotelImages("River View Hotel")
  },
  {
    name: "Presidential Lodge Lokoja",
    description: "High-end lodge offering exclusive suites and world-class hospitality for dignitaries and tourists.",
    contact: {
      phone: "+2348023456789",
      whatsapp: "+2348023456789",
      address: "Government Reserved Area, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Gym', 'Restaurant', 'Bar',
      'Room Service', 'Air Conditioning', 'Cable TV', '24/7 Security'
    ],
    rooms: [
      { type: 'Executive Room', price: 30000 },
      { type: 'Presidential Suite', price: 60000 }
    ],
    images: getHotelImages("Presidential Lodge Lokoja")
  },
  {
    name: "Lokoja Luxury Inn",
    description: "Boutique-style hotel offering premium lodging and personalized services for business travelers.",
    contact: {
      phone: "+2348109876543",
      whatsapp: "+2348109876543",
      address: "15 Hassan Katsina Road, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Restaurant', 'Bar',
      'Room Service', 'Air Conditioning', '24/7 Security'
    ],
    rooms: [
      { type: 'Standard Room', price: 16000 },
      { type: 'Deluxe Room', price: 24000 }
    ],
    images: getHotelImages("Lokoja Luxury Inn")
  },
  {
    name: "Hilltop Hotel Lokoja",
    description: "Beautifully situated hotel on a hill with panoramic views of Lokoja and its surroundings.",
    contact: {
      phone: "+2348134567890",
      whatsapp: "+2348134567890",
      address: "Hilltop Avenue, Lokoja"
    },
    amenities: [
      'Free WiFi', 'Parking', 'Restaurant', 'Air Conditioning',
      'Cable TV', '24/7 Security'
    ],
    rooms: [
      { type: 'Standard Room', price: 13000 },
      { type: 'Executive Room', price: 21000 }
    ],
    images: getHotelImages("Hilltop Hotel Lokoja")
  }
];

// Seeder function (safe: skips existing hotel names)
const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create or ensure location exists; add Lokoja to cities array if missing
    const location = await Location.findOneAndUpdate(
      { state: 'Kogi' },
      { $setOnInsert: { state: 'Kogi' }, $addToSet: { cities: 'Lokoja' } },
      { upsert: true, new: true }
    );

    const created = [];
    for (const hotelData of lokojaHotels) {
      // Skip if a hotel with same name already exists
      const existing = await Hotel.findOne({ name: hotelData.name });
      if (existing) {
        console.log(`Skipping (already exists): ${hotelData.name}`);
        continue;
      }

      const hotel = new Hotel({
        ...hotelData,
        location: location._id,
        whatsappMessageTemplate: `Hello, I'm interested in booking a room at ${hotelData.name}. Can you provide more information?`
      });

      const saved = await hotel.save();
      created.push(saved);
      console.log(`Created: ${saved.name}`);
    }

    console.log(`\nSeeding complete. ${created.length} new hotels created.`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding hotels:', err);
    process.exit(1);
  }
};

seedHotels();
