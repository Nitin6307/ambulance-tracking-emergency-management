
import { useEffect, useState } from 'react'
import {
  Ambulance,
  CheckCircle,
  AlertTriangle,
  Activity,
} from 'lucide-react'

import StatCard from '../../components/dashboard/StatCard'
import ambulanceApi from '../../api/ambulanceApi'
import emergencyApi from '../../api/emergencyApi'
import Loader from '../../components/common/Loader'

function AdminDashboard() {
  const [ambulances, setAmbulances] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [ambulanceResponse, emergencyResponse] = await Promise.all([
          ambulanceApi.getAll(),
          emergencyApi.getAll(),
        ])

        setAmbulances(ambulanceResponse.data)
        setEmergencies(emergencyResponse.data)
      } catch (error) {
        console.error('Dashboard data loading failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <Loader />

  const available = ambulances.filter(
    ambulance => ambulance.status === 'AVAILABLE'
  ).length

  const assigned = ambulances.filter(
    ambulance => ambulance.status === 'ASSIGNED'
  ).length

  const activeEmergencies = emergencies.filter(
    emergency => !['COMPLETED', 'CANCELLED'].includes(emergency.status)
  ).length

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Overview</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Ambulances"
          value={ambulances.length}
          icon={Ambulance}
        />

        <StatCard
          title="Available Ambulances"
          value={available}
          icon={CheckCircle}
        />

        <StatCard
          title="Assigned Ambulances"
          value={assigned}
          icon={Activity}
        />

        <StatCard
          title="Active Emergencies"
          value={activeEmergencies}
          icon={AlertTriangle}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
