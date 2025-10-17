import React from 'react'
import { employerFeatures, jobSeekerFeatures } from '../../../utils/data'
import { Briefcase, Users } from 'lucide-react'

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
  <div className="container mx-auto px-4">
    {/* Header */}
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Everything you need to <br />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Succeed in Your Career
        </span>
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        Our platform is designed to empower both job seekers and employers with cutting-edge tools
        that simplify the hiring process and accelerate career growth.
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Job Seeker Features */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
            Job Seeker Features
          </h3>
          <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4 w-20" />
        </div>
        
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {jobSeekerFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="group flex items-start space-x-4 transition-all hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                <feature.Icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employer Features */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-3 text-purple-600" />
            Employer Features
          </h3>
          <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mt-4 w-20" />
        </div>
        
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {employerFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="group flex items-start space-x-4 transition-all hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg group-hover:bg-purple-600 transition-colors">
                <feature.Icon className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</section>
  )
}

export default Features
