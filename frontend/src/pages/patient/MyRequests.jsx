
import { useEffect, useState } from 'react'
import { RefreshCw, ClipboardList, XCircle } from 'lucide-react'
import emergencyApi from '../../api/emergencyApi'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'

function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  async function fetchRequests() {
    setLoading(true)
    setError('')

    try {
      const response = await emergencyApi.getMyRequests()
      setRequests(response.data)
    } catch (err) {
      console.error('Unable to load requests:', err)
      setError(
        err.response?.data?.message || 'Unable to load your requests.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelRequest(requestId) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel request #${requestId}?`
    )

    if (!confirmed) return

    try {
      setCancellingId(requestId)
      setError('')

      await emergencyApi.cancelRequest(requestId)

      await fetchRequests()
    } catch (err) {
      console.error('Unable to cancel request:', err)

      setError(
        err.response?.data?.message ||
        'Unable to cancel this request.'
      )
    } finally {
      setCancellingId(null)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (loading) {
    return <Loader message="Loading your requests..." />
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">My Emergency Requests</h2>
          <p className="mt-1 text-slate-400">
            View the status and details of your ambulance requests.
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

      {requests.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
          <ClipboardList
            size={40}
            className="mx-auto mb-3 text-slate-500"
          />
          <h3 className="font-semibold">No Requests Found</h3>
          <p className="mt-2 text-sm text-slate-400">
            You have not submitted any ambulance requests yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Emergency</th>
                <th className="p-4">Pickup Location</th>
                <th className="p-4">Ambulance</th>
                <th className="p-4">Status</th>
                <th className="p-4">Requested At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(request => (
                <tr
                  key={request.id}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="p-4 font-semibold">
                    #{request.id}
                  </td>

                  <td className="max-w-[220px] p-4">
                    {request.emergencyDescription || 'N/A'}
                  </td>

                  <td className="p-4">
                    {request.pickupLatitude != null &&
                    request.pickupLongitude != null
                      ? `${request.pickupLatitude}, ${request.pickupLongitude}`
                      : 'Unavailable'}
                  </td>

                  <td className="p-4">
                    {request.ambulanceId
                      ? `AMB ID: ${request.ambulanceId}`
                      : 'Not assigned'}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="whitespace-nowrap p-4">
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>

                  <td className="p-4">
                    {request.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        disabled={cancellingId === request.id}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        {cancellingId === request.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    {request.status === 'CANCELLED' && (
                      <span className="text-slate-500">Cancelled</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyRequests
