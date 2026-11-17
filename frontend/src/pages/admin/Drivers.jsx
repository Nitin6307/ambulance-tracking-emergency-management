
import { useEffect, useState } from 'react'
import {
  Users, Mail, Phone, UserCheck, Clock, UserX, Plus, UserPlus, Trash2
} from 'lucide-react'

import ambulanceApi from '../../api/ambulanceApi'
import Loader from '../../components/common/Loader'

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
  })

  useEffect(() => {
    fetchDrivers()
  }, [])

  async function fetchDrivers() {
    try {
      const response = await ambulanceApi.getAllDrivers()
      setDrivers(response.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Unable to load drivers.')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleCreateDriver(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    const phonePattern = /^(\+91)?[6-9][0-9]{9}$/

    if (!phonePattern.test(formData.contactNumber.trim())) {
      setError('Enter a valid Indian mobile number.')
      return
    }

    setCreating(true)

    try {
      const response = await ambulanceApi.createDriver({
        ...formData,
        contactNumber: formData.contactNumber.trim(),
      })

      setDrivers(previous => [...previous, response.data])

      setFormData({
        name: '',
        email: '',
        password: '',
        contactNumber: '',
      })

      setShowForm(false)
      setSuccess('Driver account created successfully.')
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        'Unable to create driver account.'
      )
    } finally {
      setCreating(false)
    }
  }

  const statusStyles = {
    AVAILABLE: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    ASSIGNED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    ON_DUTY: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
    OFF_DUTY: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  }

  const getStatusLabel = (status) =>
    status ? status.replaceAll('_', ' ') : 'NOT SET'

  const getCount = (status) =>
    drivers.filter(driver => driver.driverStatus === status).length

  async function handleStatusChange(driver) {
    const newStatus =
      driver.driverStatus === 'AVAILABLE' ? 'OFF_DUTY' : 'AVAILABLE'

    setUpdatingId(driver.id)
    setError('')
    setSuccess('')

    try {
      const response = await ambulanceApi.updateDriverStatus(
        driver.id,
        { driverStatus: newStatus }
      )

      setDrivers(previous =>
        previous.map(item =>
          item.id === driver.id ? response.data : item
        )
      )
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
        'Unable to update driver status.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDeleteDriver(driver) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${driver.name}?\n\nHistorical emergency records will be preserved. This action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(driver.id)
    setError('')
    setSuccess('')

    try {
      await ambulanceApi.deleteDriver(driver.id)

      setDrivers(previous =>
        previous.filter(item => item.id !== driver.id)
      )

      setSuccess(`Driver ${driver.name} deleted successfully.`)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Unable to delete driver. The driver may have an active emergency.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <Loader message="Loading drivers..." />

  const statistics = [
    {
      title: 'Total Drivers',
      value: drivers.length,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      background: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: 'Available',
      value: getCount('AVAILABLE'),
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      background: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      title: 'On Duty',
      value: getCount('ON_DUTY'),
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      background: 'bg-yellow-50 dark:bg-yellow-500/10',
    },
    {
      title: 'Off Duty',
      value: getCount('OFF_DUTY'),
      icon: UserX,
      color: 'text-red-600 dark:text-red-400',
      background: 'bg-red-50 dark:bg-red-500/10',
    },
  ]

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Driver Management
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage registered ambulance drivers and their availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(previous => !previous)
            setError('')
            setSuccess('')
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          {showForm ? <Users size={18} /> : <Plus size={18} />}
          {showForm ? 'View Drivers' : 'Add New Driver'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Add Driver Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/10">
              <UserPlus size={22} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Register New Driver
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Create login credentials for an ambulance driver.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateDriver} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Driver Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Driver Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="driver@example.com"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="9876543210 or +919876543210"
                  pattern="(\+91)?[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number, optionally with +91."
                  maxLength={13}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Enter a 10-digit Indian mobile number. +91 is optional.
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Temporary Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Share the login credentials securely with the driver.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={creating}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? 'Creating Account...' : 'Create Driver Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-xl p-3 ${stat.background}`}>
                  <Icon size={24} className={stat.color} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Drivers Table */}
      {drivers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <Users size={35} className="mx-auto mb-3 opacity-50" />
          No registered drivers found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Registered Drivers
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View driver details and manage availability.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">

              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">Driver ID</th>
                  <th className="p-4 font-semibold">Driver Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map(driver => {
                  const canChangeStatus =
                    driver.driverStatus === 'AVAILABLE' ||
                    driver.driverStatus === 'OFF_DUTY'

                  return (
                    <tr
                      key={driver.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        #{driver.id}
                      </td>

                      <td className="p-4 font-medium text-slate-900 dark:text-white">
                        {driver.name || 'N/A'}
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-2">
                          <Mail size={15} className="text-slate-400" />
                          {driver.email || 'N/A'}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-2">
                          <Phone size={15} className="text-slate-400" />
                          {driver.contactNumber || 'N/A'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">

                          {canChangeStatus ? (
                            <button
                              onClick={() => handleStatusChange(driver)}
                              disabled={updatingId !== null || deletingId !== null}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                driver.driverStatus === 'AVAILABLE'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {updatingId === driver.id
                                ? 'Updating...'
                                : driver.driverStatus === 'AVAILABLE'
                                  ? 'Set Off Duty'
                                  : 'Set Available'}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {driver.driverStatus === 'ON_DUTY'
                                ? 'Emergency in progress'
                                : driver.driverStatus === 'ASSIGNED'
                                  ? 'Ambulance assigned'
                                  : 'Unavailable'}
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteDriver(driver)}
                            disabled={deletingId !== null || updatingId !== null}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {deletingId === driver.id ? 'Deleting...' : 'Delete'}
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Drivers
