
import { useEffect, useState } from 'react'
import {
  Ambulance,
  CheckCircle,
  AlertTriangle,
  Activity,
} from 'lucide-react'

import ambulanceApi from '../../api/ambulanceApi'
import emergencyApi from '../../api/emergencyApi'
import Loader from '../../components/common/Loader'

function AdminDashboard() {
  const [ambulances, setAmbulances] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [ambulanceResponse, emergencyResponse] = await Promise.all([
          ambulanceApi.getAll(),
          emergencyApi.getAll(),
        ])

        setAmbulances(ambulanceResponse.data)
        setEmergencies(emergencyResponse.data)
      } catch (error) {
        console.error('Dashboard data loading failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <Loader />

  const available = ambulances.filter(
    ambulance => ambulance.status === 'AVAILABLE'
  ).length

  const assigned = ambulances.filter(
    ambulance => ambulance.status === 'ASSIGNED'
  ).length

  const activeEmergencies = emergencies.filter(
    emergency => !['COMPLETED', 'CANCELLED'].includes(emergency.status)
  ).length

  const stats = [
    {
      title: 'Total Ambulances',
      value: ambulances.length,
      icon: Ambulance,
      color: 'blue',
      description: 'Registered vehicles',
    },
    {
      title: 'Available Ambulances',
      value: available,
      icon: CheckCircle,
      color: 'green',
      description: 'Ready for emergencies',
    },
    {
      title: 'Assigned Ambulances',
      value: assigned,
      icon: Activity,
      color: 'purple',
      description: 'Currently assigned',
    },
    {
      title: 'Active Emergencies',
      value: activeEmergencies,
      icon: AlertTriangle,
      color: 'red',
      description: 'Ongoing emergency requests',
    },
  ]

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
  }

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          ADMIN OVERVIEW
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard Overview
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Monitor ambulance availability and emergency operations.
        </p>
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

      {/* System Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            System Summary
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current ambulance fleet status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Total Ambulances
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-800 dark:text-blue-300">
              {ambulances.length}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/30">
            <p className="text-sm text-green-700 dark:text-green-400">
              Available
            </p>
            <p className="mt-2 text-2xl font-bold text-green-800 dark:text-green-300">
              {available}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-400">
              Active Emergencies
            </p>
            <p className="mt-2 text-2xl font-bold text-red-800 dark:text-red-300">
              {activeEmergencies}
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default AdminDashboard
