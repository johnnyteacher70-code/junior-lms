import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ label, value, icon, color, bg, link }) => (
  <Link to={link} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>{icon}</div>
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((r) => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Admin paneli</h1>
        <p className="text-gray-400">Platformaning to'liq ko'rinishi va boshqaruvi</p>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platforma statistikasi</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Jami foydalanuvchilar" value={stats?.totalUsers ?? 0} icon="👥" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" link="/admin/users" />
          <StatCard label="Talabalar" value={stats?.students ?? 0} icon="🎓" color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" link="/admin/users" />
          <StatCard label="O'qituvchilar" value={stats?.teachers ?? 0} icon="👨‍🏫" color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-900/20" link="/admin/users" />
          <StatCard label="Kurslar" value={stats?.totalCourses ?? 0} icon="📚" color="text-green-600 dark:text-green-400" bg="bg-green-50 dark:bg-green-900/20" link="/admin/courses" />
          <StatCard label="Yozilganlar" value={stats?.totalEnrollments ?? 0} icon="📝" color="text-orange-600 dark:text-orange-400" bg="bg-orange-50 dark:bg-orange-900/20" link="/admin/courses" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-base">Tezkor harakatlar</h2>
          <div className="space-y-2">
            {[
              { label: 'Foydalanuvchilarni boshqarish', to: '/admin/users', desc: 'Foydalanuvchilarni ko\'rish, rollarni tahrirlash va o\'chirish', icon: '👥' },
              { label: 'Kurslarni boshqarish', to: '/admin/courses', desc: 'Barcha kurslarni ko\'rib chiqish va moderatsiya qilish', icon: '📚' },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <div className="text-2xl">{a.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{a.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-base">Platforma holati</h2>
          <div className="space-y-5">
            {[
              { label: 'Foydalanuvchilar o\'sishi', value: stats?.totalUsers, max: 100, color: 'bg-blue-500' },
              { label: 'Kurs faolligi', value: stats?.totalCourses, max: 50, color: 'bg-green-500' },
              { label: 'Yozilish darajasi', value: stats?.totalEnrollments, max: 200, color: 'bg-primary-500' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{m.label}</span>
                  <span className="text-gray-900 dark:text-white font-bold">{m.value ?? 0}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(((m.value ?? 0) / m.max) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
