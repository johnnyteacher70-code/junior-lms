import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, CheckCircle2, Clock, ArrowRight, Search } from 'lucide-react';
import api from '../../api/axios';

const GRADS = [
  'linear-gradient(135deg,#4F46E5,#7C3AED)',
  'linear-gradient(135deg,#06B6D4,#4F46E5)',
  'linear-gradient(135deg,#F59E0B,#DB2777)',
  'linear-gradient(135deg,#22C55E,#06B6D4)',
  'linear-gradient(135deg,#EF4444,#F59E0B)',
];

const FILTERS = [
  { v: 'all',        l: 'Barchasi' },
  { v: 'notstarted', l: 'Boshlanmagan' },
  { v: 'inprogress', l: 'Jarayonda' },
  { v: 'completed',  l: 'Tugatilgan' },
];

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');

  useEffect(() => {
    api.get('/enrollments/my-courses')
      .then((r) => setEnrollments(r.data.enrollments))
      .finally(() => setLoading(false));
  }, []);

  const valid = enrollments.filter((e) => e.course != null);

  const filtered = valid.filter((e) => {
    const matchFilter =
      filter === 'all'        ||
      (filter === 'inprogress'  && e.progress > 0 && e.progress < 100) ||
      (filter === 'completed'   && e.progress === 100) ||
      (filter === 'notstarted'  && e.progress === 0);
    const matchSearch = search === '' ||
      e.course.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all:        valid.length,
    notstarted: valid.filter(e => e.progress === 0).length,
    inprogress: valid.filter(e => e.progress > 0 && e.progress < 100).length,
    completed:  valid.filter(e => e.progress === 100).length,
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 40, height: 40, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Mening kurslarim</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>Jami {valid.length} ta kurs</p>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: 260 }}>
          <Search size={16} color="var(--text-mute)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kurs qidirish..."
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14, color: 'var(--text)', outline: 'none' }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {FILTERS.map(({ v, l }) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ padding: '8px 16px', borderRadius: 10, border: filter === v ? 'none' : '1px solid var(--border)', background: filter === v ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'var(--surface)', color: filter === v ? '#fff' : 'var(--text-soft)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all .18s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {l}
            <span style={{ padding: '1px 7px', borderRadius: 99, background: filter === v ? 'rgba(255,255,255,0.22)' : 'var(--surface-2)', fontSize: 12, fontWeight: 700, color: filter === v ? '#fff' : 'var(--text-mute)' }}>{counts[v]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ borderRadius: 20, padding: '60px 24px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <BookOpen size={40} color="var(--text-mute)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Bu kategoriyada kurs yo'q</p>
          <p style={{ fontSize: 14, color: 'var(--text-soft)', marginTop: 8 }}>Boshqa filter tanlang yoki yangi kurslarga yoziling</p>
          <Link to="/courses"
            style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Kurslarga ko'z tashlang <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {filtered.map((e, i) => {
            const prog = e.progress;
            const done = prog === 100;
            const grad = GRADS[i % GRADS.length];
            return (
              <Link key={e._id} to={`/student/courses/${e.course._id}`}
                style={{ textDecoration: 'none', borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .2s,box-shadow .2s' }}
                onMouseEnter={(el) => { el.currentTarget.style.transform = 'translateY(-4px)'; el.currentTarget.style.boxShadow = '0 20px 44px rgba(30,27,75,0.12)'; }}
                onMouseLeave={(el) => { el.currentTarget.style.transform = 'none'; el.currentTarget.style.boxShadow = 'var(--shadow)'; }}>

                {/* thumbnail / gradient header */}
                <div style={{ position: 'relative', height: 120, background: e.course.thumbnail ? undefined : grad, overflow: 'hidden' }}>
                  {e.course.thumbnail
                    ? <img src={e.course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <>
                        <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', top: -40, right: -30 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={36} color="rgba(255,255,255,0.85)" />
                        </div>
                      </>
                  }
                  {/* status badge */}
                  <span style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 99, background: done ? 'rgba(34,197,94,0.92)' : 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11.5, fontWeight: 700, backdropFilter: 'blur(6px)' }}>
                    {done ? '✓ Tugatilgan' : `${prog}% bajarildi`}
                  </span>
                </div>

                <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{e.course.category}</span>
                  <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: 'var(--text)', margin: '6px 0 0', lineHeight: 1.35, flex: 1 }}>{e.course.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-soft)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 8, background: grad, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, fontSize: 10, fontWeight: 700 }}>
                      {e.course.instructor?.name?.charAt(0) || 'O'}
                    </span>
                    {e.course.instructor?.name || "O'qituvchi"}
                  </p>

                  {/* progress bar */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--text-soft)', marginBottom: 6 }}>
                      <span>Progress</span>
                      <span style={{ color: done ? '#22C55E' : '#4F46E5' }}>{prog}%</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div style={{ width: `${prog}%`, height: '100%', borderRadius: 99, background: done ? 'linear-gradient(90deg,#22C55E,#06B6D4)' : grad, animation: 'growW 1s ease both' }} />
                    </div>
                  </div>

                  {/* action row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    {done
                      ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#22C55E' }}><CheckCircle2 size={15} /> Tugatilgan</span>
                      : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-soft)' }}><Clock size={14} />{100 - prog}% qoldi</span>
                    }
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#4F46E5' }}>
                      {done ? 'Ko\'rish' : 'Davom etish'} <Play size={13} fill="#4F46E5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
