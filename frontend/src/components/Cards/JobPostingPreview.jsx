import {
    Briefcase,
    Clock,
    MapPin,
    Users,
    Coins,
    ArrowLeft
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";
import { Building2 } from "lucide-react";

const JobPostingPreview = ({ formData, setIsPreview }) => {
    const { user } = useAuth();
    const currencies = [{ value: "pkr", label: "PKR" }];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-5xl">
                {/* Header with glassmorphism effect */}
                <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-xl shadow-lg p-6 flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Job Preview</h2>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                        onClick={() => setIsPreview(false)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Edit</span>
                    </button>
                </div>

                {/* Main content card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Hero Section */}
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{formData.jobTitle}</h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-gray-600">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                    <span>{formData.isRemote ? "Remote" : formData.location}</span>
                                    {formData.isRemote && formData.location && (
                                        <span className="text-gray-500"> • {formData.location}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user?.companyLogo ? (
                            <img
                                src={user.companyLogo}
                                alt="Company Logo"
                                className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200"
                            />
                        ) : (
                            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                                <Building2 className="w-10 h-10 text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="px-6 pb-6 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                            {CATEGORIES.find((c) => c.value === formData.category)?.label}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                            {JOB_TYPES.find((j) => j.value === formData.jobType)?.label}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{formData.jobDuration} • Posted today</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-0 pb-8 space-y-8">
                        {/* Salary Section */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-white to-teal-100 border border-emerald-100 p-6 rounded-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 via-white to-teal-400/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-gradient-to-r from-emerald-50 via-white to-teal-100 rounded-full">
                                            <Coins className="w-6 h-6 text-yellow-500" />

                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Compensation</h3>
                                            <div className="text-gray-600">
                                                {currencies.find((c) => c.value === formData.currency)?.label}
                                                {formData.salaryMin.toLocaleString()} -{" "}
                                                {currencies.find((c) => c.value === formData.currency)?.label}
                                                {formData.salaryMax.toLocaleString()}
                                                <span className="ml-1 text-sm md:text-lg font-normal">per year</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center gap-2 text-emerald-600">
                                        <Users className="w-5 h-5 text-gray-500" />
                                        <span>Competitive</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Job Description  */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-y-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600"></div>
                                <span className="text-base md:text-lg">About This Role</span>
                            </h3>
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">

                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {formData.description}
                                </div>
                            </div>
                        </div>

                        {/* Requirments  */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center space-y-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-pink-600 to-purple-600 rounded-full"></div>
                                <span className="text-base md:text-lg">What we are Looking For</span>
                            </h3>
                            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
                                <div className="text-sm text-gray-600 px-4 py-2 leading-relaxed whitespace-pre-wrap">
                                    {formData.requirements}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default JobPostingPreview
