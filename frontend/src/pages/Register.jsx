
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import authApi from '../api/authApi'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await authApi.register({
        name,
        email,
        password,
      })

      alert('Registration successful! Please login.')
      navigate('/login', { replace: true })

    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
      >
        <h1 className="mb-2 text-2xl font-bold text-white">
          🚑 Create Patient Account
        </h1>

        <p className="mb-8 text-slate-400">
          Register to access emergency ambulance services.
        </p>

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />

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
          placeholder="Create a password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
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
          {loading ? 'Creating account...' : 'Register'}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
