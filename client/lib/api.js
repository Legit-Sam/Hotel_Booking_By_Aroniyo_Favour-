// lib/api.js
import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Mock data for development
const mockHotels = [
  {
    id: '1',
    name: 'Grand Palace Hotel',
    city: 'Los Angeles',
    state: 'California',
    description: 'A luxurious hotel in the heart of downtown Los Angeles with stunning city views and world-class amenities.',
    address: '123 Downtown Blvd, Los Angeles, CA 90012',
    phone: '+1234567890',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rooms: [
      { type: 'Standard Room', price: 150 },
      { type: 'Deluxe Room', price: 200 },
      { type: 'Suite', price: 350 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Room Service']
  },
  {
    id: '2',
    name: 'Ocean View Resort',
    city: 'Miami',
    state: 'Florida',
    description: 'Beachfront resort with pristine ocean views, spa services, and tropical paradise vibes.',
    address: '456 Ocean Drive, Miami, FL 33139',
    phone: '+1987654321',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rooms: [
      { type: 'Standard Room', price: 180 },
      { type: 'Ocean View Room', price: 250 },
      { type: 'Presidential Suite', price: 500 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Beach Access', '24/7 Security']
  },
  {
    id: '3',
    name: 'Metropolitan Hotel',
    city: 'New York City',
    state: 'New York',
    description: 'Modern hotel in Manhattan with easy access to Times Square and Broadway shows.',
    address: '789 Broadway, New York, NY 10003',
    phone: '+1122334455',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rooms: [
      { type: 'Standard Room', price: 220 },
      { type: 'Executive Room', price: 300 }
    ],
    amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Conference Room', '24/7 Security']
  },
  {
    id: '4',
    name: 'Texas Star Hotel',
    city: 'Austin',
    state: 'Texas',
    description: 'Boutique hotel with authentic Texas hospitality and modern amenities in downtown Austin.',
    address: '321 Music Lane, Austin, TX 78701',
    phone: '+1555666777',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rooms: [
      { type: 'Standard Room', price: 130 },
      { type: 'Deluxe Room', price: 180 },
      { type: 'Family Room', price: 250 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Restaurant', 'Bar', 'Parking', 'Live Music']
  },
  {
    id: '5',
    name: 'Windy City Suites',
    city: 'Chicago',
    state: 'Illinois',
    description: 'Elegant suites overlooking Lake Michigan with premium amenities and downtown convenience.',
    address: '654 Lake Shore Dr, Chicago, IL 60611',
    phone: '+1888999000',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rooms: [
      { type: 'Standard Suite', price: 200 },
      { type: 'Lake View Suite', price: 280 },
      { type: 'Presidential Suite', price: 450 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service', 'Concierge']
  },
  {
    id: '6',
    name: 'Golden Gate Inn',
    city: 'San Francisco',
    state: 'California',
    description: 'Charming boutique hotel near Golden Gate Bridge with stunning bay views and Victorian architecture.',
    address: '987 Golden Gate Ave, San Francisco, CA 94102',
    phone: '+1777888999',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    rooms: [
      { type: 'Standard Room', price: 190 },
      { type: 'Bay View Room', price: 260 },
      { type: 'Suite', price: 380 }
    ],
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge', 'Cable TV', 'Room Service']
  }
]

// API functions
export const fetchHotels = async () => {
  try {
    // Try to fetch from API first
    const response = await api.get('/hotels')
    return response.data
  } catch (error) {
    // Fall back to mock data
    console.log('Using mock data for hotels')
    return mockHotels
  }
}

export const fetchHotelById = async (id) => {
  try {
    // Try to fetch from API first
    const response = await api.get(`/hotels/${id}`)
    return response.data
  } catch (error) {
    // Fall back to mock data
    console.log('Using mock data for hotel details')
    return mockHotels.find(hotel => hotel.id === id)
  }
}

export const createHotel = async (hotelData) => {
  try {
    const response = await api.post('/hotels', hotelData)
    return response.data
  } catch (error) {
    // For demo purposes, just log the data
    console.log('Would create hotel:', hotelData)
    throw new Error('Hotel creation failed')
  }
}

// API Routes (Next.js API routes)
// app/api/hotels/route.js
import { NextResponse } from 'next/server'

// This would typically connect to your database
const hotels = [
  // ... same mock data as above
]

export async function GET() {
  try {
    // In a real app, fetch from database
    return NextResponse.json(hotels)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const hotelData = await request.json()
    
    // In a real app, validate and save to database
    const newHotel = {
      id: Date.now().toString(),
      ...hotelData,
      createdAt: new Date().toISOString()
    }
    
    // Add to mock data (in real app, save to database)
    hotels.push(newHotel)
    
    return NextResponse.json(newHotel, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
}
