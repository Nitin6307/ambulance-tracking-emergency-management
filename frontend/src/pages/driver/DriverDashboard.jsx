
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ambulance,
  ClipboardList,
  Clock,
  CheckCircle,
  ArrowRight,
  HeartPulse,
} from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'
import Loader from '../../components/common/Loader'

function DriverDashboard() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const driverName = user.name || 'Driver'

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await emergencyApi.getDriverRequests()
        setRequests(response.data)
      } catch (error) {
        console.error('Unable to load driver requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  if (loading) {
    return <Loader message="Loading driver dashboard..." />
  }

  const active = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  ).length

  const completed = requests.filter(
    request => request.status === 'COMPLETED'
  ).length

  const pending = requests.filter(
    request => request.status === 'DRIVER_ASSIGNED'
  ).length

  const stats = [
    {
      title: 'Total Assignments',
      value: requests.length,
      icon: ClipboardList,
      color: 'blue',
      description: 'All assigned requests',
    },
    {
      title: 'Active Emergencies',
      value: active,
      icon: Ambulance,
      color: 'red',
      description: 'Ongoing assignments',
    },
    {
      title: 'New Assignments',
      value: pending,
      icon: Clock,
      color: 'amber',
      description: 'Awaiting your action',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'green',
      description: 'Successfully completed',
    },
  ]

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
  }

  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <HeartPulse size={17} />
            DRIVER OVERVIEW
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {driverName}!
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your assigned emergency services and ambulance location.
          </p>
        </div>

        <button
          onClick={() => navigate('/driver/assigned-emergencies')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          View Assignments
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${colorStyles[stat.color]}`}>
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Emergency Assignments */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Ambulance size={23} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Emergency Assignments
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              View assigned emergencies and update their progress.
            </p>
          </div>

          <button
            onClick={() => navigate('/driver/assigned-emergencies')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Assigned Emergencies
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Total Assignments
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-800 dark:text-blue-300">
              {requests.length}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/30">
            <p className="text-sm text-green-700 dark:text-green-400">
              Completed Assignments
            </p>
            <p className="mt-2 text-2xl font-bold text-green-800 dark:text-green-300">
              {completed}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DriverDashboard
