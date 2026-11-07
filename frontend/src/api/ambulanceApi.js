import api from './axios'

const ambulanceApi = {
  // Get all ambulances
  getAll: () => api.get('/ambulances'),

  // Get ambulance by ID
  getById: (id) => api.get(`/ambulances/${id}`),

  // Get available ambulances
  getAvailable: () => api.get('/ambulances/available'),

  // Add new ambulance
  create: (ambulanceData) => api.post('/ambulances', ambulanceData),

  // Assign driver
  assignDriver: (ambulanceId, driverId) =>
    api.put(`/ambulances/${ambulanceId}/assign-driver/${driverId}`),

  // Update ambulance location
  updateLocation: (ambulanceId, locationData) =>
    api.put(`/ambulances/${ambulanceId}/location`, locationData),

  // Update ambulance status
  updateStatus: (ambulanceId, statusData) =>
    api.put(`/ambulances/${ambulanceId}/status`, statusData),

  // Admin maintenance
  updateMaintenance: (ambulanceId) =>
    api.put(`/ambulances/${ambulanceId}/maintenance`),
}

export default ambulanceApi