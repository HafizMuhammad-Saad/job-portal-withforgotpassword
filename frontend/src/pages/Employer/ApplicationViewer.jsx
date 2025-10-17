import { useState, useEffect, useMemo } from 'react'
import { Users, Calendar, MapPin, Briefcase, Download, Eye, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getInitials } from '../../utils/helper';
import DashboardLayout from '../../components/Layout/DashboardLayout'
import StatusBadge from '../../components/StatusBadge';
import ApplicantProfilePreview from '../../components/Cards/ApplicantProfilePreview';

const ApplicationViewer = () => {

  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId));
      setApplications(response.data);
    } catch (error) {
      console.log("Error fetching applications:", error);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (jobId) fetchApplications();
    else navigate('/manage-jobs');
  }, []);

  //Group applications by job
  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app.job.title.toLowerCase());

    return filtered.reduce((acc, app) => {
      const jobId = app.job._id;
      if (!acc[jobId]) {
        acc[jobId] = {
          job: app.job,
          applications: [],
        };
      }
      acc[jobId].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  }
  return (
    <DashboardLayout activeMenu={'manage-jobs'}>
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            <p className="mt-4 text-gray-600">Loading Applications...</p>
          </div>
        </div>
      )}

      <div className="px-6 py-6 bg-white border-b border-gray-200">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={() => navigate('/manage-jobs')}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Jobs</span>
              </button>

              {/* Page Title */}
              <h1 className="text-2xl font-bold text-gray-900">
                Applications Overview
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
{/* Main content */}
<div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 min-h-[60vh] rounded-b-lg shadow-inner">
  {Object.keys(groupedApplications).length === 0 ? (
    /* Empty state */
    <div className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 bg-blue-50 rounded-full">
        <Users className="w-14 h-14 text-blue-500 animate-pulse" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mt-6">
        No Applications Yet
      </h3>
      <p className="mt-2 text-gray-600 max-w-md">
        When candidates apply to your job postings, their applications will appear here for review.
      </p>
    </div>
  ) : (
    /* Applications by job */
    <div className="space-y-10">
      {Object.values(groupedApplications).map(({ job, applications }) => (
        <div
          key={job._id}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
        >
          {/* Job Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {job.title}
              </h2>

              {/* Job meta info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{job.category}</span>
                </div>
                
              </div>
            </div>

            {/* Applications count */}
            <div className="shrink-0">
              <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-sm">
                {applications.length} application
                {applications.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Placeholder for Applications table/list */}
          <div className="p-6 text-sm text-gray-700">
  <div className="divide-y divide-gray-200">
    {applications.map((application) => (
      <div
        key={application._id}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 hover:bg-gray-50 transition-colors"
      >
        {/* Left: Applicant Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {application.applicant.avatar ? (
              <img
                src={application.applicant.avatar}
                alt={application.applicant.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-semibold ring-2 ring-gray-200">
                {getInitials(application.applicant.name)}
              </div>
            )}
          </div>

          {/* Candidate Info */}
          <div>
            <h3 className="font-medium text-gray-900">{application.applicant.name}</h3>
            <p className="text-gray-500 text-sm">{application.applicant.email}</p>
            <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
              <Calendar className="w-4 h-4" />
              <span>
                Applied {moment(application.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Resume Button */}
          <StatusBadge status={application.status} />
          <button
            onClick={() => handleDownloadResume(application.applicant.resume)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Resume
          </button>

          {/* View Profile Button */}
          <button
            onClick={() => setSelectedApplicant(application)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Profile
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
      ))}
    </div>
  )}
</div>

{/* Profile Model  */}
{selectedApplicant && (
  <ApplicantProfilePreview
  selectedApplicant={selectedApplicant}
  setSelectedApplicant={setSelectedApplicant}
  handleDownloadResume={handleDownloadResume}
  handleClose={() => {
    setSelectedApplicant(null);
    fetchApplications();
  }}
  />
)}



    </DashboardLayout>
  )
}

export default ApplicationViewer
