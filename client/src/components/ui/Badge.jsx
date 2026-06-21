const colors = {
  green:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800',
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
  yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  red:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800',
  gray:   'bg-gray-100 text-gray-600 dark:bg-gray-700/80 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-600',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-800',
  primary:'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 ring-1 ring-primary-200 dark:ring-primary-800',
};

const dotColors = {
  green: 'bg-green-500', blue: 'bg-blue-500', yellow: 'bg-amber-500',
  red: 'bg-red-500', purple: 'bg-purple-500', gray: 'bg-gray-400',
  indigo: 'bg-indigo-500', orange: 'bg-orange-500', primary: 'bg-primary-500',
};

export default function Badge({ children, color = 'gray', className = '', dot = false, size = 'sm' }) {
  const sizeClass = size === 'xs' ? 'px-1.5 py-0 text-2xs' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${colors[color]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[color]}`} />}
      {children}
    </span>
  );
}
