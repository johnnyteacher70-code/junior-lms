import { useState } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';

const CONVS = [
  { id: 1, name: 'Sardor Aliyev', role: 'Mentor', initials: 'SA', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', last: "React Hooks darsida ko'rishguncha!", time: '14:20', unread: 2 },
  { id: 2, name: 'Kamola Saidova', role: 'Mentor', initials: 'KS', grad: 'linear-gradient(135deg,#06B6D4,#4F46E5)', last: "Topshiriqni yuborish vaqti o'tdi, iltimos...", time: 'Kecha', unread: 1 },
  { id: 3, name: 'Junior LMS', role: 'Bildirishnoma', initials: 'JL', grad: 'linear-gradient(135deg,#22C55E,#06B6D4)', last: "Yangi dars qo'shildi: CSS Grid", time: '2 kun', unread: 0 },
];

const MESSAGES = {
  1: [
    { from: 'them', text: "Salom! React Hooks darsida savolingiz bor edimi?", time: '14:10' },
    { from: 'me',   text: "Ha, useState bilan useEffect qanday farqlanadi?", time: '14:12' },
    { from: 'them', text: "useState — ma'lumot saqlash uchun, useEffect — yon ta'sirlar (API so'rov, subscription) uchun. Keyingi darsda ko'proq misollar bilan tushuntiraman!", time: '14:15' },
    { from: 'me',   text: "Rahmat, tushundim 🙏", time: '14:17' },
    { from: 'them', text: "React Hooks darsida ko'rishguncha!", time: '14:20' },
  ],
  2: [
    { from: 'them', text: "Assalomu alaykum! Topshiriqni yuborish vaqti o'tdi, iltimos imkon qadar tezroq yuboring.", time: 'Kecha 16:30' },
  ],
  3: [
    { from: 'them', text: "Yangi dars qo'shildi: CSS Grid to'liq qo'llanma. Hoziroq o'rganing!", time: '2 kun oldin' },
  ],
};

export default function Messages() {
  const [active, setActive] = useState(1);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState(MESSAGES);

  const send = () => {
    if (!text.trim()) return;
    setMsgs(prev => ({
      ...prev,
      [active]: [...(prev[active] || []), { from: 'me', text: text.trim(), time: 'Hozir' }],
    }));
    setText('');
  };

  const conv = CONVS.find(c => c.id === active);
  const thread = msgs[active] || [];

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 200px)', minHeight: 480 }}>

      {/* Conversations */}
      <div style={{ width: 280, flexShrink: 0, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)', margin: '0 0 12px' }}>Xabarlar</h2>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="var(--text-mute)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input placeholder="Qidirish..." style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 11, border: '1px solid var(--border)', background: 'var(--surface-2)', fontFamily: "'Plus Jakarta Sans'", fontSize: 13.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {CONVS.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', border: 'none', background: active === c.id ? 'rgba(79,70,229,0.08)' : 'transparent', cursor: 'pointer', transition: 'background .18s', textAlign: 'left' }}
              onMouseEnter={(e) => { if (active !== c.id) e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={(e) => { if (active !== c.id) e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: c.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{c.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-mute)' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-soft)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</div>
              </div>
              {c.unread > 0 && (
                <span style={{ width: 20, height: 20, borderRadius: 99, background: '#4F46E5', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, minWidth: 0, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: conv?.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{conv?.initials}</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{conv?.name}</div>
            <div style={{ fontSize: 12.5, color: '#22C55E', fontWeight: 600 }}>● Online</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {thread.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.from === 'me' ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'var(--surface-2)', color: m.from === 'me' ? '#fff' : 'var(--text)', fontSize: 14, lineHeight: 1.5, boxShadow: m.from === 'me' ? '0 4px 12px rgba(79,70,229,0.25)' : 'none' }}>
                <p style={{ margin: 0 }}>{m.text}</p>
                <p style={{ margin: '5px 0 0', fontSize: 11, opacity: 0.7, textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexShrink: 0 }}>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Xabar yozing..." style={{ flex: 1, padding: '11px 16px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface-2)', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: 'var(--text)', outline: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = '#4F46E5')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
          <button onClick={send}
            style={{ width: 44, height: 44, borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(79,70,229,0.28)' }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
