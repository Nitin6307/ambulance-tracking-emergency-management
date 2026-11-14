
import { useEffect, useState } from 'react'
import { MapPin, RefreshCw, Ambulance } from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'
import AmbulanceMap from '../../AmbulanceMap'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'

function LiveTracking() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchRequests() {
    setLoading(true)
    setError('')

    try {
      const response = await emergencyApi.getMyRequests()
      setRequests(response.data)
    } catch (err) {
      console.error('Unable to load tracking data:', err)
      setError('Unable to load your emergency requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const activeRequests = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  )

  const trackableRequest = activeRequests
    .filter(request => request.ambulanceId != null)
    .sort((a, b) => Number(b.id) - Number(a.id))[0]

  if (loading) {
    return <Loader message="Loading tracking information..." />
  }

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Live Ambulance Tracking
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check the status of your active emergency requests.
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
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Empty State */}
      {activeRequests.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Ambulance
            size={40}
            className="mx-auto mb-3 text-slate-400 dark:text-slate-500"
          />

          <h3 className="font-semibold text-slate-900 dark:text-white">
            No Active Emergency
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You don't have any active ambulance requests to track.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Active Requests */}
          {activeRequests.map(request => (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Emergency Request #{request.id}
                </h3>

                <StatusBadge status={request.status} />
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Emergency
                  </p>
                  <p className="mt-1 text-slate-800 dark:text-slate-200">
                    {request.emergencyDescription || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Assigned Ambulance
                  </p>
                  <p className="mt-1 text-slate-800 dark:text-slate-200">
                    {request.ambulanceId
                      ? `AMB ID: ${request.ambulanceId}`
                      : 'Waiting for assignment'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Pickup Location
                  </p>
                  <p className="mt-1 text-slate-800 dark:text-slate-200">
                    {request.pickupLatitude}, {request.pickupLongitude}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Ambulance Map */}
          {trackableRequest && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-700">
                <MapPin size={19} className="text-blue-600 dark:text-blue-400" />

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Ambulance Live Location
                </h3>
              </div>

              <div className="h-[450px] bg-slate-100 p-2 dark:bg-slate-800">
                <AmbulanceMap
                  ambulanceId={trackableRequest.ambulanceId}
                />
              </div>
            </section>
          )}

          {!trackableRequest && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Your ambulance has not been assigned yet. Please wait while
              the emergency team assigns an available ambulance.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LiveTracking
