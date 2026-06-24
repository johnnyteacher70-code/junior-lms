import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
    setLoading(true);
    try {
      const user = await register({ ...form, role: 'student' });
      toast.success(`Hisob yaratildi! Xush kelibsiz, ${user.name}!`);
      navigate('/student');
    } catch (err) {
      toast.error(err.response?.data?.message || "Ro'yxatdan o'tish muvaffaqiyatsiz bo'ldi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Chap panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-purple-700 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Bugun Junior-ga qo'shiling</h1>
          <p className="text-white/80 text-lg">Ro'yxatdan o'ting va o'rganish yo'lini boshlang.</p>
          <div className="mt-8 space-y-4">
            {[
              { icon: '📚', text: "Yuzlab kurslarga kirish imkoniyati" },
              { icon: '📈', text: "O'z rivojlanishingizni kuzating" },
              { icon: '✅', text: "Topshiriqlarni bajaring va baholar oling" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">{item.icon}</span>
                <p className="text-white/90 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* O'ng panel — forma */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Junior</span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hisobingizni yarating</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Bugun o'rganishni boshlang</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="To'liq ism"
                placeholder="Ism Familiya"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Elektron pochta"
                type="email"
                placeholder="siz@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Parol"
                type="password"
                placeholder="Kamida 6 ta belgi"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Hisob yaratish
              </Button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
