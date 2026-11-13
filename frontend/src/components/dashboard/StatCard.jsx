
function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-500',
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        {Icon && (
          <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/50">
            <Icon size={22} className={iconColor} />
          </div>
        )}
      </div>

      <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h2>

    </div>
  )
}

export default StatCard
