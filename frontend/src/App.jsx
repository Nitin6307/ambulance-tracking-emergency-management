
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
  const [activeEmergencies, setActiveEmergencies] = useState(0)
  const [loadingEmergencies, setLoadingEmergencies] = useState(true)


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
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Ambulances"
            value={
              loadingAmbulances
                ? '...'
                : ambulances.length
            }
            icon={Ambulance}
          />

          <StatCard
            title="Available"
            value={
              loadingAmbulances
                ? '...'
                : ambulances.filter(
                    a => a.status === 'AVAILABLE'
                  ).length
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
            value={
              loadingEmergencies
                ? '...'
                : activeEmergencies
            }
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
              <AmbulanceMap
                onAmbulanceUpdate={setAmbulance}
              />
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
            <AmbulanceTable ambulances={ambulances} />
          )}

        </section>

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

    </div>
  )
}

export default App
