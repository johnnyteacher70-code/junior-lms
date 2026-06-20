import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function StudentAssignments() {
  const [submissions, setSubmissions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/enrollments/my-submissions'),
      api.get('/enrollments/my-courses'),
    ]).then(async ([subRes, enrRes]) => {
      setSubmissions(subRes.data.submissions);
      const enrs = enrRes.data.enrollments;
      setEnrollments(enrs);
      const asgns = await Promise.all(
        enrs.map((e) => api.get(`/courses/${e.course._id}/assignments`).then((r) => r.data.assignments.map((a) => ({ ...a, courseTitle: e.course.title }))))
      );
      setAllAssignments(asgns.flat());
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error('Iltimos, javobingizni yozing');
    setSubmitting(true);
    try {
      await api.post(`/courses/${submitModal.course}/assignments/${submitModal._id}/submit`, { content });
      toast.success('Topshiriq yuborildi!');
      setSubmitModal(null);
      setContent('');
      const res = await api.get('/enrollments/my-submissions');
      setSubmissions(res.data.submissions);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Yuborishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const submittedIds = submissions.map((s) => s.assignment?._id);
  const pending = allAssignments.filter((a) => !submittedIds.includes(a._id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Topshiriqlar</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Kutilayotgan ({pending.length})</h2>
          <div className="space-y-3">
            {pending.length === 0 ? (
              <div className="card p-6 text-center text-gray-500 dark:text-gray-400 text-sm">Hammasi bajarildi! Kutilayotgan topshiriqlar yo'q.</div>
            ) : pending.map((a) => (
              <div key={a._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{a.courseTitle}</p>
                    <h3 className="font-medium text-gray-900 dark:text-white">{a.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{a.description}</p>
                    {a.dueDate && (
                      <p className="text-xs text-red-500 mt-2">Muddati: {new Date(a.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <Badge color="yellow">{a.points} ball</Badge>
                </div>
                <Button size="sm" className="mt-3 w-full" onClick={() => { setSubmitModal(a); setContent(''); }}>
                  Topshirish
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Yuborilgan ({submissions.length})</h2>
          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="card p-6 text-center text-gray-500 dark:text-gray-400 text-sm">Hali topshiriqlar yuborilmagan.</div>
            ) : submissions.map((s) => (
              <div key={s._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{s.assignment?.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Yuborildi: {new Date(s.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {s.grade !== null ? (
                      <Badge color="green">{s.grade}/{s.assignment?.points}</Badge>
                    ) : (
                      <Badge color="blue">Baho kutilmoqda</Badge>
                    )}
                  </div>
                </div>
                {s.feedback && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Fikr-mulohaza</p>
                    <p className="text-sm text-green-800 dark:text-green-300">{s.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!submitModal} onClose={() => setSubmitModal(null)} title={`Topshirish: ${submitModal?.title}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{submitModal?.description}</p>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Sizning javobingiz</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Bu yerga javobingizni yozing..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setSubmitModal(null)}>Bekor qilish</Button>
            <Button onClick={handleSubmit} loading={submitting}>Topshiriqni yuborish</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
