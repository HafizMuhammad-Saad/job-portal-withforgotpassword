import { BookMarked, Building, Building2, Calendar, MapPin } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../StatusBadge";

const JobCard = ({
    job,
    onClick,
    onToggleSave,
    onApply,
    saved, 
    hideApply
}) => {

    const { user } = useAuth();

    const formatSalary = (min) => {
        const formatNumber = (num) => {
            if (num >= 1000) return `PKR ${(num / 1000).toFixed(0)}k`;
            return `PKR ${num}`;
        };
        return `${formatNumber(min)}/m`;
    }

    return (
      <div
  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition cursor-pointer"
  onClick={onClick}
>
  {/* Top Row: Logo + Title + Save */}
  <div className="flex justify-between items-start gap-3">
    <div className="flex items-center gap-4">
      {job?.company?.companyLogo ? (
        <img
          src={job?.company?.companyLogo}
          alt="Company Logo"
          className="w-14 h-14 object-cover rounded-md border border-gray-100"
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center rounded-md bg-gray-50 border border-gray-100">
          <Building2 className="w-7 h-7 text-gray-400" />
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">
          {job?.title}
        </h3>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <Building className="w-4 h-4 text-gray-400" />
          {job?.company?.companyName}
        </p>
      </div>
    </div>

    {user && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave();
        }}
        className="text-gray-400 hover:text-blue-600 transition"
      >
        <BookMarked
          className={`w-5 h-5 ${
            job?.isSaved || saved ? "text-blue-600" : "text-gray-500"
          }`}
        />
      </button>
    )}
  </div>

  {/* Middle Row: Location, Type, Category */}
  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
    <span className="flex items-center gap-1">
      <MapPin className="w-4 h-4 text-gray-400" /> {job?.location}
    </span>
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        job?.type === "Full Time"
          ? "bg-green-100 text-green-700"
          : job.type === "Part Time"
          ? "bg-yellow-100 text-yellow-700"
          : job.type === "Contract"
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {job?.type}
    </span>
    <span className="text-xs px-2 py-1 rounded bg-gray-50 border border-gray-100">
      {job?.category}
    </span>
  </div>

  {/* Date Posted */}
  <div className="flex items-center gap-1 text-sm text-gray-400">
    <Calendar className="w-4 h-4" />
    {job?.createdAt ? moment(job?.createdAt).format("Do MMM YYYY") : "N/A"}
  </div>

  {/* Bottom Row: Salary + Actions */}
  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
    <div className="text-lg font-semibold text-gray-800">
      {formatSalary(job?.salaryMin, job?.salaryMax)}
    </div>

    {!saved && (
      <>
        {job?.applicationStatus ? (
          <StatusBadge status={job?.applicationStatus} />
        ) : (
          !hideApply && (
            <button
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
            >
              Apply Now
            </button>
          )
        )}
      </>
    )}
  </div>
</div>

    )
}

export default JobCard
