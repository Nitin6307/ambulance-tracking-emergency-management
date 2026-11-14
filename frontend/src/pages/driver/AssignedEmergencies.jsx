
import { useEffect, useState } from 'react'
import { RefreshCw, Ambulance, MapPin } from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'

const nextStatuses = {
  DRIVER_ASSIGNED: 'ON_THE_WAY',
  ON_THE_WAY: 'AT_PATIENT_LOCATION',
  AT_PATIENT_LOCATION: 'PATIENT_PICKED_UP',
  PATIENT_PICKED_UP: 'AT_HOSPITAL',
  AT_HOSPITAL: 'COMPLETED',
}

const statusLabels = {
  ON_THE_WAY: 'Start Journey',
  AT_PATIENT_LOCATION: 'Reached Patient',
  PATIENT_PICKED_UP: 'Patient Picked Up',
  AT_HOSPITAL: 'Reached Hospital',
  COMPLETED: 'Complete Emergency',
}

function AssignedEmergencies() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function fetchRequests() {
    try {
      const response = await emergencyApi.getDriverRequests()
      setRequests(response.data)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to load assigned emergencies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleStatusUpdate(request) {
    const nextStatus = nextStatuses[request.status]

    if (!nextStatus) return

    setUpdatingId(request.id)
    setError('')
    setSuccess('')

    try {
      await emergencyApi.updateStatus(request.id, {
        status: nextStatus,
      })

      setSuccess(`Request #${request.id} updated to ${nextStatus}.`)
      await fetchRequests()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update emergency status.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return <Loader message="Loading assigned emergencies..." />
  }

  const activeRequests = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  )

  const completedRequests = requests.filter(
    request => request.status === 'COMPLETED'
  )

  return (
    <div className="text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Assigned Emergencies
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your assigned emergency requests.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Success Message */}
      {success && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
          {success}
        </p>
      )}

      {/* Active Emergencies */}
      {activeRequests.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Ambulance
            size={40}
            className="mx-auto mb-3 text-slate-400 dark:text-slate-500"
          />

          <h3 className="font-semibold text-slate-800 dark:text-white">
            No Active Assignments
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You currently have no active emergency assignments.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {activeRequests.map(request => {
            const nextStatus = nextStatuses[request.status]

            return (
              <div
                key={request.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Emergency Request #{request.id}
                  </h3>

                  <StatusBadge status={request.status} />
                </div>

                <div className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-2">

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Emergency Description
                    </p>
                    <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                      {request.emergencyDescription || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Patient Contact
                    </p>
                    <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                      {request.contactNumber || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Ambulance
                    </p>
                    <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                      {request.ambulanceId
                        ? `AMB ID: ${request.ambulanceId}`
                        : 'Not assigned'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Pickup Coordinates
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                      <MapPin size={15} className="text-blue-500" />
                      {request.pickupLatitude}, {request.pickupLongitude}
                    </p>
                  </div>

                </div>

                {nextStatus && (
                  <button
                    onClick={() => handleStatusUpdate(request)}
                    disabled={updatingId === request.id}
                    className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {updatingId === request.id
                      ? 'Updating...'
                      : statusLabels[nextStatus]}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Completed History */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Completed History
        </h3>

        {completedRequests.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No completed emergencies yet.
          </p>
        ) : (
          completedRequests.map(request => (
            <div
              key={request.id}
              className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Request #{request.id}
              </span>

              <StatusBadge status={request.status} />
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default AssignedEmergencies
