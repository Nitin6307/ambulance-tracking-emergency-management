
function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  name,
  disabled = false,
}) {
  return (
    <div className="w-full">

      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:disabled:bg-slate-900"
      />

    </div>
  )
}

export default Input
