function Loader({ message = 'Loading...', fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        fullScreen ? 'min-h-screen' : 'py-6'
      }`}
    >
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500" />

      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}

export default Loader