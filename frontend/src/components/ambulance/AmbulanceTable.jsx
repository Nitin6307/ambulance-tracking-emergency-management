
import StatusBadge from '../common/StatusBadge'

function AmbulanceTable({ ambulances = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">

        <thead className="border-b border-slate-700 text-slate-400">
          <tr>
            <th className="p-4">Ambulance</th>
            <th className="p-4">Vehicle Number</th>
            <th className="p-4">Driver</th>
            <th className="p-4">Status</th>
            <th className="p-4">Location</th>
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
