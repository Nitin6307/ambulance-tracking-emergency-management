
import AmbulanceMap from '../../AmbulanceMap'

function LiveTracking() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Live Ambulance Tracking</h2>
        <p className="mt-1 text-slate-400">
          Monitor ambulance location updates in real time.
        </p>
      </div>

      <div className="h-[550px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-2">
        <AmbulanceMap />
      </div>
    </div>
  )
}

export default LiveTracking
