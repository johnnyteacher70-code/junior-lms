import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, Play, TrendingUp, Award, LayoutGrid,
  BookOpen, BarChart3, Clock, PlayCircle, Layers, Users, ClipboardCheck,
  UserPlus, ListChecks, Server, Smartphone, Code, PenTool,
  ChevronDown, Mail, Phone, MapPin, Send, MessageCircle, Globe, Menu, X,
} from 'lucide-react';
import { getCourses } from '../api/courses';

/* ─── static data ─── */
const NAV_LINKS = [
  { label: 'Kurslar',       href: '#courses' },
  { label: 'Imkoniyatlar',  href: '#features' },
  { label: 'Mentorlar',     href: '#mentors' },
  { label: 'Jarayon',       href: '#process' },
  { label: 'FAQ',           href: '#faq' },
];

const STATS = [
  { num: '1000+', label: "O'quvchilar" },
  { num: '50+',   label: 'Kurslar' },
  { num: '20+',   label: 'Mentorlar' },
  { num: '95%',   label: 'Mamnuniyat darajasi' },
];

const COURSES = [
  { title: 'Frontend Development', Icon: LayoutGrid, desc: 'HTML, CSS, JavaScript va React bilan zamonaviy veb-saytlar yarating.', duration: '4 oy', lessons: '120 dars', level: "Boshlang'ich", rating: '4.9', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)' },
  { title: 'Backend Development',  Icon: Server,      desc: "Node.js, ma'lumotlar bazasi va API'lar bilan server logikasini quring.", duration: '5 oy', lessons: '140 dars', level: "O'rta",        rating: '4.8', grad: 'linear-gradient(135deg,#7C3AED,#DB2777)' },
  { title: 'Flutter Mobile',       Icon: Smartphone,  desc: 'Bitta kod bazasidan iOS va Android ilovalarini ishlab chiqing.', duration: '4 oy', lessons: '110 dars', level: "O'rta",        rating: '4.9', grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)' },
  { title: 'Python Dasturlash',    Icon: Code,        desc: "Dasturlash asoslari, avtomatlashtirish va ma'lumotlar tahlili.", duration: '3 oy', lessons: '90 dars',  level: "Boshlang'ich", rating: '4.9', grad: 'linear-gradient(135deg,#0EA5E9,#22C55E)' },
  { title: 'UI/UX Design',         Icon: PenTool,     desc: "Figma'da chiroyli va qulay interfeyslar dizaynini o'rganing.", duration: '3 oy', lessons: '80 dars',  level: "Boshlang'ich", rating: '4.7', grad: 'linear-gradient(135deg,#F59E0B,#DB2777)' },
];

