
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartPulse, ShieldCheck, LockKeyhole } from 'lucide-react'

import authApi from '../api/authApi'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ThemeToggle from '../components/common/ThemeToggle'

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
        name: data.name,
        email: data.email,
        role: data.role,
      }

      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(loggedInUser))

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">

      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <HeartPulse size={34} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            MediRescue
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Ambulance Tracking & Emergency Management
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome Back
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sign in to access your account
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <LockKeyhole size={23} />
            </div>
          </div>

          <form onSubmit={handleLogin}>

            <div className="space-y-4">
              <Input
                label="Email Address"
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
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full p-3"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-6">
            <ThemeToggle />
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={15} />
          <span>Secure access to emergency management services</span>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          © 2026 MediRescue. All rights reserved.
        </p>

      </div>
    </div>
  )
}

export default Login
