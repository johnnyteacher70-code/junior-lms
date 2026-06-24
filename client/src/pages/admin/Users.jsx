import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers, createUser, updateUserRole, deleteUser } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const roleColor = { student: 'blue', teacher: 'purple', admin: 'red' };
const roleLabel = { student: 'Talaba', teacher: "O'qituvchi", admin: 'Admin' };

const TABS = [
  { key: 'teacher', label: "O'qituvchilar", icon: '👨‍🏫' },
  { key: 'student', label: "O'quvchilar",   icon: '🎓' },
  { key: 'admin',   label: 'Adminlar',       icon: '🛡️' },
];

const ROLE_OPTIONS = [
  { value: 'student', label: 'Talaba' },
  { value: 'teacher', label: "O'qituvchi" },
  { value: 'admin',   label: 'Admin' },
];

function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Parol kamida 6 ta belgi bo\'lishi kerak');
    setLoading(true);
    try {
      const res = await createUser(form);
      toast.success(`${roleLabel[form.role]} hisob yaratildi`);
      onCreated(res.data.user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Yangi foydalanuvchi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="To'liq ism"
            placeholder="Ism Familiya"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Elektron pochta"
            type="email"
            placeholder="siz@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Parol"
            type="password"
            placeholder="Kamida 6 ta belgi"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    form.role === r.value
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Yaratish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserTable({ users, search, onNavigate, onRoleChange, onDelete }) {
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!filtered.length) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-4xl mb-3">👤</p>
        <p className="text-sm">{search ? "Qidiruv bo'yicha hech kim topilmadi" : "Bu bo'limda foydalanuvchilar yo'q"}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px]">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            {['Foydalanuvchi', 'Elektron pochta', 'Rol', "Qo'shilgan", 'Amallar'].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(u._id)}>
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold flex-shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {u.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge color={roleColor[u.role]}>{roleLabel[u.role] || u.role}</Badge>
                  {u.role !== 'admin' && (
                    <select
                      value={u.role}
                      onChange={(e) => onRoleChange(u._id, e.target.value)}
                      className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="student">talaba</option>
                      <option value="teacher">o'qituvchi</option>
                    </select>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {u.role !== 'admin' && (
                  <Button size="sm" variant="danger" onClick={() => onDelete(u._id)}>O'chirish</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [activeTab, setActiveTab] = useState('teacher');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    getUsers()
      .then((r) => setUsers(r.data.users))
      .catch(() => toast.error('Foydalanuvchilarni yuklashda xatolik'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    try {
      const res = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
      toast.success('Rol yangilandi');
    } catch { toast.error('Xatolik yuz berdi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu foydalanuvchini o'chirasizmi?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("Foydalanuvchi o'chirildi");
    } catch (err) { toast.error(err.response?.data?.message || 'Xatolik yuz berdi'); }
  };

  const handleCreated = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setActiveTab(newUser.role);
  };

  if (loading) return <LoadingSpinner />;

  const teachers = users.filter((u) => u.role === 'teacher');
  const students = users.filter((u) => u.role === 'student');
  const admins   = users.filter((u) => u.role === 'admin');
  const counts   = { teacher: teachers.length, student: students.length, admin: admins.length };
  const tabUsers = { teacher: teachers, student: students, admin: admins };

  return (
    <div className="space-y-6">
      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Foydalanuvchilar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Jami: {users.length} ta · {teachers.length} o'qituvchi · {students.length} o'quvchi
          </p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki email bo'yicha qidirish..."
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-56"
          />
          <Button onClick={() => setShowModal(true)} className="whitespace-nowrap">
            + Yangi foydalanuvchi
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setSearch(''); }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === t.key
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <UserTable
          users={tabUsers[activeTab]}
          search={search}
          onNavigate={(id) => navigate(`/admin/users/${id}`)}
          onRoleChange={handleRoleChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
