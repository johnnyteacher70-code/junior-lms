import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap, LayoutGrid, BookOpen, PlayCircle, ClipboardList,
  FileCheck2, Award, CalendarDays, MessageSquare, User, Settings,
  LifeBuoy, LogOut, Search, Moon, Sun, Bell, Menu, X, Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ── shared CSS variables (same as Dashboard) ── */
export const THEME_VARS = `
  :root {
    --bg:#F8FAFC; --surface:#ffffff; --surface-2:#F1F5F9; --surface-3:#EEF2F7;
    --text:#0F172A; --text-soft:#64748B; --text-mute:#94A3B8;
    --border:rgba(15,23,42,0.08); --sidebar:#ffffff;
    --shadow:0 12px 34px rgba(30,27,75,0.06);
  }
  [data-theme="dark"] {
    --bg:#0B1120; --surface:#141d31; --surface-2:#1b2641; --surface-3:#233052;
    --text:#F1F5F9; --text-soft:#94A3B8; --text-mute:#64748B;
    --border:rgba(255,255,255,0.09); --sidebar:#0f1729;
    --shadow:0 12px 34px rgba(0,0,0,0.35);
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes growW  { from{width:0} }
  .ds-scroll::-webkit-scrollbar { width:6px; height:6px; }
  .ds-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:6px; }
`;

const SHELL_MEDIA = `
  .ds-mobile-only  { display:none !important; }
  .ds-desktop-only { display:flex !important; }
  @media (min-width:921px) {
    .ds-sidebar { position:sticky !important; top:0; transform:none !important; flex-shrink:0; }
    .ds-bottom-nav { display:none !important; }
  }
  @media (max-width:920px) {
    .ds-sidebar { position:fixed !important; transform:translateX(-110%); }
    .ds-sidebar.is-open { transform:translateX(0) !important; }
    .ds-mobile-only  { display:flex !important; }
    .ds-desktop-only { display:none !important; }
    .ds-bottom-nav   { display:flex !important; }
    .ds-shell-content { padding-bottom:80px !important; }
  }
`;

function getActiveLabel(path) {
  if (path === '/student')                     return 'Dashboard';
  if (path.startsWith('/student/assignments')) return 'Topshiriqlar';
  if (path.startsWith('/student/group'))       return 'Guruhim';
  if (path.startsWith('/student/profile'))     return 'Sozlamalar';
  if (path.startsWith('/student/courses'))     return 'Mening kurslarim';
  return 'Dashboard';
}

const MENU = [
  { label: 'Dashboard',        Icon: LayoutGrid,    to: '/student' },
  { label: 'Mening kurslarim', Icon: BookOpen,      to: '/student/courses' },
  { label: 'Darslar',          Icon: PlayCircle,    to: '/student/courses' },
  { label: 'Topshiriqlar',     Icon: ClipboardList, to: '/student/assignments' },
  { label: 'Testlar',          Icon: FileCheck2,    to: '/student/courses' },
  { label: 'Sertifikatlar',    Icon: Award,         to: '/student/courses' },
  { label: 'Jadval',           Icon: CalendarDays,  to: '/student/courses' },
  { label: 'Xabarlar',        Icon: MessageSquare, to: '/student/courses', badge: 3 },
  { label: 'Guruhim',          Icon: User,          to: '/student/group' },
  { label: 'Sozlamalar',       Icon: Settings,      to: '/student/profile' },
];

const BOTTOM_NAV = [
  { label: 'Asosiy',    Icon: LayoutGrid,    to: '/student' },
  { label: 'Kurslar',   Icon: BookOpen,      to: '/student/courses' },
  { label: 'Topshiriq', Icon: ClipboardList, to: '/student/assignments' },
  { label: 'Xabarlar',  Icon: MessageSquare, to: '/student/courses' },
  { label: 'Profil',    Icon: User,          to: '/student/profile' },
];

