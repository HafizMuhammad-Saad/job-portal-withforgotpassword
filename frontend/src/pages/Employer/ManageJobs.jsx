import { useState, useMemo, useEffect } from 'react'
import { Search, Plus, Edit, X, Trash2, ChevronUp, ChevronDown, Users } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import DashboardLayout from '../../components/Layout/DashboardLayout'
import { API_PATHS } from '../../utils/apiPaths';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const ManageJobs = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;


  //Sample Job data
  const [jobs, setJobs] = useState([]);

  //filter and sort job
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    //Sort jobs
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'applicants') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);


  //Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  //Toggle the status of the job
  const handleStatusChange = async (jobId) => {
    try {
      const response = await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      getPostedJobs(true);
    } catch (error) {
      console.error("Error toggling job status:", error);

    }
  };

  // Delete a specific job
  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job listing deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);

    }
  };

  //Decide which sort icon to display based on current sort field and direction
  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ChevronUp className='w-4 h-4' />;
    return sortDirection === 'asc' ? <ChevronUp className='w-4 h-4 text-blue-500' /> : <ChevronDown className='w-4 h-4 text-blue-500' />
  };

  //Loading state with animations
  const LoadingRow = () => {
    return (
      <tr className="animate-pulse">
        {/* First Column: Avatar + Text */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </td>

        {/* Second Column */}
        <td className="px-6 py-4">
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
        </td>

        {/* Third Column */}
        <td className="px-6 py-4">
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </td>

        {/* Fourth Column: 3 small lines */}
        <td className="px-6 py-4">
          <div className="space-y-2">
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
        </td>
      </tr>
    );
  };


  const getPostedJobs = async (disableLoader) => {
    setIsLoading(!disableLoader);
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);

      if (response.status === 200 && response.data?.length > 0) {
        const formattedJobs = response.data.map((job) => ({
          id: job._id,
          title: job?.title,
          company: job?.company?.name,
          status: job?.isClosed ? "Closed" : "Active",
          applicants: job?.applicationCount || 0,
          datePosted: moment(job?.createdAt).format("YYYY-MM-DD"),
          logo: job?.company?.companyLogo,
        }));

        setJobs(formattedJobs);
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      } else {
        console.error(error.message, 'error posting job');
      }
    } finally {
      setIsLoading(false);

    }
  };

  useEffect(() => {
    getPostedJobs();
    return () => { };
  }, []);
  return (
    <DashboardLayout activeMenu={'manage-jobs'}>
      <div className="px-6 py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Job Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage your Job posting and track applications
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/post-job')}
            >
              <Plus className="w-5 h-5" />
              Add New Job
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 max-w-7xl mx-auto backdrop-blur-sm bg-white/30 shadow-black/20 rounded-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex items-center w-full md:w-1/2 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 pointer-events-none">
              <div>
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block focus:ring-2 focus:ring-blue-500 ml-2 w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-75"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block focus:ring-2 focus:ring-blue-500 transition-all duration-200 w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs.
            </p>
          </div>



          {/* Table */}
          <div className="mt-6 shadow-xl">
            {filteredAndSortedJobs.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Job Title</span>
                          <SortIcon field="title" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          <SortIcon field="status" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("applicants")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Applicants</span>
                          <SortIcon field="applicants" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                        <LoadingRow key={index} />
                      ))
                      : paginatedJobs.map((job) => (
                        <tr
                          key={job.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* Job Title & Company */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {job.title}
                              </div>
                              <div className="text-sm text-gray-500">{job.company}</div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${job.status === "Active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                            >
                              {job.status}
                            </span>
                          </td>

                          {/* Applicants */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                              onClick={() =>
                                navigate("/applicants", { state: { jobId: job.id } })
                              }
                            >
                              <Users className="w-4 h-4" />
                              {job.applicants}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {/* Edit */}
                              <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() =>
                                  navigate("/post-job", { state: { jobId: job.id } })
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Status Change */}
                              {job.status === "Active" ? (
                                <button
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                                  onClick={() => handleStatusChange(job.id)}
                                >
                                  <X className="w-4 h-4" />
                                  <span className="text-xs font-medium">Close</span>
                                </button>
                              ) : (
                                <button
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                                  onClick={() => handleStatusChange(job.id)}
                                >
                                  <Plus className="w-4 h-4" />
                                  <span className="text-xs font-medium">Activate</span>
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                className="text-gray-500 hover:text-red-600"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination  */}
          { totalPages > 1 && (
<div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  {/* Simple Prev/Next */}
  <div className="flex items-center gap-2">
    <button
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>

  {/* Showing Info + Numbered Pagination */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
    {/* Results summary */}
    <p className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-medium">{startIndex + 1}</span> to{" "}
      <span className="font-medium">
        {Math.min(startIndex + itemsPerPage, filteredAndSortedJobs.length)}
      </span>{" "}
      of{" "}
      <span className="font-medium">{filteredAndSortedJobs.length}</span> results
    </p>

    {/* Page numbers */}
    <nav className="inline-flex rounded-md shadow-sm">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-1.5 text-sm font-medium border border-gray-300 ${
            currentPage === page
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  </div>
</div>

                    )}
        </div>
      </div>


    </DashboardLayout>
  )
}

export default ManageJobs
