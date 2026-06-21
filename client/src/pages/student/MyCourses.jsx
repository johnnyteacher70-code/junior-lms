import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/enrollments/my-courses').then((r) => setEnrollments(r.data.enrollments)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const valid = enrollments.filter((e) => e.course != null);
  const filtered = valid.filter((e) => {
    if (filter === 'inprogress') return e.progress > 0 && e.progress < 100;
    if (filter === 'completed') return e.progress === 100;
    if (filter === 'notstarted') return e.progress === 0;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mening kurslarim</h1>
        <div className="flex gap-2 flex-wrap">
          {[['all', 'Barchasi'], ['notstarted', 'Boshlanmagan'], ['inprogress', 'Jarayonda'], ['completed', 'Tugatilgan']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === v ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Bu kategoriyada kurslar yo'q.</p>
          <Link to="/courses" className="mt-3 inline-block text-primary-600 hover:underline text-sm">Kurslarga ko'z tashlang</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Link key={e._id} to={`/student/courses/${e.course._id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-36 bg-gradient-to-br from-primary-500 to-purple-600 relative">
                {e.course.thumbnail && (
                  <img src={e.course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                  {e.progress}% bajarildi
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{e.course.category}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">{e.course.title}</h3>
                <p className="text-xs text-gray-500">O'qituvchi: {e.course.instructor?.name}</p>
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
