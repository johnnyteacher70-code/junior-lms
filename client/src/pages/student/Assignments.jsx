import { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle2, Clock, X, Send, AlarmClock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

function toEmbedUrl(url) {
  if (!url) return null;
  const w = url.match(/[?&]v=([\w-]+)/);
  if (w) return `https://www.youtube.com/embed/${w[1]}`;
  const s = url.match(/youtu\.be\/([\w-]+)/);
  if (s) return `https://www.youtube.com/embed/${s[1]}`;
  return url;
}

/* ── Inline Modal ── */
function SubmitModal({ assignment, onClose, onSubmitted }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error('Iltimos, javobingizni yozing');
    setLoading(true);
    try {
      await api.post(`/courses/${assignment.course}/assignments/${assignment._id}/submit`, { content });
      toast.success('Topshiriq muvaffaqiyatli yuborildi!');
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Yuborishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '100%', maxWidth: 520, borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 30px 70px rgba(0,0,0,0.25)', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: 0 }}>Topshiriq yuborish</h2>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={17} />
          </button>
        </div>

        <div style={{ padding: '12px 16px', borderRadius: 14, background: 'var(--surface-2)', marginBottom: 18 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', margin: 0 }}>{assignment.title}</p>
          {assignment.description && (
            <p style={{ fontSize: 13.5, color: 'var(--text-soft)', margin: '6px 0 0', lineHeight: 1.55 }}>{assignment.description}</p>
          )}
          {assignment.dueDate && (
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#EF4444', fontWeight: 600, marginTop: 8, margin: '8px 0 0' }}>
              <AlarmClock size={14} /> Muddat: {new Date(assignment.dueDate).toLocaleDateString('uz-UZ')}
            </p>
          )}
        </div>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sizning javobingiz</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6}
          placeholder="Bu yerga javobingizni yozing..."
          style={{ width: '100%', padding: '12px 14px', borderRadius: 13, border: '1px solid var(--border)', background: 'var(--surface-2)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: 'var(--text)', outline: 'none', resize: 'vertical', transition: 'border-color .2s', boxSizing: 'border-box' }}
          onFocus={(e) => (e.target.style.borderColor = '#4F46E5')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />

        <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onClose}
            style={{ padding: '11px 22px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Bekor qilish
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: '11px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: loading ? 0.8 : 1, boxShadow: '0 8px 20px rgba(79,70,229,0.32)' }}>
            {loading
              ? <><span style={{ width: 16, height: 16, border: '3px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> Yuborilmoqda...</>
              : <><Send size={15} /> Topshiriqni yuborish</>
            }
          </button>
        </div>
      </div>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function StudentAssignments() {
  const [submissions, setSubmissions]       = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [modal, setModal]                   = useState(null);

  const load = async () => {
    try {
      const [subRes, enrRes] = await Promise.all([
        api.get('/enrollments/my-submissions'),
        api.get('/enrollments/my-courses'),
      ]);
      setSubmissions(subRes.data.submissions || []);
      const enrs = (enrRes.data.enrollments || []).filter(e => e.course);
      const asgns = await Promise.all(
        enrs.map(e =>
          api.get(`/courses/${e.course._id}/assignments`)
            .then(r => r.data.assignments.map(a => ({ ...a, courseTitle: e.course.title, course: e.course._id })))
            .catch(() => [])
        )
      );
      setAllAssignments(asgns.flat());
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submittedIds = submissions.map(s => s.assignment?._id);
  const pending = allAssignments.filter(a => !submittedIds.includes(a._id));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 40, height: 40, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {modal && <SubmitModal assignment={modal} onClose={() => setModal(null)} onSubmitted={load} />}

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Topshiriqlar</h1>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>
          {pending.length} ta kutilayotgan · {submissions.length} ta yuborilgan
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Kutilayotgan', val: pending.length, bg: 'rgba(79,70,229,0.10)', color: '#4F46E5', Icon: ClipboardList },
          { label: 'Yuborilgan',   val: submissions.length, bg: 'rgba(34,197,94,0.10)', color: '#16A34A', Icon: CheckCircle2 },
          { label: 'Baholangan',   val: submissions.filter(s => s.grade != null).length, bg: 'rgba(245,158,11,0.10)', color: '#D97706', Icon: CheckCircle2 },
        ].map(({ label, val, bg, color, Icon }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}><Icon size={18} /></span>
            <div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: 'var(--text)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-soft)', fontWeight: 600, marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24, alignItems: 'start' }}>

        {/* PENDING */}
        <section style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Kutilayotgan</h2>
            <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(79,70,229,0.10)', color: '#4F46E5', fontSize: 12.5, fontWeight: 700 }}>{pending.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {pending.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--text-soft)', fontSize: 14 }}>
                <CheckCircle2 size={32} color="var(--text-mute)" style={{ margin: '0 auto 10px', display: 'block' }} />
                Hammasi bajarildi! Kutilayotgan topshiriqlar yo'q.
              </div>
            ) : pending.map((a, i) => (
              <div key={a._id} style={{ padding: '18px 22px', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{a.courseTitle}</span>
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15.5, color: 'var(--text)', margin: '4px 0 0' }}>{a.title}</h3>
                    {a.description && (
                      <p style={{ fontSize: 13.5, color: 'var(--text-soft)', margin: '5px 0 0', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.description}</p>
                    )}
                    {a.dueDate && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#EF4444', fontWeight: 600, marginTop: 6 }}>
                        <AlarmClock size={13} /> {new Date(a.dueDate).toLocaleDateString('uz-UZ')}
                      </span>
                    )}
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.12)', color: '#D97706', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {a.points} ball
                  </span>
                </div>
                <button onClick={() => setModal(a)}
                  style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 6px 16px rgba(79,70,229,0.28)', transition: 'transform .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                  <Send size={14} /> Topshirish
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SUBMITTED */}
        <section style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Yuborilgan</h2>
            <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(34,197,94,0.10)', color: '#16A34A', fontSize: 12.5, fontWeight: 700 }}>{submissions.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {submissions.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--text-soft)', fontSize: 14 }}>
                <ClipboardList size={32} color="var(--text-mute)" style={{ margin: '0 auto 10px', display: 'block' }} />
                Hali topshiriqlar yuborilmagan.
              </div>
            ) : submissions.map((s, i) => {
              const graded = s.grade != null;
              return (
                <div key={s._id} style={{ padding: '18px 22px', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15.5, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.assignment?.title || 'Topshiriq'}</h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-soft)', margin: '5px 0 0' }}>
                        <Clock size={13} /> {new Date(s.submittedAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <span style={{ padding: '5px 12px', borderRadius: 99, background: graded ? 'rgba(34,197,94,0.12)' : 'rgba(79,70,229,0.10)', color: graded ? '#16A34A' : '#4F46E5', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {graded ? `${s.grade}/${s.assignment?.points || 100}` : 'Baho kutilmoqda'}
                    </span>
                  </div>
                  {s.feedback && (
                    <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mentor fikri</p>
                      <p style={{ fontSize: 13.5, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>{s.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
