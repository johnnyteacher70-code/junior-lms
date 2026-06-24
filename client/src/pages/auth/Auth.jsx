import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CHIPS = [
  { num: "1000+", label: "O'quvchilar" },
  { num: '50+',   label: 'Kurslar' },
  { num: '95%',   label: 'Mamnuniyat' },
];

const KEYFRAMES = `
  @keyframes floatySlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.4} }
`;

/* ─── shared input style ─── */
const inputBase = {
  width: '100%',
  padding: '13px 14px 13px 44px',
  borderRadius: 13,
  border: '1px solid rgba(15,23,42,0.12)',
  background: '#fff',
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  fontSize: 15,
  color: '#0F172A',
  transition: 'border-color .2s,box-shadow .2s',
  outline: 'none',
};

function AuthInput({ icon: Icon, type, placeholder, value, onChange, rightSlot, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={18} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        style={{
          ...inputBase,
          paddingRight: rightSlot ? 44 : 14,
          borderColor: focused ? '#4F46E5' : 'rgba(15,23,42,0.12)',
          boxShadow: focused ? '0 0 0 4px rgba(79,70,229,0.12)' : 'none',
          ...style,
        }}
      />
      {rightSlot}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Auth({ initialTab = 'login' }) {
  const [mode, setMode] = useState(initialTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password.length < 6)
      return toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");

    setLoading(true);
    try {
      const user = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password, role: 'student' });

      toast.success(isLogin ? `Xush kelibsiz, ${user.name}!` : `Hisob yaratildi! Xush kelibsiz, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || (isLogin ? "Kirish muvaffaqiyatsiz bo'ldi" : "Ro'yxatdan o'tish muvaffaqiyatsiz bo'ldi"));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setForm({ name: '', email: '', password: '' });
    setShowPw(false);
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: '11px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 700,
    fontSize: 15,
    transition: 'all .2s',
    background: active ? '#fff' : 'transparent',
    color: active ? '#4F46E5' : '#64748B',
    boxShadow: active ? '0 4px 12px rgba(15,23,42,0.08)' : 'none',
  });

  const EyeIcon = showPw ? EyeOff : Eye;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2"
      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: '#0F172A', WebkitFontSmoothing: 'antialiased' }}>
      <style>{KEYFRAMES}{`input::placeholder { color: #94A3B8; }`}</style>

      {/* ══════════ BRAND PANEL ══════════ */}
      <div className="hidden md:flex flex-col justify-between relative overflow-hidden" style={{ padding: 48, background: 'radial-gradient(600px 360px at 18% 12%,rgba(6,182,212,0.45),transparent 60%),radial-gradient(620px 420px at 88% 92%,rgba(124,58,237,0.6),transparent 60%),linear-gradient(135deg,#4F46E5,#7C3AED)' }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', top: -90, right: -70 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.14)', bottom: 60, left: -70 }} />

        {/* logo */}
        <Link to="/" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <span style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <GraduationCap size={22} />
          </span>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 21, letterSpacing: '-0.02em', color: '#fff' }}>
            Junior<span style={{ color: '#C7D2FE' }}>LMS</span>
          </span>
        </Link>

        {/* center copy */}
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#67E8F9', animation: 'pulseDot 1.6s infinite', display: 'inline-block' }} />
            Zamonaviy IT ta'lim platformasi
          </span>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.4vw,42px)', lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', margin: '22px 0 0' }}>
            Bilim — eng yaxshi sarmoya
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.88)', margin: '16px 0 0' }}>
            Akkauntingizga kiring va o'rganishni davom ettiring. Darslar, loyihalar va sertifikatlar sizni kutmoqda.
          </p>

          {/* stat chips */}
          <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
            {CHIPS.map((c) => (
              <div key={c.label} style={{ padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: '#fff' }}>{c.num}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* floating testimonial */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, padding: '16px 18px', borderRadius: 18, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', maxWidth: 420, animation: 'floatySlow 6s ease-in-out infinite' }}>
          <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#67E8F9,#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#4F46E5' }}>DR</span>
          <div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#fff' }}>"Junior LMS karyeramni o'zgartirdi — 4 oyda ishga joylashdim."</p>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontWeight: 600 }}>Doniyor R. · Frontend Developer</div>
          </div>
        </div>
      </div>

      {/* ══════════ FORM PANEL ══════════ */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(500px 300px at 90% -10%,rgba(124,58,237,0.10),transparent 60%),#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* mobile logo */}
          <Link to="/" className="flex md:hidden items-center justify-center" style={{ gap: 10, textDecoration: 'none', marginBottom: 26 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(79,70,229,0.35)' }}>
              <GraduationCap size={21} />
            </span>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: '#0F172A' }}>Junior<span style={{ color: '#4F46E5' }}>LMS</span></span>
          </Link>

          {/* tab switcher */}
          <div style={{ display: 'flex', padding: 5, borderRadius: 14, background: '#EEF1F6', border: '1px solid rgba(15,23,42,0.05)', marginBottom: 28 }}>
            <button type="button" onClick={() => switchMode('login')}  style={tabStyle(isLogin)}>Kirish</button>
            <button type="button" onClick={() => switchMode('signup')} style={tabStyle(!isLogin)}>Ro'yxatdan o'tish</button>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} key={mode} style={{ animation: 'fadeUp .4s ease both' }}>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', color: '#0F172A', margin: 0 }}>
              {isLogin ? 'Xush kelibsiz!' : 'Akkaunt yarating'}
            </h2>
            <p style={{ fontSize: 15, color: '#64748B', margin: '8px 0 0' }}>
              {isLogin ? 'Davom etish uchun akkauntingizga kiring.' : "Bir necha daqiqada bepul ro'yxatdan o'ting."}
            </p>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* name — signup only */}
              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 7 }}>To'liq ism</label>
                  <AuthInput
                    icon={User}
                    type="text"
                    placeholder="Ismingizni kiriting"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              )}

              {/* email */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Email manzil</label>
                <AuthInput
                  icon={Mail}
                  type="email"
                  placeholder="siz@email.uz"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* password */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 7 }}>Parol</label>
                <AuthInput
                  icon={Lock}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  rightSlot={
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                      <EyeIcon size={18} />
                    </button>
                  }
                />
              </div>
            </div>

            {/* remember / forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '20px 0 22px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#475569', fontWeight: 600 }}>
                <input type="checkbox" style={{ width: 17, height: 17, accentColor: '#4F46E5', cursor: 'pointer' }} />
                {isLogin ? 'Meni eslab qol' : 'Yangiliklarni qabul qilish'}
              </label>
              {isLogin && (
                <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5', textDecoration: 'none' }}>Parolni unutdingizmi?</a>
              )}
            </div>

            {/* submit */}
            <SubmitBtn loading={loading} label={isLogin ? 'Kirish' : "Ro'yxatdan o'tish"} />

            {/* switch link */}
            <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#64748B' }}>
              {isLogin ? "Akkauntingiz yo'qmi?" : 'Akkauntingiz bormi?'}{' '}
              <button type="button" onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#4F46E5' }}>
                {isLogin ? "Ro'yxatdan o'ting" : 'Kirish'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="submit" disabled={loading}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 14, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: hovered ? '0 20px 40px rgba(79,70,229,0.46)' : '0 14px 30px rgba(79,70,229,0.36)', transform: hovered ? 'translateY(-2px)' : 'none', transition: 'transform .2s,box-shadow .2s', opacity: loading ? 0.8 : 1 }}>
      {loading ? (
        <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
          <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <>{label} <ArrowRight size={18} /></>
      )}
    </button>
  );
}
