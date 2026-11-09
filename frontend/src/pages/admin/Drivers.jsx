
import { useEffect, useState } from 'react'
import {
  Users, Mail, Phone, UserCheck, Clock, UserX
} from 'lucide-react'

import ambulanceApi from '../../api/ambulanceApi'
import Loader from '../../components/common/Loader'

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

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

  const statusStyles = {
    AVAILABLE: 'bg-green-500/20 text-green-400',
    ASSIGNED: 'bg-blue-500/20 text-blue-400',
    ON_DUTY: 'bg-yellow-500/20 text-yellow-400',
    OFF_DUTY: 'bg-red-500/20 text-red-400',
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

  if (loading) return <Loader message="Loading drivers..." />

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Driver Management</h2>
        <p className="mt-1 text-slate-400">
          Manage registered ambulance drivers and their availability.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <div>
              <p className="text-sm text-slate-400">Total Drivers</p>
              <p className="text-2xl font-bold">{drivers.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <UserCheck className="text-green-400" size={24} />
            <div>
              <p className="text-sm text-slate-400">Available</p>
              <p className="text-2xl font-bold">{getCount('AVAILABLE')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-400" size={24} />
            <div>
              <p className="text-sm text-slate-400">On Duty</p>
              <p className="text-2xl font-bold">{getCount('ON_DUTY')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <UserX className="text-red-400" size={24} />
            <div>
              <p className="text-sm text-slate-400">Off Duty</p>
              <p className="text-2xl font-bold">{getCount('OFF_DUTY')}</p>
            </div>
          </div>
        </div>

      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {drivers.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
          No registered drivers found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full min-w-[900px] text-left text-sm">

            <thead className="border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-4">Driver ID</th>
                <th className="p-4">Driver Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
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
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="p-4">#{driver.id}</td>

                    <td className="p-4 font-medium">
                      {driver.name || 'N/A'}
                    </td>

                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        <Mail size={15} className="text-slate-400" />
                        {driver.email || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        <Phone size={15} className="text-slate-400" />
                        {driver.contactNumber || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[driver.driverStatus] ||
                          'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {getStatusLabel(driver.driverStatus)}
                      </span>
                    </td>

                    <td className="p-4">
                      {canChangeStatus ? (
                        <button
                          onClick={() => handleStatusChange(driver)}
                          disabled={updatingId !== null}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
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
                        <span className="text-xs text-slate-500">
                          {driver.driverStatus === 'ON_DUTY'
                            ? 'Emergency in progress'
                            : driver.driverStatus === 'ASSIGNED'
                              ? 'Ambulance assigned'
                              : 'Unavailable'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Drivers
