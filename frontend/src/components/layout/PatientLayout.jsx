
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ambulance,
  ClipboardList,
  MapPin,
  LogOut,
  HeartPulse,
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
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">

      {/* Sidebar */}
      <aside className="w-full border-b border-slate-200 bg-white p-5 shadow-sm md:min-h-screen md:w-64 md:border-b-0 md:border-r">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <HeartPulse size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              MediRescue
            </h2>
            <p className="text-xs text-slate-500">
              Patient Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

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
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="mt-8 border-t border-slate-100 pt-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {/* Account Information */}
        <div className="mt-8 rounded-xl bg-blue-50 p-4">
          <p className="text-xs font-semibold text-blue-700">
            NEED HELP?
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Use the emergency assistance section to request an ambulance.
          </p>
        </div>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 md:p-8">

        {/* Header */}
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Patient Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Request and track emergency ambulance services.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-800">
              {user?.name || 'Patient'}
            </span>

            <span className="text-slate-300">|</span>

            <span className="text-slate-500">
              {user?.email || 'Patient Account'}
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
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
