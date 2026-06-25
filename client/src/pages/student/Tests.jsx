import { FileCheck2, Zap } from 'lucide-react';

const MOCK = [
  { title: 'HTML & CSS asoslari testi', course: 'Frontend Development', questions: 20, duration: '30 daqiqa', status: 'available', score: null },
  { title: 'JavaScript asoslari testi', course: 'Frontend Development', questions: 25, duration: '40 daqiqa', status: 'done', score: 88 },
  { title: "Python o'zgaruvchilar testi", course: 'Python Dasturlash', questions: 15, duration: '20 daqiqa', status: 'available', score: null },
];

export default function Tests() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', color: 'var(--text)', margin: 0 }}>Testlar</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>Bilimingizni mustahkamlang va tekshiring</p>
        </div>
      </div>

      {/* Coming soon banner */}
      <div style={{ borderRadius: 20, padding: '22px 26px', background: 'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(124,58,237,0.08))', border: '1px solid rgba(79,70,229,0.18)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={22} color="#fff" />
        </span>
        <div>
          <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: 'var(--text)', margin: 0 }}>Test tizimi tez kunda ishga tushadi!</p>
          <p style={{ fontSize: 13.5, color: 'var(--text-soft)', margin: '4px 0 0' }}>Hozircha namuna testlarni ko'rishingiz mumkin.</p>
        </div>
      </div>

      {/* Mock tests */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {MOCK.map((t, i) => (
          <div key={i} style={{ borderRadius: 18, padding: '18px 22px', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: t.status === 'done' ? 'rgba(34,197,94,0.12)' : 'rgba(79,70,229,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileCheck2 size={22} color={t.status === 'done' ? '#16A34A' : '#4F46E5'} />
              </div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15.5, color: 'var(--text)', margin: 0 }}>{t.title}</p>
                <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 13, color: 'var(--text-soft)', flexWrap: 'wrap' }}>
                  <span>{t.course}</span>
                  <span>· {t.questions} savol</span>
                  <span>· {t.duration}</span>
                </div>
              </div>
            </div>
            <div>
              {t.status === 'done'
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', color: '#16A34A', fontWeight: 700, fontSize: 13.5 }}>
                    ✓ Ball: {t.score}/100
                  </span>
                : <button disabled style={{ padding: '9px 20px', borderRadius: 12, border: 'none', background: 'var(--surface-2)', color: 'var(--text-mute)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13.5, cursor: 'not-allowed' }}>
                    Tez kunda
                  </button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
