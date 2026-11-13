
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ambulance,
  Siren,
  MapPin,
  Users,
  LogOut,
  HeartPulse,
} from 'lucide-react'

import ThemeToggle from '../common/ThemeToggle'

function AdminLayout() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Ambulances',
      path: '/admin/ambulances',
      icon: Ambulance,
    },
    {
      name: 'Emergency Requests',
      path: '/admin/emergency-requests',
      icon: Siren,
    },
    {
      name: 'Live Tracking',
      path: '/admin/live-tracking',
      icon: MapPin,
    },
    {
      name: 'Drivers',
      path: '/admin/drivers',
      icon: Users,
    },
  ]

  function handleLogout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 md:flex">

      {/* Sidebar */}
      <aside className="w-full border-b border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:min-h-screen md:w-64 md:border-b-0 md:border-r">

        {/* Branding */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <HeartPulse size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              MediRescue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Admin Portal
            </p>
          </div>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Management
        </p>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Theme and Logout */}
        <div className="mt-8 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {/* Admin Information */}
        <div className="mt-8 rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            ADMIN CONTROL
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
            Manage ambulances, drivers and emergency operations from one place.
          </p>
        </div>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 md:p-8">

        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ambulance Management System
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-Time Emergency Tracking Dashboard
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || 'Administrator'}
            </span>

            <span className="text-slate-300 dark:text-slate-600">|</span>

            <span className="text-slate-500 dark:text-slate-400">
              {user?.email}
            </span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-400">
              ADMIN
            </span>
          </div>
        </header>

        <Outlet />

      </main>
    </div>
  )
}

export default AdminLayout
