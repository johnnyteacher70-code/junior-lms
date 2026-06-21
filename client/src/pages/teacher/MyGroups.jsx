import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyGroups } from '../../api/groups';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';

export default function TeacherMyGroups() {
  const [groups, setGroups]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGroups()
      .then(r => setGroups(r.data.groups))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mening guruhlarim</h1>
        <p className="text-sm text-gray-500 mt-0.5">{groups.length} ta guruh</p>
      </div>

      {groups.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hali guruh yo'q</h3>
          <p className="text-gray-500">Admin sizni guruhga biriktirganidan keyin bu yerda ko'rinadi</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {groups.map(g => (
            <div key={g._id} className="card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl">
                    {g.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{g.name}</h3>
                    {g.course && <p className="text-xs text-primary-600 dark:text-primary-400">{g.course.title}</p>}
                  </div>
                </div>
                <Badge color={g.status === 'active' ? 'green' : 'gray'} dot>
                  {g.status === 'active' ? 'Faol' : 'Nofaol'}
                </Badge>
              </div>

              {g.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{g.description}</p>
              )}

              {/* Talabalar */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Talabalar ({g.students.length})
                </p>
                {g.students.length === 0 ? (
                  <p className="text-sm text-gray-400">Talabalar yo'q</p>
                ) : (
                  <div className="space-y-1.5">
                    {g.students.map((s, i) => (
                      <div key={s._id} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{s.name}</p>
                          <p className="text-xs text-gray-400 truncate">{s.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
