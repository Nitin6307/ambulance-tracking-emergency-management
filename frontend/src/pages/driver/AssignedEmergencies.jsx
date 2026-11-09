
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

  if (loading) return <Loader message="Loading assigned emergencies..." />

  const activeRequests = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  )

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Assigned Emergencies</h2>
          <p className="mt-1 text-slate-400">
            Manage your assigned emergency requests.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-lg bg-emerald-900/30 p-3 text-sm text-emerald-400">
          {success}
        </p>
      )}

      {activeRequests.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
          <Ambulance size={40} className="mx-auto mb-3 text-slate-500" />
          <h3 className="font-semibold">No Active Assignments</h3>
          <p className="mt-2 text-sm text-slate-400">
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
                className="rounded-xl border border-slate-700 bg-slate-900 p-5"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">
                    Emergency Request #{request.id}
                  </h3>

                  <StatusBadge status={request.status} />
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-slate-400">Emergency Description</p>
                    <p className="mt-1">
                      {request.emergencyDescription || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Patient Contact</p>
                    <p className="mt-1">
                      {request.contactNumber || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Ambulance</p>
                    <p className="mt-1">
                      {request.ambulanceId
                        ? `AMB ID: ${request.ambulanceId}`
                        : 'Not assigned'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Pickup Coordinates</p>
                    <p className="mt-1 flex items-center gap-2">
                      <MapPin size={15} />
                      {request.pickupLatitude}, {request.pickupLongitude}
                    </p>
                  </div>
                </div>

                {nextStatus && (
                  <button
                    onClick={() => handleStatusUpdate(request)}
                    disabled={updatingId === request.id}
                    className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
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

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Completed History</h3>

        {requests.filter(request => request.status === 'COMPLETED').length === 0 ? (
          <p className="text-sm text-slate-400">No completed emergencies yet.</p>
        ) : (
          requests
            .filter(request => request.status === 'COMPLETED')
            .map(request => (
              <div
                key={request.id}
                className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900 p-4"
              >
                <span>Request #{request.id}</span>
                <StatusBadge status={request.status} />
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default AssignedEmergencies
