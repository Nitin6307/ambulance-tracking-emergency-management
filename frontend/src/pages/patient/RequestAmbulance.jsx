
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

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40'

  const labelClass =
    'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'

  return (
    <div className="mx-auto max-w-3xl text-slate-800 dark:text-slate-100">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Request an Ambulance
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Provide your emergency details and pickup location.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >

        {/* Pickup Location */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <MapPin size={19} className="text-blue-600 dark:text-blue-400" />
            Pickup Location
          </h3>

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
            className="mb-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
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
              <label className={labelClass}>Latitude</label>

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
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Longitude</label>

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
                className={inputClass}
              />
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            You can enter coordinates manually if GPS access is unavailable.
          </p>
        </div>

        {/* Emergency Description */}
        <div>
          <label className={labelClass}>
            Emergency Description
          </label>

          <textarea
            name="emergencyDescription"
            value={formData.emergencyDescription}
            onChange={handleChange}
            placeholder="Describe your emergency..."
            rows={4}
            required
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className={labelClass}>
            Contact Number
          </label>

          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            required
            className={inputClass}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || loadingLocation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Ambulance size={19} />
          {submitting ? 'Submitting Request...' : 'Submit Emergency Request'}
        </button>

      </form>
    </div>
  )
}

export default RequestAmbulance
