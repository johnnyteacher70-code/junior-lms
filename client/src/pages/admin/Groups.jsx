import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getGroups, createGroup, deleteGroup } from '../../api/groups';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

export default function AdminGroups() {
  const [groups, setGroups]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: '', description: '' });

  const load = () => {
    setLoading(true);
    getGroups()
      .then(r => setGroups(r.data.groups))
      .catch(() => toast.error('Guruhlarni yuklashda xatolik'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Guruh nomi kiritilmagan');
    setSaving(true);
    try {
      await createGroup(form);
      toast.success('Guruh yaratildi!');
      setModal(false);
      setForm({ name: '', description: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu guruhni o\'chirasizmi?')) return;
    try {
      await deleteGroup(id);
      setGroups(prev => prev.filter(g => g._id !== id));
      toast.success('Guruh o\'chirildi');
    } catch { toast.error('O\'chirishda xatolik'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guruhlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{groups.length} ta guruh</p>
        </div>
        <Button onClick={() => setModal(true)}>
          + Yangi guruh
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hali guruhlar yo'q</h3>
          <p className="text-gray-500 mb-5">Birinchi guruhni yarating</p>
          <Button onClick={() => setModal(true)}>+ Yangi guruh</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(g => (
            <div key={g._id} className="card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {g.name.charAt(0).toUpperCase()}
                </div>
                <Badge color={g.status === 'active' ? 'green' : 'gray'} dot>
                  {g.status === 'active' ? 'Faol' : 'Nofaol'}
                </Badge>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{g.name}</h3>
              {g.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{g.description}</p>
              )}

              <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {g.teacher ? g.teacher.name : 'O\'qituvchi yo\'q'}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {g.students.length} talaba
                </span>
              </div>

              <div className="flex gap-2">
                <Link to={`/admin/groups/${g._id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">Boshqarish</Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => handleDelete(g._id)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Yangi guruh yaratish">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Guruh nomi"
            placeholder="Masalan: Frontend 1-guruh"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Tavsif (ixtiyoriy)</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Guruh haqida qisqacha ma'lumot..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={saving}>Yaratish</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
