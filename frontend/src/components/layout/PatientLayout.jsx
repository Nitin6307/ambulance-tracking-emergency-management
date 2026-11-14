
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ambulance,
  ClipboardList,
  MapPin,
  LogOut,
  HeartPulse,
} from 'lucide-react'

import ThemeToggle from '../common/ThemeToggle'

function PatientLayout() {
  const navigate = useNavigate()

  const user = JSON.parse(sessionStorage.getItem('user') || 'null')

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/patient/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Request Ambulance',
      path: '/patient/request-ambulance',
      icon: Ambulance,
    },
    {
      name: 'My Requests',
      path: '/patient/my-requests',
      icon: ClipboardList,
    },
    {
      name: 'Live Tracking',
      path: '/patient/live-tracking',
      icon: MapPin,
    },
  ]

  function handleLogout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100 md:flex">

      {/* Sidebar */}
      <aside className="w-full border-b border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-5">

        {/* Logo */}
        <div className="mb-5 flex items-center gap-3 md:mb-8">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <HeartPulse size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              MediRescue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Patient Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-1 md:space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition sm:justify-center md:justify-start md:gap-3 md:px-4 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                  }`
                }
              >
                <Icon size={19} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Theme and Logout */}
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2 md:grid-cols-1">

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

        {/* Help Section */}
        <div className="mt-5 hidden rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30 md:block">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            NEED HELP?
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
            Use the emergency assistance section to request an ambulance.
          </p>
        </div>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 md:p-8">

        {/* Header */}
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-8 sm:p-5">

          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            Patient Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Request and track emergency ambulance services.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || 'Patient'}
            </span>

            <span className="text-slate-300 dark:text-slate-600">|</span>

            <span className="break-all text-slate-500 dark:text-slate-400">
              {user?.email || 'Patient Account'}
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400">
              PATIENT
            </span>
          </div>
        </header>

        <Outlet />

      </main>
    </div>
  )
}

export default PatientLayout
