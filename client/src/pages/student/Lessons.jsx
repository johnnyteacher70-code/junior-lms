import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import api from '../../api/axios';

const GRADS = [
  'linear-gradient(135deg,#4F46E5,#7C3AED)',
  'linear-gradient(135deg,#06B6D4,#4F46E5)',
  'linear-gradient(135deg,#F59E0B,#DB2777)',
  'linear-gradient(135deg,#22C55E,#06B6D4)',
  'linear-gradient(135deg,#EF4444,#F59E0B)',
];

export default function Lessons() {
  const [data, setData]     = useState([]); // [{course, lessons, enrollment}]
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // active course _id filter

  useEffect(() => {
    api.get('/enrollments/my-courses').then(async (r) => {
      const enrs = (r.data.enrollments || []).filter(e => e.course);
      const rows = await Promise.all(enrs.map(async (e, i) => {
        try {
          const lr = await api.get(`/courses/${e.course._id}/lessons`);
          return {
            course: e.course,
            enrollment: e,
            lessons: lr.data.lessons || [],
            grad: GRADS[i % GRADS.length],
          };
        } catch { return null; }
      }));
      const valid = rows.filter(Boolean).filter(r => r.lessons.length > 0);
      setData(valid);
      if (valid.length) setActive(valid[0].course._id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 40, height: 40, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );

  if (!data.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', color: 'var(--text)', margin: 0 }}>Darslar</h1>
      <div style={{ borderRadius: 20, padding: '60px 24px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <PlayCircle size={40} color="var(--text-mute)" style={{ margin: '0 auto 16px', display: 'block' }} />
        <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Hali darslar yo'q</p>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '8px 0 0' }}>Avval kurslarga yozilib, darslarni boshlang</p>
        <Link to="/courses" style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Kurslarga o'tish
        </Link>
      </div>
    </div>
  );

  const current = data.find(d => d.course._id === active) || data[0];
  const completedIds = current?.enrollment?.completedLessons || [];
  const doneCount = current ? current.lessons.filter(l => completedIds.includes(l._id)).length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', color: 'var(--text)', margin: 0 }}>Darslar</h1>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>
          {data.reduce((s, d) => s + d.lessons.length, 0)} ta dars · {data.length} ta kurs
        </p>
      </div>

      {/* Course tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {data.map((d) => (
          <button key={d.course._id} onClick={() => setActive(d.course._id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 12, border: active === d.course._id ? 'none' : '1px solid var(--border)', background: active === d.course._id ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'var(--surface)', color: active === d.course._id ? '#fff' : 'var(--text-soft)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all .18s' }}>
            <BookOpen size={14} />
            <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.course.title}</span>
            <span style={{ padding: '1px 7px', borderRadius: 99, background: active === d.course._id ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)', fontSize: 11.5, fontWeight: 700 }}>{d.lessons.length}</span>
          </button>
        ))}
      </div>

      {/* Selected course lessons */}
      {current && (
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Progress card */}
          <div style={{ borderRadius: 20, padding: 22, background: current.grad, minWidth: 220, maxWidth: 280, flex: '0 0 auto', boxShadow: '0 16px 36px rgba(79,70,229,0.28)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.14)', top: -40, right: -40 }} />
            <div style={{ position: 'relative' }}>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600, margin: 0 }}>Joriy kurs</p>
              <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: '#fff', margin: '6px 0 0', lineHeight: 1.3 }}>{current.course.title}</h3>
              <div style={{ marginTop: 16, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.22)' }}>
                <div style={{ width: `${current.enrollment.progress}%`, height: '100%', borderRadius: 99, background: '#fff', animation: 'growW .8s ease both', transition: 'width .5s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                <span>{doneCount} / {current.lessons.length} dars</span>
                <span>{current.enrollment.progress}%</span>
              </div>
              <style>{'@keyframes growW{from{width:0}}'}</style>
            </div>
          </div>

          {/* Lessons list */}
          <div style={{ flex: 1, minWidth: 260, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, color: 'var(--text)', margin: 0 }}>Darslar ro'yxati</h2>
              <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(79,70,229,0.10)', color: '#4F46E5', fontSize: 12.5, fontWeight: 700 }}>{current.lessons.length} ta</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {current.lessons.map((lesson, i) => {
                const done = completedIds.includes(lesson._id);
                return (
                  <Link key={lesson._id} to={`/student/courses/${current.course._id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border)', textDecoration: 'none', transition: 'background .18s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'rgba(34,197,94,0.12)' : 'var(--surface-2)', color: done ? '#16A34A' : '#4F46E5' }}>
                      {done ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-mute)', marginTop: 3 }}>
                        <span>{i + 1}-dars</span>
                        {lesson.duration > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{lesson.duration} daq</span>}
                      </div>
                    </div>
                    {done
                      ? <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', flexShrink: 0 }}>Tugatilgan</span>
                      : <span style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>Ko'rish →</span>
                    }
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