/* ═══════════════════════════════════════════════════════════ */
export default function StudentShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    () => localStorage.getItem('ds-theme') || 'light'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDark = theme === 'dark';
  const activeLabel = getActiveLabel(location.pathname);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('ds-theme', next);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  return (
    <div data-theme={theme}
      style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: 'var(--text)', WebkitFontSmoothing: 'antialiased' }}>
      <style>{THEME_VARS}{SHELL_MEDIA}</style>

      {/* overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 75, background: 'rgba(2,6,23,0.5)', backdropFilter: 'blur(2px)' }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`ds-sidebar${sidebarOpen ? ' is-open' : ''}`}
        style={{ width: 264, height: '100vh', background: 'var(--sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '22px 16px', top: 0, left: 0, zIndex: 80, transition: 'transform .3s ease', overflowY: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 8px 0', flexShrink: 0 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(79,70,229,0.35)', flexShrink: 0 }}>
            <GraduationCap size={21} />
          </span>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Junior<span style={{ color: '#7C3AED' }}>LMS</span>
          </span>
          <button className="ds-mobile-only" onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--text)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        <nav className="ds-scroll" style={{ flex: 1, marginTop: 26, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {MENU.map((m) => {
            const active = m.label === activeLabel;
            return (
              <Link key={m.label} to={m.to} onClick={() => setSidebarOpen(false)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14.5, color: active ? '#4F46E5' : 'var(--text-soft)', background: active ? 'rgba(79,70,229,0.10)' : 'transparent', transition: 'background .18s,color .18s' }}>
                <span style={{ position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)', width: 4, height: 22, borderRadius: '0 4px 4px 0', background: active ? 'linear-gradient(180deg,#4F46E5,#7C3AED)' : 'transparent' }} />
                <m.Icon size={19} />
                <span style={{ flex: 1 }}>{m.label}</span>
                {m.badge > 0 && (
                  <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 99, background: active ? '#4F46E5' : (m.label === 'Xabarlar' ? '#EF4444' : 'var(--surface-3)'), color: (active || m.label === 'Xabarlar') ? '#fff' : 'var(--text-soft)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14.5, color: 'var(--text-soft)' }}>
            <LifeBuoy size={19} /> Yordam markazi
          </a>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14.5, color: '#EF4444', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
            <LogOut size={19} /> Chiqish
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* HEADER */}
        <header style={{ flexShrink: 0, zIndex: 40, backdropFilter: 'saturate(180%) blur(16px)', WebkitBackdropFilter: 'saturate(180%) blur(16px)', background: isDark ? 'rgba(20,29,49,0.95)' : 'rgba(255,255,255,0.95)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px' }}>
            <button className="ds-mobile-only" onClick={() => setSidebarOpen(true)}
              style={{ alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text)', flexShrink: 0 }}>
              <Menu size={20} />
            </button>

            <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
              <Search size={18} color="var(--text-mute)" style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Kurs yoki dars qidiring..."
                style={{ width: '100%', padding: '11px 14px 11px 44px', borderRadius: 13, border: '1px solid var(--border)', background: 'var(--surface-2)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: 'var(--text)', outline: 'none' }} />
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconBtn onClick={toggleTheme} title="Tema">
                {isDark ? <Sun size={19} /> : <Moon size={19} />}
              </IconBtn>
              <IconBtn style={{ position: 'relative' }}>
                <Bell size={19} />
                <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#06B6D4', border: '2px solid var(--surface)' }} />
              </IconBtn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '5px 8px 5px 5px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials}</span>
                <div className="ds-desktop-only" style={{ flexDirection: 'column', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap' }}>{user?.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#7C3AED', fontWeight: 700 }}><Zap size={12} /> Student</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="ds-scroll ds-shell-content"
          style={{ flex: 1, overflowY: 'auto', padding: '26px 24px 30px', animation: 'fadeUp .4s ease both' }}>
          {children}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="ds-bottom-nav"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70, display: 'none', alignItems: 'center', justifyContent: 'space-around', padding: '9px 8px', background: isDark ? 'rgba(15,23,49,0.96)' : 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        {BOTTOM_NAV.map((b) => {
          const active = location.pathname === b.to || (b.to !== '/student' && location.pathname.startsWith(b.to));
          return (
            <Link key={b.label} to={b.to}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 6, textDecoration: 'none', color: active ? '#4F46E5' : 'var(--text-mute)', fontSize: 11, fontWeight: 700 }}>
              <b.Icon size={22} />{b.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function IconBtn({ children, onClick, title, style: extra = {} }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width: 42, height: 42, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', position: 'relative', flexShrink: 0, ...extra }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}>
      {children}
    </button>
  );
}
