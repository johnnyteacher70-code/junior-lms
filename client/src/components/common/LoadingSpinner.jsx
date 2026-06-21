export default function LoadingSpinner({ fullPage = false, size = 'md', text = '' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-9 w-9', lg: 'h-14 w-14' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-4 border-primary-100 dark:border-primary-900/30`} />
        <div className={`${sizes[size]} rounded-full border-4 border-transparent border-t-primary-600 absolute inset-0 animate-spin`} />
      </div>
      {text && <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center p-12">
      {spinner}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-2/3 rounded-full" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-3 w-1/4 rounded-full" />
          <div className="skeleton h-3 w-1/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
