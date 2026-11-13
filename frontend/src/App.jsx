
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

// Layouts
import AdminLayout from './components/layout/AdminLayout'
import PatientLayout from './components/layout/PatientLayout'
import DriverLayout from './components/layout/DriverLayout'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import Ambulances from './pages/admin/Ambulances'
import EmergencyRequests from './pages/admin/EmergencyRequests'
import Drivers from './pages/admin/Drivers'
import AdminLiveTracking from './pages/admin/LiveTracking'

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard'
import RequestAmbulance from './pages/patient/RequestAmbulance'
import MyRequests from './pages/patient/MyRequests'
import PatientLiveTracking from './pages/patient/LiveTracking'

// Driver pages
import DriverDashboard from './pages/driver/DriverDashboard'
import AssignedEmergencies from './pages/driver/AssignedEmergencies'
import DriverLiveTracking from './pages/driver/LiveTracking'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="ambulances" element={<Ambulances />} />
            <Route path="emergency-requests" element={<EmergencyRequests />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="live-tracking" element={<AdminLiveTracking />} />
          </Route>
        </Route>

        {/* Patient routes */}
        <Route element={<ProtectedRoute role="PATIENT" />}>
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="request-ambulance" element={<RequestAmbulance />} />
            <Route path="my-requests" element={<MyRequests />} />
            <Route path="live-tracking" element={<PatientLiveTracking />} />
          </Route>
        </Route>

        {/* Driver routes */}
        <Route element={<ProtectedRoute role="DRIVER" />}>
          <Route path="/driver" element={<DriverLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="assigned-emergencies" element={<AssignedEmergencies />} />
            <Route path="live-tracking" element={<DriverLiveTracking />} />
          </Route>
        </Route>

        {/* Default and unknown routes */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
