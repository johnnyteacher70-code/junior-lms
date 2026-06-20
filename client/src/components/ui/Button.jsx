const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
  white: 'bg-white hover:bg-gray-50 text-primary-700 shadow-sm',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  'outline-white': 'border border-white/40 text-white hover:bg-white/10',
  ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, loading, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
