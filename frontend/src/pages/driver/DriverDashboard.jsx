
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ambulance,
  ClipboardList,
  Clock,
  CheckCircle,
} from 'lucide-react'

import emergencyApi from '../../api/emergencyApi'
import StatCard from '../../components/dashboard/StatCard'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'

function DriverDashboard() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await emergencyApi.getDriverRequests()
        setRequests(response.data)
      } catch (error) {
        console.error('Unable to load driver requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  if (loading) return <Loader message="Loading driver dashboard..." />

  const active = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  ).length

  const completed = requests.filter(
    request => request.status === 'COMPLETED'
  ).length

  const pending = requests.filter(
    request => request.status === 'DRIVER_ASSIGNED'
  ).length

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome, Driver!</h2>
        <p className="mt-1 text-slate-400">
          Manage your assigned emergency services and ambulance location.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Assignments" value={requests.length} icon={ClipboardList} />
        <StatCard title="Active Emergencies" value={active} icon={Ambulance} />
        <StatCard title="New Assignments" value={pending} icon={Clock} />
        <StatCard title="Completed" value={completed} icon={CheckCircle} />
      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h3 className="mb-2 text-lg font-semibold">
          Your Emergency Assignments
        </h3>

        <p className="mb-5 text-sm text-slate-400">
          View assigned emergencies and update their progress.
        </p>

        <Button onClick={() => navigate('/driver/assigned-emergencies')}>
          View Assigned Emergencies
        </Button>
      </div>
    </div>
  )
}

export default DriverDashboard
