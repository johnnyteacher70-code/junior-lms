import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 text-center">
      <div className="text-8xl font-extrabold text-primary-600 dark:text-primary-400 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sahifa topilmadi</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.</p>
      <Link to="/" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold text-sm">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
