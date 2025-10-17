import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Search, ArrowRight, Users, Building2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import SplitText from '../../../../Reactbits/SplitText/SplitText'
import ShinyText from '../../../../Reactbits/ShinyText/ShinyText'

const Hero = () => {
    const {user, isAuthenticated}  = useAuth()
    const navigate = useNavigate()

    const stats = [
        {icon: Users, label: "Total Users", value: "2.4M+"},
        {icon: Building2, label: "Companies", value: "567"},
        {icon: TrendingUp, label: "Jobs Posted", value: "890"}
    ]
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-6 lg:px-20">
    <div className="max-w-7xl mx-auto">
        <div className="space-y-8 text-center">
            {/* Main Heading */}
            {/* <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            >
                Find Your Dream Job{" "}
                <span className="block text-blue-600">
                    Perfect Hire
                </span>
            </motion.h1> */}
            <SplitText
  text={`Find Your Dream Job \n Perfect Hire`}
  className="text-4xl md:text-5xl font-extrabold text-blue-600 leading-tight"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
//   onLetterAnimationComplete={handleAnimationComplete}
/>

            {/* <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-3xl mx-auto text-lg text-gray-600"
            >
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam repudiandae nisi eligendi ea eaque facere delectus ab, tenetur excepturi dolores nobis eos odio voluptatibus quas a praesentium dolorem accusamus libero quia voluptatem aspernatur qui repellat, aut magnam. Aut, non ut.
                <span className="font-semibold text-blue-600"> Perfect Hire</span>
            </motion.p> */}
            <ShinyText text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam repudiandae nisi eligendi ea eaque facere delectus ab, tenetur excepturi dolores nobis eos odio voluptatibus quas a praesentium dolorem accusamus libero quia voluptatem aspernatur qui repellat, aut magnam. Aut, non ut.
" disabled={false} speed={3} className='max-w-3xl mx-auto text-lg text-zinc-600' />


            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-wrap gap-4 justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition"
                    onClick={() => navigate('/find-jobs')}
                >
                    <Search className="w-5 h-5" />
                    <span>Find Jobs</span>
                    <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-full shadow-md hover:bg-gray-300 transition"
                    onClick={() => navigate(
                        isAuthenticated && user?.role === 'employer'
                            ? '/employer-dashboard'
                            : '/login'
                    )}
                >
                    Post a Job
                </motion.button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                        className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-3">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </div>

    {/* Decorative Shapes */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
    </div>
</section>

  )
}

export default Hero
