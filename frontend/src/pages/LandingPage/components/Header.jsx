import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const Header = () => {
    
      const {user, isAuthenticated}  = useAuth()
  const navigate = useNavigate()

  return (
       <motion.header
       initial={{ opacity: 0, y: -20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}
       className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
              <Briefcase className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-gray-800">JobConnect</span>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/find-jobs')}
              className="px-3 py-1 text-gray-600 hover:text-blue-500 font-medium transition-colors"
            >
              Find Jobs
            </button>
            <button
              onClick={() => navigate(
                isAuthenticated && user?.role === 'employer'
                  ? '/employer-dashboard'
                  : '/login'
              )}
              className="px-3 py-1 text-gray-600 hover:text-blue-500 font-medium transition-colors"
            >
              For Employers
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi, {user?.fullName || user?.email.split('@')[0]}
                </span>
                <button
                  onClick={() => navigate(user?.role === 'employer' ? '/employer-dashboard' : '/find-jobs')}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-gray-600 hover:text-blue-500 font-medium text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
