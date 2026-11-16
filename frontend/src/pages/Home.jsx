
import { Link } from 'react-router-dom'
import {
  Ambulance,
  UserRound,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Activity,
  ArrowRight,
  CheckCircle2,
  Navigation,
  HeartPulse,
  Radio,
  Zap,
  PhoneCall,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

import heroImage from '../assets/hero.png'

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const roles = [
    {
      title: 'Patient',
      description: 'Request emergency assistance and track your assigned ambulance in real time.',
      icon: UserRound,
      path: '/login/patient',
      button: 'Patient Login',
      registerPath: '/register',
      registerButton: 'Create Account',
      accent: 'red',
    },
    {
      title: 'Driver',
      description: 'View assigned emergency requests, manage availability and update GPS location.',
      icon: Truck,
      path: '/login/driver',
      button: 'Driver Login',
      accent: 'blue',
    },
    {
      title: 'Admin',
      description: 'Manage ambulance fleets, coordinate drivers and monitor emergency operations.',
      icon: ShieldCheck,
      path: '/login/admin',
      button: 'Admin Login',
      accent: 'emerald',
    },
  ]

  const features = [
    {
      icon: Navigation,
      title: 'Live GPS Tracking',
      description: 'Follow ambulance movement through real-time location updates.',
    },
    {
      icon: Zap,
      title: 'Smart Assignment',
      description: 'Connect emergency requests with nearby available ambulances.',
    },
    {
      icon: Radio,
      title: 'Instant Updates',
      description: 'Keep patients, drivers and administrators synchronized.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Request Help',
      description: 'Patients submit an emergency request with their pickup location.',
      icon: PhoneCall,
    },
    {
      number: '02',
      title: 'Find Ambulance',
      description: 'The system identifies and assigns an available ambulance.',
      icon: MapPin,
    },
    {
      number: '03',
      title: 'Live Tracking',
      description: 'Patients can follow the assigned ambulance on the map.',
      icon: Navigation,
    },
    {
      number: '04',
      title: 'Reach Hospital',
      description: 'The driver completes the emergency journey and updates its status.',
      icon: HeartPulse,
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-[#080d19] text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080d19]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">

          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-red-600 p-2.5 shadow-lg shadow-red-600/20">
              <Ambulance size={27} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Medi<span className="text-red-500">Rescue</span>
              </h1>
              <p className="text-[10px] tracking-[3px] text-slate-500">
                EMERGENCY RESPONSE
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-9 text-sm font-medium text-slate-300 md:flex">
            <a href="#home" className="transition hover:text-red-400">Home</a>
            <a href="#services" className="transition hover:text-red-400">Services</a>
            <a href="#how-it-works" className="transition hover:text-red-400">How It Works</a>
            <a href="#about" className="transition hover:text-red-400">About</a>
          </div>

          <div className="hidden md:block">
            <Link
              to="/login/patient"
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              Login <ArrowRight className="ml-2 inline" size={16} />
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 p-2 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-4 border-t border-white/10 bg-[#0c1424] px-6 py-5 md:hidden">
            <a href="#home" onClick={() => setMenuOpen(false)} className="block text-slate-300">Home</a>
            <a href="#services" onClick={() => setMenuOpen(false)} className="block text-slate-300">Services</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-slate-300">How It Works</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="block text-slate-300">About</a>
            <Link to="/login/patient" className="block font-semibold text-red-400">Login →</Link>
          </div>
        )}
      </nav>

      <main>

        {/* HERO SECTION */}
        <section id="home" className="relative">
          <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]" />
          <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">

            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-red-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                SMART EMERGENCY RESPONSE SYSTEM
              </div>

              <h1 className="max-w-2xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
                Every Second
                <span className="mt-2 block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Can Save a Life.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Emergency assistance, smarter coordination and real-time ambulance tracking.
                Connecting patients, drivers and hospitals through one intelligent platform.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="group rounded-xl bg-red-600 px-7 py-4 font-bold shadow-xl shadow-red-600/20 transition hover:-translate-y-1 hover:bg-red-700"
                >
                  Request Assistance
                  <ArrowRight className="ml-2 inline transition group-hover:translate-x-1" size={18} />
                </Link>

                <a
                  href="#how-it-works"
                  className="rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold transition hover:border-red-500/50 hover:bg-white/10"
                >
                  Explore Platform
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-7 border-t border-white/10 pt-8">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="text-emerald-400" size={18} />
                    Live GPS
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Location tracking</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="text-emerald-400" size={18} />
                    Smart Dispatch
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Ambulance assignment</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="text-emerald-400" size={18} />
                    Real-Time
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Status updates</p>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative mx-auto w-full max-w-xl">

              <div className="absolute inset-0 rounded-full bg-red-600/10 blur-[100px]" />

              <div className="relative rounded-[30px] border border-white/10 bg-gradient-to-br from-[#172338] to-[#0c1424] p-4 shadow-2xl shadow-black/40 sm:p-6">

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Emergency Response</p>
                    <p className="mt-1 text-xs text-slate-500">MediRescue platform preview</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    System Preview
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101d30]">
                  <img
                    src={heroImage}
                    alt="Ambulance emergency response"
                    className="h-72 w-full object-contain p-3 sm:h-80"
                  />

                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#080d19]/90 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-500/15 p-2.5 text-red-400">
                          <Ambulance size={23} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Ambulance Tracking</p>
                          <p className="mt-1 text-xs text-slate-400">Live GPS monitoring feature</p>
                        </div>
                      </div>
                      <Activity className="text-emerald-400" size={23} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <MapPin className="mb-2 text-red-400" size={21} />
                    <p className="text-sm font-bold">GPS Tracking</p>
                    <p className="mt-1 text-xs text-slate-500">Location updates</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <Clock className="mb-2 text-blue-400" size={21} />
                    <p className="text-sm font-bold">Quick Response</p>
                    <p className="mt-1 text-xs text-slate-500">Smart coordination</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-20 hidden rounded-xl border border-white/10 bg-[#172338] p-3 shadow-xl sm:block lg:-right-8">
                <Activity className="text-emerald-400" size={25} />
              </div>
            </div>

          </div>
        </section>

        {/* PORTAL SECTION */}
        <section id="services" className="border-y border-white/5 bg-[#0d1525] px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">

            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-bold tracking-[4px] text-red-400">PORTAL ACCESS</p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
                One Platform. <span className="text-red-500">Three Portals.</span>
              </h2>
              <p className="mt-5 leading-7 text-slate-400">
                Dedicated access for everyone involved in emergency response.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {roles.map((role) => {
                const Icon = role.icon

                const accentStyles = {
                  red: 'bg-red-500/10 text-red-400 border-red-500/20',
                  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                }

                const buttonStyles = {
                  red: 'bg-red-600 hover:bg-red-700',
                  blue: 'bg-blue-600 hover:bg-blue-700',
                  emerald: 'bg-emerald-600 hover:bg-emerald-700',
                }

                return (
                  <div
                    key={role.title}
                    className="group rounded-3xl border border-white/10 bg-[#111c2e] p-8 transition duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-900/10"
                  >
                    <div className={`mb-7 inline-flex rounded-2xl border p-4 ${accentStyles[role.accent]}`}>
                      <Icon size={34} />
                    </div>

                    <h3 className="text-2xl font-bold">{role.title} Portal</h3>

                    <p className="mt-4 min-h-20 leading-7 text-slate-400">
                      {role.description}
                    </p>

                    <Link
                      to={role.path}
                      className={`mt-7 flex items-center justify-center rounded-xl px-5 py-3.5 font-bold transition ${buttonStyles[role.accent]}`}
                    >
                      {role.button}
                      <ArrowRight className="ml-2" size={18} />
                    </Link>

                    {role.registerPath && (
                      <Link
                        to={role.registerPath}
                        className="mt-3 block rounded-xl border border-white/10 px-5 py-3.5 text-center text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        {role.registerButton}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">

            <div className="mb-16 text-center">
              <p className="text-xs font-bold tracking-[4px] text-red-400">SIMPLE WORKFLOW</p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
                How MediRescue <span className="text-red-500">Works</span>
              </h2>
              <p className="mt-5 text-slate-400">
                From emergency request to hospital arrival, every step connected.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon

                return (
                  <div key={step.number} className="relative rounded-2xl border border-white/10 bg-[#111c2e] p-7 transition hover:-translate-y-1 hover:border-red-500/40">
                    <div className="mb-7 flex items-center justify-between">
                      <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                        <Icon size={26} />
                      </div>
                      <span className="text-3xl font-black text-white/10">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="about" className="border-y border-white/5 bg-[#0d1525] px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">

            <div className="mb-14 text-center">
              <p className="text-xs font-bold tracking-[4px] text-red-400">WHY MEDIRESCUE</p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
                Technology That <span className="text-red-500">Connects Lives</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-[#111c2e] p-8 transition hover:border-red-500/40">
                    <div className="mb-6 inline-flex rounded-xl bg-red-500/10 p-4 text-red-400">
                      <Icon size={30} />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 lg:px-10">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-red-500/20 bg-gradient-to-r from-[#40121d] via-[#271522] to-[#111c2e] p-9 text-center sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-500/20 blur-[90px]" />

            <div className="relative">
              <div className="mx-auto mb-6 inline-flex rounded-2xl bg-red-500/15 p-4 text-red-400">
                <Ambulance size={36} />
              </div>

              <h2 className="text-3xl font-extrabold sm:text-5xl">
                Be Ready When Every <span className="text-red-400">Second Matters.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
                Join MediRescue and experience a smarter way to coordinate emergency ambulance services.
              </p>

              <Link
                to="/register"
                className="mt-9 inline-flex items-center rounded-xl bg-red-600 px-8 py-4 font-bold transition hover:bg-red-700"
              >
                Get Started <ArrowRight className="ml-2" size={19} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#060a13] px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 sm:flex-row">

          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-red-600 p-2">
              <Ambulance size={22} />
            </div>
            <span className="text-xl font-extrabold">
              Medi<span className="text-red-500">Rescue</span>
            </span>
          </Link>

          <p className="text-center text-sm text-slate-500">
            © 2026 Ambulance Tracking & Emergency Management System.
            <br />
            Designed for smarter emergency coordination.
          </p>

          <Link to="/login/patient" className="text-sm font-semibold text-slate-400 transition hover:text-red-400">
            Patient Login →
          </Link>
        </div>
      </footer>

    </div>
  )
}

export default Home
