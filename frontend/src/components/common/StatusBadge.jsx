
function StatusBadge({ status }) {
  const statusStyles = {
    AVAILABLE:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',

    ASSIGNED:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',

    ON_THE_WAY:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',

    AT_PATIENT_LOCATION:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',

    TRANSPORTING_PATIENT:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',

    OUT_OF_SERVICE:
      'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',

    COMPLETED:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',

    CANCELLED:
      'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',

    PENDING:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  }

  const style =
    statusStyles[status] ||
    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {status?.replaceAll('_', ' ') || 'UNKNOWN'}
    </span>
  )
}

export default StatusBadge
