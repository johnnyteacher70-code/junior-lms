import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetail } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';

const roleLabel = { student: 'Talaba', teacher: "O'qituvchi", admin: 'Administrator' };
const roleColor = { student: 'blue', teacher: 'purple', admin: 'red' };
const levelLabel = { beginner: "Boshlang'ich", intermediate: "O'rta", advanced: 'Yuqori' };

function StatCard({ label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm mt-0.5 opacity-80">{label}</p>
    </div>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetail(id)
      .then(r => setData(r.data))
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { user, enrollments, courses, lessonCount, totalStudents } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/users')}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-sm text-gray-500">Foydalanuvchilar</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
        </div>
      </div>

      {/* User info card */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
              : user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</h2>
              <Badge color={roleColor[user.role]}>{roleLabel[user.role]}</Badge>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
            {user.bio && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{user.bio}</p>}
          </div>
          <div className="text-right text-sm text-gray-400 flex-shrink-0">
            <p>Ro'yxatdan o'tgan</p>
            <p className="font-medium text-gray-600 dark:text-gray-300">
              {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
            </p>
          </div>
        </div>
      </div>

      {/* TALABA */}
      {user.role === 'student' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Yozilgan kurslar" value={enrollments?.length || 0} color="primary" />
            <StatCard label="Jarayonda" value={enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0} color="orange" />
            <StatCard label="Tugatilgan" value={enrollments?.filter(e => e.progress === 100).length || 0} color="green" />
            <StatCard label="Boshlanmagan" value={enrollments?.filter(e => e.progress === 0).length || 0} color="purple" />
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">Yozilgan kurslar</h3>
            </div>
            {!enrollments?.length ? (
              <div className="p-10 text-center text-gray-400">
                <p>Hali hech qanday kursga yozilmagan</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {enrollments.map(e => (
                  <div key={e._id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0 overflow-hidden">
                      {e.course?.thumbnail
                        ? <img src={e.course.thumbnail} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                            {e.course?.title?.charAt(0)}
                          </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{e.course?.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{e.course?.category} · {levelLabel[e.course?.level] || e.course?.level}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${e.progress}%`,
                              background: e.progress === 100 ? '#22c55e' : e.progress > 0 ? '#6366f1' : '#d1d5db'
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 w-10 text-right">{e.progress}%</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {e.progress === 100 ? (
                        <Badge color="green">Tugatilgan</Badge>
                      ) : e.progress > 0 ? (
                        <Badge color="blue">Jarayonda</Badge>
                      ) : (
                        <Badge color="gray">Boshlanmagan</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* O'QITUVCHI */}
      {user.role === 'teacher' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Yaratgan kurslari" value={courses?.length || 0} color="primary" />
            <StatCard label="Nashr etilgan" value={courses?.filter(c => c.status === 'published').length || 0} color="green" />
            <StatCard label="Jami talabalar" value={totalStudents || 0} color="purple" />
            <StatCard label="Jami darslar" value={lessonCount || 0} color="orange" />
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">Yaratgan kurslari</h3>
            </div>
            {!courses?.length ? (
              <div className="p-10 text-center text-gray-400">
                <p>Hali hech qanday kurs yaratmagan</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {courses.map(c => (
                  <div key={c._id} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0 overflow-hidden">
                      {c.thumbnail
                        ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                            {c.title?.charAt(0)}
                          </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.category} · {levelLabel[c.level] || c.level}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {c.totalStudents}
                      </span>
                      <Badge color={c.status === 'published' ? 'green' : 'gray'}>
                        {c.status === 'published' ? 'Nashr' : 'Qoralama'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ADMIN */}
      {user.role === 'admin' && (
        <div className="card p-10 text-center text-gray-400">
          <p>Administrator hisobi</p>
        </div>
      )}
    </div>
  );
}
