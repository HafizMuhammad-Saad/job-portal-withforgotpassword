import { useEffect, useState } from "react"
import { Save, X, Trash2 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"
import uploadImage from "../../utils/uploadImage"
import Navbar from "../../components/Layout/Navbar"
import { Link } from "react-router-dom"

const UserProfile = () => {

  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || ""

      //update form data with new image url;
      handleInputChange(type, avatarUrl);
    } catch (error) {
      console.error("Error uploading image:", error);

    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  }

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // create preview URL
      const previewURL = URL.createObjectURL(file);
      handleInputChange(type, previewURL);

      // upload image
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, formData);

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        // Update profile data and exit edit mode
        setProfileData({ ...formData });
        updateUser({ ...formData });
      }
    } catch (error) {
      console.error("Error updating profile:", error);

    } finally {
      setSaving(false);

    }
  }

  const handleCancel = () => {
    setFormData({ ...profileData });
  }

  const DeleteResume = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: user.resume || "",
      }
      );

      if (response.status === 200) {
        toast.success("Resume deleted successfully!");
        setProfileData({ ...formData, resume: "" });
        updateUser({ ...formData, resume: "" });
      }
    } catch (error) {
      console.error("profile update failed:", error);

    } finally {
      setSaving(false);

    }
  }

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    };

    setProfileData({ ...userData });
    setFormData({ ...userData });
    return () => { };
  }, [user])
  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar />

  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      </div>

      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={formData?.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
          />
          {uploading?.avatar && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div>
          <label className="cursor-pointer">
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm transition">
              Choose Avatar
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "avatar")}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your full name"
          className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Email (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          readOnly
          className="block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2 text-gray-600 sm:text-sm cursor-not-allowed"
        />
      </div>

      {/* Resume */}
      {user?.resume ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume
          </label>
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
            <p className="text-sm text-gray-700 truncate">
              Link:{" "}
              <a
                href={user?.resume}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {user?.resume}
              </a>
            </p>
            <button
              onClick={DeleteResume}
              className="p-2 rounded-md hover:bg-red-50 transition"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="cursor-pointer">
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm transition">
              Choose File
            </span>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, "resume")}
              // className="hidden"
            />
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <Link
          to="/find-jobs"
          onClick={handleCancel}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm transition"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Link>

        <button
          onClick={handleSave}
          disabled={saving || uploading.avatar || uploading.logo}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm transition"
        >
          {saving ? (
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
</div>

  )
}

export default UserProfile
