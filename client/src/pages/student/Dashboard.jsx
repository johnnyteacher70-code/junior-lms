import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-courses').then((r) => setEnrollments(r.data.enrollments)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const valid = enrollments.filter((e) => e.course != null);
  const inProgress = valid.filter((e) => e.progress > 0 && e.progress < 100);
  const completed = valid.filter((e) => e.progress === 100);
  const notStarted = valid.filter((e) => e.progress === 0);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Xush kelibsiz, {user.name}! 👋</h1>
        <p className="text-white/70">O'rganishingizni to'xtatgan joyingizdan davom eting.</p>
        {valid.length > 0 && (
          <div className="flex gap-6 mt-5 pt-5 border-t border-white/20">
            <div><p className="text-2xl font-bold">{enrollments.length}</p><p className="text-white/70 text-sm">Yozilgan</p></div>
            <div><p className="text-2xl font-bold">{inProgress.length}</p><p className="text-white/70 text-sm">Jarayonda</p></div>
            <div><p className="text-2xl font-bold">{completed.length}</p><p className="text-white/70 text-sm">Tugatilgan</p></div>
          </div>
        )}
      </div>

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">O'rganishni davom eting</h2>
            <Link to="/student/courses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Barchasini ko'rish</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((e) => (
              <Link key={e._id} to={`/student/courses/${e.course._id}`} className="card p-4 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{e.course.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">O'qituvchi: {e.course.instructor?.name}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Rivojlanish</span><span className="font-semibold text-primary-600">{e.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all" style={{ width: `${e.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Not Started */}
      {notStarted.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Boshlanmagan</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notStarted.map((e) => (
              <Link key={e._id} to={`/student/courses/${e.course._id}`} className="card p-4 hover:shadow-md transition-all group flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{e.course.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{e.course.category} · Boshlanmagan</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tugatilgan 🎉</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((e) => (
              <div key={e._id} className="card p-4 flex items-center gap-3 border-green-200 dark:border-green-800">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{e.course.title}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Tugatilgan ✓</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {valid.length === 0 && (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hali kurslar yo'q</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Katalogimizni ko'rib chiqing va birinchi kursingizga yoziling.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-semibold">
            Kurslarga ko'z tashlang →
          </Link>
        </div>
      )}
    </div>
  );
}
