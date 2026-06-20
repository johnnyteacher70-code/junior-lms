import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, updateUserRole, deleteUser } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const roleColor = { student: 'blue', teacher: 'purple', admin: 'red' };
const roleLabel = { student: 'Talaba', teacher: 'O\'qituvchi', admin: 'Admin' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => { getUsers().then((r) => setUsers(r.data.users)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    try {
      const res = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
      toast.success('Rol yangilandi');
    } catch { toast.error('Xatolik yuz berdi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu foydalanuvchini o\'chirasizmi?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('Foydalanuvchi o\'chirildi');
    } catch (err) { toast.error(err.response?.data?.message || 'Xatolik yuz berdi'); }
  };

  if (loading) return <LoadingSpinner />;

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Foydalanuvchilar ({users.length})</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism yoki elektron pochta bo'yicha qidirish..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Foydalanuvchi', 'Elektron pochta', 'Rol', 'Qo\'shilgan', 'Amallar'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-medium flex-shrink-0">{u.name.charAt(0).toUpperCase()}</div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge color={roleColor[u.role]}>{roleLabel[u.role] || u.role}</Badge>
                      {u.role !== 'admin' && (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="student">talaba</option>
                          <option value="teacher">o'qituvchi</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>O'chirish</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">Foydalanuvchilar topilmadi.</p>
        )}
      </div>
    </div>
  );
}
