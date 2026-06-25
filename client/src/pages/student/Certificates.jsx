import { useEffect, useState } from 'react';
import { Award, Download, Calendar, CheckCircle2, BookOpen } from 'lucide-react';
import api from '../../api/axios';

const GRADS = [
  'linear-gradient(135deg,#4F46E5,#7C3AED)',
  'linear-gradient(135deg,#06B6D4,#4F46E5)',
  'linear-gradient(135deg,#22C55E,#06B6D4)',
  'linear-gradient(135deg,#F59E0B,#DB2777)',
  'linear-gradient(135deg,#EF4444,#F59E0B)',
];

export default function Certificates() {
  const [certs, setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-courses').then((r) => {
      const completed = (r.data.enrollments || [])
        .filter(e => e.course && e.progress === 100);
      setCerts(completed);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 40, height: 40, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', color: 'var(--text)', margin: 0 }}>Sertifikatlar</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>{certs.length} ta sertifikat qo'lga kiritildi</p>
        </div>
        {certs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 14, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle2 size={18} color="#16A34A" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#16A34A' }}>{certs.length} ta kurs tugatildi</span>
          </div>
        )}
      </div>

      {certs.length === 0 ? (
        <div style={{ borderRadius: 20, padding: '64px 24px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Award size={44} color="var(--text-mute)" style={{ margin: '0 auto 18px', display: 'block' }} />
          <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: 0 }}>Hali sertifikat yo'q</p>
          <p style={{ fontSize: 14.5, color: 'var(--text-soft)', margin: '10px auto 0', maxWidth: 340, lineHeight: 1.6 }}>
            Kursni to'liq tugallagan vaqtda sertifikat avtomatik ravishda beriladi.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 22 }}>
          {certs.map((e, i) => (
            <div key={e._id} style={{ borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              {/* Gradient certificate header */}
              <div style={{ position: 'relative', height: 140, background: GRADS[i % GRADS.length], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.14)', top: -50, right: -50 }} />
                <div style={{ width: 58, height: 58, borderRadius: 16, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={30} color="rgba(255,255,255,0.95)" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Junior LMS · Sertifikat</span>
              </div>

              <div style={{ padding: '20px 20px 18px' }}>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, color: 'var(--text)', margin: 0, lineHeight: 1.35 }}>{e.course.title}</h3>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-soft)' }}>
                    <BookOpen size={14} color="var(--text-mute)" />
                    <span>{e.course.category || 'Kurs'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-soft)' }}>
                    <Calendar size={14} color="var(--text-mute)" />
                    <span>{new Date(e.enrolledAt || Date.now()).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '8px 12px', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <CheckCircle2 size={15} color="#16A34A" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#16A34A' }}>Muvaffaqiyatli tugatildi</span>
                </div>

                <button
                  style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background .2s,color .2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#4F46E5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <Download size={16} /> Yuklab olish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
