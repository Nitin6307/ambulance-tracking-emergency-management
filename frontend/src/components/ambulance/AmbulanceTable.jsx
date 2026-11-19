import StatusBadge from '../common/StatusBadge'
import Button from '../common/Button'
import { Trash2 } from 'lucide-react'

function AmbulanceTable({
  ambulances = [],
  onAssignDriver,
  onDeleteAmbulance,
  deletingAmbulanceId,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-slate-700 text-slate-400">
          <tr>
            <th className="p-4">Ambulance</th>
            <th className="p-4">Vehicle Number</th>
            <th className="p-4">Driver</th>
            <th className="p-4">Status</th>
            <th className="p-4">Location</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {ambulances.map(item => (
            <tr
              key={item.id}
              className="border-b border-slate-800 hover:bg-slate-800/60"
            >
              <td className="p-4 font-semibold">
                {item.ambulanceNumber}
              </td>

              <td className="p-4">
                {item.vehicleNumber}
              </td>

              <td className="p-4">
                {item.driverName || 'Not assigned'}
              </td>

              <td className="p-4">
                <StatusBadge status={item.status} />
              </td>

              <td className="p-4">
                {item.latitude != null && item.longitude != null
                  ? `${item.latitude}, ${item.longitude}`
                  : 'Location unavailable'}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-2">
                  {item.status === 'AVAILABLE' && (
                    <Button
                      onClick={() => onAssignDriver?.(item)}
                    >
                      Assign Driver
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteAmbulance?.(item)}
                    disabled={deletingAmbulanceId === item.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={15} />
                    {deletingAmbulanceId === item.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ambulances.length === 0 && (
        <p className="p-4 text-slate-400">
          No ambulances found.
        </p>
      )}
    </div>
  )
}

export default AmbulanceTable