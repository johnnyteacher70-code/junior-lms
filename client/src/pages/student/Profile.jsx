import { useState } from 'react';
import { User, Mail, Shield, Image, FileText, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, changePassword } from '../../api/auth';

const ROLE_LABEL = { student: 'Talaba', teacher: "O'qituvchi", admin: 'Administrator' };
const ROLE_GRAD  = {
  student: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
  teacher: 'linear-gradient(135deg,#06B6D4,#4F46E5)',
  admin:   'linear-gradient(135deg,#0F172A,#334155)',
};

function FieldInput({ label, Icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={16} color="var(--text-mute)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />}
        <input {...props}
          style={{ width: '100%', padding: Icon ? '12px 14px 12px 42px' : '12px 14px', borderRadius: 13, border: `1px solid ${focused ? '#4F46E5' : 'var(--border)'}`, background: props.disabled ? 'var(--surface-2)' : 'var(--surface)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: props.disabled ? 'var(--text-soft)' : 'var(--text)', outline: 'none', boxShadow: focused ? '0 0 0 4px rgba(79,70,229,0.10)' : 'none', transition: 'border-color .2s,box-shadow .2s', boxSizing: 'border-box', cursor: props.disabled ? 'not-allowed' : 'text' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)} />
      </div>
    </div>
  );
}

function PwInput({ label, ...props }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Lock size={16} color="var(--text-mute)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input {...props} type={show ? 'text' : 'password'}
          style={{ width: '100%', padding: '12px 44px 12px 42px', borderRadius: 13, border: `1px solid ${focused ? '#4F46E5' : 'var(--border)'}`, background: 'var(--surface)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: 'var(--text)', outline: 'none', boxShadow: focused ? '0 0 0 4px rgba(79,70,229,0.10)' : 'none', transition: 'border-color .2s,box-shadow .2s', boxSizing: 'border-box' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)} />
        <button type="button" onClick={() => setShow(v => !v)}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function Alert({ msg }) {
  if (!msg) return null;
  const ok = msg.type === 'success';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 13, background: ok ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)', border: `1px solid ${ok ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
      {ok ? <CheckCircle2 size={17} color="#16A34A" /> : <AlertCircle size={17} color="#EF4444" />}
      <span style={{ fontSize: 14, fontWeight: 600, color: ok ? '#16A34A' : '#EF4444' }}>{msg.text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function StudentProfile() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    setProfileLoading(true); setProfileMsg(null);
    try {
      const res = await updateProfile({ name: profileForm.name.trim(), bio: profileForm.bio, avatar: profileForm.avatar });
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profil muvaffaqiyatli saqlandi' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally { setProfileLoading(false); }
  };

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) {
      setPassMsg({ type: 'error', text: 'Yangi parollar mos kelmaydi' }); return;
    }
    setPassLoading(true); setPassMsg(null);
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassMsg({ type: 'success', text: "Parol muvaffaqiyatli o'zgartirildi" });
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally { setPassLoading(false); }
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const grad = ROLE_GRAD[user?.role] || ROLE_GRAD.student;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680 }}>

      {/* PROFILE HERO */}
      <section style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div style={{ height: 110, background: grad, position: 'relative' }}>
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.14)', top: -60, right: -40 }} />
        </div>
        <div style={{ padding: '0 26px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: -40 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {profileForm.avatar
                ? <img src={profileForm.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', border: '3px solid var(--surface)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }} onError={(e) => (e.target.style.display = 'none')} />
                : <div style={{ width: 80, height: 80, borderRadius: 20, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, border: '3px solid var(--surface)', boxShadow: '0 8px 20px rgba(79,70,229,0.3)' }}>{initials}</div>
              }
              <span style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#22C55E', border: '2.5px solid var(--surface)' }} />
            </div>
            <div style={{ paddingBottom: 6 }}>
              <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: 'var(--text)', margin: 0 }}>{user?.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(79,70,229,0.10)', color: '#4F46E5', fontSize: 12.5, fontWeight: 700 }}>{ROLE_LABEL[user?.role] || user?.role}</span>
                <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE FORM */}
      <section style={{ borderRadius: 20, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: '0 0 20px' }}>Shaxsiy ma'lumotlar</h2>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FieldInput label="To'liq ism" Icon={User} value={profileForm.name} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} required placeholder="Ism Familiya" />
          <FieldInput label="Email" Icon={Mail} value={user?.email} disabled />
          <FieldInput label="Rol" Icon={Shield} value={ROLE_LABEL[user?.role] || user?.role} disabled />
          <FieldInput label="Avatar URL (ixtiyoriy)" Icon={Image} value={profileForm.avatar} onChange={(e) => setProfileForm(p => ({ ...p, avatar: e.target.value }))} placeholder="https://..." />
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bio</label>
            <textarea value={profileForm.bio} onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="O'zingiz haqingizda qisqacha..."
              style={{ width: '100%', padding: '12px 14px', borderRadius: 13, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: 'var(--text)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color .2s' }}
              onFocus={(e) => (e.target.style.borderColor = '#4F46E5')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <Alert msg={profileMsg} />
          <button type="submit" disabled={profileLoading}
            style={{ padding: '13px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 15, cursor: profileLoading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(79,70,229,0.28)', opacity: profileLoading ? 0.8 : 1, transition: 'transform .2s' }}
            onMouseEnter={(e) => { if (!profileLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
            {profileLoading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </section>

      {/* PASSWORD FORM */}
      <section style={{ borderRadius: 20, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: '0 0 20px' }}>Parolni o'zgartirish</h2>
        <form onSubmit={handlePassChange} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PwInput label="Joriy parol" value={passForm.currentPassword} onChange={(e) => setPassForm(p => ({ ...p, currentPassword: e.target.value }))} required placeholder="••••••••" />
          <PwInput label="Yangi parol" value={passForm.newPassword} onChange={(e) => setPassForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} placeholder="Kamida 6 belgi" />
          <PwInput label="Yangi parolni tasdiqlang" value={passForm.confirm} onChange={(e) => setPassForm(p => ({ ...p, confirm: e.target.value }))} required placeholder="••••••••" />
          <Alert msg={passMsg} />
          <button type="submit" disabled={passLoading}
            style={{ padding: '13px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 15, cursor: passLoading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(79,70,229,0.28)', opacity: passLoading ? 0.8 : 1 }}>
            {passLoading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
          </button>
        </form>
      </section>

      {/* ACCOUNT INFO */}
      <section style={{ borderRadius: 20, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: '0 0 18px' }}>Hisob ma'lumotlari</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Hisob ID', <code style={{ fontFamily: 'monospace', fontSize: 12.5, padding: '3px 8px', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--text)' }}>{user?._id}</code>],
            ["Ro'yxatdan o'tgan", user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : '—'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 13, background: 'var(--surface-2)' }}>
              <span style={{ fontSize: 13.5, color: 'var(--text-soft)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
