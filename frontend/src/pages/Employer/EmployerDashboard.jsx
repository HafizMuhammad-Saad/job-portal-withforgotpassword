import { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  Users,
  FileText,
  MessageSquare,
  CheckCircle2,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react'
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import JobDashboardCard from '../../components/Cards/JobDashboardCard';
import ApplicantDashboardCard from '../../components/Cards/ApplicantDashboardCard';


const Card = ({ title, headerAction, subtitle, className, children }) => {
  return (
    <div
      className={`bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-4">
          <div className="">
            {title && (<h3 className="text-lg font-semibold">{title}</h3>)}
            {subtitle && (<p className="text-sm text-gray-500">{subtitle}</p>)}

          </div>
          {headerAction}
        </div>
      )}
      <div className={title ? "px-6 pb-6" : "px-4 pb-4"}>
        {children}

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trendValue, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-150 via-white to-blue-200",
    green: "from-green-150 via-white to-green-200",
    red: "from-red-150 via-white to-red-200",
    orange: "from-orange-150 via-white to-orange-200",
  };

  const trendColor =
    trendValue && trendValue.toString().startsWith("-") ? "text-red-600" : "text-green-600";

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${trendColor}`} />
              <span className={`text-sm font-medium ${trendColor}`}>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Right Section - Icon */}
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </Card>
  );
};


const EmployerDashboard = () => {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }

    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => { };
  }, []);
  return (
    <DashboardLayout activeMenu="employer-dashboard">
      {isLoading ? (<LoadingSpinner />) :
        (<div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Jobs"
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={Briefcase}
              trend
              trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
              color="blue"
            />
            {/* You can add more StatCards here */}
            <StatCard
              title="Total Applications"
              value={dashboardData?.counts?.totalApplications || 0}
              icon={Users}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.totalApplicants || 0}%`}
              color="green"
            />

            <StatCard
              title="Hired" value={dashboardData?.counts?.totalHired || 0} icon={CheckCircle2} trend={true} trendValue={`${dashboardData?.counts?.trends?.totalHired || 0}%`} color="orange" />

          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card
             title="Recent Job Posts"
             subtitle="Your latest job postings"
             headerAction={
              <button
               className='text-sm text-blue-600 font-semibold'
               onClick={() => navigate("/manage-jobs")}>
                View all
              </button>
             } >
              <div className="space-y-4">
                {dashboardData?.data?.recentJobs?.slice(0, 3)?.map((job, index) => (
                  <JobDashboardCard key={index} job={job} />
                ))}
              </div>
             </Card>

             <Card
             title="Recent Applications"
             subtitle="Latest candidates applications"
             headerAction={
              <button
               className='text-sm text-blue-600 font-semibold'
               onClick={() => navigate("/manage-jobs")}>
                View all
              </button>
             } >
              <div className="space-y-4">
                {dashboardData?.data?.recentApplications?.slice(0, 3)?.map((data, index) => (
                  <ApplicantDashboardCard key={index} applicant={data?.applicant || ""}
                  position={data?.job?.title || ""}
                  time={moment(data?.updatedAt).fromNow()}
                   />
                ))}
              </div>
             </Card>
          </div>

          {/* Quick Actions */}
         <Card title="Quick Actions" subtitle="Common tasks to get you started">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[
      { title: "Post New Job", icon: Plus, color: "bg-blue-100 text-blue-600", path: "/post-job" },
      { title: "Review Applications", icon: MessageSquare, color: "bg-green-100 text-green-600", path: "/manage-jobs" },
      { title: "Company Settings", icon: Building2, color: "bg-yellow-100 text-yellow-600", path: "/company-profile" }
    ].map((action, index) => (
      <button
        key={index}
        onClick={() => navigate(action.path)}
        className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
      >
        <div className={`p-3 rounded-full ${action.color} group-hover:scale-105 transition-transform`}>
          <action.icon className="w-6 h-6" />
        </div>
        <span className="ml-4 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
          {action.title}
        </span>
      </button>
    ))}
  </div>
</Card>


        </div>)
      }
    </DashboardLayout>
  )
}

export default EmployerDashboard
