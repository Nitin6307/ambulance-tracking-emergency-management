import api from './axios'

const authApi = {
  // Login
  login: (credentials) =>
    api.post('/auth/login', credentials),

  // Register patient
  register: (userData) =>
    api.post('/users/register', userData),
}

export default authApi