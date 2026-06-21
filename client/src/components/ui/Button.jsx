const variants = {
  primary:       'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-sm hover:shadow-glow-sm',
  white:         'bg-white hover:bg-gray-50 text-primary-700 shadow-sm border border-gray-200',
  secondary:     'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-white',
  danger:        'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-sm',
  outline:       'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 dark:text-primary-400 dark:border-primary-500',
  'outline-white':'border border-white/50 text-white hover:bg-white/15 backdrop-blur-sm',
  ghost:         'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60',
  accent:        'bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-600 hover:to-accent-500 text-white shadow-sm',
  dark:          'bg-gray-900 hover:bg-gray-800 text-white shadow-sm dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg',
  sm: 'px-3.5 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, loading, icon, ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 ease-spring
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        active:scale-[0.97]
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
