
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Ambulance, Loader2 } from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'

function RequestAmbulance() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    pickupLatitude: '',
    pickupLongitude: '',
    emergencyDescription: '',
    contactNumber: '',
  })

  const [loadingLocation, setLoadingLocation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoadingLocation(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      position => {
        setFormData(prev => ({
          ...prev,
          pickupLatitude: position.coords.latitude.toString(),
          pickupLongitude: position.coords.longitude.toString(),
        }))

        setLoadingLocation(false)
      },
      () => {
        setError('Unable to access your location. Please enter coordinates manually.')
        setLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const latitude = Number(formData.pickupLatitude)
    const longitude = Number(formData.pickupLongitude)

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError('Please enter valid latitude and longitude.')
      return
    }

    setSubmitting(true)

    try {
      await emergencyApi.create({
        pickupLatitude: latitude,
        pickupLongitude: longitude,
        emergencyDescription: formData.emergencyDescription,
        contactNumber: formData.contactNumber,
      })

      alert('Your ambulance request has been submitted successfully!')

      navigate('/patient/my-requests')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to submit your request. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Request an Ambulance</h2>
        <p className="mt-2 text-slate-400">
          Provide your emergency details and pickup location.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-700 bg-slate-900 p-6"
      >
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <MapPin size={19} className="text-blue-400" />
            Pickup Location
          </h3>

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            className="mb-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingLocation ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <MapPin size={17} />
            )}

            {loadingLocation
              ? 'Getting Location...'
              : 'Use My Current Location'}
          </button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Latitude
              </label>

              <input
                type="number"
                name="pickupLatitude"
                step="any"
                min="-90"
                max="90"
                value={formData.pickupLatitude}
                onChange={handleChange}
                placeholder="e.g. 26.8467"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Longitude
              </label>

              <input
                type="number"
                name="pickupLongitude"
                step="any"
                min="-180"
                max="180"
                value={formData.pickupLongitude}
                onChange={handleChange}
                placeholder="e.g. 80.9462"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            You can enter coordinates manually if GPS access is unavailable.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Emergency Description
          </label>

          <textarea
            name="emergencyDescription"
            value={formData.emergencyDescription}
            onChange={handleChange}
            placeholder="Describe your emergency..."
            rows={4}
            required
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Contact Number
          </label>

          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || loadingLocation}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Ambulance size={19} />

          {submitting ? 'Submitting Request...' : 'Submit Emergency Request'}
        </button>
      </form>
    </div>
  )
}

export default RequestAmbulance
