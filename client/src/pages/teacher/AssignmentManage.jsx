import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment, getSubmissions, gradeSubmission } from '../../api/assignments';
import { getCourse } from '../../api/courses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

const empty = { title: '', description: '', dueDate: '', points: 100 };

export default function AssignmentManage() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [submissionsModal, setSubmissionsModal] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [gradeForm, setGradeForm] = useState({});

  const load = () => {
    Promise.all([getAssignments(id), getCourse(id)]).then(([a, c]) => {
      setAssignments(a.data.assignments);
      setCourse(c.data.course);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (a) => { setEditing(a); setForm({ title: a.title, description: a.description, dueDate: a.dueDate?.slice(0, 10) || '', points: a.points }); setModal(true); };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await updateAssignment(id, editing._id, form); toast.success('Topshiriq yangilandi'); }
      else { await createAssignment(id, form); toast.success('Topshiriq yaratildi'); }
      setModal(false); load();
    } catch { toast.error('Saqlashda xatolik'); } finally { setSaving(false); }
  };

  const handleDelete = async (aId) => {
    if (!confirm('Bu topshiriqni o\'chirasizmi?')) return;
    try { await deleteAssignment(id, aId); setAssignments((prev) => prev.filter((a) => a._id !== aId)); toast.success('O\'chirildi'); }
    catch { toast.error('Xatolik yuz berdi'); }
  };

  const openSubmissions = async (a) => {
    setSubmissionsModal(a);
    const res = await getSubmissions(id, a._id);
    setSubmissions(res.data.submissions);
    setGradeForm({});
  };

  const handleGrade = async (subId) => {
    const { grade, feedback } = gradeForm[subId] || {};
    if (grade === undefined) return toast.error('Ball kiriting');
    try {
      await gradeSubmission(subId, { grade: Number(grade), feedback });
      toast.success('Baholandi!');
      setSubmissions((prev) => prev.map((s) => s._id === subId ? { ...s, grade: Number(grade), feedback } : s));
    } catch { toast.error('Baholashda xatolik'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Topshiriqlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{course?.title}</p>
        </div>
        <Button onClick={openCreate}>+ Topshiriq qo'shish</Button>
      </div>

      {assignments.length === 0 ? (
        <div className="card p-10 text-center"><p className="text-gray-500">Hali topshiriqlar yo'q.</p></div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div key={a._id} className="card p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{a.title}</h3>
                  <Badge color="indigo">{a.points} ball</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{a.description}</p>
                {a.dueDate && <p className="text-xs text-red-500 mt-1">Muddati: {new Date(a.dueDate).toLocaleDateString()}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="secondary" onClick={() => openSubmissions(a)}>Topshirilganlar</Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(a)}>Tahrirlash</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(a._id)}>O'chirish</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Topshiriqni tahrirlash' : 'Topshiriq qo\'shish'} size="lg">
        <div className="space-y-4">
          <Input label="Sarlavha" value={form.title} onChange={set('title')} required />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tavsif</label>
            <textarea value={form.description} onChange={set('description')} rows={4} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Muddati" type="date" value={form.dueDate} onChange={set('dueDate')} />
            <Input label="Ball" type="number" min="0" value={form.points} onChange={set('points')} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModal(false)}>Bekor qilish</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Yangilash' : 'Yaratish'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!submissionsModal} onClose={() => setSubmissionsModal(null)} title={`Topshiriqlar: ${submissionsModal?.title}`} size="xl">
        {submissions.length === 0 ? (
          <p className="text-center text-gray-500 py-6">Hali topshiriqlar yuborilmagan.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {submissions.map((s) => (
              <div key={s._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-medium">{s.student?.name?.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{s.student?.name}</p>
                    <p className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</p>
                  </div>
                  {s.grade !== null && <Badge color="green" className="ml-auto">{s.grade}/{submissionsModal?.points}</Badge>}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">{s.content}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Ball"
                    type="number"
                    min="0"
                    max={submissionsModal?.points}
                    value={gradeForm[s._id]?.grade ?? s.grade ?? ''}
                    onChange={(e) => setGradeForm((f) => ({ ...f, [s._id]: { ...f[s._id], grade: e.target.value } }))}
                  />
                  <Input
                    placeholder="Fikr"
                    value={gradeForm[s._id]?.feedback ?? s.feedback ?? ''}
                    onChange={(e) => setGradeForm((f) => ({ ...f, [s._id]: { ...f[s._id], feedback: e.target.value } }))}
                    className="col-span-1"
                  />
                  <Button size="sm" onClick={() => handleGrade(s._id)}>Bahoni saqlash</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
