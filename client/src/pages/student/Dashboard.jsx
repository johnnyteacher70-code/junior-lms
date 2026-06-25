import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap, LayoutGrid, BookOpen, PlayCircle, ClipboardList,
  FileCheck2, Award, CalendarDays, MessageSquare, User, Settings,
  LifeBuoy, LogOut, Search, Moon, Sun, Bell, Menu, X,
  TrendingUp, Target, CheckCircle2, ArrowRight, Play,
  Clock, ChevronLeft, ChevronRight, Download, Zap, Video,
  PlusCircle, AlarmClock, CalendarCheck, Lock, Rocket, Crown,
  Flame, Star, Braces, Smartphone, Layout,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import { getMySubmissions } from '../../api/assignments';

/* ── CSS variable themes ── */
const THEME_VARS = `
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
  @keyframes growBar{ from{height:0} }
  .ds-scroll::-webkit-scrollbar { width:6px; height:6px; }
  .ds-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:6px; }
`;

/* ── static data ── */
const WEEK_CHART = [
  { day: 'Du', a: 55, b: 18 }, { day: 'Se', a: 70, b: 25 },
  { day: 'Cho', a: 40, b: 30 }, { day: 'Pa', a: 85, b: 22 },
  { day: 'Ju', a: 60, b: 35 }, { day: 'Sha', a: 30, b: 15 },
  { day: 'Yak', a: 50, b: 20 },
];
const TODAY_IDX = 3;

