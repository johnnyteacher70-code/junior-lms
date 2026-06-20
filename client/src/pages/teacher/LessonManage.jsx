import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getLessons, createLesson, updateLesson, deleteLesson } from '../../api/lessons';
import { getCourse } from '../../api/courses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const empty = { title: '', content: '', videoUrl: '', duration: 0, order: 0 };

export default function LessonManage() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([getLessons(id), getCourse(id)]).then(([l, c]) => {
      setLessons(l.data.lessons);
      setCourse(c.data.course);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (l) => { setEditing(l); setForm({ title: l.title, content: l.content, videoUrl: l.videoUrl, duration: l.duration, order: l.order }); setModal(true); };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateLesson(id, editing._id, form);
        toast.success('Dars yangilandi');
      } else {
        await createLesson(id, form);
        toast.success('Dars yaratildi');
      }
      setModal(false);
      load();
    } catch { toast.error('Saqlashda xatolik'); } finally { setSaving(false); }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm('Bu darsni o\'chirasizmi?')) return;
    try {
      await deleteLesson(id, lessonId);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success('Dars o\'chirildi');
    } catch { toast.error('O\'chirishda xatolik'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Darslar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{course?.title}</p>
        </div>
        <Button onClick={openCreate}>+ Dars qo'shish</Button>
      </div>

      {lessons.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">Hali darslar yo'q. Birinchi darsni qo'shing!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <div key={lesson._id} className="card p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                {lesson.videoUrl && <p className="text-xs text-blue-500 mt-0.5 truncate">Video biriktirilgan</p>}
                {lesson.content && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{lesson.content}</p>}
                {lesson.duration > 0 && <p className="text-xs text-gray-400 mt-1">{lesson.duration} daq</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="secondary" onClick={() => openEdit(lesson)}>Tahrirlash</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(lesson._id)}>O'chirish</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Darsni tahrirlash' : 'Dars qo\'shish'} size="lg">
        <div className="space-y-4">
          <Input label="Dars nomi" value={form.title} onChange={set('title')} required />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Mazmun</label>
            <textarea
              value={form.content}
              onChange={set('content')}
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Dars mazmuni yoki eslatmalar..."
            />
          </div>
          <Input label="Video URL (YouTube va boshqalar)" placeholder="https://..." value={form.videoUrl} onChange={set('videoUrl')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Davomiyligi (daqiqa)" type="number" min="0" value={form.duration} onChange={set('duration')} />
            <Input label="Tartib" type="number" min="0" value={form.order} onChange={set('order')} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModal(false)}>Bekor qilish</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Darsni yangilash' : 'Dars yaratish'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
