function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button