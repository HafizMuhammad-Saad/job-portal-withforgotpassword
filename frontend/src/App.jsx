import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import JobSeekerDashboard from './pages/JobSeeker/JobSeekerDashboard';
import JobDetails from './pages/JobSeeker/JobDetails';
import SavedJobs from './pages/JobSeeker/SavedJobs';
import UserProfile from './pages/JobSeeker/UserProfile';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import JobPostingForm from './pages/Employer/JobPostingForm';
import ManageJobs from './pages/Employer/ManageJobs';
import EmployerProfilePage from './pages/Employer/EmployerProfilePage';
import ApplicationViewer from './pages/Employer/ApplicationViewer';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import { ForgotPassword } from './features/ForgotPassword';
import { ResetPassword } from './features/ResetPassword';
// import DotGrid from '../Reactbits/DotGrid/DotGrid';
// import Silk from '../Reactbits/Silk/Silk';

function App() {

  return (
    <AuthProvider>
      {/* <div className="relative min-h-screen light-silk">
<div className="fixed inset-0 -z-10">
          <Silk
  speed={5}
  scale={1}
  color="#436B84"
  noiseIntensity={1.5}
  rotation={0}
/>
        </div> */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
                  <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPassword/>}/>


          <Route path="/find-jobs" element={<JobSeekerDashboard />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Protected Routes */}

          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants" element={<ApplicationViewer />} />
            <Route path="/company-profile" element={<EmployerProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster 
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#333',
          }
        }}
      />

      {/* </div> */}

    </AuthProvider>
  )
}

export default App
