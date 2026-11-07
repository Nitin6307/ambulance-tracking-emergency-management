function StatCard({ title, value, icon: Icon, iconColor = 'text-blue-400' }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>

        {Icon && (
          <Icon size={22} className={iconColor} />
        )}
      </div>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {value}
      </h2>
    </div>
  )
}
export default StatCard
