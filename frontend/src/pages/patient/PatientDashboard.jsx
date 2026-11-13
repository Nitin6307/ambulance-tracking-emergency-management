
import { useEffect, useState } from 'react'
import {
  Ambulance,
  ClipboardList,
  Clock,
  CheckCircle,
  UserRound,
  Activity,
  HeartPulse,
  ArrowRight,
} from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'
import Loader from '../../components/common/Loader'
import { useNavigate } from 'react-router-dom'

function PatientDashboard() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const patientName = user.name || 'Patient'
  const patientEmail = user.email || 'Patient account'

  const initials = patientName
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    async function fetchMyRequests() {
      try {
        const response = await emergencyApi.getMyRequests()
        setRequests(response.data)
      } catch (error) {
        console.error('Unable to load patient requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyRequests()
  }, [])

  if (loading) {
    return <Loader message="Loading your dashboard..." />
  }

  const activeRequests = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  ).length

  const completedRequests = requests.filter(
    request => request.status === 'COMPLETED'
  ).length

  const pendingRequests = requests.filter(
    request => request.status === 'PENDING'
  ).length

  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: ClipboardList,
      color: 'blue',
    },
    {
      title: 'Active Requests',
      value: activeRequests,
      icon: Ambulance,
      color: 'red',
    },
    {
      title: 'Pending Requests',
      value: pendingRequests,
      icon: Clock,
      color: 'amber',
    },
    {
      title: 'Completed Requests',
      value: completedRequests,
      icon: CheckCircle,
      color: 'green',
    },
  ]

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
  }

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-1 text-slate-800">

      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <HeartPulse size={17} />
            Patient Overview
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back, {patientName}!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your emergency requests and monitor ambulance services.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/request-ambulance')}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <Ambulance size={19} className="mr-2" />
          Request Ambulance
        </button>
      </div>

      {/* Patient Profile */}
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
            {initials || 'P'}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {patientName}
              </h2>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                PATIENT
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {patientEmail}
            </p>

            <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <UserRound size={14} />
              Registered Patient Account
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <Activity size={17} />
            Account Active
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Emergency Statistics
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${colorStyles[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Emergency Assistance */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-100">
              <HeartPulse size={20} />
              <span className="text-sm font-semibold">
                Emergency Assistance
              </span>
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              Need medical assistance?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Request an ambulance through MediRescue and monitor your
              emergency request from your dashboard.
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/request-ambulance')}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get Emergency Help
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Request Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Emergency Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your ambulance request activity.
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/requests')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            View All Requests
            <ArrowRight size={16} />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Ambulance size={24} />
            </div>

            <h3 className="font-semibold text-slate-800">
              No emergency requests yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your ambulance request activity will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {requests.slice(0, 5).map((request, index) => (
              <div
                key={request.id || index}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Ambulance size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Emergency Request
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Request #{request.id || index + 1}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {request.status?.replaceAll('_', ' ') || 'UNKNOWN'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default PatientDashboard
