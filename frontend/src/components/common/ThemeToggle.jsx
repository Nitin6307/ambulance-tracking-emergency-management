
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(previous => !previous)}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      {dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  )
}

export default ThemeToggle
