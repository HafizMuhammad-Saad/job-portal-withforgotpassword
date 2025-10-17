import React from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { useState, useEffect } from 'react'
import {
  AlertCircle,
  MapPin,
  DollarSign,
  Coins,
  Briefcase,
  Users,
  Eye,
  Send,
} from 'lucide-react'
import { API_PATHS } from '../../utils/apiPaths'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { CATEGORIES, JOB_TYPES } from '../../utils/data'
import toast from 'react-hot-toast'
import InputField from '../../components/Input/InputField'
import SelectField from '../../components/Input/SelectField'
import TextareaField from '../../components/Input/TextareaField'
import JobPostingPreview from '../../components/Cards/JobPostingPreview'

const JobPostingForm = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    jobType: '',
    category: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const jobPayload = {
      title: formData.jobTitle,
      location: formData.location,
      type: formData.jobType,
      category: formData.category,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      description: formData.description,
      requirements: formData.requirements,
    };

    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(jobId ? "Job updated successfully!" : "Job posted successfully!");
        setFormData({
          jobTitle: '',
          location: '',
          jobType: '',
          category: '',
          salaryMin: '',
          salaryMax: '',
          description: '',
          requirements: '',
        });
        navigate('/employer-dashboard');
        return;
      }

      console.error("unexpected response", response);
      toast.error("failed to post/update job");

    } catch (error) {
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
        toast.error(error.response.data.message);

      } else {
        console.error("Unexpected API Error:", error);
        toast.error("An error occurred. Please try again.");
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  // form validation helper
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.jobType) {
      errors.jobType = "Job type is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    const minStr = formData.salaryMin;
const maxStr = formData.salaryMax;

const min = minStr === "" ? null : Number(minStr);
const max = maxStr === "" ? null : Number(maxStr);


    if (min === null || max === null || Number.isNaN(min) || Number.isNaN(max)) {
  errors.salary = "Both minimum and maximum salary are required";
} else if (min < 0 || max < 0) {
  errors.salary = "Salary cannot be negative";
} else if (min >= max) {
  errors.salary = "Minimum salary should be less than maximum salary";
}

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
          const jobData = response.data;
          if(jobData) {
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              jobType: jobData.type,
              category: jobData.category,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
              description: jobData.description,
              requirements: jobData.requirements
            })
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          if(error.response) {
            toast.error('API Error',error.response.data.message);
          }
        }

      }
    };

    fetchJobDetails();

    return () => {

    }
  }, [])

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview
          formData={formData}
          setIsPreview={setIsPreview} />
      </DashboardLayout>
    )
  }


  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Post a New Job</h2>
              <p className="text-gray-500">Fill out the form below to create a job listing</p>
            </div>
            <button
              onClick={() => setIsPreview(true)}
              disabled={!isFormValid()}
              className={`flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0 rounded-md text-sm font-medium transition-all ${isFormValid()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="border-b border-gray-200">
            <div className="space-y-6">
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />

              {/* Location & Remote  */}
              <div className="space-y-4">
                <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row sm:items-end sm:justify-between sm:space-x-4">
                  <div className="flex-1">
                    <InputField
                      label="Location"
                      id="location"
                      placeholder="e.g. New York, USA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      error={errors.location}
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              {/* Category & Job Type  */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <SelectField
                  label="Category"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  options={CATEGORIES}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                  icon={Users} />

                <SelectField
                  label="Job Type"
                  id="jobType"
                  options={JOB_TYPES}
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  placeholder="Select a job type"
                  error={errors.jobType}
                  required
                  icon={Briefcase} />
              </div>

              {/* Description  */}
              <TextareaField
                label="Job Description"
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                placeholder="Enter job description"
                helperText="Describe the job role, responsibilities, and any specific requirements."
                required
              />

              {/* Requirements  */}
              <TextareaField
                label="Job Requirements"
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={errors.requirements}
                placeholder="Enter job requirements"
                helperText="Describe the skills, experience, and any other requirements for the job."
                required
              />

              {/* Salary Range */}
              <div className="flex flex-col w-full">
                <label htmlFor="salary" className="mb-2 text-sm font-semibold text-gray-700">
                  Salary Range <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Min Salary */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Coins className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      min={0} step="1" inputMode="numeric" 
                      pattern="[0-9]*"
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className="w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Max Salary */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Coins className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min={0} step="1" inputMode="numeric" 
                      pattern="[0-9]*"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className="w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                {errors.salaryMin && (
                  <div className="mt-1 flex items-center text-xs text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errors.salaryMin}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className={`w-full flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg text-white transition-all ${isSubmitting || !isFormValid()
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing Job...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Job</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default JobPostingForm
