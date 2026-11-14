
function Loader({ message = 'Loading...', fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        fullScreen
          ? 'min-h-screen bg-slate-50 dark:bg-slate-950'
          : 'py-6'
      }`}
    >
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />

      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  )
}

export default Loader
