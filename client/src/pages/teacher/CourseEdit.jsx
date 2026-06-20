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
  'Data Science': 'Ma\'lumotlar fanlari',
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
  const [form, setForm] = useState({ title: '', description: '', category: '', level: 'beginner', price: 0, thumbnail: '', language: 'O\'zbek' });
  const [status, setStatus] = useState('draft');

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
      toast.success('Kurs yangilandi!');
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

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kursni tahrirlash</h1>
        <div className="flex items-center gap-3">
          <Badge color={status === 'published' ? 'green' : 'gray'}>{statusLabel[status] || status}</Badge>
          <Button variant={status === 'published' ? 'secondary' : 'primary'} size="sm" onClick={handlePublish} loading={toggling}>
            {status === 'published' ? 'Noshir etmaslik' : 'Nashr etish'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link to={`/teacher/courses/${id}/lessons`}><Button variant="outline" size="sm">Darslarni boshqarish</Button></Link>
        <Link to={`/teacher/courses/${id}/assignments`}><Button variant="outline" size="sm">Topshiriqlarni boshqarish</Button></Link>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <Input label="Kurs nomi" value={form.title} onChange={set('title')} required />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tavsif</label>
            <textarea value={form.description} onChange={set('description')} rows={4} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
          <Input label="Muqova URL" value={form.thumbnail} onChange={set('thumbnail')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/teacher/courses')}>Orqaga</Button>
            <Button type="submit" loading={saving}>O'zgarishlarni saqlash</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
