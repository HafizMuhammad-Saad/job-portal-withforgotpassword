import { useState, useEffect } from "react"
import { Briefcase, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";


const Navbar = () => {
    const {user, logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [ProfileDropdownOpen, setProfileDropdownOpen] = useState(false);


    //Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (ProfileDropdownOpen) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => 
            document.removeEventListener("click", handleClickOutside);

    }, [ProfileDropdownOpen]);
  return (
    <header className="bg-white shadow-md border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      
      {/* Logo */}
      <Link to="/find-jobs" className="flex items-center gap-2 group">
        <div className="p-2 rounded-md bg-blue-100 group-hover:bg-blue-200 transition">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          JOB<span className="text-blue-600">PORTAL</span>
        </span>
      </Link>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => navigate("/saved-jobs")}
          >
            <Bookmark className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {isAuthenticated ? (
          <ProfileDropdown
            isOpen={ProfileDropdownOpen}
            onToggle={(e) => {
              e.stopPropagation();
              setProfileDropdownOpen(!ProfileDropdownOpen);
            }}
            avatar={user?.avatar || ""}
            companyName={user?.name || ""}
            email={user?.email || ""}
            userRole={user?.role || ""}
            onLogout={logout}
          />
        ) : (
          <>
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition"
            >
              Sign Up
            </a>
          </>
        )}
      </div>

    </div>
  </div>
</header>

  )
};

export default Navbar
