
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ambulance,
  Siren,
  MapPin,
  Users,
  LogOut,
} from 'lucide-react'

import Button from '../common/Button'

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
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">

      <aside className="w-full border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">

        <h2 className="mb-8 text-xl font-bold">
          🚑 Ambulance Admin
        </h2>

        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-8">
          <Button
            onClick={handleLogout}
            variant="danger"
            className="flex w-full items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>

      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">

        <header className="mb-8">
          <h1 className="text-2xl font-bold">
            🚑 Ambulance Management System
          </h1>

          <p className="mt-1 text-slate-400">
            Real-Time Emergency Tracking Dashboard
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {user?.email} · ADMIN
          </p>
        </header>

        <Outlet />

      </main>
    </div>
  )
}

export default AdminLayout
