
import AmbulanceMap from '../../AmbulanceMap'

function LiveTracking() {
  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Live Ambulance Tracking
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor ambulance location updates in real time.
        </p>
      </div>

      {/* Map Container */}
      <div className="h-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <AmbulanceMap />
      </div>

    </div>
  )
}

export default LiveTracking
