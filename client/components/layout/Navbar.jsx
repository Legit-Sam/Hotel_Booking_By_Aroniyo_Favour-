'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Hotel } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const isAdmin = user?.role === 'admin'

  const navItems = [
    { href: '/', label: 'Home' },
    !user && { href: '/login', label: 'Login' },
    isAdmin && { href: '/admin', label: 'Dashboard' },
    isAdmin && { href: '/admin/hotels', label: 'Manage Hotels' },
  ].filter(Boolean)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Hotel className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">HotelHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
