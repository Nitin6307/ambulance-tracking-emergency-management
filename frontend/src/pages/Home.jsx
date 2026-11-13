
import { Link } from 'react-router-dom'
import {
  Ambulance,
  UserRound,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Activity,
} from 'lucide-react'

import heroImage from '../assets/hero.png'

function Home() {
  const roles = [
    {
      title: 'Patient',
      description:
        'Request an ambulance and track its live location.',
      icon: UserRound,
      path: '/login',
      button: 'Patient Login',
      registerPath: '/register',
      registerButton: 'Create Patient Account',
    },
    {
      title: 'Driver',
      description:
        'Access assigned emergency requests and update your journey.',
      icon: Truck,
      path: '/login',
      button: 'Driver Login',
    },
    {
      title: 'Admin',
      description:
        'Manage ambulances, drivers and emergency requests.',
      icon: ShieldCheck,
      path: '/login',
      button: 'Admin Login',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-5 lg:px-16">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-600 p-2">
            <Ambulance size={27} />
          </div>

          <span className="text-xl font-bold">
            Medi<span className="text-red-500">Rescue</span>
          </span>
        </div>

        <Link
          to="/login"
          className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold hover:bg-red-700"
        >
          Login
        </Link>
      </nav>

      <main>

        {/* Hero Section */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-16">

          <div>
            <span className="mb-5 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              Emergency Response & Ambulance Coordination
            </span>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Every Second
              <span className="block text-red-500">
                Can Save a Life.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              A real-time ambulance tracking and emergency management
              platform designed to connect patients, ambulance drivers
              and emergency administrators.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/register"
                className="rounded-xl bg-red-600 px-7 py-3.5 font-bold hover:bg-red-700"
              >
                Register as Patient →
              </Link>

              <a
                href="#services"
                className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold hover:bg-slate-800"
              >
                Explore Services
              </a>

            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src={heroImage}
              alt="Ambulance emergency response"
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-5 left-5 rounded-xl border border-slate-700 bg-slate-900/90 p-4">
              <div className="flex items-center gap-3">
                <Activity className="text-green-400" />

                <div>
                  <p className="font-semibold">
                    Emergency Response
                  </p>

                  <p className="text-sm text-slate-400">
                    Real-time coordination
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Portal Access Section */}
        <section
          id="services"
          className="bg-slate-900/70 px-6 py-20 lg:px-16"
        >
          <div className="mx-auto max-w-7xl">

            <div className="mb-12 text-center">
              <p className="font-semibold text-red-500">
                PORTAL ACCESS
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Choose Your Portal
              </h2>

              <p className="mt-3 text-slate-400">
                Select your role to access the appropriate portal.
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-3">

              {roles.map((role) => {
                const Icon = role.icon

                return (
                  <div
                    key={role.title}
                    className="rounded-2xl border border-slate-700 bg-slate-950 p-7 transition hover:-translate-y-1 hover:border-red-500"
                  >

                    <div className="mb-5 inline-flex rounded-xl bg-red-500/10 p-4 text-red-500">
                      <Icon size={32} />
                    </div>

                    <h3 className="text-2xl font-bold">
                      {role.title}
                    </h3>

                    <p className="my-4 min-h-14 leading-6 text-slate-400">
                      {role.description}
                    </p>

                    {/* Login Button */}
                    <Link
                      to={role.path}
                      className="mt-4 block rounded-lg bg-red-600 px-5 py-3 text-center font-semibold hover:bg-red-700"
                    >
                      {role.button} →
                    </Link>

                    {/* Patient Registration Button */}
                    {role.registerPath && (
                      <Link
                        to={role.registerPath}
                        className="mt-3 block rounded-lg border border-red-500 px-5 py-3 text-center font-semibold text-red-400 hover:bg-red-500/10"
                      >
                        {role.registerButton} →
                      </Link>
                    )}

                  </div>
                )
              })}

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3 lg:px-16">

          {[
            {
              icon: MapPin,
              title: 'Live Tracking',
              text: 'Track assigned ambulances in real time.',
            },
            {
              icon: Clock,
              title: 'Faster Coordination',
              text: 'Coordinate emergency requests efficiently.',
            },
            {
              icon: Activity,
              title: 'Real-Time Updates',
              text: 'Monitor ambulance and emergency status.',
            },
          ].map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="text-center"
              >
                <Icon
                  className="mx-auto mb-4 text-red-500"
                  size={35}
                />

                <h3 className="text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {feature.text}
                </p>
              </div>
            )
          })}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-7 text-center text-sm text-slate-500">
        © 2026 Ambulance Tracking & Emergency Management System.
        <br />
        Designed for faster emergency response.
      </footer>

    </div>
  )
}

export default Home
