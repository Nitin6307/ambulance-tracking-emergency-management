
import { useEffect, useState } from 'react'

import AmbulanceMap from './AmbulanceMap'

import StatCard from './components/dashboard/StatCard'
import Button from './components/common/Button'
import Loader from './components/common/Loader'
import Input from './components/common/Input'
import Modal from './components/common/Modal'

import AmbulanceForm from './components/ambulance/AmbulanceForm'
import AmbulanceTable from './components/ambulance/AmbulanceTable'
import AmbulanceDetails from './components/ambulance/AmbulanceDetails'
import EmergencyRequestsTable from './components/emergency/EmergencyRequestsTable'

import {
  Ambulance,
  CheckCircle2,
  Activity,
  Siren,
} from 'lucide-react'

import authApi from './api/authApi'
import ambulanceApi from './api/ambulanceApi'
import emergencyApi from './api/emergencyApi'


function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [activePage, setActivePage] = useState('Dashboard')

  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Ambulance modal states
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false)
  // Driver assignment states
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [selectedDriverId, setSelectedDriverId] = useState('')
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [assigningDriver, setAssigningDriver] = useState(false)
  const [driverError, setDriverError] = useState('')
  const [addingAmbulance, setAddingAmbulance] = useState(false)
  const [ambulanceError, setAmbulanceError] = useState('')

  // Selected ambulance details
  const [ambulance, setAmbulance] = useState({
    ambulanceNumber: 'AMB-003',
    vehicleNumber: 'UP32EF7890',
    driverName: 'Test User',
    status: 'ASSIGNED',
    latitude: 26.850,
    longitude: 80.950,
  })

  // Ambulance data
  const [ambulances, setAmbulances] = useState([])
  const [loadingAmbulances, setLoadingAmbulances] = useState(true)

  // Emergency data
  // Emergency data
  const [emergencyRequests, setEmergencyRequests] = useState([])
  const [activeEmergencies, setActiveEmergencies] = useState(0)
  const [loadingEmergencies, setLoadingEmergencies] = useState(true)
  const [assigningRequestId, setAssigningRequestId] = useState(null)

  // FETCH ALL AMBULANCES
  useEffect(() => {
    async function fetchAmbulances() {
      try {
        const response = await ambulanceApi.getAll()
        setAmbulances(response.data)
      } catch (error) {
        console.error('Error fetching ambulances:', error)
      } finally {
        setLoadingAmbulances(false)
      }
    }

    if (user?.role === 'ADMIN') {
      setLoadingAmbulances(true)
      fetchAmbulances()
    } else {
      setLoadingAmbulances(false)
    }
  }, [user])


