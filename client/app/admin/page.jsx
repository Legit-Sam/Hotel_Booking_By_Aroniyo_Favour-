'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import ImageUpload from '@/components/admin/ImageUpload'
import RoomManager from '@/components/admin/RoomManager'
import AmenityManager from '@/components/admin/AmenityManager'
import LocationSelector from '@/components/admin/LocationSelector'
import HotelService from '@/services/hotelService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LayoutDashboard, Hotel, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Hotels', icon: Hotel, href: '/admin/hotels' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 fixed h-full z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>HotelAdmin</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 w-full"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {children}
      </div>
    </div>
  )
}

const CreateHotelForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      phone: '+234' // Set default phone with country code
    }
  })
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [rooms, setRooms] = useState([{ type: '', price: '' }])
  const [amenities, setAmenities] = useState([])
  const router = useRouter()

  const onSubmit = async (data) => {
    setLoading(true)
    const toastId = toast.loading('Creating hotel...')
    
  try {
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append structured data
      formData.append('rooms', JSON.stringify(rooms.filter(room => room.type && room.price)));
      formData.append('amenities', JSON.stringify(amenities));
      
      // Append whatsapp template if exists
      if (data.whatsappMessageTemplate) {
        formData.append('whatsappMessageTemplate', data.whatsappMessageTemplate);
      }
      
      // Append image files
  images.forEach((image) => {
        if (image.file instanceof File) {
          formData.append('images', image.file, image.name)
        }
      })

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await HotelService.createHotel(formData);
      
      toast.success('Hotel created successfully!', { id: toastId });
      router.push('/admin/hotels');
    } catch (error) {
      console.error('Error creating hotel:', error);
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Create New Hotel</h1>
              <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Fill in the details below to register a new hotel property</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Hotel Name *
                    </label>
                    <input
                      {...register('name', { 
                        required: 'Hotel name is required',
                        minLength: {
                          value: 3,
                          message: 'Name must be at least 3 characters'
                        }
                      })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="Grand Plaza Hotel"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number *
                    </label>
                    <input
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\+[1-9]\d{1,14}$/,
                          message: 'Must be in international format (e.g. +2341234567890)'
                        }
                      })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="+2341234567890"
                      type="tel"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: {
                        value: 20,
                        message: 'Description must be at least 20 characters'
                      }
                    })}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Describe the hotel's features, amenities, and unique selling points..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Location Details
                </h2>
                
                <LocationSelector
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Address *
                  </label>
                  <textarea
                    {...register('address', { 
                      required: 'Address is required',
                      minLength: {
                        value: 10,
                        message: 'Address must be at least 10 characters'
                      }
                    })}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="123 Main Street, City, State, Postal Code"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Hotel Images
                </h2>
                <ImageUpload 
                  images={images} 
                  setImages={setImages} 
                  maxFiles={10}
                  accept="image/*"
                />
              </div>

              {/* Rooms Section */}
              <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Room Configuration
                </h2>
                <RoomManager 
                  rooms={rooms} 
                  setRooms={setRooms} 
                  minRooms={1}
                  maxRooms={10}
                />
              </div>

              {/* Amenities Section */}
              <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  Amenities & Facilities
                </h2>
                <AmenityManager 
                  amenities={amenities} 
                  setAmenities={setAmenities} 
                  maxAmenities={20}
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 sm:space-x-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-32"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <CreateHotelForm />
    </AdminLayout>
  )
}