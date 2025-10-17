import { useState } from 'react'
import { Building2, Mail, Edit3 } from 'lucide-react'
import {useEffect} from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import uploadImage from '../../utils/uploadImage'

import DashboardLayout from '../../components/Layout/DashboardLayout'
import EditProfileDetails from './EditProfileDetails'

const EmployerProfilePage = () => {

  const {user, updateUser} = useAuth(); 

  useEffect(() => {
    if (!user) {
      return;
    }
    setProfileData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      companyLogo: user.companyLogo,
    });
  }, [user]);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({...profileData});
  const [uploading, setUploading] = useState({avatar: false, logo: false});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || "";

      //update from data with new image url
      const field = type === 'avatar' ? 'avatar' : 'companyLogo';
      handleInputChange(field, avatarUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      
    } finally {
      setUploading((prev) => ({...prev, [type]: false }));
    }

  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];

    if (file) {
      // create preview url
      const previewUrl = URL.createObjectURL(file);
      const field = type === 'avatar' ? 'avatar' : 'companyLogo';
      handleInputChange(field, previewUrl);

      //upload image
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, formData);

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setProfileData({...formData});
        updateUser({...formData});
        setEditMode(false);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({...profileData});
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
      formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
/>
    )
  }

 return (
  <DashboardLayout activeMenu={"company-profile"}>
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Employer Profile
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
          onClick={() => setEditMode(true)}
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-sm font-medium">Edit Profile</span>
        </button>
      </div>

      {/* Content - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        
        {/* Personal Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="flex items-center gap-6">
            <img
              src={profileData.avatar || "example.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full shadow-md object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {profileData.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-sm">{profileData.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Company Information
          </h2>
          <div className="flex items-center gap-6">
            <img
              src={profileData.companyLogo || "company-logo.png"}
              alt="Company Logo"
              className="w-20 h-20 rounded-lg shadow-md object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {profileData.companyName}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Building2 className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Company</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    {/* Company description  */}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-gray-200 pb-2">
          About Company
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
          {profileData.companyDescription}

        </p>

      </div>
    </div>
  </div>
</DashboardLayout>


)

}

export default EmployerProfilePage
