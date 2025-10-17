import { ArrowLeft, Bookmark, Grid, List, X } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { useEffect, useState } from "react"
import Navbar from "../../components/Layout/Navbar"
import JobCard from "../../components/Cards/JobCard"
import toast from "react-hot-toast"

const SavedJobs = () => {

  const {user} = useAuth()
  const navigate = useNavigate();

  const [savedJobList, setSavedJobList] = useState([])
  const [viewMode, setViewMode] = useState("grid")

  const getSavedJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      setSavedJobList(response.data)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.UNSAVE_JOB(jobId));
      toast.success("Job removed successfully!");
      getSavedJobs();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      getSavedJobs();
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar />

  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {savedJobList && (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Saved Jobs</h1>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div>
          {savedJobList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                You haven’t saved any jobs yet
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-sm">
                Start saving jobs that interest you to easily view them later.
              </p>
              <button
                onClick={() => navigate("/find-jobs")}
                className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
                  : "space-y-4"
              }
            >
              {savedJobList.map((savedJob) => (
                <JobCard
                  key={savedJob._id}
                  job={savedJob?.job}
                  onClick={() => navigate(`/job/${savedJob?.job._id}`)}
                  onToggleSave={() => handleUnsaveJob(savedJob?.job._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

  )
}

export default SavedJobs