// FETCH EMERGENCY REQUESTS
useEffect(() => {
  async function fetchEmergencies() {
    try {
      const response = await emergencyApi.getAll()
      const data = response.data

      // Store all emergency requests
      setEmergencyRequests(data)

      // Count active emergencies
      setActiveEmergencies(
        data.filter(request =>
          request.status !== 'COMPLETED' &&
          request.status !== 'CANCELLED'
        ).length
      )

    } catch (error) {
      console.error('Emergency API error:', error)
    } finally {
      setLoadingEmergencies(false)
    }
  }

  if (user?.role === 'ADMIN') {
    setLoadingEmergencies(true)
    fetchEmergencies()
  } else {
    setLoadingEmergencies(false)
  }
}, [user])



  // ADD NEW AMBULANCE
  async function handleAddAmbulance(ambulanceData) {
    setAddingAmbulance(true)
    setAmbulanceError('')

    try {
      const response = await ambulanceApi.create(ambulanceData)

      setAmbulances(previous => [
        ...previous,
        response.data,
      ])

      setShowAmbulanceModal(false)

    } catch (error) {
      setAmbulanceError(
        error.response?.data?.message ||
        'Unable to add ambulance'
      )
    } finally {
      setAddingAmbulance(false)
    }
  }

  async function handleEmergencyAssignment(requestId, assignmentType) {
    setAssigningRequestId(requestId)

    try {
      if (assignmentType === 'ambulance') {
        await emergencyApi.assignNearestAmbulance(requestId)
      } else if (assignmentType === 'driver') {
        await emergencyApi.assignDriver(requestId)
      }

      // Refresh emergency requests after assignment
      const response = await emergencyApi.getAll()
      const data = response.data

      setEmergencyRequests(data)

      setActiveEmergencies(
        data.filter(request =>
          request.status !== 'COMPLETED' &&
          request.status !== 'CANCELLED'
        ).length
      )

      window.alert(
        assignmentType === 'ambulance'
          ? 'Ambulance assigned successfully!'
          : 'Driver assigned successfully!'
      )

    } catch (error) {
      console.error('Emergency assignment error:', error)

      window.alert(
        error.response?.data?.message ||
        'Unable to complete the assignment.'
      )
    } finally {
      setAssigningRequestId(null)
    }
  }

  // OPEN ASSIGN DRIVER MODAL
  async function handleOpenAssignModal(ambulanceItem) {
    setSelectedAmbulance(ambulanceItem)
    setSelectedDriverId('')
    setDriverError('')
    setDrivers([])
    setShowAssignModal(true)
    setLoadingDrivers(true)

    try {
      const response = await ambulanceApi.getAllDrivers()
      setDrivers(response.data)
    } catch (error) {
      console.error('Error fetching drivers:', error)

      setDriverError(
        error.response?.data?.message ||
        'Unable to load drivers'
      )
    } finally {
      setLoadingDrivers(false)
    }
  }

  // ASSIGN DRIVER TO AMBULANCE
  async function handleAssignDriver() {
    if (!selectedAmbulance || !selectedDriverId) {
      return
    }

    setAssigningDriver(true)
    setDriverError('')

    try {
      await ambulanceApi.assignDriver(
        selectedAmbulance.id,
        Number(selectedDriverId)
      )

      const response = await ambulanceApi.getAll()
      setAmbulances(response.data)

      setShowAssignModal(false)
      setSelectedAmbulance(null)
      setSelectedDriverId('')

    } catch (error) {
      console.error('Driver assignment error:', error)

      setDriverError(
        error.response?.data?.message ||
        'Unable to assign driver'
      )
    } finally {
      setAssigningDriver(false)
    }
  }


  // LOGIN
  async function handleLogin(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await authApi.login({
        email,
        password,
      })

      const data = response.data

      sessionStorage.setItem('token', data.token)

      const loggedInUser = {
        email: data.email,
        role: data.role,
      }

      sessionStorage.setItem(
        'user',
        JSON.stringify(loggedInUser)
      )

      setUser(loggedInUser)

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Invalid credentials or unable to connect to server'
      )
    } finally {
      setLoading(false)
    }
  }


  // LOGOUT
  function handleLogout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')

    setUser(null)
    setPassword('')

    setAmbulances([])
    setActiveEmergencies(0)

    setLoadingAmbulances(false)
    setLoadingEmergencies(false)
  }


  // LOGIN PAGE
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        >

          <h1 className="mb-2 text-2xl font-bold text-white">
            🚑 Ambulance System
          </h1>

          <p className="mb-8 text-slate-400">
            Sign in to your account
          </p>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && (
            <p className="mb-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full p-3"
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>

        </form>
      </div>
    )
  }


  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">

      {/* SIDEBAR */}
      <aside className="w-full border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">

        <h2 className="mb-8 text-xl font-bold">
          🚑 Ambulance Admin
        </h2>

        <nav className="space-y-2">

          {[
            'Dashboard',
            'Ambulances',
            'Emergency Requests',
            'Live Tracking',
            'Drivers',
          ].map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                activePage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

        </nav>

        <div className="mt-8">
          <Button
            onClick={handleLogout}
            variant="danger"
            className="w-full"
          >
            Logout
          </Button>
        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-4 md:p-8">

        {/* HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold">
              🚑 Ambulance Management System
            </h1>

            <p className="mt-1 text-slate-400">
              Real-Time Emergency Tracking Dashboard
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {user.email} · {user.role}
            </p>
          </div>

        </header>


        {/* DASHBOARD STATISTICS */}
        {/* PAGE CONTENT */}

        {activePage === 'Dashboard' && (
          <>
            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Ambulances"
                value={loadingAmbulances ? '...' : ambulances.length}
                icon={Ambulance}
              />

              <StatCard
                title="Available"
                value={
                  loadingAmbulances
                    ? '...'
                    : ambulances.filter(a => a.status === 'AVAILABLE').length
                }
                icon={CheckCircle2}
                iconColor="text-emerald-400"
              />

              <StatCard
                title="Assigned"
                value={
                  loadingAmbulances
                    ? '...'
                    : ambulances.filter(
                        a =>
                          a.status !== 'AVAILABLE' &&
                          a.status !== 'OUT_OF_SERVICE'
                      ).length
                }
                icon={Activity}
                iconColor="text-orange-400"
              />

              <StatCard
                title="Active Emergencies"
                value={loadingEmergencies ? '...' : activeEmergencies}
                icon={Siren}
                iconColor="text-red-400"
              />

            </section>

            {/* LIVE MAP AND AMBULANCE DETAILS */}
            <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">

              <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 xl:col-span-2">
                <h2 className="mb-4 text-xl font-semibold">
                  Live Ambulance Map
                </h2>

                <div className="h-[480px] w-full overflow-hidden rounded-lg">
                  <AmbulanceMap onAmbulanceUpdate={setAmbulance} />
                </div>
              </div>

              <AmbulanceDetails ambulance={ambulance} />

            </section>

            {/* ALL AMBULANCES */}
            <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-5">

              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  All Ambulances
                </h2>

                <Button
                  onClick={() => {
                    setAmbulanceError('')
                    setShowAmbulanceModal(true)
                  }}
                >
                  + Add Ambulance
                </Button>
              </div>

              {loadingAmbulances ? (
                <Loader message="Loading ambulances..." />
              ) : (
               <AmbulanceTable
                 ambulances={ambulances}
                 onAssignDriver={handleOpenAssignModal}
               />
              )}

            </section>
          </>
        )}

       {/* AMBULANCE MANAGEMENT PAGE */}
       {activePage === 'Ambulances' && (
         <>
           <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
             <div>
               <h2 className="text-2xl font-bold">Ambulance Management</h2>
               <p className="mt-1 text-slate-400">
                 Manage and monitor all registered ambulances.
               </p>
             </div>

             <Button
               onClick={() => {
                 setAmbulanceError('')
                 setShowAmbulanceModal(true)
               }}
             >
               + Add Ambulance
             </Button>
           </div>

           <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
             <StatCard
               title="Total Ambulances"
               value={loadingAmbulances ? '...' : ambulances.length}
               icon={Ambulance}
             />

             <StatCard
               title="Available"
               value={
                 loadingAmbulances
                   ? '...'
                   : ambulances.filter(a => a.status === 'AVAILABLE').length
               }
               icon={CheckCircle2}
               iconColor="text-emerald-400"
             />

             <StatCard
               title="Assigned / Active"
               value={
                 loadingAmbulances
                   ? '...'
                   : ambulances.filter(
                       a =>
                         a.status !== 'AVAILABLE' &&
                         a.status !== 'OUT_OF_SERVICE'
                     ).length
               }
               icon={Activity}
               iconColor="text-orange-400"
             />

             <StatCard
               title="Out of Service"
               value={
                 loadingAmbulances
                   ? '...'
                   : ambulances.filter(a => a.status === 'OUT_OF_SERVICE').length
               }
               icon={Siren}
               iconColor="text-red-400"
             />
           </section>

           <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-5">
             <h3 className="mb-5 text-xl font-semibold">
               Registered Ambulances
             </h3>

             {loadingAmbulances ? (
               <Loader message="Loading ambulances..." />
             ) : (
               <AmbulanceTable
                 ambulances={ambulances}
                 onAssignDriver={handleOpenAssignModal}
               />
             )}
           </section>
         </>
       )}


{/* EMERGENCY REQUESTS PAGE */}
{activePage === 'Emergency Requests' && (
  <>
    <div className="mb-6">
      <h2 className="text-2xl font-bold">
        Emergency Requests Management
      </h2>
      <p className="mt-1 text-slate-400">
        Monitor and manage all patient emergency requests.
      </p>
    </div>

    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Requests"
        value={loadingEmergencies ? '...' : emergencyRequests.length}
        icon={Siren}
      />

      <StatCard
        title="Active Requests"
        value={loadingEmergencies ? '...' : activeEmergencies}
        icon={Activity}
        iconColor="text-red-400"
      />

      <StatCard
        title="Completed Requests"
        value={
          loadingEmergencies
            ? '...'
            : emergencyRequests.filter(r => r.status === 'COMPLETED').length
        }
        icon={CheckCircle2}
        iconColor="text-emerald-400"
      />
    </section>

    <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-5">
      <h3 className="mb-5 text-xl font-semibold">
        All Emergency Requests
      </h3>

      {loadingEmergencies ? (
        <Loader message="Loading emergency requests..." />
      ) : (
        <EmergencyRequestsTable
          requests={emergencyRequests}
          onAssignAmbulance={(requestId) =>
            handleEmergencyAssignment(requestId, 'ambulance')
          }
          onAssignDriver={(requestId) =>
            handleEmergencyAssignment(requestId, 'driver')
          }
          assigningRequestId={assigningRequestId}
        />
      )}
    </section>
  </>
)}

{/* OTHER PAGE PLACEHOLDERS */}
{!['Dashboard', 'Ambulances', 'Emergency Requests'].includes(activePage) && (
  <section className="rounded-xl border border-slate-700 bg-slate-900 p-8">
    <h2 className="mb-3 text-2xl font-bold">{activePage}</h2>
    <p className="text-slate-400">
      {activePage} page is under development.
    </p>
  </section>
)}


      </main>


      {/* ADD AMBULANCE MODAL */}
      <Modal
        isOpen={showAmbulanceModal}
        onClose={() => setShowAmbulanceModal(false)}
        title="Add New Ambulance"
      >

        {ambulanceError && (
          <p className="mb-4 text-sm text-red-400">
            {ambulanceError}
          </p>
        )}

        <AmbulanceForm
          onSubmit={handleAddAmbulance}
          onCancel={() => setShowAmbulanceModal(false)}
          loading={addingAmbulance}
        />

      </Modal>


{/* ASSIGN DRIVER MODAL */}
<Modal
  isOpen={showAssignModal}
  onClose={() => setShowAssignModal(false)}
  title="Assign Driver"
>
  {selectedAmbulance && (
    <div className="space-y-5">

      <div className="rounded-lg bg-slate-800 p-4">
        <p className="text-sm text-slate-400">
          Selected Ambulance
        </p>
        <p className="mt-1 font-semibold text-white">
          {selectedAmbulance.ambulanceNumber}
        </p>
        <p className="text-sm text-slate-300">
          {selectedAmbulance.vehicleNumber}
        </p>
      </div>

      {loadingDrivers ? (
        <Loader message="Loading drivers..." />
      ) : driverError ? (
        <p className="text-sm text-red-400">
          {driverError}
        </p>
      ) : drivers.length === 0 ? (
        <p className="text-sm text-slate-400">
          No registered drivers found.
        </p>
      ) : (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Select Driver
          </label>

          <select
            value={selectedDriverId}
            onChange={e => setSelectedDriverId(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
          >
            <option value="">Choose a driver</option>

            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => setShowAssignModal(false)}
        >
          Cancel
        </Button>

        <Button
          onClick={handleAssignDriver}
          disabled={
            !selectedDriverId ||
            loadingDrivers ||
            assigningDriver
          }
        >
          {assigningDriver ? 'Assigning...' : 'Assign Driver'}
        </Button>
      </div>

    </div>
  )}
</Modal>


    </div>
  )
}

export default App
