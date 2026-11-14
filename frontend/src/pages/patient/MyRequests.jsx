
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
        err.response?.data?.message || 'Unable to cancel this request.'
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
    <div className="space-y-6 text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Emergency Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View the status and details of your ambulance requests.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <ClipboardList
            size={40}
            className="mx-auto mb-3 text-slate-400 dark:text-slate-500"
          />

          <h3 className="font-semibold text-slate-900 dark:text-white">
            No Requests Found
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You have not submitted any ambulance requests yet.
          </p>
        </div>
      ) : (
        /* Requests Table */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="p-4 font-semibold">Request ID</th>
                <th className="p-4 font-semibold">Emergency</th>
                <th className="p-4 font-semibold">Pickup Location</th>
                <th className="p-4 font-semibold">Ambulance</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Requested At</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map(request => (
                <tr
                  key={request.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    #{request.id}
                  </td>

                  <td className="max-w-[220px] p-4 text-slate-700 dark:text-slate-300">
                    {request.emergencyDescription || 'N/A'}
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {request.pickupLatitude != null &&
                    request.pickupLongitude != null
                      ? `${request.pickupLatitude}, ${request.pickupLongitude}`
                      : 'Unavailable'}
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {request.ambulanceId
                      ? `AMB ID: ${request.ambulanceId}`
                      : 'Not assigned'}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="whitespace-nowrap p-4 text-slate-600 dark:text-slate-300">
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>

                  <td className="p-4">
                    {request.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        disabled={cancellingId === request.id}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        {cancellingId === request.id
                          ? 'Cancelling...'
                          : 'Cancel'}
                      </button>
                    )}

                    {request.status === 'CANCELLED' && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Cancelled
                      </span>
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
