'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import HotelService from '@/services/hotelService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const AdminHotels = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  })
  const router = useRouter()

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const response = await HotelService.getAllHotels({
          ...filters,
          q: searchTerm,
        })
        
        // Ensure we're working with an array
        const hotelsData = Array.isArray(response?.hotels) 
          ? response.hotels 
          : Array.isArray(response?.data?.hotels) 
            ? response.data.hotels 
            : []
            
        setHotels(hotelsData)
      } catch (error) {
        console.error('Error fetching hotels:', error)
        toast.error(error.message || 'Failed to fetch hotels')
        setHotels([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchHotels()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, filters])

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this hotel?')
      if (!confirmDelete) return

      await HotelService.deleteHotel(id)
      toast.success('Hotel deleted successfully')
      setHotels(prev => prev.filter(hotel => hotel._id !== id))
    } catch (error) {
      toast.error(error.message || 'Failed to delete hotel')
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Calculate price range safely
  const getPriceRange = (rooms) => {
    if (!Array.isArray(rooms)) return 'N/A'
    const prices = rooms.map(room => room?.price || 0).filter(price => !isNaN(price))
    if (prices.length === 0) return 'N/A'
    return `₦${Math.min(...prices)} - ₦${Math.max(...prices)}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Hotels</h1>
          <p className="text-gray-600 mt-1">View and manage all hotel properties</p>
        </div>
        <Button asChild>
          <Link href="/admin" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Hotel
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search hotels..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Input
            placeholder="State"
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="City"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Min Price"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Max Price"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Hotels Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : !Array.isArray(hotels) || hotels.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hotels found. Create your first hotel.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/hotels/${hotel._id}`} className="hover:text-primary-600">
                      {hotel.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {hotel.location?.state || 'N/A'}, {hotel.location?.cities?.[0] || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {getPriceRange(hotel.rooms)}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(hotel.rooms) ? hotel.rooms.length : 0} types
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-200 text-green-800 bg-green-50">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/hotels/${hotel._id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/hotels/edit/${hotel._id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(hotel._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default AdminHotels