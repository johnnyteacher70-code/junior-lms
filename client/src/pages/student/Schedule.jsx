import { CalendarDays, Clock, User, Video } from 'lucide-react';

const DAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const UPCOMING = [
  { day: '25', month: 'Iyun', weekday: 'Chorshanba', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', title: 'React Hooks chuqur tahlil', time: '14:00 – 15:30', mentor: 'Sardor Aliyev', course: 'Frontend Development' },
  { day: '26', month: 'Iyun', weekday: 'Payshanba',  grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)', title: 'Async / Await amaliyot',    time: '16:30 – 18:00', mentor: 'Kamola Saidova', course: 'JavaScript Advanced' },
  { day: '28', month: 'Iyun', weekday: 'Shanba',     grad: 'linear-gradient(135deg,#22C55E,#06B6D4)', title: 'Flutter Navigation',         time: '11:00 – 12:30', mentor: 'Bekzod Tursunov', course: 'Flutter Development' },
];

function buildCalendar() {
  const year = 2026, month = 5;
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 25, lessonDays = [25, 26, 28];
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    let bg = 'transparent', color = 'var(--text)', isToday = d === today, hasLesson = lessonDays.includes(d);
    if (isToday) { bg = 'linear-gradient(135deg,#4F46E5,#7C3AED)'; color = '#fff'; }
    else if (hasLesson) { bg = 'rgba(79,70,229,0.12)'; color = '#4F46E5'; }
    cells.push({ d, bg, color, isToday, hasLesson });
  }
  return cells;
}

export default function Schedule() {
  const calendar = buildCalendar();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', color: 'var(--text)', margin: 0 }}>Jadval</h1>
        <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>Iyun 2026 · Yaqin darslar</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, alignItems: 'start' }}>

        {/* Calendar */}
        <section style={{ borderRadius: 20, padding: 22, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: '0 0 18px' }}>Iyun 2026</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
            {DAYS.map(w => (
              <div key={w} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-mute)', paddingBottom: 8 }}>{w}</div>
            ))}
            {calendar.map((c, i) => (
              <div key={i} style={{ aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, fontSize: 13, fontWeight: c ? 600 : 400, color: c ? c.color : 'transparent', background: c ? c.bg : 'transparent', position: 'relative', cursor: c?.hasLesson ? 'pointer' : 'default' }}>
                {c ? c.d : ''}
                {c?.hasLesson && !c.isToday && (
                  <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: '50%', background: '#4F46E5' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            {[['#4F46E5', 'Dars', 'rgba(79,70,229,0.12)'], ['#fff', 'Bugun', 'linear-gradient(135deg,#4F46E5,#7C3AED)']].map(([color, label, bg]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-soft)', fontWeight: 600 }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, background: bg, display: 'inline-block' }} />{label}
              </span>
            ))}
          </div>
        </section>

        {/* Upcoming lessons */}
        <section style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarDays size={18} color="#4F46E5" />
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, color: 'var(--text)', margin: 0 }}>Yaqin darslar</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {UPCOMING.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '16px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ width: 52, textAlign: 'center', borderRadius: 14, padding: '10px 0', background: l.grad, color: '#fff', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{l.day}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginTop: 3 }}>{l.month}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-mute)', fontWeight: 600 }}>{l.weekday} · {l.course}</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: 'var(--text)', marginTop: 4, lineHeight: 1.3 }}>{l.title}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 7, fontSize: 12.5, color: 'var(--text-soft)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} />{l.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={13} />{l.mentor}</span>
                  </div>
                </div>
                <button title="Qo'shilish"
                  style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform .2s', alignSelf: 'center' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                  <Video size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
