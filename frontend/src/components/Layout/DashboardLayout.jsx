import { useState, useEffect } from 'react'
import { Briefcase, Building2, LogOut, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAVIGATION_MENU } from '../../utils/data'
import ProfileDropdown from './ProfileDropdown'

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`flex items-center w-full space-x-3 py-2.5 px-4 rounded-lg transition-colors duration-200
        ${isActive 
          ? "bg-blue-50 text-blue-600 font-medium" 
          : "text-gray-600 hover:bg-gray-50"
        }`}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 transition-colors duration-200
          ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`}
      />
      {!isCollapsed && (
        <span className="truncate">{item.name}</span>
      )}
    </button>
  );
};
const DashboardLayout = ({ activeMenu, children }) => {

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);


    //Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (profileDropdownOpen) {
                setProfileDropdownOpen(false);
            }

        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);

    }, [profileDropdownOpen]);

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
        navigate(`/${itemId}`);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const sidebarCollapsed = !isMobile && false;


    return (
    <div className="flex">
  {/* Sidebar */}
  <div
    className={`fixed inset-y-0 left-0 flex flex-col transition-all duration-300 ease-in-out shadow-sm
      ${isMobile
        ? sidebarOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full w-64"
        : sidebarCollapsed
          ? "w-20"
          : "w-64"
      }
      bg-white border-r border-gray-200 z-50`}
  >

    {/* Logo Section */}
    <div className="flex items-center justify-center py-6 px-4 border-b border-gray-100">
      {!sidebarCollapsed ? (
        <Link to="/" className="flex items-center space-x-2 group">
          <Briefcase className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-lg font-semibold text-gray-800 tracking-tight">
            JobPortal
          </span>
        </Link>
      ) : (
        <Building2 className="w-7 h-7 text-blue-600" />
      )}
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
      {NAVIGATION_MENU.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={activeNavItem === item.id}
          onClick={handleNavigation}
          isCollapsed={sidebarCollapsed}
        />
      ))}
    </nav>

    {/* Logout */}
    <div className="px-3 py-4 border-t border-gray-100">
      <button
        onClick={logout}
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
      >
        <LogOut className="w-5 h-5 text-red-500" />
        {!sidebarCollapsed && <span className="ml-3">Logout</span>}
      </button>
    </div>
  </div>

  {/* Mobile overlay */}
{isMobile && sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-200"
    onClick={() => setSidebarOpen(false)}
  />
)}

{/* Main content */}
<div
  className={`flex-1 p-6 transition-all duration-300 bg-gray-50 min-h-screen 
    ${!isMobile && (sidebarCollapsed ? "ml-20" : "ml-64")}`}
>

  {/* Top navbar */}
  <header className="flex items-center justify-between bg-white shadow-sm rounded-lg px-5 py-3 mb-6">
    <div className="flex items-center gap-4">
      {isMobile && (
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      )}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Welcome back!</h1>
        <p className="text-sm text-gray-500">
          Here's what's happening with your job today.
        </p>
      </div>
    </div>

    {/* Profile Dropdown Placeholder */}
    <div className="flex items-center">
      {/* Add profile dropdown here */}
      <ProfileDropdown isOpen={profileDropdownOpen} onToggle={(e) => {
        e.stopPropagation();
        setProfileDropdownOpen(!profileDropdownOpen);
      }}
      avatar={user?.avatar || ""} companyName={user?.name || ""} email={user?.email || ""}
      onLogout={logout}/>
    </div>
  </header>

  {/* Main content area */}
  <main className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-10rem)]">
    {children}
  </main>
</div>

</div>

    )
}

export default DashboardLayout
