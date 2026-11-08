
import StatusBadge from '../common/StatusBadge'
import Button from '../common/Button'

function EmergencyRequestsTable({
  requests = [],
  onAssignAmbulance,
  onAssignDriver,
  assigningRequestId,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] text-left text-sm">
        <thead className="border-b border-slate-700 text-slate-400">
          <tr>
            <th className="p-4">Request ID</th>
            <th className="p-4">Patient ID</th>
            <th className="p-4">Emergency</th>
            <th className="p-4">Contact</th>
            <th className="p-4">Pickup Location</th>
            <th className="p-4">Ambulance</th>
            <th className="p-4">Status</th>
            <th className="p-4">Created At</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(request => (
            <tr
              key={request.id}
              className="border-b border-slate-800 hover:bg-slate-800/60"
            >
              <td className="p-4 font-semibold">#{request.id}</td>

              <td className="p-4">
                {request.patientId ?? 'N/A'}
              </td>

              <td className="max-w-[200px] p-4">
                {request.emergencyDescription || 'N/A'}
              </td>

              <td className="p-4">
                {request.contactNumber || 'N/A'}
              </td>

              <td className="p-4">
                {request.pickupLatitude != null &&
                request.pickupLongitude != null
                  ? `${request.pickupLatitude}, ${request.pickupLongitude}`
                  : 'Unavailable'}
              </td>

              <td className="p-4">
                {request.ambulanceId
                  ? `AMB ID: ${request.ambulanceId}`
                  : 'Not assigned'}
              </td>

              <td className="p-4">
                <StatusBadge status={request.status} />
              </td>

              <td className="whitespace-nowrap p-4">
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleString()
                  : 'N/A'}
              </td>

              <td className="p-4">
                {request.status === 'PENDING' && (
                  <Button
                    onClick={() => onAssignAmbulance(request.id)}
                    disabled={assigningRequestId === request.id}
                  >
                    {assigningRequestId === request.id
                      ? 'Assigning...'
                      : 'Assign Ambulance'}
                  </Button>
                )}

                {request.status === 'AMBULANCE_ASSIGNED' && (
                  <Button
                    onClick={() => onAssignDriver(request.id)}
                    disabled={assigningRequestId === request.id}
                  >
                    {assigningRequestId === request.id
                      ? 'Assigning...'
                      : 'Assign Driver'}
                  </Button>
                )}

                {!['PENDING', 'AMBULANCE_ASSIGNED'].includes(
                  request.status
                ) && (
                  <span className="text-slate-500">
                    No action
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {requests.length === 0 && (
        <p className="p-6 text-center text-slate-400">
          No emergency requests found.
        </p>
      )}
    </div>
  )
}

export default EmergencyRequestsTable
