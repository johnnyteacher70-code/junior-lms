import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourse, updateCourse, publishCourse } from '../../api/courses';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Other'];
const CATEGORY_LABELS = {
  'Web Development': 'Veb ishlab chiqish',
  'Mobile Development': 'Mobil ishlab chiqish',
  'Data Science': "Ma'lumotlar fanlari",
  'Design': 'Dizayn',
  'Business': 'Biznes',
  'Marketing': 'Marketing',
  'Photography': 'Fotografiya',
  'Music': 'Musiqa',
  'Other': 'Boshqa',
};
const statusLabel = { published: 'Nashr etilgan', draft: 'Qoralama' };

export default function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', level: 'beginner', price: 0, thumbnail: '', language: "O'zbek" });
  const [status, setStatus] = useState('draft');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    getCourse(id).then((r) => {
      const c = r.data.course;
      setForm({ title: c.title, description: c.description, category: c.category, level: c.level, price: c.price, thumbnail: c.thumbnail, language: c.language });
      setStatus(c.status);
    }).catch(() => navigate('/teacher/courses')).finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCourse(id, form);
      toast.success("Kurs yangilandi!");
    } catch { toast.error('Yangilashda xatolik'); } finally { setSaving(false); }
  };

  const handlePublish = async () => {
    setToggling(true);
    try {
      const r = await publishCourse(id);
      setStatus(r.data.course.status);
      toast.success(`Kurs ${r.data.course.status === 'published' ? 'nashr etildi' : 'qoralamaga olindi'}`);
    } catch { toast.error('Xatolik yuz berdi'); } finally { setToggling(false); }
  };

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />;

  const tabs = [
    { key: 'info', label: 'Kurs ma\'lumotlari' },
    { key: 'lessons', label: 'Darslar' },
    { key: 'assignments', label: 'Topshiriqlar' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={() => navigate('/teacher/courses')} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 mb-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Mening kurslarim
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kursni tahrirlash</h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge color={status === 'published' ? 'green' : 'gray'}>{statusLabel[status] || status}</Badge>
          <Button variant={status === 'published' ? 'secondary' : 'primary'} size="sm" onClick={handlePublish} loading={toggling}>
            {status === 'published' ? 'Nashrdan olish' : 'Nashr etish'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              if (t.key === 'lessons') navigate(`/teacher/courses/${id}/lessons`);
              else if (t.key === 'assignments') navigate(`/teacher/courses/${id}/assignments`);
              else setActiveTab(t.key);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.key && t.key === 'info'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Course Info Form */}
      <div className="card p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <Input label="Kurs nomi" value={form.title} onChange={set('title')} required />

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tavsif</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={4}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Kategoriya</label>
              <select value={form.category} onChange={set('category')} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Kategoriya tanlang</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Daraja</label>
              <select value={form.level} onChange={set('level')} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="beginner">Boshlang'ich</option>
                <option value="intermediate">O'rta</option>
                <option value="advanced">Yuqori</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Narxi ($)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} />
            <Input label="Til" value={form.language} onChange={set('language')} />
          </div>

          {/* Thumbnail with preview */}
          <div>
            <Input label="Muqova rasmi URL" placeholder="https://..." value={form.thumbnail} onChange={set('thumbnail')} />
            {form.thumbnail && (
              <div className="mt-2 rounded-lg overflow-hidden h-40 bg-gray-100 dark:bg-gray-800">
                <img
                  src={form.thumbnail}
                  alt="Muqova"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/teacher/courses')}>Orqaga</Button>
            <Button type="submit" loading={saving}>O'zgarishlarni saqlash</Button>
          </div>
        </form>
      </div>

      {/* Quick nav cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to={`/teacher/courses/${id}/lessons`} className="card p-5 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">Darslarni boshqarish</p>
              <p className="text-xs text-gray-500 mt-0.5">Video darslar qo'shing va tartibga soling</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link to={`/teacher/courses/${id}/assignments`} className="card p-5 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">Topshiriqlarni boshqarish</p>
              <p className="text-xs text-gray-500 mt-0.5">Talabalar uchun topshiriqlar yarating</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
