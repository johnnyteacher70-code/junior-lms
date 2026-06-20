import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';

const statusLabel = { published: 'Nashr etilgan', draft: 'Qoralama' };

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/my').then((r) => setCourses(r.data.courses)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalStudents = courses.reduce((s, c) => s + (c.totalStudents || 0), 0);
  const published = courses.filter((c) => c.status === 'published').length;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">O'qituvchi paneli</h1>
        <p className="text-white/70">Xush kelibsiz, {user.name} — kurslaringizni boshqaring.</p>
        <div className="flex gap-8 mt-6 pt-5 border-t border-white/20">
          {[
            ['📚', courses.length, 'Jami kurslar'],
            ['✅', published, 'Nashr etilgan'],
            ['👥', totalStudents, 'Talabalar soni'],
          ].map(([icon, val, label]) => (
            <div key={label}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="text-3xl font-extrabold">{val}</span>
              </div>
              <p className="text-white/60 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mening kurslarim</h2>
          <Link to="/teacher/courses/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-semibold">
            + Yangi kurs
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hali kurslar yo'q</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-5">Birinchi kursingizni yarating va o'qitishni boshlang.</p>
            <Link to="/teacher/courses/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-semibold">
              Kurs yaratish →
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  {['Kurs', 'Holati', 'Talabalar', 'Narxi', 'Amallar'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 max-w-xs">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.category}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={c.status === 'published' ? 'green' : 'gray'}>{statusLabel[c.status] || c.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{c.totalStudents}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {c.price === 0 ? <span className="text-green-600 font-semibold">Bepul</span> : `$${c.price}`}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3 text-xs font-semibold">
                        <Link to={`/teacher/courses/${c._id}/edit`} className="text-primary-600 hover:underline">Tahrirlash</Link>
                        <Link to={`/teacher/courses/${c._id}/lessons`} className="text-gray-500 hover:underline">Darslar</Link>
                        <Link to={`/teacher/courses/${c._id}/assignments`} className="text-gray-500 hover:underline">Topshiriqlar</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
