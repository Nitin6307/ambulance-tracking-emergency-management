
import { useEffect, useState } from 'react'

import emergencyApi from '../../api/emergencyApi'
import EmergencyRequestsTable from '../../components/emergency/EmergencyRequestsTable'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/dashboard/StatCard'

import {
  ClipboardList,
  Clock,
  Ambulance,
  CheckCircle,
} from 'lucide-react'

function EmergencyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningRequestId, setAssigningRequestId] = useState(null)
  const [error, setError] = useState('')

  async function fetchRequests() {
    try {
      const response = await emergencyApi.getAll()
      setRequests(response.data)
    } catch (err) {
      setError('Unable to load emergency requests.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleAssignment(requestId, type) {
    setAssigningRequestId(requestId)
    setError('')

    try {
      if (type === 'ambulance') {
        await emergencyApi.assignNearestAmbulance(requestId)
      } else {
        await emergencyApi.assignDriver(requestId)
      }

      await fetchRequests()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Assignment failed. Please try again.'
      )
    } finally {
      setAssigningRequestId(null)
    }
  }

  const pending = requests.filter(
    request => request.status === 'PENDING'
  ).length

  const assigned = requests.filter(
    request => request.status === 'AMBULANCE_ASSIGNED'
  ).length

  const completed = requests.filter(
    request => request.status === 'COMPLETED'
  ).length

  if (loading) {
    return <Loader message="Loading emergency requests..." />
  }

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Emergency Requests
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor requests and coordinate ambulance assignments.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={ClipboardList}
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={Clock}
        />

        <StatCard
          title="Ambulance Assigned"
          value={assigned}
          icon={Ambulance}
        />

        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Requests Table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            All Emergency Requests
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review emergency requests and manage assignments.
          </p>
        </div>

        <div className="p-4">
          <EmergencyRequestsTable
            requests={requests}
            assigningRequestId={assigningRequestId}
            onAssignAmbulance={id => handleAssignment(id, 'ambulance')}
            onAssignDriver={id => handleAssignment(id, 'driver')}
          />
        </div>

      </section>
    </div>
  )
}

export default EmergencyRequests
