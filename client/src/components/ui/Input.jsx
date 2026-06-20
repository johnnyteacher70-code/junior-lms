export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
