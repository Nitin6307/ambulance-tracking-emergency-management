
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
    request =>
      !['COMPLETED', 'CANCELLED'].includes(request.status)
  )

  const trackableRequest = activeRequests.find(
    request => request.ambulanceId != null
  )

  if (loading) {
    return <Loader message="Loading tracking information..." />
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Live Ambulance Tracking</h2>
          <p className="mt-1 text-slate-400">
            Check the status of your active emergency requests.
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

      {activeRequests.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
          <Ambulance
            size={40}
            className="mx-auto mb-3 text-slate-500"
          />
          <h3 className="font-semibold">No Active Emergency</h3>
          <p className="mt-2 text-sm text-slate-400">
            You don't have any active ambulance requests to track.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {activeRequests.map(request => (
            <div
              key={request.id}
              className="rounded-xl border border-slate-700 bg-slate-900 p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">
                  Emergency Request #{request.id}
                </h3>

                <StatusBadge status={request.status} />
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-400">Emergency</p>
                  <p className="mt-1">
                    {request.emergencyDescription || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Assigned Ambulance</p>
                  <p className="mt-1">
                    {request.ambulanceId
                      ? `AMB ID: ${request.ambulanceId}`
                      : 'Waiting for assignment'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Pickup Location</p>
                  <p className="mt-1">
                    {request.pickupLatitude}, {request.pickupLongitude}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {trackableRequest && (
            <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-700 p-4">
                <MapPin size={19} className="text-blue-400" />
                <h3 className="font-semibold">
                  Ambulance Live Location
                </h3>
              </div>

              <div className="h-[450px] p-2">
                <AmbulanceMap
                  ambulanceId={trackableRequest.ambulanceId}
                />
              </div>
            </section>
          )}

          {!trackableRequest && (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-400">
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
