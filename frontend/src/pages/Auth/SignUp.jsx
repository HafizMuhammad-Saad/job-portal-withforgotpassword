import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import {User, Mail, Lock, Eye, Upload, EyeOff, Loader, AlertCircle, CheckCircle, UserCheck, Building2} from 'lucide-react'
import { validateAvatar, validateEmail, validatePassword } from '../../utils/helper';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from '../../context/AuthContext';


const SignUp = () => {

  const {login} = useAuth()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: '',
        avatar: null   
    });

    const [formState, setFormState] = useState({
        loading: false,
        errors: {},
        success: false,
        showPaassword: false,
        avatarPreview: null
    });

     const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    };

    if (formState.errors[name]) {
        setFormState(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [name]: ''
            }
        }));
    }

    const handleRoleChange = (role) => {
        setFormData(prev => ({
            ...prev,
            role
        }));
        if (formState.errors.role) {
            setFormState(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    role: ''
                }
            }));
            
        }
    };


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateAvatar(file);
            if (error) {
                setFormState(prev => ({
                    ...prev,
                    errors: {
                        ...prev.errors,
                        avatar: error
                    }
                }));
                return;
            } 

            setFormData(prev => ({
                ...prev,
                avatar: file
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormState(prev => ({
                    ...prev,
                    avatarPreview: e.target.result,
                    errors: {
                        ...prev.errors,
                        avatar: ''
                    }
                }));
            }
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {
            fullName: !formData.fullName ? "Enter Full Name" : "",
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            role: !formData.role ? "Select Role" : "",
            avatar: "",
        };

        // remove empty errors
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key]
        });

        setFormState(prev => ({
            ...prev,
            errors
        }));
        return Object.keys(errors).length === 0;
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormState(prev => ({
            ...prev,
            loading: true
        }));

        try {
            let avatarUrl = "";

            if (formData.avatar) {
              const imgUploadRes = await uploadImage(formData.avatar);
              avatarUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
              name: formData.fullName,
              email: formData.email,
              password: formData.password,
              role: formData.role,
              avatar: avatarUrl || "",
            });

            setFormState(prev => ({
                ...prev,
                loading: false,
                success: true,
                errors: {},
            }));

            const { token } = response.data;

            if (token) {
              login(response.data, token);

              // redirect based on role
              setTimeout(() => {
                window.location.href = formData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
              }, 2000);
            }
        } catch (error) {
            console.log(error);

            setFormState(prev => ({
                ...prev,
                loading: false,
                errors: {
                    submit: error.response?.data?.message || 'Registration failed. Please try again',
                }
            }));
            
        }
    };


       if (formState.success) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className=''>
                        <CheckCircle className=''/>
                        <h2 className="text-2xl font-bold text">Account Created!</h2>
                        <p className="">
                            Welcome to JobPortal Your account has been successfully created </p>    
                            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
                            <p className="">Redirecting to your Dashboard...</p>
                    </motion.div>
                </div>
            )
        }

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="sm:mx-auto sm:w-full sm:max-w-md"
  >
    <div className="bg-white py-8 px-4 shadow-card rounded-lg sm:px-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-semibold text-text">Create Account</h2>
        <p className="mt-2 text-sm text-muted">
          Create a new account to get started
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-text">
            Full Name *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-muted" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              onChange={handleInputChange}
              value={formData.fullName}
              className={`block w-full pl-10 pr-3 py-3 border ${formState.errors.fullName ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-muted focus:ring-primary focus:border-primary'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              placeholder="Enter Your Full Name"
            />
          </div>
          {formState.errors.fullName && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">
            Email Address *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              className={`block w-full pl-10 pr-3 py-3 border ${formState.errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-muted focus:ring-primary focus:border-primary'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              placeholder="Enter Your Email"
            />
          </div>
          {formState.errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text">
            Password *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted" />
            </div>
            <input
              type={formState.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              className={`block w-full pl-10 pr-10 py-3 border ${formState.errors.password ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-muted focus:ring-primary focus:border-primary'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              placeholder="Create a strong password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setFormState(prev => ({...prev, showPassword: !prev.showPassword}))}
                className="text-muted hover:text-text focus:outline-none"
              >
                {formState.showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {formState.errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.password}
            </p>
          )}
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Profile Picture (optional)
          </label>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              {formState.avatarPreview ? (
                <img
                  src={formState.avatarPreview}
                  alt="Avatar Preview"
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <User className="h-8 w-8 text-muted" />
                </div>
              )}
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                id="avatar"
                accept=".jpg,.jpeg,.png"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <p className="mt-1 text-xs text-muted">JPG, PNG up to 5MB</p>
            </label>
          </div>
          {formState.errors.avatar && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.avatar}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            I am a *
          </label>
          <div className="grid grid-cols-2 gap-4">
  <button
    type="button"
    onClick={() => handleRoleChange('jobseeker')}
    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center 
      ${formState.role === 'jobseeker' 
        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/50' 
        : 'border-gray-300 hover:border-primary/50'
      }
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
  >
    <UserCheck className="w-6 h-6" />
    <span className="mt-2 font-medium">Job Seeker</span>
    <span className="text-xs text-muted mt-1">Looking for opportunities</span>
  </button>
  
  <button
    type="button"
    onClick={() => handleRoleChange('employer')}
    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center 
      ${formState.role === 'employer' 
        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/50' 
        : 'border-gray-300 hover:border-primary/50'
      }
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
  >
    <Building2 className="w-6 h-6" />
    <span className="mt-2 font-medium">Employer</span>
    <span className="text-xs text-muted mt-1">Hiring Talent</span>
  </button>
</div>
          {formState.errors.role && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.role}
            </p>
          )}
        </div>

        {formState.errors.submit && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {formState.errors.submit}
          </p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={formState.loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {formState.loading ? (
              <>
                <Loader className="animate-spin h-5 w-5" />
                <span className="ml-2">Signing up...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Already have an account? */}
        <div className="text-center">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </div>
  </motion.div>
</div>
  )
}

export default SignUp
