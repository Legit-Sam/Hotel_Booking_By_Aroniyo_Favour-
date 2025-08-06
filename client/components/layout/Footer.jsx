import { Hotel, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8"> {/* Reduced padding */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> {/* Reduced gap */}
          {/* Logo & Description - Made more compact */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-2"> {/* Reduced margin */}
              <Hotel className="w-6 h-6 text-primary-500" /> {/* Smaller icon */}
              <span className="text-xl font-bold">HotelHub</span> {/* Smaller text */}
            </div>
            <p className="text-gray-300 text-sm mb-3 max-w-md"> {/* Smaller text and reduced margin */}
              Your trusted partner in finding perfect accommodations worldwide.
            </p> {/* Shortened description */}
          </div>

          {/* Quick Links - More compact */}
          <div>
            <h3 className="text-md font-semibold mb-2">Links</h3> {/* Smaller heading */}
            <ul className="space-y-1 text-sm"> {/* Smaller gap and text */}
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - More compact */}
          <div>
            <h3 className="text-md font-semibold mb-2">Contact</h3> {/* Smaller heading */}
            <div className="space-y-1 text-sm"> {/* Smaller gap and text */}
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 text-primary-500" /> {/* Smaller icon */}
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3 text-primary-500" /> {/* Smaller icon */}
                <span className="text-gray-300">info@hotelhub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-primary-500" /> {/* Smaller icon */}
                <span className="text-gray-300">New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-6 text-center text-sm"> {/* Reduced padding and smaller text */}
          <p className="text-gray-300">
            © 2024 HotelHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}