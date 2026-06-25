import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, BookOpen, Clock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

function toEmbedUrl(url) {
  if (!url) return null;
  const w = url.match(/[?&]v=([\w-]+)/);
  if (w) return `https://www.youtube.com/embed/${w[1]}`;
  const s = url.match(/youtu\.be\/([\w-]+)/);
  if (s) return `https://www.youtube.com/embed/${s[1]}`;
  const sh = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (sh) return `https://www.youtube.com/embed/${sh[1]}`;
  return url;
}

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse]         = useState(null);
  const [lessons, setLessons]       = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [marking, setMarking]       = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [listOpen, setListOpen]     = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/lessons`),
      api.get(`/enrollments/${id}/check`),
    ]).then(([c, l, e]) => {
      setCourse(c.data.course);
      setLessons(l.data.lessons);
      setEnrollment(e.data.enrollment);
      if (l.data.lessons.length > 0) {
        setActiveLesson(l.data.lessons[0]);
        setVideoLoading(!!l.data.lessons[0]?.videoUrl);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const selectLesson = (lesson) => {
    setActiveLesson(lesson);
    setVideoLoading(!!lesson.videoUrl);
    setListOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markComplete = async () => {
    if (!activeLesson || !enrollment) return;
    setMarking(true);
    try {
      const res = await api.patch(`/enrollments/${id}/progress`, { lessonId: activeLesson._id });
      setEnrollment(res.data.enrollment);
      toast.success('Dars tugatildi!');
    } catch {
      toast.error("Rivojlanishni yangilashda xatolik");
    } finally {
      setMarking(false);
    }
  };

  const activeIdx   = lessons.findIndex(l => l._id === activeLesson?._id);
  const isCompleted = enrollment?.completedLessons?.includes(activeLesson?._id);
  const embedUrl    = toEmbedUrl(activeLesson?.videoUrl);
  const completedCount = lessons.filter(l => enrollment?.completedLessons?.includes(l._id)).length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 40, height: 40, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );

  if (!course) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-soft)' }}>
      <BookOpen size={40} color="var(--text-mute)" style={{ margin: '0 auto 12px', display: 'block' }} />
      <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Kurs topilmadi</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Course header */}
        <div style={{ borderRadius: 20, padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(18px,2.2vw,24px)', color: 'var(--text)', margin: 0 }}>{course.title}</h1>
          {enrollment && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-soft)', marginBottom: 8 }}>
                <span>{completedCount} / {lessons.length} dars tugallangan</span>
                <span style={{ color: '#4F46E5' }}>{enrollment.progress}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
                <div style={{ width: `${enrollment.progress}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#4F46E5,#7C3AED)', animation: 'growW .8s ease both', transition: 'width .5s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile lesson list toggle */}
        <button onClick={() => setListOpen(v => !v)}
          style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14 }}
          className="cv-mobile-toggle">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={16} color="#4F46E5" /> Kurs tarkibi ({lessons.length} dars)</span>
          <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{listOpen ? '▲' : '▼'}</span>
        </button>
        <style>{`
          @keyframes growW { from{width:0} }
          @media(max-width:860px){ .cv-mobile-toggle{display:flex !important;} .cv-lesson-panel{position:relative !important;width:100% !important;} }
        `}</style>

        {/* Video player */}
        {activeLesson ? (
          <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            {embedUrl ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                {videoLoading && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
                    <div style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                  </div>
                )}
                <iframe src={embedUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  allowFullScreen title={activeLesson.title} onLoad={() => setVideoLoading(false)} />
              </div>
            ) : (
              <div style={{ paddingTop: '56.25%', position: 'relative', background: 'linear-gradient(135deg,#0F172A,#1E1B4B)' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                  <PlayCircle size={56} color="rgba(255,255,255,0.18)" />
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Bu darsda video mavjud emas</p>
                </div>
              </div>
            )}

            {/* Lesson info */}
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: 99, background: 'var(--surface-2)', fontSize: 12.5, fontWeight: 600, color: 'var(--text-soft)' }}>
                  {activeIdx + 1} / {lessons.length}
                </span>
                {isCompleted && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', fontSize: 12.5, fontWeight: 700, color: '#16A34A' }}>
                    <Check size={13} /> Tugatilgan
                  </span>
                )}
                {activeLesson.duration > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-mute)', fontWeight: 600, marginLeft: 'auto' }}>
                    <Clock size={13} /> {activeLesson.duration} daqiqa
                  </span>
                )}
              </div>

              <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(16px,1.8vw,20px)', color: 'var(--text)', margin: 0 }}>{activeLesson.title}</h2>
              {activeLesson.content && (
                <p style={{ fontSize: 14.5, color: 'var(--text-soft)', margin: '10px 0 0', lineHeight: 1.65 }}>{activeLesson.content}</p>
              )}

              {/* nav + complete */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <NavBtn onClick={() => { const i = activeIdx; if (i > 0) selectLesson(lessons[i - 1]); }} disabled={activeIdx === 0}>
                    <ChevronLeft size={17} /> Oldingi
                  </NavBtn>
                  <NavBtn onClick={() => { const i = activeIdx; if (i < lessons.length - 1) selectLesson(lessons[i + 1]); }} disabled={activeIdx === lessons.length - 1}>
                    Keyingi <ChevronRight size={17} />
                  </NavBtn>
                </div>
                {enrollment && (
                  <button onClick={markComplete} disabled={isCompleted || marking}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, border: 'none', cursor: isCompleted ? 'default' : 'pointer', background: isCompleted ? 'rgba(34,197,94,0.12)' : 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: isCompleted ? '#16A34A' : '#fff', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, boxShadow: isCompleted ? 'none' : '0 6px 16px rgba(79,70,229,0.28)', transition: 'transform .2s', opacity: marking ? 0.7 : 1 }}
                    onMouseEnter={(e) => { if (!isCompleted) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                    {marking
                      ? <><span style={{ width: 15, height: 15, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> Saqlanmoqda...</>
                      : isCompleted
                        ? <><CheckCircle2 size={16} /> Tugatilgan</>
                        : <><Check size={16} /> Tugatildi deb belgilash</>
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: 20, padding: '60px 24px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-soft)' }}>
            <BookOpen size={36} color="var(--text-mute)" style={{ margin: '0 auto 12px', display: 'block' }} />
            Hali darslar mavjud emas.
          </div>
        )}
      </div>

      {/* ── LESSON LIST ── */}
      <div className="cv-lesson-panel" style={{ width: 290, flexShrink: 0, position: 'sticky', top: 0 }}>
        {(listOpen || true) && (
          <div style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: 'var(--text)', margin: 0 }}>Kurs tarkibi</h3>
              <span style={{ padding: '3px 9px', borderRadius: 99, background: 'rgba(79,70,229,0.10)', color: '#4F46E5', fontSize: 12, fontWeight: 700 }}>{lessons.length} dars</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 10px', maxHeight: '65vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {lessons.map((lesson, i) => {
                const done   = enrollment?.completedLessons?.includes(lesson._id);
                const active = activeLesson?._id === lesson._id;
                return (
                  <li key={lesson._id}>
                    <button onClick={() => selectLesson(lesson)}
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: active ? 'rgba(79,70,229,0.10)' : 'transparent', transition: 'background .18s' }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'rgba(34,197,94,0.9)' : active ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'var(--surface-2)', color: (done || active) ? '#fff' : 'var(--text-mute)', fontSize: 11, fontWeight: 700 }}>
                        {done ? <Check size={14} /> : i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: active ? 700 : 600, color: active ? '#4F46E5' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{lesson.title}</div>
                        {lesson.duration > 0 && (
                          <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{lesson.duration} daq</div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 11, border: '1px solid var(--border)', background: 'var(--surface-2)', color: disabled ? 'var(--text-mute)' : 'var(--text)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13.5, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'background .18s' }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'var(--surface-3)'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = 'var(--surface-2)'; }}>
      {children}
    </button>
  );
}
