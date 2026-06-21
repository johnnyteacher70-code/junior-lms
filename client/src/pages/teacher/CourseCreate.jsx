import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createCourse } from '../../api/courses';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

export default function CourseCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', level: 'beginner', price: 0, thumbnail: '', language: 'O\'zbek' });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await createCourse(form);
      toast.success('Kurs yaratildi! Endi darslar qo\'shishingiz mumkin.');
      navigate(`/teacher/courses/${r.data.course._id}/lessons`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kurs yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Yangi kurs yaratish</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Kurs nomi" placeholder="Masalan: To'liq React Developer kursi" value={form.title} onChange={set('title')} required />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tavsif</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={4}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Talabalar bu kursda nima o'rganadi?"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Kategoriya</label>
              <select
                value={form.category}
                onChange={set('category')}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Kategoriya tanlang</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Daraja</label>
              <select
                value={form.level}
                onChange={set('level')}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
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
          <div>
            <Input label="Muqova rasmi URL (ixtiyoriy)" placeholder="https://..." value={form.thumbnail} onChange={set('thumbnail')} />
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
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Bekor qilish</Button>
            <Button type="submit" loading={loading}>Kurs yaratish</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
