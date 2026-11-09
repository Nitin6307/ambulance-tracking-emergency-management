
import { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'

function PatientDashboard() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyRequests() {
      try {
        const response = await emergencyApi.getMyRequests()
        setRequests(response.data)
      } catch (error) {
        console.error('Unable to load patient requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyRequests()
  }, [])

  if (loading) {
    return <Loader message="Loading your dashboard..." />
  }

  const activeRequests = requests.filter(
    request => !['COMPLETED', 'CANCELLED'].includes(request.status)
  ).length

  const completedRequests = requests.filter(
    request => request.status === 'COMPLETED'
  ).length

  const pendingRequests = requests.filter(
    request => request.status === 'PENDING'
  ).length

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome!</h2>
          <p className="mt-1 text-slate-400">
            Manage your ambulance requests and track emergency services.
          </p>
        </div>

        <Button onClick={() => navigate('/patient/request-ambulance')}>
          <Ambulance size={17} className="mr-2 inline" />
          Request Ambulance
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={ClipboardList}
        />

        <StatCard
          title="Active Requests"
          value={activeRequests}
          icon={Ambulance}
        />

        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={Clock}
        />

        <StatCard
          title="Completed Requests"
          value={completedRequests}
          icon={CheckCircle}
        />
      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h3 className="mb-2 text-lg font-semibold">
          Need an Ambulance?
        </h3>

        <p className="mb-5 text-sm text-slate-400">
          Submit an emergency request to get ambulance assistance.
        </p>

        <Button onClick={() => navigate('/patient/request-ambulance')}>
          Request Emergency Assistance
        </Button>
      </div>
    </div>
  )
}

export default PatientDashboard
