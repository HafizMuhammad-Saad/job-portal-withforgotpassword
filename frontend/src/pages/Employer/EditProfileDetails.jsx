import { X, Save } from 'lucide-react' 
import DashboardLayout from '../../components/Layout/DashboardLayout'

const EditProfileDetails = ({
  formData,
        handleInputChange,
        handleImageChange,
        handleSave,
        handleCancel,
        saving,
        uploading
}) => {
 return (
  <DashboardLayout activeMenu={"company-profile"}>
    {formData && (
      <div className="min-h-screen bg-gray-50 flex justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          </div>

          {/* Form - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Personal Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={formData?.avatar || null} alt="Avatar" className="w-20 h-20 rounded-full shadow object-cover" />
                  {uploading?.avatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  )}
                </div>
                <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                  Change Avatar
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, "avatar")} />
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input type="email" value={formData.email} readOnly className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500" />
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Company Information</h2>

              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={formData.companyLogo || null} alt="Company Logo" className="w-16 h-16 rounded-lg shadow object-cover" />
                  {uploading.companyLogo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  )}
                </div>
                <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                  Change Logo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, "logo")} />
                </label>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                <input type="text" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} placeholder="Enter your company name" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Company Description</label>
                <textarea value={formData.companyDescription} onChange={(e) => handleInputChange("companyDescription", e.target.value)} rows={3} placeholder="Describe your company..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} disabled={saving || uploading.avatar || uploading.logo} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>

        </div>
      </div>
    )}
  </DashboardLayout>
);


}

export default EditProfileDetails
