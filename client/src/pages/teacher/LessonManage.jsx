import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getLessons, createLesson, updateLesson, deleteLesson } from '../../api/lessons';
import { getCourse } from '../../api/courses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const empty = { title: '', content: '', videoUrl: '', duration: 0, order: 0 };

function toEmbedUrl(url) {
  if (!url) return null;
  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const shorts = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  return url;
}

export default function LessonManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const load = () => {
    Promise.all([getLessons(id), getCourse(id)]).then(([l, c]) => {
      setLessons(l.data.lessons);
      setCourse(c.data.course);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const openCreate = () => { setEditing(null); setForm(empty); setShowPreview(false); setModal(true); };
  const openEdit = (l) => {
    setEditing(l);
    setForm({ title: l.title, content: l.content, videoUrl: l.videoUrl, duration: l.duration, order: l.order });
    setShowPreview(false);
    setModal(true);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Dars nomini kiriting");
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
    if (!confirm("Bu darsni o'chirasizmi?")) return;
    try {
      await deleteLesson(id, lessonId);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success("Dars o'chirildi");
    } catch { toast.error("O'chirishda xatolik"); }
  };

  if (loading) return <LoadingSpinner />;

  const embedUrl = toEmbedUrl(form.videoUrl);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate(`/teacher/courses/${id}/edit`)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 mb-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kursni tahrirlash
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Darslar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{course?.title}</p>
        </div>
        <Button onClick={openCreate}>+ Dars qo'shish</Button>
      </div>

      {lessons.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
          </div>
          <p className="font-medium text-gray-900 dark:text-white mb-1">Hali darslar yo'q</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Birinchi darsni qo'shing va YouTube videosini biriktiring</p>
          <Button onClick={openCreate}>+ Birinchi darsni qo'shish</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <div key={lesson._id} className="card p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                {lesson.videoUrl && (
                  <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                    Video biriktirilgan
                  </p>
                )}
                {lesson.content && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{lesson.content}</p>}
                {lesson.duration > 0 && <p className="text-xs text-gray-400 mt-1">{lesson.duration} daqiqa</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="secondary" onClick={() => openEdit(lesson)}>Tahrirlash</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(lesson._id)}>O'chirish</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Darsni tahrirlash' : "Dars qo'shish"} size="lg">
        <div className="space-y-4">
          <Input label="Dars nomi" value={form.title} onChange={set('title')} required />

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Mazmun</label>
            <textarea
              value={form.content}
              onChange={set('content')}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Dars mazmuni yoki eslatmalar..."
            />
          </div>

          {/* Video URL + preview */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">YouTube Video URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) => { set('videoUrl')(e); setShowPreview(false); }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {form.videoUrl && (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? 'Yopish' : 'Preview'}
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">youtube.com/watch?v=... yoki youtu.be/... formatida kiriting</p>

            {showPreview && embedUrl && (
              <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video preview"
                />
              </div>
            )}
            {showPreview && !embedUrl && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                Noto'g'ri YouTube URL. Tekshirib ko'ring.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Davomiyligi (daqiqa)" type="number" min="0" value={form.duration} onChange={set('duration')} />
            <Input label="Tartib raqami" type="number" min="0" value={form.order} onChange={set('order')} />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setModal(false)}>Bekor qilish</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Darsni yangilash' : 'Dars yaratish'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
