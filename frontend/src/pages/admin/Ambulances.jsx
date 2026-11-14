
import { useEffect, useState } from 'react'

import ambulanceApi from '../../api/ambulanceApi'

import StatCard from '../../components/dashboard/StatCard'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'

import AmbulanceForm from '../../components/ambulance/AmbulanceForm'
import AmbulanceTable from '../../components/ambulance/AmbulanceTable'

import {
  Ambulance,
  CheckCircle,
  Activity,
  AlertTriangle,
} from 'lucide-react'

function Ambulances() {
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false)
  const [addingAmbulance, setAddingAmbulance] = useState(false)
  const [ambulanceError, setAmbulanceError] = useState('')

  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [selectedDriverId, setSelectedDriverId] = useState('')
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [assigningDriver, setAssigningDriver] = useState(false)
  const [driverError, setDriverError] = useState('')

  async function fetchAmbulances() {
    try {
      const response = await ambulanceApi.getAll()
      setAmbulances(response.data)
    } catch (error) {
      console.error('Error fetching ambulances:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAmbulances()
  }, [])

  async function handleAddAmbulance(ambulanceData) {
    setAddingAmbulance(true)
    setAmbulanceError('')

    try {
      await ambulanceApi.create(ambulanceData)
      await fetchAmbulances()
      setShowAmbulanceModal(false)
    } catch (error) {
      setAmbulanceError(
        error.response?.data?.message || 'Unable to add ambulance'
      )
    } finally {
      setAddingAmbulance(false)
    }
  }

  async function handleOpenAssignModal(ambulanceItem) {
    setSelectedAmbulance(ambulanceItem)
    setSelectedDriverId('')
    setDriverError('')
    setDrivers([])
    setShowAssignModal(true)
    setLoadingDrivers(true)

    try {
      const response = await ambulanceApi.getAllDrivers()
      setDrivers(response.data)
    } catch (error) {
      setDriverError(
        error.response?.data?.message || 'Unable to load drivers'
      )
    } finally {
      setLoadingDrivers(false)
    }
  }

  async function handleAssignDriver() {
    if (!selectedAmbulance || !selectedDriverId) return

    setAssigningDriver(true)
    setDriverError('')

    try {
      await ambulanceApi.assignDriver(
        selectedAmbulance.id,
        Number(selectedDriverId)
      )

      await fetchAmbulances()

      setShowAssignModal(false)
      setSelectedAmbulance(null)
      setSelectedDriverId('')
    } catch (error) {
      setDriverError(
        error.response?.data?.message || 'Unable to assign driver'
      )
    } finally {
      setAssigningDriver(false)
    }
  }

  const available = ambulances.filter(
    item => item.status === 'AVAILABLE'
  ).length

  const assigned = ambulances.filter(
    item =>
      item.status !== 'AVAILABLE' &&
      item.status !== 'OUT_OF_SERVICE'
  ).length

  const outOfService = ambulances.filter(
    item => item.status === 'OUT_OF_SERVICE'
  ).length

  return (
    <div className="text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ambulance Management
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and monitor all registered ambulances.
          </p>
        </div>

        <Button
          onClick={() => {
            setAmbulanceError('')
            setShowAmbulanceModal(true)
          }}
        >
          + Add Ambulance
        </Button>
      </div>

      {loading ? (
        <Loader message="Loading ambulances..." />
      ) : (
        <>
          {/* Statistics */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Ambulances"
              value={ambulances.length}
              icon={Ambulance}
            />

            <StatCard
              title="Available"
              value={available}
              icon={CheckCircle}
              iconColor="text-emerald-500"
            />

            <StatCard
              title="Assigned / Active"
              value={assigned}
              icon={Activity}
              iconColor="text-orange-500"
            />

            <StatCard
              title="Out of Service"
              value={outOfService}
              icon={AlertTriangle}
              iconColor="text-red-500"
            />
          </div>

          {/* Ambulance Table */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Registered Ambulances
            </h3>

            <AmbulanceTable
              ambulances={ambulances}
              onAssignDriver={handleOpenAssignModal}
            />
          </section>
        </>
      )}

      {/* Add Ambulance Modal */}
      <Modal
        isOpen={showAmbulanceModal}
        onClose={() => setShowAmbulanceModal(false)}
        title="Add New Ambulance"
      >
        {ambulanceError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            {ambulanceError}
          </p>
        )}

        <AmbulanceForm
          onSubmit={handleAddAmbulance}
          onCancel={() => setShowAmbulanceModal(false)}
          loading={addingAmbulance}
        />
      </Modal>

      {/* Assign Driver Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Driver"
      >
        {selectedAmbulance && (
          <div className="space-y-5">

            {/* Selected Ambulance */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Selected Ambulance
              </p>

              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {selectedAmbulance.ambulanceNumber}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {selectedAmbulance.vehicleNumber}
              </p>
            </div>

            {loadingDrivers ? (
              <Loader message="Loading drivers..." />
            ) : driverError ? (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {driverError}
              </p>
            ) : drivers.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No registered drivers found.
              </p>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Select Driver
                </label>

                <select
                  value={selectedDriverId}
                  onChange={e => setSelectedDriverId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Choose a driver</option>

                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {driverError && !loadingDrivers && drivers.length > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {driverError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleAssignDriver}
                disabled={
                  !selectedDriverId ||
                  loadingDrivers ||
                  assigningDriver
                }
              >
                {assigningDriver ? 'Assigning...' : 'Assign Driver'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}

export default Ambulances
