import api from './axios'

const emergencyApi = {
  // Create emergency request
  create: (requestData) =>
    api.post('/emergency-requests', requestData),

  // Get all emergency requests (Admin)
  getAll: () =>
    api.get('/emergency-requests/all'),

  // Get patient's own requests
  getMyRequests: () =>
    api.get('/emergency-requests/my-requests'),

  // Get driver's assigned requests
  getDriverRequests: () =>
    api.get('/emergency-requests/driver/my-requests'),

  // Update emergency status
  updateStatus: (requestId, statusData) =>
    api.put(`/emergency-requests/${requestId}/status`, statusData),
}

export default emergencyApi