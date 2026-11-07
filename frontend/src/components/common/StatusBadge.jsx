function StatusBadge({ status }) {
  const statusStyles = {
    AVAILABLE: 'bg-emerald-900/50 text-emerald-300',
    ASSIGNED: 'bg-blue-900/50 text-blue-300',
    ON_THE_WAY: 'bg-yellow-900/50 text-yellow-300',
    AT_PATIENT_LOCATION: 'bg-purple-900/50 text-purple-300',
    TRANSPORTING_PATIENT: 'bg-orange-900/50 text-orange-300',
    OUT_OF_SERVICE: 'bg-red-900/50 text-red-300',
    COMPLETED: 'bg-emerald-900/50 text-emerald-300',
    CANCELLED: 'bg-red-900/50 text-red-300',
    PENDING: 'bg-yellow-900/50 text-yellow-300',
  }

  const style = statusStyles[status] || 'bg-slate-700 text-slate-300'

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {status?.replaceAll('_', ' ') || 'UNKNOWN'}
    </span>
  )
}

export default StatusBadge