import StatusBadge from '../common/StatusBadge'

function AmbulanceDetails({ ambulance }) {
  if (!ambulance) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <p className="text-slate-400">
          Select an ambulance to view details.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="mb-4 text-xl font-semibold">
        Ambulance Details
      </h2>

      <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
        <h3 className="mb-3 font-bold">
          🚑 {ambulance.ambulanceNumber}
        </h3>

        <p className="mb-2 text-sm text-slate-300">
          Vehicle: {ambulance.vehicleNumber}
        </p>

        <p className="mb-2 text-sm text-slate-300">
          Driver: {ambulance.driverName || 'Not assigned'}
        </p>

        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          Status:
          <StatusBadge status={ambulance.status} />
        </div>

        <p className="mb-2 text-sm text-slate-300">
          Latitude: {ambulance.latitude ?? 'Unavailable'}
        </p>

        <p className="text-sm text-slate-300">
          Longitude: {ambulance.longitude ?? 'Unavailable'}
        </p>
      </div>
    </div>
  )
}

export default AmbulanceDetails
