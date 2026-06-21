import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../api/auth';

const roleLabel = { student: 'Talaba', teacher: "O'qituvchi", admin: 'Administrator' };
const roleGradient = {
  student: 'from-blue-500 to-primary-600',
  teacher: 'from-primary-500 to-purple-600',
  admin: 'from-gray-700 to-gray-900',
};

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await updateProfile({
        name: profileForm.name.trim(),
        bio: profileForm.bio,
        avatar: profileForm.avatar,
      });
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profil muvaffaqiyatli saqlandi' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) {
      setPassMsg({ type: 'error', text: 'Yangi parollar mos kelmaydi' });
      return;
    }
    setPassLoading(true);
    setPassMsg(null);
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassMsg({ type: 'success', text: "Parol muvaffaqiyatli o'zgartirildi" });
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setPassLoading(false);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-br ${roleGradient[user?.role] || 'from-primary-600 to-purple-600'} rounded-2xl p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold shadow-lg overflow-hidden">
            {profileForm.avatar
              ? <img src={profileForm.avatar} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              : initial}
          </div>
          <div>
            <h1 className="text-xl font-extrabold">{user?.name}</h1>
            <p className="text-white/70 text-sm mt-0.5">{roleLabel[user?.role] || user?.role}</p>
            <p className="text-white/60 text-xs mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-base">Shaxsiy ma'lumotlar</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ism familiya</label>
            <input
              className="input"
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ism familiya"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input className="input opacity-60 cursor-not-allowed" value={user?.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rol</label>
            <input className="input opacity-60 cursor-not-allowed" value={roleLabel[user?.role] || user?.role} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Avatar URL (ixtiyoriy)</label>
            <input
              className="input"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm((p) => ({ ...p, avatar: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="O'zingiz haqingizda qisqacha..."
            />
          </div>

          {profileMsg && (
            <div className={`text-sm px-4 py-2.5 rounded-xl font-medium ${profileMsg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
              {profileMsg.text}
            </div>
          )}

          <button type="submit" disabled={profileLoading} className="btn btn-primary w-full">
            {profileLoading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-base">Parolni o'zgartirish</h2>
        <form onSubmit={handlePassChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Joriy parol</label>
            <input
              type="password"
              className="input"
              value={passForm.currentPassword}
              onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
              required
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Yangi parol</label>
            <input
              type="password"
              className="input"
              value={passForm.newPassword}
              onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Yangi parolni tasdiqlang</label>
            <input
              type="password"
              className="input"
              value={passForm.confirm}
              onChange={(e) => setPassForm((p) => ({ ...p, confirm: e.target.value }))}
              required
              placeholder="••••••••"
            />
          </div>

          {passMsg && (
            <div className={`text-sm px-4 py-2.5 rounded-xl font-medium ${passMsg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
              {passMsg.text}
            </div>
          )}

          <button type="submit" disabled={passLoading} className="btn btn-primary w-full">
            {passLoading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-base">Hisob ma'lumotlari</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Hisob ID</span>
            <span className="font-mono text-gray-700 dark:text-gray-300 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">{user?._id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Ro'yxatdan o'tgan</span>
            <span className="text-gray-700 dark:text-gray-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