const UPCOMING = [
  { day: '25', month: 'Iyun', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', title: 'React Hooks chuqur tahlil', time: '14:00', mentor: 'Sardor A.' },
  { day: '26', month: 'Iyun', grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)', title: 'Async / Await amaliyot',    time: '16:30', mentor: 'Kamola S.' },
  { day: '28', month: 'Iyun', grad: 'linear-gradient(135deg,#22C55E,#06B6D4)', title: 'Flutter Navigation',         time: '11:00', mentor: 'Bekzod T.' },
];

const NOTIFS = [
  { title: 'Yangi dars qo\'shildi: "React Router"', time: '10 daqiqa oldin', Icon: PlusCircle, bg: 'rgba(79,70,229,0.12)',  color: '#4F46E5' },
  { title: 'Topshiriq muddati yaqinlashmoqda',      time: '2 soat oldin',    Icon: AlarmClock,  bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
  { title: 'Sertifikatingiz tayyor 🎉',              time: 'Kecha',           Icon: Award,       bg: 'rgba(34,197,94,0.12)', color: '#16A34A' },
];

const ACHIEVEMENTS_RAW = [
  { label: 'Birinchi kurs',     note: 'Ochilgan',    Icon: Rocket,        unlocked: true,  grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)' },
  { label: 'Top o\'quvchi',    note: 'Ochilgan',    Icon: Crown,         unlocked: true,  grad: 'linear-gradient(135deg,#F59E0B,#DB2777)' },
  { label: '7 kunlik faollik',  note: 'Ochilgan',    Icon: Flame,         unlocked: true,  grad: 'linear-gradient(135deg,#EF4444,#F59E0B)' },
  { label: '30 kunlik faollik', note: '18 / 30 kun', Icon: CalendarCheck, unlocked: false },
  { label: 'Mukammal natija',   note: 'Qulflangan',  Icon: Star,          unlocked: false },
];

const COURSE_GRADS = [
  'linear-gradient(135deg,#4F46E5,#7C3AED)',
  'linear-gradient(135deg,#F59E0B,#DB2777)',
  'linear-gradient(135deg,#06B6D4,#4F46E5)',
  'linear-gradient(135deg,#22C55E,#06B6D4)',
  'linear-gradient(135deg,#EF4444,#F59E0B)',
];
const COURSE_ICONS = [Layout, Braces, Smartphone, BookOpen, Target];

/* ── calendar ── */
function buildCalendar() {
  const year = 2026, month = 5;
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 25, lessonDays = [25, 26, 28], deadlineDays = [24, 27];
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    let bg = 'transparent', color = 'var(--text)', border = '1px solid transparent';
    if (d === today)                  { bg = 'linear-gradient(135deg,#4F46E5,#7C3AED)'; color = '#fff'; }
    else if (lessonDays.includes(d))  { bg = 'rgba(79,70,229,0.12)'; color = '#4F46E5'; }
    else if (deadlineDays.includes(d)){ bg = 'rgba(239,68,68,0.12)'; color = '#EF4444'; }
    cells.push({ d, bg, color, border });
  }
  return cells;
}

/* ── active menu label by current path ── */
function getActiveLabel(path) {
  if (path === '/student')                      return 'Dashboard';
  if (path.startsWith('/student/lessons'))      return 'Darslar';
  if (path.startsWith('/student/assignments'))  return 'Topshiriqlar';
  if (path.startsWith('/student/tests'))        return 'Testlar';
  if (path.startsWith('/student/certificates')) return 'Sertifikatlar';
  if (path.startsWith('/student/schedule'))     return 'Jadval';
  if (path.startsWith('/student/messages'))     return 'Xabarlar';
  if (path.startsWith('/student/group'))        return 'Guruhim';
  if (path.startsWith('/student/profile'))      return 'Sozlamalar';
  if (path.startsWith('/student/courses'))      return 'Mening kurslarim';
  return 'Dashboard';
}

/* ═══════════════════════════════════════════════════════════ */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/enrollments/my-courses'),
      getMySubmissions(),
    ]).then(([e, s]) => {
      setEnrollments(e.data.enrollments || []);
      setSubmissions(s.data.submissions || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const isDark = theme === 'dark';
  const activeLabel = getActiveLabel(location.pathname);

  const valid       = enrollments.filter((e) => e.course != null);
  const inProgress  = valid.filter((e) => e.progress > 0 && e.progress < 100);
  const completed   = valid.filter((e) => e.progress === 100);
  const avgProgress = valid.length
    ? Math.round(valid.reduce((s, e) => s + e.progress, 0) / valid.length)
    : 0;

  /* ── sidebar menu ── */
  const MENU = [
    { label: 'Dashboard',         Icon: LayoutGrid,    to: '/student' },
    { label: 'Mening kurslarim',  Icon: BookOpen,      to: '/student/courses' },
    { label: 'Darslar',           Icon: PlayCircle,    to: '/student/lessons' },
    { label: 'Topshiriqlar',      Icon: ClipboardList, to: '/student/assignments', badge: submissions.filter(s => !s.grade).length || null },
    { label: 'Testlar',           Icon: FileCheck2,    to: '/student/tests' },
    { label: 'Sertifikatlar',     Icon: Award,         to: '/student/certificates' },
    { label: 'Jadval',            Icon: CalendarDays,  to: '/student/schedule' },
    { label: 'Xabarlar',         Icon: MessageSquare, to: '/student/messages', badge: 3 },
    { label: 'Guruhim',           Icon: User,          to: '/student/group' },
    { label: 'Sozlamalar',        Icon: Settings,      to: '/student/profile' },
  ];

  const BOTTOM_NAV = [
    { label: 'Asosiy',    Icon: LayoutGrid,    to: '/student' },
    { label: 'Kurslar',   Icon: BookOpen,      to: '/student/courses' },
    { label: 'Topshiriq', Icon: ClipboardList, to: '/student/assignments' },
    { label: 'Xabarlar',  Icon: MessageSquare, to: '/student/courses' },
    { label: 'Profil',    Icon: User,          to: '/student/profile' },
  ];

  /* ── stat cards ── */
  const STATS = [
    { label: 'Tugatilgan kurslar', value: String(completed.length),  Icon: CheckCircle2, grad: 'linear-gradient(135deg,#22C55E,#06B6D4)', shadow: 'rgba(34,197,94,0.32)',  pct: `${Math.min(100, completed.length * 20)}%`, trend: `+${completed.length}`,  TrendIcon: TrendingUp, trendColor: '#22C55E' },
    { label: 'Faol kurslar',       value: String(inProgress.length), Icon: BookOpen,     grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', shadow: 'rgba(79,70,229,0.32)', pct: `${Math.min(100, inProgress.length * 20)}%`, trend: `+${inProgress.length}`, TrendIcon: TrendingUp, trendColor: '#22C55E' },
    { label: 'Sertifikatlar',      value: String(completed.length),  Icon: Award,        grad: 'linear-gradient(135deg,#F59E0B,#DB2777)', shadow: 'rgba(245,158,11,0.30)', pct: `${Math.min(100, completed.length * 33)}%`, trend: 'Yangi',                TrendIcon: Zap,        trendColor: '#F59E0B' },
    { label: 'O\'qish foizi',      value: `${avgProgress}%`,         Icon: Target,       grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)', shadow: 'rgba(6,182,212,0.30)',  pct: `${avgProgress}%`,                           trend: `${avgProgress}%`,      TrendIcon: TrendingUp, trendColor: '#22C55E' },
  ];

  /* ── continue courses ── */
  const continueCourses = inProgress.slice(0, 3).map((e, i) => ({
    _id: e.course._id,
    title: e.course.title,
    mentor: e.course.instructor?.name || 'O\'qituvchi',
    Icon: COURSE_ICONS[i % COURSE_ICONS.length],
    grad: COURSE_GRADS[i % COURSE_GRADS.length],
    pct: e.progress,
    left: `${100 - e.progress}% qoldi`,
  }));

  /* ── assignments table ── */
  const assignRows = submissions.slice(0, 4).map((s) => {
    const graded = s.grade != null;
    return {
      task:   s.assignment?.title || 'Topshiriq',
      course: s.assignment?.course?.title || '—',
      due:    s.assignment?.dueDate ? new Date(s.assignment.dueDate).toLocaleDateString('uz-UZ') : '—',
      ...(graded
        ? { status: 'Baholangan', bg: 'rgba(34,197,94,0.12)', color: '#16A34A', action: 'Ko\'rish' }
        : { status: 'Jarayonda',  bg: 'rgba(79,70,229,0.12)', color: '#4F46E5', action: 'Davom etish' }),
    };
  });

  /* ── certificates ── */
  const certs = completed.slice(0, 3).map((e, i) => ({
    title: e.course.title,
    date:  new Date(e.enrolledAt || Date.now()).toLocaleDateString('uz-UZ'),
    grad:  COURSE_GRADS[i % COURSE_GRADS.length],
  }));

  const calendar = buildCalendar();
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) {
    return (
      <div data-theme={theme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <style>{THEME_VARS}{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    /* Fix #4: height:100vh + overflow:hidden → only content div scrolls, body stays still */
    <div data-theme={theme} style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: 'var(--text)', WebkitFontSmoothing: 'antialiased' }}>
      <style>{THEME_VARS}</style>
      <style>{`
        /* Fix #1: remove margin-left completely — sidebar in-flow on desktop, off-screen on mobile */
        /* Fix #2: use 920px breakpoint everywhere (not Tailwind md:=768px) */
        .ds-mobile-only { display:none !important; }
        .ds-desktop-only { display:flex !important; }
        @media (min-width:921px) {
          .ds-sidebar { position:sticky !important; top:0; transform:none !important; flex-shrink:0; }
          .ds-bottom-nav { display:none !important; }
        }
        @media (max-width:920px) {
          .ds-sidebar { position:fixed !important; transform:translateX(-110%); }
          .ds-sidebar.is-open { transform:translateX(0) !important; }
          .ds-mobile-only { display:flex !important; }
          .ds-desktop-only { display:none !important; }
          .ds-bottom-nav { display:flex !important; }
          .ds-right-col { display:none !important; }
          .ds-stat-grid { grid-template-columns:1fr 1fr !important; }
          .ds-main-content { padding-bottom:80px !important; }
        }
        @media (max-width:560px) {
          .ds-cont-grid { grid-template-columns:1fr !important; }
          .ds-stat-grid { grid-template-columns:1fr !important; }
        }
        @media (max-width:1100px) {
          .ds-right-col { display:none !important; }
          .ds-main-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 75, background: 'rgba(2,6,23,0.5)', backdropFilter: 'blur(2px)' }} />
      )}

      {/* ══════════ SIDEBAR ══════════ */}
      {/* Fix #5: height:100vh so sidebar always fills viewport */}
      <aside className={`ds-sidebar${sidebarOpen ? ' is-open' : ''}`}
        style={{ width: 264, height: '100vh', background: 'var(--sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '22px 16px', top: 0, left: 0, zIndex: 80, transition: 'transform .3s ease', overflowY: 'auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 8px 0', flexShrink: 0 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(79,70,229,0.35)', flexShrink: 0 }}>
            <GraduationCap size={21} />
          </span>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Junior<span style={{ color: '#7C3AED' }}>LMS</span>
          </span>
          {/* Fix #2: use ds-mobile-only class (920px) instead of Tailwind md: (768px) */}
          <button className="ds-mobile-only" onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--text)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Fix #3: active detection via label, not URL startsWith (prevents multiple active items) */}
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

      {/* ══════════ MAIN ══════════ */}
      {/* Fix #1: no margin-left — sidebar is in-flow on desktop */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* HEADER */}
        <header style={{ flexShrink: 0, zIndex: 40, backdropFilter: 'saturate(180%) blur(16px)', WebkitBackdropFilter: 'saturate(180%) blur(16px)', background: isDark ? 'rgba(20,29,49,0.95)' : 'rgba(255,255,255,0.95)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px' }}>
            {/* Fix #2: hamburger at 920px breakpoint */}
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
              <IconBtn onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} title="Tema">
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#7C3AED', fontWeight: 700 }}><Zap size={12} /> Level 1 · Student</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT — Fix #4: flex:1 + overflowY:auto → inner scroll, body stays still */}
        <div className="ds-scroll ds-main-content" style={{ flex: 1, overflowY: 'auto', padding: '26px 24px 30px', display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeUp .5s ease both' }}>

          {/* WELCOME HERO */}
          <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, padding: 30, background: 'radial-gradient(500px 280px at 12% 10%,rgba(6,182,212,0.45),transparent 60%),radial-gradient(560px 360px at 90% 100%,rgba(124,58,237,0.55),transparent 60%),linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 20px 44px rgba(79,70,229,0.32)', flexShrink: 0 }}>
            <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', top: -90, right: -50, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ maxWidth: 520 }}>
                <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(22px,3vw,34px)', letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
                  Salom, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)', margin: '10px 0 0' }}>
                  {inProgress.length > 0
                    ? `Sizni ${inProgress.length} ta kurs davom etishini kutmoqda.`
                    : "Bugun ham yangi bilimlarni o'rganishni boshlang!"}
                </p>
                <Link to="/student/courses"
                  style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 9, padding: '12px 22px', borderRadius: 13, background: '#fff', color: '#4F46E5', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 12px 26px rgba(0,0,0,0.18)', transition: 'transform .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                  O'qishni davom ettirish <ArrowRight size={17} />
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', borderRadius: 20, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                <div style={{ position: 'relative', width: 88, height: 88, borderRadius: '50%', background: `conic-gradient(#fff ${Math.round(avgProgress * 3.6)}deg, rgba(255,255,255,0.25) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(79,70,229,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20 }}>{avgProgress}%</span>
                  </div>
                </div>
                <div style={{ color: '#fff' }}>
                  <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>Umumiy progress</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, marginTop: 2 }}>{valid.length} ta kurs</div>
                  <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 4 }}>
                    {completed.length > 0 ? 'Ajoyib ish! Davom eting 🔥' : 'Boshlang, muvaffaqiyat siz bilan!'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STAT CARDS */}
          <section className="ds-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, flexShrink: 0 }}>
            {STATS.map((s) => (
              <div key={s.label}
                style={{ borderRadius: 20, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', transition: 'transform .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ width: 46, height: 46, borderRadius: 13, background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 8px 18px ${s.shadow}` }}>
                    <s.Icon size={22} />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12.5, fontWeight: 700, color: s.trendColor }}>
                    <s.TrendIcon size={13} />{s.trend}
                  </span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 30, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: 14 }}>{s.value}</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-soft)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                <div style={{ marginTop: 12, height: 6, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <div style={{ width: s.pct, height: '100%', borderRadius: 99, background: s.grad, animation: 'growW 1s ease both' }} />
                </div>
              </div>
            ))}
          </section>

          {/* CONTINUE LEARNING */}
          {continueCourses.length > 0 && (
            <section style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 21, letterSpacing: '-0.01em', color: 'var(--text)', margin: 0 }}>O'qishni davom ettirish</h2>
                <Link to="/student/courses" style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  Barchasi <ArrowRight size={15} />
                </Link>
              </div>
              <div className="ds-cont-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
                {continueCourses.map((c) => (
                  <div key={c._id}
                    style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden', transition: 'transform .2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                    <div style={{ position: 'relative', height: 108, background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', top: -40, right: -30 }} />
                      <span style={{ position: 'relative', width: 54, height: 54, borderRadius: 15, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <c.Icon size={25} />
                      </span>
                      <span style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.92)', fontSize: 11.5, fontWeight: 700, color: '#0F172A' }}>{c.left}</span>
                    </div>
                    <div style={{ padding: 18 }}>
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16.5, color: 'var(--text)' }}>{c.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-soft)', marginTop: 6 }}>
                        <User size={14} />{c.mentor}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                        <span>Progress</span><span style={{ color: '#4F46E5' }}>{c.pct}%</span>
                      </div>
                      <div style={{ marginTop: 7, height: 7, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', borderRadius: 99, background: c.grad, animation: 'growW 1.1s ease both' }} />
                      </div>
                      <Link to={`/student/courses/${c._id}`}
                        style={{ width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 11, borderRadius: 12, background: 'var(--surface-2)', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background .2s,color .2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg,#4F46E5,#7C3AED)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)'; }}>
                        Davom etish <Play size={15} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MAIN GRID */}
          <div className="ds-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 24, alignItems: 'start', flexShrink: 0 }}>

            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

              {/* WEEKLY CHART */}
              <section style={{ borderRadius: 20, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: 'var(--text)', margin: 0 }}>Haftalik o'qish statistikasi</h2>
                    <p style={{ fontSize: 13.5, color: 'var(--text-soft)', margin: '4px 0 0' }}>Bu hafta jami <strong style={{ color: 'var(--text)' }}>12.5 soat</strong> o'qidingiz</p>
                  </div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    {[['linear-gradient(135deg,#4F46E5,#7C3AED)', 'Darslar'], ['#06B6D4', 'Amaliyot']].map(([bg, label]) => (
                      <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--text-soft)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: bg, display: 'inline-block' }} />{label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 190, marginTop: 24, padding: '0 4px' }}>
                  {WEEK_CHART.map((d, i) => (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3, height: '100%' }}>
                        <div style={{ height: `${d.b}%`, borderRadius: '5px 5px 0 0', background: '#06B6D4', animation: 'growBar .9s ease both' }} />
                        <div style={{ height: `${d.a}%`, borderRadius: d.b > 0 ? 0 : '5px 5px 0 0', background: 'linear-gradient(180deg,#7C3AED,#4F46E5)', animation: 'growBar .9s ease both' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: i === TODAY_IDX ? '#4F46E5' : 'var(--text-mute)' }}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ASSIGNMENTS TABLE */}
              <section style={{ borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 22px 16px' }}>
                  <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: 'var(--text)', margin: 0 }}>Topshiriqlar</h2>
                  <Link to="/student/assignments" style={{ fontSize: 13.5, fontWeight: 700, color: '#4F46E5', textDecoration: 'none' }}>Barchasi</Link>
                </div>
                <div style={{ overflowX: 'auto' }} className="ds-scroll">
                  {assignRows.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                      <thead>
                        <tr>
                          {['Topshiriq', 'Kurs', 'Muddat', 'Holati', 'Amal'].map((col) => (
                            <th key={col} style={{ padding: '11px 20px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-mute)', background: 'var(--surface-2)', textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {assignRows.map((a, i) => (
                          <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                            <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: 'var(--text)', maxWidth: 180 }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.task}</div>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: 13.5, color: 'var(--text-soft)', whiteSpace: 'nowrap' }}>{a.course}</td>
                            <td style={{ padding: '14px 20px', fontSize: 13.5, color: 'var(--text-soft)', whiteSpace: 'nowrap' }}>{a.due}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: a.bg, color: a.color, whiteSpace: 'nowrap' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />{a.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <Link to="/student/assignments" style={{ fontSize: 13.5, fontWeight: 700, color: '#4F46E5', textDecoration: 'none', whiteSpace: 'nowrap' }}>{a.action}</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '48px 22px', textAlign: 'center', color: 'var(--text-soft)', fontSize: 14 }}>
                      <ClipboardList size={36} color="var(--text-mute)" style={{ margin: '0 auto 12px', display: 'block' }} />
                      Hozircha topshiriqlar yo'q
                    </div>
                  )}
                </div>
              </section>

              {/* CERTIFICATES */}
              {certs.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: 'var(--text)', margin: '0 0 16px' }}>Sertifikatlar</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                    {certs.map((c, i) => (
                      <div key={i} style={{ borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', height: 96, background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={34} color="rgba(255,255,255,0.95)" />
                          <span style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>JUNIOR LMS</span>
                        </div>
                        <div style={{ padding: 16 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-soft)', marginTop: 5 }}>
                            <CalendarCheck size={14} />{c.date}
                          </div>
                          <button
                            style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 10, border: '1px solid var(--border)', cursor: 'pointer', borderRadius: 11, background: 'var(--surface-2)', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13.5, transition: 'background .2s,color .2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)'; }}>
                            <Download size={15} /> Yuklab olish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ACHIEVEMENTS */}
              <section style={{ borderRadius: 20, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: 'var(--text)', margin: 0 }}>Yutuqlar</h2>
                  <span style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 600 }}>3 / 5 ochilgan</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 12 }}>
                  {ACHIEVEMENTS_RAW.map((b) => (
                    <div key={b.label} style={{ textAlign: 'center', padding: '16px 10px', borderRadius: 16, background: b.unlocked ? 'var(--surface-2)' : 'transparent', border: '1px solid var(--border)', opacity: b.unlocked ? 1 : 0.6 }}>
                      <div style={{ width: 48, height: 48, margin: '0 auto', borderRadius: '50%', background: b.unlocked ? b.grad : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.unlocked ? '#fff' : 'var(--text-mute)', boxShadow: b.unlocked ? '0 8px 18px rgba(79,70,229,0.22)' : 'none' }}>
                        {b.unlocked ? <b.Icon size={22} /> : <Lock size={22} />}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text)', marginTop: 10, lineHeight: 1.3 }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 3 }}>{b.note}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="ds-right-col" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* PROFILE WIDGET */}
              <section style={{ borderRadius: 20, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 78, height: 78, margin: '0 auto' }}>
                  <div style={{ width: 78, height: 78, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, boxShadow: '0 10px 24px rgba(79,70,229,0.35)' }}>{initials}</div>
                  <span style={{ position: 'absolute', bottom: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: '#22C55E', border: '3px solid var(--surface)' }} />
                </div>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', marginTop: 12 }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: '#7C3AED', fontWeight: 700, marginTop: 2 }}>Level 1 · Student</div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                  {[[String(valid.length), 'Kurslar'], [String(completed.length), 'Tugatilgan'], ['2026', 'Boshlangan']].map(([n, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{n}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* UPCOMING LESSONS */}
              <section style={{ borderRadius: 20, padding: 22, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: '0 0 16px' }}>Yaqin darslar</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {UPCOMING.map((l) => (
                    <div key={l.title} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, borderRadius: 14, background: 'var(--surface-2)' }}>
                      <div style={{ flexShrink: 0, width: 48, textAlign: 'center', borderRadius: 11, padding: '7px 0', background: l.grad, color: '#fff' }}>
                        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, lineHeight: 1 }}>{l.day}</div>
                        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>{l.month}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: 'var(--text-soft)', marginTop: 3 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{l.time}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={12} />{l.mentor}</span>
                        </div>
                      </div>
                      <button title="Qo'shilish"
                        style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                        <Video size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* CALENDAR */}
              <section style={{ borderRadius: 20, padding: 22, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Iyun 2026</h2>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[ChevronLeft, ChevronRight].map((Icon, i) => (
                      <button key={i} style={{ width: 30, height: 30, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                  {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((w) => (
                    <div key={w} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-mute)', paddingBottom: 6 }}>{w}</div>
                  ))}
                  {calendar.map((c, i) => (
                    <div key={i} style={{ aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: c ? c.color : 'transparent', background: c ? c.bg : 'transparent', border: c ? c.border : 'none', cursor: c ? 'default' : 'default' }}>
                      {c ? c.d : ''}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  {[['#4F46E5', 'Dars'], ['#EF4444', 'Muddat']].map(([color, label]) => (
                    <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-soft)', fontWeight: 600 }}>
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block' }} />{label}
                    </span>
                  ))}
                </div>
              </section>

              {/* NOTIFICATIONS */}
              <section style={{ borderRadius: 20, padding: 22, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: 0 }}>Bildirishnomalar</h2>
                  <span style={{ minWidth: 22, height: 22, padding: '0 7px', borderRadius: 99, background: 'rgba(79,70,229,0.12)', color: '#4F46E5', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {NOTIFS.map((n, i) => (
                    <div key={i}
                      style={{ display: 'flex', gap: 12, padding: 11, borderRadius: 13, transition: 'background .2s', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.color }}>
                        <n.Icon size={18} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="ds-bottom-nav"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70, display: 'none', alignItems: 'center', justifyContent: 'space-around', padding: '9px 8px', background: isDark ? 'rgba(15,23,49,0.96)' : 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border)' }}>
        {BOTTOM_NAV.map((b) => {
          const active = location.pathname === b.to || (b.to !== '/student' && location.pathname.startsWith(b.to));
          return (
            <Link key={b.label} to={b.to}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 6, textDecoration: 'none', color: active ? '#4F46E5' : 'var(--text-mute)', fontSize: 11, fontWeight: 700, transition: 'color .2s' }}>
              <b.Icon size={22} />{b.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* ── small helper ── */
function IconBtn({ children, onClick, title, style: extraStyle = {} }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width: 42, height: 42, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', position: 'relative', flexShrink: 0, ...extraStyle }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}>
      {children}
    </button>
  );
}
