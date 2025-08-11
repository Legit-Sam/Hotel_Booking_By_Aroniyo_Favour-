import { Hotel, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <Hotel className="w-6 h-6 text-primary-500" />
              <span className="text-xl font-bold">HotelHub</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              Your trusted partner in finding perfect accommodations worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-2">Links</h3>
            <ul className="space-y-1 text-sm">
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

          {/* Contact Info */}
          <div>
            <h3 className="text-md font-semibold mb-2">Contact</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 text-primary-500" />
                <span className="text-gray-300">+234 814 880 8800</span> {/* Hilltop Paradise Phone */}
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3 text-primary-500" />
                <span className="text-gray-300">booking@hilltopparadise.com</span> {/* Placeholder email */}
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-primary-500" />
                <span className="text-gray-300">Lokoja, Kogi State, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 mt-6 text-center text-sm">
          <p className="text-gray-300">
            © {new Date().getFullYear()} HotelHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
