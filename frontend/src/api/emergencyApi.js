
import api from './axios'

const emergencyApi = {
  create: (requestData) => api.post('/emergency-requests', requestData),

  getAll: () => api.get('/emergency-requests/all'),

  getMyRequests: () => api.get('/emergency-requests/my-requests'),

  getDriverRequests: () => api.get('/emergency-requests/driver/my-requests'),

  assignNearestAmbulance: (requestId) =>
    api.put(`/emergency-requests/${requestId}/assign-nearest-ambulance`),

  assignDriver: (requestId) =>
    api.put(`/emergency-requests/${requestId}/assign-driver`),

  updateStatus: (requestId, statusData) =>
    api.put(`/emergency-requests/${requestId}/status`, statusData),
}

export default emergencyApi
