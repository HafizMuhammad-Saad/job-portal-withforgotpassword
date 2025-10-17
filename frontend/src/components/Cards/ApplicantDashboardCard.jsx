import { Clock } from "lucide-react"

const ApplicantDashboardCard = ({
    applicant, position, time
}) => {
    return (
   <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
  {/* Left - Avatar + Info */}
  <div className="flex items-center gap-4">
    {/* Avatar with initials */}
    <div className="w-10 h-10 rounded-full bg-purple-400 text-white flex items-center justify-center text-blue-600 font-semibold text-sm">
      {applicant.name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>

    {/* Name & Position */}
    <div>
      <h4 className="text-sm font-semibold text-gray-800">{applicant.name}</h4>
      <p className="text-xs text-gray-500">{position}</p>
    </div>
  </div>

  {/* Right - Time */}
  <div className="flex items-center gap-1 text-xs text-gray-500">
    <Clock className="w-4 h-4 text-gray-400" />
    {time}
  </div>
</div>

    )
}

export default ApplicantDashboardCard
