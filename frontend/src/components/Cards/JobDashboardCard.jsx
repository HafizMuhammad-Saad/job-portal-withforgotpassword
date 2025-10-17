import { Briefcase } from "lucide-react"
import moment from 'moment';


const JobDashboardCard = ({job}) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
  {/* Left - Icon & Job Info */}
  <div className="flex items-center gap-4">
    {/* Icon Container */}
    <div className="p-2 rounded-full bg-blue-100 flex items-center justify-center">
      <Briefcase className="w-6 h-6 text-blue-600" />
    </div>

    {/* Job Details */}
    <div>
      <h4 className="text-base font-semibold text-gray-800">{job.title}</h4>
      <p className="text-sm text-gray-500">
        {job.location} • {moment(job.createdAt).format("DD MMM YYYY")}
      </p>
    </div>
  </div>

  {/* Right - Status Badge */}
  <div>
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
        job.isClosed
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {job.isClosed ? "Closed" : "Active"}
    </span>
  </div>
</div>

  )
}

export default JobDashboardCard
