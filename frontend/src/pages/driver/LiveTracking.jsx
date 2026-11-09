
import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, RefreshCw } from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'
import ambulanceApi from '../../api/ambulanceApi'
import Loader from '../../components/common/Loader'

function LiveTracking() {
  const [requests, setRequests] = useState([])
  const [selectedRequestId, setSelectedRequestId] = useState('')
  const [sharing, setSharing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [coordinates, setCoordinates] = useState(null)

  const watchIdRef = useRef(null)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await emergencyApi.getDriverRequests()

        const active = response.data.filter(
          request =>
            request.ambulanceId &&
            !['COMPLETED', 'CANCELLED'].includes(request.status)
        )

        setRequests(active)

        if (active.length > 0) {
          setSelectedRequestId(String(active[0].id))
        }
      } catch (err) {
        console.error(err)
        setError('Unable to load your assigned ambulances.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation?.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  function stopSharing() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setSharing(false)
    setMessage('Location sharing stopped.')
  }

  function startSharing() {
    const selectedRequest = requests.find(
      request => String(request.id) === selectedRequestId
    )

    if (!selectedRequest?.ambulanceId) {
      setError('No assigned ambulance found for this request.')
      return
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setError('')
    setMessage('Waiting for GPS location...')

    const watchId = navigator.geolocation.watchPosition(
      async position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        setCoordinates({ latitude, longitude })

        try {
          await ambulanceApi.updateLocation(
            selectedRequest.ambulanceId,
            { latitude, longitude }
          )

          setMessage('Your live location is being shared successfully.')
        } catch (err) {
          console.error('Location update failed:', err)
          setError(
            err.response?.data?.message ||
            'Unable to send location to the server.'
          )
        }
      },
      () => {
        setError('Unable to access GPS. Please allow location permission.')
        stopSharing()
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    )

    watchIdRef.current = watchId
    setSharing(true)
  }

  if (loading) return <Loader message="Loading tracking information..." />

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Driver Live Tracking</h2>
        <p className="mt-1 text-slate-400">
          Share your current ambulance location with the emergency system.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6">
        {requests.length === 0 ? (
          <p className="text-slate-400">
            You don't have an active ambulance assignment. Location sharing
            will become available after an ambulance is assigned.
          </p>
        ) : (
          <>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Select Emergency Assignment
            </label>

            <select
              value={selectedRequestId}
              onChange={e => {
                if (sharing) stopSharing()
                setSelectedRequestId(e.target.value)
                setCoordinates(null)
                setError('')
                setMessage('')
              }}
              disabled={sharing}
              className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            >
              {requests.map(request => (
                <option key={request.id} value={request.id}>
                  Request #{request.id} — Ambulance #{request.ambulanceId}
                </option>
              ))}
            </select>

            <div className="mb-5 rounded-lg bg-slate-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-blue-400" />
                <span className="font-medium">Current GPS Coordinates</span>
              </div>

              {coordinates ? (
                <p className="text-sm text-slate-300">
                  Latitude: {coordinates.latitude.toFixed(6)}
                  <br />
                  Longitude: {coordinates.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Waiting for location...
                </p>
              )}
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p className="mb-4 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {!sharing ? (
                <button
                  onClick={startSharing}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  <Navigation size={17} />
                  Start Location Sharing
                </button>
              ) : (
                <button
                  onClick={stopSharing}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
                >
                  Stop Location Sharing
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LiveTracking
