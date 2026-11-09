
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import authApi from '../api/authApi'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await authApi.login({
        email,
        password,
      })

      const data = response.data

      const loggedInUser = {
        email: data.email,
        role: data.role,
      }

      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(loggedInUser))

      // Redirect according to user role
      const role = data.role.toLowerCase()

      if (['admin', 'patient', 'driver'].includes(role)) {
        navigate(`/${role}/dashboard`, { replace: true })
      } else {
        setError('Your account role is not supported.')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Invalid credentials or unable to connect to server'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
      >
        <h1 className="mb-2 text-2xl font-bold text-white">
          🚑 Ambulance System
        </h1>

        <p className="mb-8 text-slate-400">
          Sign in to your account
        </p>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full p-3"
        >
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}

export default Login