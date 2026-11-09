
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ambulance,
  ClipboardList,
  MapPin,
  LogOut,
} from 'lucide-react'

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
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">

      <aside className="w-full border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">

        <h2 className="mb-8 text-xl font-bold">
          🚑 Patient Portal
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

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
        >
          <LogOut size={16} />
          Logout
        </button>

      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">

        <header className="mb-8">
          <h1 className="text-2xl font-bold">
            Patient Dashboard
          </h1>

          <p className="mt-1 text-slate-400">
            Request and track emergency ambulance services.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {user?.email} · PATIENT
          </p>
        </header>

        <Outlet />

      </main>
    </div>
  )
}

export default PatientLayout
