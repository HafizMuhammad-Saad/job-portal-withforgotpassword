import { MapPin, Coins, Building2, Clock, Users } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { useEffect, useState } from "react"
import Navbar from "../../components/Layout/Navbar"
import moment from "moment"
import StatusBadge from "../../components/StatusBadge"
import toast from "react-hot-toast"

const JobDetails = () => {

  const navigate = useNavigate()
  const {user } = useAuth()
  const { jobId } = useParams()

  const [jobDetails, setJobDetails] = useState(null);

  const getJobDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId), {
        params: {userId : user?._id || null},
      });
      setJobDetails(response.data);
    } catch (error) {
      console.error('error fetching job details', error);
      
    }
  };

  const applyToJob = async () => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success('Application submitted successfully');
      }
      getJobDetailsById();
    } catch (error) {
      console.log("Error", error);
      const errorMsg = error?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong please try again later");
    }
  };

  useEffect(() => {
    if (jobId && user) {
      getJobDetailsById();
      
    } else (
      navigate('/login')
    )
  }, [jobId, user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
  <Navbar />

  <div className="max-w-5xl mx-auto px-6 py-10">
    {jobDetails && (
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Hero Section */}
        <div className="p-8 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Company Logo / Icon */}
            <div className="flex items-center gap-4">
              {jobDetails?.company?.companyLogo ? (
                <img
                  src={jobDetails?.company?.companyLogo}
                  alt="company logo"
                  className="w-16 h-16 rounded-lg object-contain border border-gray-200 shadow-sm bg-white"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 shadow-sm">
                  <Building2 className="w-8 h-8" />
                </div>
              )}

              {/* Title & Location */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {jobDetails.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{jobDetails.location}</span>
                </div>
              </div>
            </div>

            {/* CTA / Status */}
            <div>
              {jobDetails?.applicationStatus ? (
                <StatusBadge status={jobDetails?.applicationStatus} />
              ) : (
                <button
                  onClick={applyToJob}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow hover:opacity-90 transition"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              {jobDetails.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
              {jobDetails.type}
            </span>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>
                {jobDetails.createdAt
                  ? moment(jobDetails.createdAt).fromNow()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
<div className="p-8 space-y-10">
  
  {/* Salary Section */}
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      
      {/* Compensation Info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm">
          <Coins className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compensation</h3>
          <p className="text-gray-700 text-sm">
            {jobDetails.salaryMin} - {jobDetails.salaryMax}
            <span className="ml-1 text-gray-500">per year</span>
          </p>
        </div>
      </div>

      {/* Competitive Tag */}
      <div className="flex items-center gap-2 text-indigo-600 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium">
        <Users className="w-4 h-4" />
        <span>Competitive</span>
      </div>
    </div>
  </div>

  {/* Job Description */}
  <div>
    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-3">
      <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
      About this role
    </h3>
    <p className="text-gray-700 leading-relaxed">
      {jobDetails.description}
    </p>
  </div>

  {/* Requirements */}
  <div>
    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-3">
      <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
      What we are looking for
    </h3>
    <ul className="list-disc pl-6 space-y-2 text-gray-700">
      {jobDetails.requirements}
    </ul>
  </div>

</div>

      </div>
    )}
  </div>
</div>

  )
}

export default JobDetails
