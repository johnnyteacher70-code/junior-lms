import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getGroup, updateGroup, addStudent, removeStudent,
  getAvailableStudents, getTeachers,
} from '../../api/groups';
import { getCourses } from '../../api/courses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses]   = useState([]);
  const [available, setAvailable] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [telegramLink, setTelegramLink] = useState('');

  const load = async () => {
    try {
      const [gRes, tRes, cRes] = await Promise.all([
        getGroup(id),
        getTeachers(),
        getCourses({ status: 'published' }),
      ]);
      setGroup(gRes.data.group);
      setTelegramLink(gRes.data.group.telegramLink || '');
      setTeachers(tRes.data.teachers);
      setCourses(cRes.data.courses);
    } catch { toast.error('Guruh topilmadi'); navigate('/admin/groups'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const openAddModal = async () => {
    const res = await getAvailableStudents(id);
    setAvailable(res.data.students);
    setAddModal(true);
  };

  const handleAddStudent = async (studentId) => {
    try {
      const res = await addStudent(id, { studentId });
      setGroup(res.data.group);
      setAvailable(prev => prev.filter(s => s._id !== studentId));
      toast.success('Talaba qo\'shildi');
    } catch (err) { toast.error(err.response?.data?.message || 'Xatolik'); }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Bu talabani guruhdan chiqarasizmi?')) return;
    try {
      await removeStudent(id, studentId);
      setGroup(prev => ({ ...prev, students: prev.students.filter(s => s._id !== studentId) }));
      toast.success('Talaba chiqarildi');
    } catch { toast.error('Xatolik yuz berdi'); }
  };

  const handleUpdate = async (field, value) => {
    setSaving(true);
    try {
      const res = await updateGroup(id, { [field]: value });
      setGroup(res.data.group);
      toast.success('Saqlandi');
    } catch { toast.error('Xatolik'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!group)  return null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/groups')}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
          <p className="text-sm text-gray-500">{group.description || 'Tavsif yo\'q'}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge color={group.status === 'active' ? 'green' : 'gray'} dot>
            {group.status === 'active' ? 'Faol' : 'Nofaol'}
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleUpdate('status', group.status === 'active' ? 'inactive' : 'active')}
            loading={saving}
          >
            {group.status === 'active' ? 'Nofaol qilish' : 'Faollashtirish'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chap: Sozlamalar */}
        <div className="space-y-4">
          {/* O'qituvchi */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-lg">👨‍🏫</span> O'qituvchi
            </h3>
            <select
              value={group.teacher?._id || ''}
              onChange={e => handleUpdate('teacher', e.target.value || null)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">— O'qituvchi tanlang —</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {group.teacher && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                  {group.teacher.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{group.teacher.name}</p>
                  <p className="text-xs text-gray-500">{group.teacher.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Telegram */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-lg">✈️</span> Telegram guruh
            </h3>
            <input
              type="url"
              value={telegramLink}
              onChange={e => setTelegramLink(e.target.value)}
              placeholder="https://t.me/guruh_nomi"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 mb-2"
            />
            <button
              onClick={() => handleUpdate('telegramLink', telegramLink)}
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.604l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.868.955z"/></svg>
              {saving ? 'Saqlanmoqda...' : 'Telegram linkni saqlash'}
            </button>
            {group.telegramLink && (
              <a
                href={group.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.604l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.868.955z"/></svg>
                Telegram guruhni ochish →
              </a>
            )}
          </div>

          {/* Kurs */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-lg">📚</span> Onlayn kurs
            </h3>
            <select
              value={group.course?._id || ''}
              onChange={e => handleUpdate('course', e.target.value || null)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">— Kurs tanlang —</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
            {group.course && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{group.course.title}</p>
              </div>
            )}
          </div>
        </div>

        {/* O'ng: Talabalar */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-lg">🎓</span>
                Talabalar
                <Badge color="primary">{group.students.length}</Badge>
              </h3>
              <Button size="sm" onClick={openAddModal}>
                + Talaba qo'shish
              </Button>
            </div>

            {group.students.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-3">👤</div>
                <p className="text-sm">Hali talabalar qo'shilmagan</p>
                <Button size="sm" className="mt-3" onClick={openAddModal}>+ Talaba qo'shish</Button>
              </div>
            ) : (
              <div className="space-y-2">
                {group.students.map((s, i) => (
                  <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-primary-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.name}</p>
                      <p className="text-xs text-gray-400 truncate">{s.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(s._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Talaba qo'shish modali */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Talaba qo'shish" size="md">
        {available.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Barcha talabalar allaqachon ushbu guruhda</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {available.map(s => (
              <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-primary-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </div>
                <Button size="sm" onClick={() => handleAddStudent(s._id)}>
                  Qo'shish
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
