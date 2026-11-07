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
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {label}
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
        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none transition focus:border-blue-500 disabled:opacity-50"
      />
    </div>
  )
}

export default Input