
import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'

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

  if (loading) {
    return <Loader message="Loading tracking information..." />
  }

  return (
    <div className="text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Driver Live Tracking
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Share your current ambulance location with the emergency system.
        </p>
      </div>

      {/* Tracking Card */}
      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        {requests.length === 0 ? (
          <div className="py-5 text-center">
            <MapPin
              size={40}
              className="mx-auto mb-3 text-slate-400 dark:text-slate-500"
            />

            <h3 className="font-semibold text-slate-800 dark:text-white">
              No Active Assignment
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              You don't have an active ambulance assignment. Location sharing
              will become available after an ambulance is assigned.
            </p>
          </div>
        ) : (
          <>
            {/* Assignment Selection */}
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
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
              className="mb-5 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900"
            >
              {requests.map(request => (
                <option key={request.id} value={request.id}>
                  Request #{request.id} — Ambulance #{request.ambulanceId}
                </option>
              ))}
            </select>

            {/* GPS Coordinates */}
            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400" />

                <span className="font-semibold text-slate-800 dark:text-white">
                  Current GPS Coordinates
                </span>
              </div>

              {coordinates ? (
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p>
                    <span className="text-slate-500 dark:text-slate-400">
                      Latitude:
                    </span>{' '}
                    {coordinates.latitude.toFixed(6)}
                  </p>

                  <p>
                    <span className="text-slate-500 dark:text-slate-400">
                      Longitude:
                    </span>{' '}
                    {coordinates.longitude.toFixed(6)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Waiting for location...
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </p>
            )}

            {/* Sharing Message */}
            {message && (
              <p className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                {message}
              </p>
            )}

            {/* Location Sharing Button */}
            <div className="flex flex-wrap gap-3">
              {!sharing ? (
                <button
                  onClick={startSharing}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  <Navigation size={17} />
                  Start Location Sharing
                </button>
              ) : (
                <button
                  onClick={stopSharing}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
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
