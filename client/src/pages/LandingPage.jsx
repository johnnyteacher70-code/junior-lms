import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCourses } from '../api/courses';
import Navbar from '../components/layout/Navbar';
import CourseCard from '../components/common/CourseCard';
import Button from '../components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: '🎓', title: 'Mutaxassis o\'qituvchilar', desc: 'Amaliy tajribaga ega soha mutaxassislaridan o\'rganing.' },
  { icon: '📱', title: 'Istalgan joyda o\'rganing', desc: 'Istalgan qurilmada, istalgan vaqtda, o\'z sur\'atingizda kurslarga kiring.' },
  { icon: '🏆', title: 'Sertifikat qozonish', desc: 'Tugatish sertifikatlari bilan yutuqlaringizni tasdiqlang.' },
  { icon: '💬', title: 'Jamiyat', desc: 'O\'quvchilar va o\'qituvchilarning global jamoasiga qo\'shiling.' },
];

const steps = [
  { step: '01', title: 'Kurs toping', desc: 'Katalogimizni ko\'rib chiqing va maqsadlaringizga mos kursni tanlang.' },
  { step: '02', title: 'Yoziling va o\'rganing', desc: 'Darslarni o\'z sur\'atingizda tomosha qiling, topshiriqlarni bajaring, rivojlanishni kuzating.' },
  { step: '03', title: 'Sertifikat oling', desc: 'Kursni tugatib, yutuq sertifikatingizni oling.' },
];

const categories = ['Veb ishlab chiqish', 'Ma\'lumotlar fanlari', 'Dizayn', 'Biznes', 'Mobil ishlab chiqish', 'Marketing'];
const categoryValues = ['Web Development', 'Data Science', 'Design', 'Business', 'Mobile Development', 'Marketing'];

export default function LandingPage() {
  const [courses, setCourses] = useState([]);
  const heroRef     = useRef(null);
  const badgeRef    = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const btnsRef     = useRef(null);
  const statsRef    = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef    = useRef(null);
  const ctaRef      = useRef(null);

  useEffect(() => {
    getCourses({ status: 'published' }).then((r) => setCourses(r.data.courses.slice(0, 6))).catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance — staggered from bottom
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(badgeRef.current,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(titleRef.current,    { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(btnsRef.current,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo(statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5 }, '-=0.2');

      // Features — scroll trigger
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.children,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
          }
        );
      }

      // Steps
      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.children,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' },
          }
        );
      }

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-purple-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:py-36 text-center">
          <span ref={badgeRef} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            🚀 Zamonaviy ta'lim platformasi
          </span>
          <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Cheksiz<br />
            <span className="text-yellow-300">O'rganish</span>
          </h1>
          <p ref={subtitleRef} className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            <strong>Junior</strong> platformasida minglab o'quvchilar va o'qituvchilarga qo'shiling — online ta'lim uchun zamonaviy platforma.
          </p>
          <div ref={btnsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="white" size="lg" className="px-8 shadow-xl">
                Bepul boshlang →
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline-white" size="lg" className="px-8">
                Kurslarga ko'z tashlang
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-10 border-t border-white/20">
            {[['10K+', 'Talabalar'], ['500+', 'Kurslar'], ['200+', "O'qituvchilar"], ['95%', 'Mamnuniyat']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{n}</p>
                <p className="text-xs sm:text-sm text-white/70 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((c, i) => (
              <Link
                key={c}
                to={`/courses?category=${encodeURIComponent(categoryValues[i])}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Nega Junior-ni tanlash kerak?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Professional o'sish uchun kerak bo'lgan hamma narsa.</p>
          </div>
          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group bg-white dark:bg-gray-800/60 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Tavsiya etilgan kurslar</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Eng yaxshi o'qituvchilarimizdan tanlangan kurslar</p>
              </div>
              <Link to="/courses" className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-semibold flex items-center gap-1 flex-shrink-0">
                Barchasini ko'rish →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`}>
                  <CourseCard course={c} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Qanday ishlaydi</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Yo'lingizni boshlash uchun uch oddiy qadam</p>
          </div>
          <div ref={stepsRef} className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-purple-200 dark:from-primary-900 dark:to-purple-900" />
            {steps.map((s) => (
              <div key={s.step} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200 dark:shadow-primary-900">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700 text-white">
        <div ref={ctaRef} className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">O'rganishni boshlashga tayyormisiz?</h2>
          <p className="text-white/80 text-base sm:text-lg mb-8">10,000 dan ortiq talabalar allaqachon Junior da o'rganmoqda.</p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link to="/register">
              <Button variant="white" size="lg" className="px-10 shadow-xl">Bepul boshlang</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline-white" size="lg" className="px-10">O'qituvchi bo'ling</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-bold text-white text-lg">Junior</span>
              </div>
              <p className="text-sm leading-relaxed">Online ta'lim va o'qitish uchun zamonaviy platforma.</p>
            </div>
            {[
              { title: 'Platforma', links: [['Kurslarga ko\'z tashlang', '/courses'], ['O\'qituvchi bo\'ling', '/register'], ['Kirish', '/login']] },
              { title: 'Kategoriyalar', links: [['Veb ishlab chiqish', '/courses'], ['Ma\'lumotlar fanlari', '/courses'], ['Dizayn', '/courses']] },
              { title: 'Kompaniya', links: [['Biz haqimizda', '/'], ['Aloqa', '/'], ['Maxfiylik', '/']] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(([label, to]) => (
                    <li key={label}><Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            © 2025 Junior. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
}
