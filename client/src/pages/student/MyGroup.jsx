import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Send, ExternalLink, RefreshCw, BookOpen, CheckCircle2 } from 'lucide-react';
import { getMyGroup } from '../../api/groups';

export default function StudentMyGroup() {
  const [group, setGroup]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroup = (spinner = true) => {
    if (spinner) setLoading(true);
    return getMyGroup()
      .then(r => setGroup(r.data.group))
      .catch(() => setGroup(null))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => {
    fetchGroup();
    const onFocus = () => fetchGroup(false);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 40, height: 40, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );

  if (!group) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Mening guruhim</h1>
      <div style={{ borderRadius: 24, padding: '64px 24px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Users size={32} color="var(--text-mute)" />
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: 0 }}>Siz hali guruhga biriktirilmagansiz</h3>
        <p style={{ fontSize: 14.5, color: 'var(--text-soft)', margin: '10px auto 0', maxWidth: 360, lineHeight: 1.6 }}>
          Admin sizni guruhga qo'shgandan keyin bu yerda guruh ma'lumotlari ko'rinadi.
        </p>
      </div>
    </div>
  );

  const initials = group.name.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 780 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>Mening guruhim</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)', margin: '4px 0 0' }}>{group.students.length} ta a'zo</p>
        </div>
        <button onClick={() => { setRefreshing(true); fetchGroup(false); }} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-soft)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, cursor: refreshing ? 'not-allowed' : 'pointer' }}>
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin .8s linear infinite' : 'none' }} />
          Yangilash
        </button>
      </div>

      {/* Group card */}
      <section style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        {/* Gradient top bar */}
        <div style={{ height: 120, background: 'radial-gradient(500px 200px at 80% 50%,rgba(124,58,237,0.4),transparent 70%),linear-gradient(135deg,#4F46E5,#7C3AED)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 28px 0' }}>
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', top: -60, right: -40 }} />
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, color: '#fff', transform: 'translateY(32px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            {initials}
          </div>
          <div style={{ marginLeft: 16, paddingBottom: 12, transform: 'translateY(0)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 99, background: group.status === 'active' ? 'rgba(34,197,94,0.9)' : 'rgba(100,116,139,0.9)', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: group.status === 'active' ? 'pulseDot 1.6s infinite' : 'none' }} />
              {group.status === 'active' ? 'Faol' : 'Nofaol'}
            </div>
            <style>{'@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.4}}'}</style>
          </div>
        </div>

        <div style={{ padding: '44px 28px 28px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: 'var(--text)', margin: 0 }}>{group.name}</h2>
          {group.description && (
            <p style={{ fontSize: 14.5, color: 'var(--text-soft)', margin: '8px 0 0', lineHeight: 1.6 }}>{group.description}</p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 22 }}>
            {/* Telegram */}
            {group.telegramLink ? (
              <a href={group.telegramLink} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 16, background: 'rgba(0,136,204,0.08)', border: '1px solid rgba(0,136,204,0.2)', textDecoration: 'none', transition: 'background .2s', flex: 1, minWidth: 200 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,136,204,0.14)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,136,204,0.08)')}>
                <span style={{ width: 42, height: 42, borderRadius: 12, background: '#29A8E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Send size={18} color="#fff" />
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#29A8E0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Telegram guruh</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14.5, color: 'var(--text)', marginTop: 2 }}>Guruhga qo'shiling</div>
                </div>
                <ExternalLink size={16} color="var(--text-mute)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </a>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 16, background: 'var(--surface-2)', border: '1px solid var(--border)', flex: 1, minWidth: 200 }}>
                <span style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Send size={18} color="var(--text-mute)" />
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Telegram guruh</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-soft)', marginTop: 2 }}>Havola hali qo'shilmagan</div>
                </div>
              </div>
            )}

            {/* Course */}
            {group.course && (
              <Link to={`/student/courses/${group.course._id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 16, background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.18)', textDecoration: 'none', flex: 1, minWidth: 200, transition: 'background .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(79,70,229,0.14)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(79,70,229,0.08)')}>
                <span style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={18} color="#fff" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Onlayn kurs</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14.5, color: 'var(--text)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.course.title}</div>
                </div>
                <ExternalLink size={16} color="#4F46E5" style={{ flexShrink: 0 }} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Teacher */}
      {group.teacher && (
        <section style={{ borderRadius: 20, padding: 22, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, color: 'var(--text)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={18} color="#4F46E5" /> O'qituvchi
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, background: 'var(--surface-2)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
              {group.teacher.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{group.teacher.name}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-soft)', marginTop: 2 }}>{group.teacher.email}</div>
            </div>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, background: 'rgba(79,70,229,0.10)', color: '#4F46E5', fontSize: 12.5, fontWeight: 700 }}>
              <CheckCircle2 size={13} /> O'qituvchi
            </span>
          </div>
        </section>
      )}

      {/* Members */}
      <section style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, color: 'var(--text)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={17} color="#4F46E5" /> Guruh a'zolari
          </h2>
          <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(79,70,229,0.10)', color: '#4F46E5', fontSize: 12.5, fontWeight: 700 }}>{group.students.length}</span>
        </div>
        <div style={{ padding: '8px 12px' }}>
          {group.students.map((s, i) => (
            <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 12, transition: 'background .18s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: 'var(--text)', flexShrink: 0 }}>
                {s.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      </section>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}
