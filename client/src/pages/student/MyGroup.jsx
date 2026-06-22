import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyGroup } from '../../api/groups';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function StudentMyGroup() {
  const [group, setGroup]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroup = (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    return getMyGroup()
      .then(r => setGroup(r.data.group))
      .catch(() => setGroup(null))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => {
    fetchGroup();
    const onFocus = () => fetchGroup(false);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGroup(false);
  };

  if (loading) return <LoadingSpinner />;

  if (!group) return (
    <div className="card p-16 text-center">
      <div className="text-5xl mb-4">🏫</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Siz hali guruhga biriktirilmagansiz</h3>
      <p className="text-gray-500">Admin sizni guruhga qo'shgandan keyin bu yerda ko'rinadi</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mening guruhim</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Yangilash
        </button>
      </div>

      {/* Guruh kartochkasi */}
      <div className="card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-500 to-purple-600" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-glow-sm">
                {group.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h2>
                {group.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{group.description}</p>
                )}
              </div>
            </div>
            <Badge color={group.status === 'active' ? 'green' : 'gray'} dot>
              {group.status === 'active' ? 'Faol' : 'Nofaol'}
            </Badge>
          </div>

          {/* Telegram */}
          <div className="mb-4">
            {group.telegramLink ? (
              <a
                href={group.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.604l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.868.955z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Telegram guruh</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Guruhga qo'shiling →</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.604l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.868.955z"/></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Telegram guruh</p>
                  <p className="text-sm text-gray-400">Havola hali qo'shilmagan</p>
                </div>
              </div>
            )}
          </div>

          {/* Onlayn kurs */}
          {group.course && (
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">Onlayn kurs</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{group.course.title}</p>
                </div>
              </div>
              <Link to={`/courses/${group.course._id}`}>
                <Button size="sm">O'rganish →</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* O'qituvchi */}
      {group.teacher && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>👨‍🏫</span> O'qituvchi
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
              {group.teacher.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{group.teacher.name}</p>
              <p className="text-sm text-gray-500">{group.teacher.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Guruh do'stlari */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎓</span> Guruh a'zolari
          <Badge color="primary">{group.students.length}</Badge>
        </h3>
        <div className="grid gap-2">
          {group.students.map((s, i) => (
            <div key={s._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-primary-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {s.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