const FEATURES = [
  { title: 'Video darslar',      Icon: PlayCircle,      desc: "Yuqori sifatli, qadam-baqadam video darslar — istalgan vaqtda va joyda ko'ring.", grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', shadow: 'rgba(79,70,229,0.35)' },
  { title: 'Amaliy loyihalar',   Icon: Layers,          desc: 'Real loyihalar ustida ishlab, portfelingizni darslar davomida shakllantiring.', grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)', shadow: 'rgba(6,182,212,0.35)' },
  { title: 'Sertifikatlar',      Icon: Award,           desc: "Har bir kursni tugatganingizda rasmiy sertifikat bilan taqdirlanasiz.", grad: 'linear-gradient(135deg,#22C55E,#06B6D4)', shadow: 'rgba(34,197,94,0.32)' },
  { title: 'Mentor yordami',     Icon: Users,           desc: 'Savollaringizga tajribali mentorlardan tezkor va aniq javob oling.', grad: 'linear-gradient(135deg,#7C3AED,#DB2777)', shadow: 'rgba(124,58,237,0.35)' },
  { title: 'Test va imtihonlar', Icon: ClipboardCheck,  desc: "Interaktiv testlar orqali bilimingizni mustahkamlang va tekshiring.", grad: 'linear-gradient(135deg,#F59E0B,#DB2777)', shadow: 'rgba(245,158,11,0.32)' },
  { title: 'Progress kuzatuvi',  Icon: TrendingUp,      desc: "Shaxsiy dashboard orqali o'sishingizni real vaqt rejimida kuzating.", grad: 'linear-gradient(135deg,#0EA5E9,#4F46E5)', shadow: 'rgba(14,165,233,0.32)' },
];

const STEPS = [
  { n: '1', title: "Ro'yxatdan o'ting", desc: 'Bir necha daqiqada bepul akkaunt yarating.',   Icon: UserPlus },
  { n: '2', title: 'Kurs tanlang',       desc: "Maqsadingizga mos yo'nalishni belgilang.",   Icon: ListChecks },
  { n: '3', title: "Darslarni o'rganing", desc: 'Video va materiallar bilan o\'rganing.',     Icon: BookOpen },
  { n: '4', title: 'Loyihalarni bajaring', desc: "Bilimni amaliyotda mustahkamlang.",         Icon: Layers },
  { n: '5', title: 'Sertifikat oling',   desc: "Yutuqlaringizni tasdiqlang.",                 Icon: Award },
];

const TESTIMONIALS = [
  { quote: "Frontend kursi karyeramni butunlay o'zgartirdi. Endi men IT kompaniyada ishlayman va har kuni yangi narsa yarataman.", name: 'Doniyor Rahimov',  role: 'Frontend Developer',    initials: 'DR', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)' },
  { quote: "Mentorlar juda sabrli va yordamga doim tayyor. Tushunmagan mavzularimni qayta-qayta tushuntirib berishdi.",           name: 'Madina Yusupova', role: 'Universitet talabasi',   initials: 'MY', grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)' },
  { quote: "Dasturlashni noldan boshladim. Amaliy loyihalar tufayli o'rgangan narsalarim mustahkam o'rnashib qoldi.",            name: 'Jasur Karimov',   role: 'Beginner Developer',    initials: 'JK', grad: 'linear-gradient(135deg,#22C55E,#06B6D4)' },
  { quote: "O'g'lim uchun eng to'g'ri qaror bo'ldi. Platforma qulay, darslar tushunarli, natijasini ko'rib turibman.",           name: 'Nigora Tosheva',  role: 'Ota-ona',               initials: 'NT', grad: 'linear-gradient(135deg,#F472B6,#7C3AED)' },
];

const MENTORS = [
  { name: 'Sardor Aliyev',    role: 'Senior Frontend Mentor', exp: "8 yil tajriba · 600+ o'quvchi", initials: 'SA', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', skills: ['React', 'TypeScript', 'Next.js'] },
  { name: 'Kamola Saidova',   role: 'Backend Mentor',         exp: "6 yil tajriba · 450+ o'quvchi", initials: 'KS', grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)', skills: ['Node.js', 'Python', 'SQL'] },
  { name: 'Bekzod Tursunov',  role: 'Flutter Mentor',         exp: "5 yil tajriba · 380+ o'quvchi", initials: 'BT', grad: 'linear-gradient(135deg,#22C55E,#06B6D4)', skills: ['Flutter', 'Dart', 'Firebase'] },
  { name: 'Dilnoza Rashidova',role: 'UI/UX Mentor',           exp: "7 yil tajriba · 520+ o'quvchi", initials: 'DR', grad: 'linear-gradient(135deg,#F59E0B,#DB2777)', skills: ['Figma', 'Design', 'Prototyping'] },
];

const FAQS = [
  { q: 'Kurslar qancha vaqt davom etadi?',             a: "Har bir kurs yo'nalishiga qarab 3 oydan 5 oygacha davom etadi. Darslarni o'zingizga qulay tezlikda o'rganishingiz mumkin — materiallar doimo ochiq qoladi." },
  { q: 'Oldindan dasturlash tajribasi kerakmi?',       a: "Yo'q. Ko'pchilik kurslarimiz mutlaqo boshlang'ich darajadagilar uchun mo'ljallangan. Biz asoslardan boshlab, qadam-baqadam murakkab mavzularga o'tamiz." },
  { q: "To'lovni qanday amalga oshiraman?",            a: "To'lovni Click, Payme yoki bank kartasi orqali qulay tarzda amalga oshirishingiz mumkin. Bo'lib-bo'lib to'lash imkoniyati ham mavjud." },
  { q: 'Kurs oxirida sertifikat beriladimi?',          a: 'Ha. Kursni muvaffaqiyatli yakunlab, yakuniy loyihani topshirganingizdan so\'ng rasmiy sertifikat olasiz.' },
  { q: 'Mentor bilan qanday bog\'lanaman?',            a: "Har bir o'quvchi shaxsiy mentorga biriktiriladi. Savollaringizni platforma ichidagi chat yoki jonli uchrashuvlar orqali bera olasiz." },
  { q: 'Darslarni qaysi qurilmada ko\'rishim mumkin?', a: "Platforma to'liq moslashuvchan — kompyuter, planshet va telefonda bir xil qulaylik bilan ishlaydi. Internet bo'lsa, istalgan joyda o'rganing." },
];

const FOOTER_COLS = [
  { title: 'Platforma',  links: ['Kurslar', 'Mentorlar', 'Narxlar', 'Sertifikatlar'] },
  { title: 'Kompaniya',  links: ['Biz haqimizda', 'Karyera', 'Bloglar', 'Hamkorlar'] },
  { title: 'Yordam',     links: ["Savol-javob", "Qo'llab-quvvatlash", 'Hujjatlar', "Bog'lanish"] },
];

const HERO_AVATARS = [
  'linear-gradient(135deg,#4F46E5,#7C3AED)',
  'linear-gradient(135deg,#06B6D4,#4F46E5)',
  'linear-gradient(135deg,#F472B6,#7C3AED)',
  'linear-gradient(135deg,#22C55E,#06B6D4)',
];

/* ─── css keyframes injected once ─── */
const KEYFRAMES = `
  @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes floatySlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes growBar { from{width:0} }
`;

/* ═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    getCourses({ status: 'published' }).then((r) => setDbCourses(r.data.courses.slice(0, 5))).catch(() => {});
  }, []);

  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));

  return (
    <div style={{ overflowX: 'hidden', background: '#F8FAFC', color: '#0F172A', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style>{KEYFRAMES}</style>

      {/* ══════════════ NAV ══════════════ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'saturate(180%) blur(18px)', WebkitBackdropFilter: 'saturate(180%) blur(18px)', background: 'rgba(248,250,252,0.82)', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(79,70,229,0.35)', flexShrink: 0 }}>
              <GraduationCap size={21} />
            </span>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: '#0F172A' }}>Junior<span style={{ color: '#4F46E5' }}>LMS</span></span>
          </a>

          {/* desktop links */}
          <div className="hidden lg:flex items-center" style={{ gap: 30 }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: 15, transition: 'color .2s' }}
                onMouseEnter={(e) => (e.target.style.color = '#4F46E5')}
                onMouseLeave={(e) => (e.target.style.color = '#475569')}>
                {l.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" className="hidden lg:block" style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 600, fontSize: 15, padding: '10px 16px', borderRadius: 12, transition: 'background .2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15,23,42,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              Kirish
            </Link>
            <Link to="/register" className="hidden sm:inline-block" style={{ textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: 15, padding: '11px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 10px 24px rgba(79,70,229,0.32)', transition: 'transform .2s,box-shadow .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(79,70,229,0.42)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(79,70,229,0.32)'; }}>
              Bepul boshlash
            </Link>
            <button className="flex lg:hidden" onClick={() => setMobileOpen((v) => !v)}
              style={{ alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, border: '1px solid rgba(15,23,42,0.08)', background: '#fff', cursor: 'pointer', color: '#0F172A' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div style={{ padding: '8px 18px 18px', display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid rgba(15,23,42,0.06)' }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: 16, padding: '12px 10px', borderRadius: 10, display: 'block' }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ══════════════ HERO ══════════════ */}
      <section id="top" style={{ position: 'relative', padding: '72px 0 88px', background: 'radial-gradient(900px 520px at 85% -10%,rgba(124,58,237,0.14),transparent 60%),radial-gradient(760px 520px at 5% 10%,rgba(6,182,212,0.12),transparent 55%),radial-gradient(800px 600px at 50% 120%,rgba(79,70,229,0.10),transparent 60%),#F8FAFC', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 56 }}>
            {/* copy */}
            <div style={{ animation: 'fadeUp .7s ease both' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.16)', color: '#4F46E5', fontWeight: 700, fontSize: 13 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#06B6D4', animation: 'pulseDot 1.6s infinite', display: 'inline-block' }} />
                O'zbekistondagi zamonaviy IT ta'lim platformasi
              </span>
              <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(38px,5.4vw,64px)', lineHeight: 1.04, letterSpacing: '-0.03em', margin: '22px 0 0', color: '#0F172A' }}>
                Kelajagingizni{' '}
                <span style={{ background: 'linear-gradient(120deg,#4F46E5,#7C3AED 55%,#06B6D4)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>bugundan</span>
                {' '}boshlang
              </h1>
              <p style={{ fontSize: 'clamp(17px,1.6vw,20px)', lineHeight: 1.6, color: '#475569', margin: '22px 0 0', maxWidth: 520 }}>
                Frontend, Backend, Flutter va boshqa IT kurslarini zamonaviy platforma orqali o'rganing. Amaliyot, mentor yordami va sertifikat — barchasi bir joyda.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 34 }}>
                <a href="#courses"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: 16, padding: '15px 26px', borderRadius: 14, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 14px 30px rgba(79,70,229,0.36)', transition: 'transform .2s,box-shadow .2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(79,70,229,0.46)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(79,70,229,0.36)'; }}>
                  Kurslarni ko'rish <ArrowRight size={18} />
                </a>
                <Link to="/register"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0F172A', fontWeight: 700, fontSize: 16, padding: '15px 26px', borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(15,23,42,0.10)', backdropFilter: 'blur(8px)', transition: 'transform .2s,border-color .2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(15,23,42,0.10)'; }}>
                  <Play size={17} style={{ color: '#4F46E5' }} /> Bepul boshlash
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30 }}>
                <div style={{ display: 'flex' }}>
                  {HERO_AVATARS.map((g, i) => (
                    <span key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: g, border: '2.5px solid #F8FAFC', marginLeft: i === 0 ? 0 : -10, boxShadow: '0 2px 6px rgba(15,23,42,0.12)', display: 'inline-block' }} />
                  ))}
                </div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.4 }}>
                  <strong style={{ color: '#0F172A' }}>1000+ o'quvchi</strong><br />allaqachon biz bilan o'rganmoqda
                </div>
              </div>
            </div>

            {/* dashboard mockup */}
            <div className="hidden lg:block" style={{ position: 'relative', animation: 'fadeUp .7s .12s ease both' }}>
              <div style={{ position: 'absolute', inset: -30, background: 'radial-gradient(closest-side,rgba(124,58,237,0.18),transparent)', filter: 'blur(20px)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 2, borderRadius: 24, background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 70px rgba(30,27,75,0.22)', overflow: 'hidden' }}>
                {/* top bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: '1px solid rgba(15,23,42,0.06)', background: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FB7185', display: 'inline-block' }} />
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FBBF24', display: 'inline-block' }} />
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                  <span style={{ marginLeft: 10, fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>app.juniorlms.uz/dashboard</span>
                </div>
                <div style={{ display: 'flex' }}>
                  {/* mini sidebar */}
                  <div style={{ width: 60, padding: '18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, background: 'linear-gradient(180deg,#4F46E5,#7C3AED)' }}>
                    <LayoutGrid size={20} color="#fff" />
                    <BookOpen size={20} color="rgba(255,255,255,0.6)" />
                    <BarChart3 size={20} color="rgba(255,255,255,0.6)" />
                    <Award size={20} color="rgba(255,255,255,0.6)" />
                  </div>
                  {/* main */}
                  <div style={{ flex: 1, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Xush kelibsiz,</div>
                        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 19, fontWeight: 700, color: '#0F172A' }}>Aziz Yusupov</div>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#06B6D4,#4F46E5)' }} />
                    </div>
                    <div style={{ marginTop: 16, borderRadius: 16, padding: 16, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 12px 24px rgba(79,70,229,0.3)' }}>
                      <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Davom etayotgan kurs</div>
                      <div style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 700, marginTop: 2 }}>Frontend Development</div>
                      <div style={{ marginTop: 12, height: 7, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                        <div style={{ width: '68%', height: '100%', borderRadius: 99, background: '#fff', animation: 'growBar 1.3s ease both' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 600 }}>
                        <span>68% tugallandi</span><span>82 / 120 dars</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                      {[['12', 'Faol kunlar'], ['3', 'Sertifikatlar']].map(([n, l]) => (
                        <div key={l} style={{ borderRadius: 13, padding: 12, background: '#F1F5F9' }}>
                          <div style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{n}</div>
                          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* floating badges */}
              <div style={{ position: 'absolute', zIndex: 3, top: -22, left: -26, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', borderRadius: 16, background: '#fff', boxShadow: '0 16px 34px rgba(30,27,75,0.16)', animation: 'floaty 5s ease-in-out infinite' }}>
                <span style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#06B6D4,#4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><TrendingUp size={18} /></span>
                <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Haftalik progress</div><div style={{ fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 700, color: '#0F172A' }}>+24%</div></div>
              </div>
              <div style={{ position: 'absolute', zIndex: 3, bottom: -20, right: -18, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', borderRadius: 16, background: '#fff', boxShadow: '0 16px 34px rgba(30,27,75,0.16)', animation: 'floatySlow 6s ease-in-out infinite' }}>
                <span style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#22C55E,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Award size={18} /></span>
                <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Yangi yutuq</div><div style={{ fontFamily: "'Space Grotesk'", fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Sertifikat olindi</div></div>
              </div>
              <div style={{ position: 'absolute', zIndex: 3, top: '42%', right: -30, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 14, background: '#fff', boxShadow: '0 14px 30px rgba(30,27,75,0.14)', animation: 'floaty 4.4s ease-in-out infinite' }}>
                <span style={{ color: '#FBBF24', fontSize: 15 }}>★</span>
                <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#0F172A', fontSize: 14 }}>4.9</span>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>reyting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section style={{ padding: '8px 0 40px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 18, padding: 30, borderRadius: 24, background: '#fff', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 16px 44px rgba(30,27,75,0.06)' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: 8 }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(32px,3.6vw,42px)', letterSpacing: '-0.02em', background: 'linear-gradient(120deg,#4F46E5,#7C3AED)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.num}</div>
                <div style={{ marginTop: 6, fontSize: 15, color: '#64748B', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ COURSES ══════════════ */}
      <section id="courses" style={{ padding: '70px 0', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#4F46E5' }}>Mashhur kurslar</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.8vw,46px)', letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>Bugun o'rganishni boshlang</h2>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, margin: '14px 0 0' }}>Eng talab yuqori bo'lgan yo'nalishlar bo'yicha amaliyotga asoslangan kurslar.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 24, marginTop: 46 }}>
            {COURSES.map((c) => (
              <CourseCard key={c.title} course={c} href="#cta" />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#7C3AED' }}>Nega Junior LMS?</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.8vw,46px)', letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>O'rganish uchun kerakli barcha narsa</h2>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, margin: '14px 0 0' }}>Zamonaviy ta'lim tajribasini tashkil etuvchi imkoniyatlar.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, marginTop: 46 }}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PROCESS ══════════════ */}
      <section id="process" style={{ padding: '84px 0', background: 'radial-gradient(700px 400px at 90% 0%,rgba(124,58,237,0.10),transparent 60%),radial-gradient(600px 400px at 0% 100%,rgba(6,182,212,0.08),transparent 60%),#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#06B6D4' }}>O'quv jarayoni</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.8vw,46px)', letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>5 ta oddiy qadamda</h2>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, margin: '14px 0 0' }}>Ro'yxatdan o'tishdan sertifikatgacha — aniq va tushunarli yo'l.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: 18, marginTop: 50 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ position: 'relative', textAlign: 'center', padding: '26px 16px', borderRadius: 20, background: '#fff', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 10px 26px rgba(30,27,75,0.05)' }}>
                <div style={{ width: 54, height: 54, margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 21, color: '#fff', boxShadow: '0 10px 22px rgba(79,70,229,0.3)' }}>{s.n}</div>
                <div style={{ marginTop: 14, color: '#4F46E5', display: 'flex', justifyContent: 'center' }}><s.Icon size={22} /></div>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: '#0F172A', margin: '10px 0 0' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, margin: '6px 0 0' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#4F46E5' }}>Fikrlar</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.8vw,46px)', letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>O'quvchilarimiz nima deyishadi</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, marginTop: 46 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ display: 'flex', flexDirection: 'column', padding: 26, borderRadius: 20, background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.05)' }}>
                <div style={{ color: '#FBBF24', fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.65, margin: '14px 0 0', flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <span style={{ width: 46, height: 46, borderRadius: '50%', background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{t.initials}</span>
                  <div><div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{t.name}</div><div style={{ fontSize: 13, color: '#64748B' }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ MENTORS ══════════════ */}
      <section id="mentors" style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#7C3AED' }}>Mentorlar</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.8vw,46px)', letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>Soha mutaxassislaridan o'rganing</h2>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, margin: '14px 0 0' }}>Real loyihalarda ishlagan tajribali mentorlar sizga yo'l ko'rsatadi.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 22, marginTop: 46 }}>
            {MENTORS.map((m) => (
              <MentorCard key={m.name} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section id="faq" style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#06B6D4' }}>Savol-javob</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(30px,3.8vw,46px)', letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>Ko'p so'raladigan savollar</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderRadius: 16, background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.06)', overflow: 'hidden' }}>
                <button onClick={() => toggleFaq(i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, textAlign: 'left', padding: '20px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 17, color: '#0F172A' }}>
                  <span>{f.q}</span>
                  <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 9, background: openFaq === i ? '#4F46E5' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openFaq === i ? '#fff' : '#64748B', transition: 'transform .25s,background .25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown size={18} />
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 22px', fontSize: 15, color: '#475569', lineHeight: 1.65, animation: 'fadeUp .3s ease both' }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section id="cta" style={{ padding: '40px 0 90px', background: '#fff' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 32, padding: 'clamp(40px,6vw,72px)', textAlign: 'center', background: 'radial-gradient(600px 300px at 15% 20%,rgba(6,182,212,0.5),transparent 60%),radial-gradient(600px 360px at 85% 90%,rgba(124,58,237,0.6),transparent 60%),linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 30px 70px rgba(79,70,229,0.4)' }}>
            <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', top: -80, left: -60 }} />
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', bottom: -60, right: -40 }} />
            <h2 style={{ position: 'relative', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(28px,4.4vw,52px)', letterSpacing: '-0.025em', lineHeight: 1.1, color: '#fff', margin: '0 auto', maxWidth: 760 }}>IT sohasidagi karyerangizni bugun boshlang</h2>
            <p style={{ position: 'relative', fontSize: 'clamp(16px,1.6vw,19px)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '18px auto 0', maxWidth: 560 }}>Bepul ro'yxatdan o'ting va birinchi darslaringizni hoziroq oching. Hech qanday tajriba talab qilinmaydi.</p>
            <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 34 }}>
              <Link to="/register"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#4F46E5', fontWeight: 700, fontSize: 16, padding: '15px 28px', borderRadius: 14, background: '#fff', boxShadow: '0 14px 30px rgba(0,0,0,0.18)', transition: 'transform .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
                Hoziroq boshlash <ArrowRight size={18} />
              </Link>
              <a href="tel:+998712007070"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: 16, padding: '15px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.35)', transition: 'background .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}>
                <Phone size={17} /> Bog'lanish
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: '#0F172A', color: '#CBD5E1', padding: '64px 0 30px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40 }}>
            <div style={{ maxWidth: 300 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><GraduationCap size={21} /></span>
                <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: '#fff' }}>Junior<span style={{ color: '#818CF8' }}>LMS</span></span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#94A3B8', margin: '16px 0 0' }}>Zamonaviy IT ta'lim platformasi. Kelajagingizni biz bilan quring.</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                {[Send, MessageCircle, Globe, Mail].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', transition: 'background .2s,color .2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#CBD5E1'; }}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: '#fff' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
                  {col.links.map((l) => (
                    <a key={l} href="#" style={{ textDecoration: 'none', fontSize: 14, color: '#94A3B8', transition: 'color .2s' }}
                      onMouseEnter={(e) => (e.target.style.color = '#fff')}
                      onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: '#fff' }}>Bog'lanish</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, fontSize: 14, color: '#94A3B8' }}>
                {[
                  [Mail,   'info@juniorlms.uz'],
                  [Phone,  '+998 71 200 70 70'],
                  [MapPin, "Toshkent, Amir Temur ko'chasi 1"],
                ].map(([Icon, text]) => (
                  <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                    <Icon size={16} color="#818CF8" />{text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: '#64748B' }}>
            <span>© 2026 Junior LMS. Barcha huquqlar himoyalangan.</span>
            <span style={{ display: 'flex', gap: 22 }}>
              {['Maxfiylik siyosati', 'Foydalanish shartlari'].map((t) => (
                <a key={t} href="#" style={{ color: '#64748B', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={(e) => (e.target.style.color = '#CBD5E1')}
                  onMouseLeave={(e) => (e.target.style.color = '#64748B')}>
                  {t}
                </a>
              ))}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─── sub-components ─── */
function CourseCard({ course, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: 22, background: '#fff', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 10px 30px rgba(30,27,75,0.05)', overflow: 'hidden', transition: 'transform .25s,box-shadow .25s', transform: hovered ? 'translateY(-6px)' : 'none', boxShadow: hovered ? '0 26px 50px rgba(30,27,75,0.13)' : '0 10px 30px rgba(30,27,75,0.05)' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: 'relative', height: 138, background: course.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', top: -50, right: -40 }} />
        <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', bottom: -30, left: -20 }} />
        <span style={{ position: 'relative', width: 62, height: 62, borderRadius: 18, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <course.Icon size={28} />
        </span>
        <span style={{ position: 'absolute', top: 14, left: 14, padding: '5px 11px', borderRadius: 99, background: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{course.level}</span>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: '#0F172A' }}>{course.title}</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5, marginTop: 6, flex: 1 }}>{course.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, fontSize: 13, color: '#475569', fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Clock size={15} color="#94A3B8" />{course.duration}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><PlayCircle size={15} color="#94A3B8" />{course.lessons}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(15,23,42,0.06)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, color: '#0F172A' }}><span style={{ color: '#FBBF24' }}>★</span>{course.rating}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, color: '#4F46E5' }}>Batafsil <ArrowRight size={15} /></span>
        </div>
      </div>
    </a>
  );
}

function FeatureCard({ title, Icon, desc, grad, shadow }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ padding: 28, borderRadius: 20, background: hovered ? '#fff' : '#F8FAFC', border: '1px solid rgba(15,23,42,0.05)', transition: 'transform .25s,box-shadow .25s,background .25s', transform: hovered ? 'translateY(-4px)' : 'none', boxShadow: hovered ? '0 18px 40px rgba(30,27,75,0.08)' : 'none' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span style={{ width: 54, height: 54, borderRadius: 16, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 10px 22px ${shadow}` }}><Icon size={24} /></span>
      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: '#0F172A', margin: '18px 0 0' }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, margin: '8px 0 0' }}>{desc}</p>
    </div>
  );
}

function MentorCard({ name, role, exp, initials, grad, skills }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ borderRadius: 22, background: '#fff', border: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 10px 30px rgba(30,27,75,0.05)', overflow: 'hidden', transition: 'transform .25s,box-shadow .25s', transform: hovered ? 'translateY(-5px)' : 'none', boxShadow: hovered ? '0 24px 48px rgba(30,27,75,0.12)' : '0 10px 30px rgba(30,27,75,0.05)' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: 'relative', height: 150, background: grad, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <span style={{ position: 'absolute', top: 18, right: 18, width: 11, height: 11, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', transform: 'translateY(45px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 30, color: '#4F46E5', boxShadow: '0 8px 20px rgba(15,23,42,0.14)' }}>{initials}</div>
      </div>
      <div style={{ padding: '54px 22px 22px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: '#0F172A' }}>{name}</div>
        <div style={{ fontSize: 14, color: '#4F46E5', fontWeight: 600, marginTop: 3 }}>{role}</div>
        <div style={{ fontSize: 13, color: '#64748B', marginTop: 6 }}>{exp}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 14 }}>
          {skills.map((sk) => (
            <span key={sk} style={{ padding: '5px 11px', borderRadius: 99, background: '#F1F5F9', fontSize: 12, fontWeight: 600, color: '#475569' }}>{sk}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
          {[Mail, Code, Send].map((Icon, i) => (
            <SocialBtn key={i} Icon={Icon} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ Icon }) {
  const [h, setH] = useState(false);
  return (
    <a href="#" style={{ width: 36, height: 36, borderRadius: 10, background: h ? '#4F46E5' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: h ? '#fff' : '#475569', transition: 'background .2s,color .2s' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <Icon size={17} />
    </a>
  );
}
