import { Download, X } from "lucide-react"
import { useState } from "react"
import { getInitials } from "../../utils/helper"
import moment from "moment"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"

import StatusBadge from "../StatusBadge"
const statusOptions = ["Applied", "In Review", "Accepted", "Rejected"];
const ApplicantProfilePreview = ({
    selectedApplicant, setSelectedApplicant, handleDownloadResume, handleClose
}) => {

    const [currentStatus, setCurrentStatus] = useState(selectedApplicant.status);
    const [loading, setLoading] = useState(false);

    const onChangeStatus = async (e) => {
        const newStatus = e.target.value;
        setCurrentStatus(newStatus);
        setLoading(true);

        try {
            const response = await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplicant._id), {status: newStatus }
        );
            
            if (response.status === 200) {
                // update local state after successful update
                setSelectedApplicant({...selectedApplicant , status: newStatus});
                toast.success("Application Status updated successfully");
            }
        } catch (error) {
            console.log("error", error);
            //optionally revert status if failed
            setCurrentStatus(selectedApplicant.status)
        } finally {
            setLoading(false);
        }
    }
 return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Model header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
                <h3 className="text-lg font-semibold">Applicant Profile</h3>
                <button
                    className="p-1 hover:bg-white/20 rounded-full transition"
                    onClick={() => handleClose()}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Model Content */}
            <div className="p-6 flex flex-col items-center space-y-6">
                {/* Applicant Info */}
                <div className="flex flex-col items-center space-y-3">
                    {selectedApplicant.applicant.avatar ? (
                        <img
                            src={selectedApplicant.applicant.avatar}
                            alt={selectedApplicant.applicant.name}
                            className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
                        />
                    ) : (
                        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-2xl shadow-lg">
                            <span>
                                {getInitials(selectedApplicant.applicant.name)}
                            </span>
                        </div>
                    )}
                    <h4 className="text-xl font-semibold text-gray-800">
                        {selectedApplicant.applicant.name}
                    </h4>
                    <p className="text-gray-500">{selectedApplicant.applicant.email}</p>
                </div>

                {/* Application Details */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Applied Position */}
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">
                            Applied Position
                        </h5>
                        <p className="text-gray-800 font-medium">{selectedApplicant.job.title}</p>
                        <p className="text-gray-500 text-sm">
                            {selectedApplicant.job.location} ◽ {selectedApplicant.job.type}
                        </p>
                    </div>

                    {/* Application Status */}
                    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 space-y-2">
                        <h5 className="text-sm font-semibold text-gray-700">
                            Application Details
                        </h5>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-600 text-sm">Status:</span>
                            <StatusBadge status={currentStatus} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-600 text-sm">Applied Date:</span>
                            <span className="text-gray-800 text-sm">
                                {moment(selectedApplicant.createdAt)?.format("Do MMM YYYY")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                        onClick={() => handleDownloadResume(selectedApplicant.applicant.resume)}
                    >
                        <Download className="w-5 h-5" />
                        Download resume
                    </button>

                    {/* Status Dropdown */}
                    <div className="flex flex-col items-start">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Change Application Status
                        </label>
                        <select
                            value={currentStatus}
                            onChange={onChangeStatus}
                            disabled={loading}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {loading && (
                            <p className="text-xs text-blue-500 mt-1">Updating Status...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
)


};

export default ApplicantProfilePreview
