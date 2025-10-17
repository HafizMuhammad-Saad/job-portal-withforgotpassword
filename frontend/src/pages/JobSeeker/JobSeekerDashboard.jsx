import { useState, useEffect } from "react"
import { Search, Filter, Grid, List, X } from "lucide-react";
import LoadingSpinner from "../../components/Layout/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import FilterContent from "../../components/FilterContent";
import SearchHeader from "../../components/SearchHeader";
import Navbar from "../../components/Layout/Navbar";
import JobCard from "../../components/Cards/JobCard";


const JobSeekerDashboard = () => {

  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalaray: "",
    maxSalary: "",
  });

  //Sidebar collapse state 
  const [expendSections, setExpendSections] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  //function to fetch jobs from API
  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      //Build query parameters
      const params = new URLSearchParams();

      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location) params.append("location", filterParams.location);
      if (filterParams.category) params.append("category", filterParams.category);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.minSalaray) params.append("minSalaray", filterParams.minSalaray);
      if (filterParams.maxSalary) params.append("maxSalary", filterParams.maxSalary);
      if (filterParams.experience) params.append("experience", filterParams.experience);
      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(`${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`);

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("failed to fetch jobs please try again later");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  //Fetch jobs when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        category: filters.category,
        type: filters.type,
        minSalaray: filters.minSalaray,
        maxSalary: filters.maxSalary,
        experience: filters.experience,
        remoteOnly: filters.remoteOnly
      };

      // Only call API if there are meaningfull filters
      const hasFilters = Object.values(apiFilters).some((value) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== false
      );
      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs(); // fetch all jobs if no filters
      }
    }, 500); //500ms debounce
    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section) => {
    setExpendSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalaray: "",
      maxSalary: "",
      experience: "",
    })
  };

  const MobileFilterOverlay = () => {
    <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? "" : "hidden"
      }`}>
      <div className="" onClick={() => setShowMobileFilters(false)}>
        <div className="fixed inset-0 bg-black/50">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-lg">
              <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full pb-20">
              <FilterContent
                toggleSection={toggleSection}
                clearAllFilters={clearAllFilters}
                expendSections={expendSections}
                filters={filters}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  }

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");
      }

      fetchJobs();
    } catch (error) {
      console.log(error, "error");

      toast.error("something went wrong please try again later");
    }

  }

  const applyToJob = async (jobId) => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Application submitted successfully!");
      }

      fetchJobs();
    } catch (error) {
      console.log(error, "error");
      const errorMsg = error?.response?.data?.message
      toast.error(errorMsg || "something went wrong please try again later");

    }
  };

  if (jobs.length == 0 && loading) {
    return <LoadingSpinner />
  }
  // }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
  <Navbar />

  <div className="mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      
      {/* Search Header */}
      <SearchHeader
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      {/* Content Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Jobs</h3>
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilters={clearAllFilters}
            expendSections={expendSections}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-800">{jobs.length}</span> jobs
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${viewMode === "list"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        

          {/* Job grid  */}
          {jobs.length === 0 ? (
            <div className="">
              <div className="">
                <Search className="" />
              </div>
              <h3 className="">
                No jobs found
              </h3>
              <p className="">
                Try searching for a different term or location
              </p>
              <button className="" onClick={clearAllFilters}>
                Clear all filters
              </button>
            </div>
          ): (
            <div className={
              viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0 mt-10"
      : "space-y-4 lg:space-y-6 px-2 sm:px-0 mt-10"
            }>
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() => navigate(`/job/${job._id}`)}
                  onToggleSave={() => toggleSaveJob(job._id, job.isSaved)}
                  onApply={() => applyToJob(job._id)}
                  
                />
              ))}

            </div>
          )}
        </main>
      </div>
    </div>
  </div>

  {/* Mobile Filter Overlay */}
  <MobileFilterOverlay />
</div>

  )
}

export default JobSeekerDashboard
