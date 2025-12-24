import React, { useState, useEffect } from 'react';

// --- STYLES (עיצוב מוטמע) ---
const GLOBAL_STYLES = `
:root {
  --primary: #0f172a;
  --accent: #2563eb;
  --bg: #f8fafc;
  --text: #1e293b;
  --border: #e2e8f0;
}
body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); direction: rtl; }
.container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
.navbar { background: rgba(255,255,255,0.9); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; padding: 1rem 0; backdrop-filter: blur(8px); }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.brand { font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--primary); }
.btn { padding: 0.6rem 1.2rem; border-radius: 99px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s; font-size: 0.95rem; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.btn-secondary { background: white; border: 1px solid var(--border); color: var(--text); }
.btn:hover { opacity: 0.9; transform: translateY(-1px); }
.card { background: white; border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; transition: 0.2s; }
.card:hover { border-color: var(--accent); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
.grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.hero { text-align: center; padding: 4rem 1rem; }
.hero h1 { font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.1; }
.hero span { color: var(--accent); }
.input-group { position: relative; max-width: 500px; margin: 2rem auto; }
.input-field { width: 100%; padding: 1rem 3rem 1rem 1rem; border-radius: 99px; border: 1px solid var(--border); font-size: 1.1rem; box-sizing: border-box; }
.icon-absolute { position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); color: #94a3b8; }
.wizard-step { display: flex; justify-content: space-between; padding: 1rem; border: 1px solid var(--border); border-radius: 0.75rem; margin-bottom: 0.75rem; cursor: pointer; background: white; transition: 0.2s; }
.wizard-step:hover { border-color: var(--accent); }
.wizard-step.selected { border-color: var(--primary); background: #eff6ff; ring: 2px solid var(--primary); }
.time-slot { padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.5rem; text-align: center; cursor: pointer; background: white; }
.time-slot:hover { border-color: var(--accent); }
.time-slot.selected { background: var(--primary); color: white; border-color: var(--primary); }
.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// --- ICONS (SVG) ---
const Icon = ({ path }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);
const Icons = {
  Scissors: <Icon path={<><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></>} />,
  Calendar: <Icon path={<><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>} />,
  User: <Icon path={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  Check: <Icon path={<polyline points="20 6 9 17 4 12"/>} />,
  Search: <Icon path={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>} />,
  Star: <Icon path={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />,
  MapPin: <Icon path={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} />,
  ChevronRight: <Icon path={<path d="m9 18 6-6-6-6"/>} />,
  LogOut: <Icon path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>} />,
  Settings: <Icon path={<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>} />
};

// --- DATA ---
const DATA = {
  businesses: [
    { id: "b1", name: "Royal Cuts TLV", address: "דיזנגוף 100, תל אביב", category: "Barbershop", rating: 4.9, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80" },
    { id: "b2", name: "Glamour Spa", address: "רוטשילד 45, תל אביב", category: "Spa", rating: 4.8, image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80" }
  ],
  services: {
    "b1": [{ id: 1, name: "תספורת גבר קלאסית", price: 80, duration: 30 }, { id: 2, name: "עיצוב זקן ומגבת", price: 50, duration: 20 }, { id: 3, name: "תספורת + זקן VIP", price: 120, duration: 50 }],
    "b2": [{ id: 4, name: "מניקור ג'ל", price: 120, duration: 45 }, { id: 5, name: "עיסוי שוודי", price: 350, duration: 60 }]
  },
  workers: {
    "b1": [{ id: 1, name: "דניאל", role: "Master Barber", image: "https://randomuser.me/api/portraits/men/32.jpg" }, { id: 2, name: "יוסי", role: "Stylist", image: "https://randomuser.me/api/portraits/men/45.jpg" }],
    "b2": [{ id: 3, name: "שרה", role: "Nail Artist", image: "https://randomuser.me/api/portraits/women/44.jpg" }]
  }
};

// --- COMPONENTS ---

const Navbar = ({ user, setView, onLogout }) => (
  <nav className="navbar">
    <div className="container nav-inner">
      <div className="brand" onClick={() => setView('home')}>
        {Icons.Scissors} Style<span>Queue</span>
      </div>
      <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
        {user ? (
          <>
            <div style={{textAlign:'center', fontSize:'0.85rem'}}>
              <strong>{user.name}</strong>
              <div style={{color:'#64748b', fontSize:'0.75rem'}}>{user.role === 'admin' ? 'מנהל' : 'לקוח'}</div>
            </div>
            <button className="btn btn-secondary" style={{padding:'0.5rem'}} onClick={onLogout}>{Icons.LogOut}</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => setView('login')}>התחברות</button>
        )}
      </div>
    </div>
  </nav>
);

const Home = ({ onSelect }) => (
  <div className="container fade-in">
    <div className="hero">
      <span style={{background:'#dbeafe', color:'#1e40af', padding:'0.2rem 0.8rem', borderRadius:'99px', fontSize:'0.85rem', fontWeight:'bold'}}>
        הפלטפורמה המובילה בישראל
      </span>
      <h1>קבע את התור הבא שלך<br/><span>בקלות ובסטייל</span></h1>
      <div className="input-group">
        <span className="icon-absolute">{Icons.Search}</span>
        <input className="input-field" placeholder="חפש עסק, שירות או עיר..." />
      </div>
    </div>

    <h3 style={{marginBottom:'1rem', marginTop:'2rem'}}>עסקים מומלצים</h3>
    <div className="grid">
      {DATA.businesses.map(b => (
        <div key={b.id} className="card" onClick={() => onSelect(b)} style={{padding:0, overflow:'hidden', cursor:'pointer'}}>
          <img src={b.image} style={{width:'100%', height:200, objectFit:'cover'}} alt={b.name}/>
          <div style={{padding:'1.5rem'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
              <span style={{background:'#fef3c7', color:'#92400e', padding:'0.1rem 0.5rem', borderRadius:'4px', fontSize:'0.75rem', fontWeight:'bold'}}>{b.category}</span>
              <span style={{display:'flex', alignItems:'center', gap:4, fontWeight:'bold', color:'#f59e0b'}}>{Icons.Star} {b.rating}</span>
            </div>
            <h3 style={{margin:'0 0 0.5rem 0'}}>{b.name}</h3>
            <p style={{margin:0, color:'#64748b', display:'flex', alignItems:'center', gap:4, fontSize:'0.9rem'}}>{Icons.MapPin} {b.address}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Booking = ({ business, services, workers, onBack, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  return (
    <div className="container fade-in" style={{maxWidth:600}}>
      <button onClick={step === 1 ? onBack : () => setStep(s=>s-1)} style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:'#64748b', marginBottom:'1rem'}}>
        {Icons.ChevronRight} חזרה
      </button>
      
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{margin:0}}>{step === 1 ? 'בחר שירות' : step === 2 ? 'בחר איש צוות' : step === 3 ? 'בחר שעה' : 'אישור הזמנה'}</h2>
        <div style={{height:4, background:'#e2e8f0', borderRadius:2, marginTop:'1rem', overflow:'hidden'}}>
          <div style={{height:'100%', width:`${step * 25}%`, background:'var(--primary)', transition:'0.3s'}}></div>
        </div>
      </div>

      {step === 1 && services.map(s => (
        <div key={s.id} className={`wizard-step ${data.service?.id === s.id ? 'selected' : ''}`} onClick={() => { setData({...data, service: s}); setStep(2); }}>
          <div>
            <div style={{fontWeight:'bold'}}>{s.name}</div>
            <div style={{fontSize:'0.85rem', color:'#64748b'}}>{s.duration} דקות</div>
          </div>
          <div style={{fontWeight:'bold'}}>₪{s.price}</div>
        </div>
      ))}

      {step === 2 && workers.map(w => (
        <div key={w.id} className={`wizard-step ${data.worker?.id === w.id ? 'selected' : ''}`} onClick={() => { setData({...data, worker: w}); setStep(3); }}>
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <img src={w.image} style={{width:50, height:50, borderRadius:'50%', objectFit:'cover'}} />
            <div>
              <div style={{fontWeight:'bold'}}>{w.name}</div>
              <div style={{fontSize:'0.85rem', color:'#64748b'}}>{w.role}</div>
            </div>
          </div>
        </div>
      ))}

      {step === 3 && <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem'}}>
        {['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30'].map(t => (
          <div key={t} className={`time-slot ${data.time === t ? 'selected' : ''}`} onClick={() => { setData({...data, time: t}); setStep(4); }}>{t}</div>
        ))}
      </div>}

      {step === 4 && (
        <div className="card" style={{textAlign:'center'}}>
          <h3 style={{borderBottom:'1px solid #eee', paddingBottom:'1rem', marginBottom:'1rem'}}>סיכום פרטים</h3>
          <div style={{textAlign:'right', marginBottom:'1.5rem'}}>
            <p><strong>עסק:</strong> {business.name}</p>
            <p><strong>שירות:</strong> {data.service?.name}</p>
            <p><strong>צוות:</strong> {data.worker?.name}</p>
            <p><strong>שעה:</strong> {data.time}</p>
            <h2 style={{marginTop:'1rem'}}>₪{data.service?.price}</h2>
          </div>
          <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={onSubmit}>אשר הזמנה</button>
        </div>
      )}
    </div>
  );
};

const Admin = () => (
  <div className="container fade-in">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
      <h1>לוח בקרה</h1>
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn btn-secondary">{Icons.Settings}</button>
      </div>
    </div>
    <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', marginBottom:'2rem'}}>
      <div className="card"><h3>₪12,500</h3><small>הכנסות החודש</small></div>
      <div className="card"><h3>48</h3><small>תורים השבוע</small></div>
      <div className="card"><h3>120</h3><small>לקוחות חדשים</small></div>
    </div>
    <div className="card" style={{padding:0, overflow:'hidden'}}>
      <div style={{padding:'1rem', background:'#f8fafc', borderBottom:'1px solid #eee', fontWeight:'bold'}}>תורים אחרונים</div>
      {[1,2,3].map(i => (
        <div key={i} style={{padding:'1rem', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
          <span>לקוח לדוגמה {i}</span>
          <span style={{background:'#dcfce7', color:'#166534', padding:'0.2rem 0.6rem', borderRadius:'99px', fontSize:'0.8rem', fontWeight:'bold'}}>מאושר</span>
        </div>
      ))}
    </div>
  </div>
);

const Login = ({ onLogin }) => (
  <div className="container fade-in" style={{minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div className="card" style={{width:'100%', maxWidth:400, textAlign:'center'}}>
      <div style={{width:60, height:60, background:'var(--primary)', color:'white', borderRadius:'1rem', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem auto'}}>{Icons.Scissors}</div>
      <h2>התחברות</h2>
      <p style={{color:'#64748b', marginBottom:'2rem'}}>הזן פרטים לכניסה למערכת</p>
      <input className="input-field" style={{marginBottom:'1rem'}} placeholder="אימייל (admin@demo.com למנהל)" />
      <input className="input-field" style={{marginBottom:'1rem'}} type="password" placeholder="סיסמה" />
      <div style={{display:'flex', gap:'1rem'}}>
        <button className="btn btn-secondary" style={{flex:1, justifyContent:'center'}} onClick={() => onLogin('user')}>לקוח</button>
        <button className="btn btn-primary" style={{flex:1, justifyContent:'center'}} onClick={() => onLogin('admin')}>מנהל</button>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  // Inject styles dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [view, setView] = useState('home'); // home, booking, login, admin, success
  const [user, setUser] = useState(null);
  const [selectedBiz, setSelectedBiz] = useState(null);

  const handleLogin = (type) => {
    setUser({ name: type === 'admin' ? 'מנהל מערכת' : 'ישראל ישראלי', role: type });
    setView(type === 'admin' ? 'admin' : 'home');
  };

  const handleSelectBiz = (b) => { setSelectedBiz(b); setView('booking'); };

  return (
    <div>
      <Navbar user={user} setView={setView} onLogout={() => { setUser(null); setView('home'); }} />
      
      {view === 'home' && <Home onSelect={handleSelectBiz} />}
      
      {view === 'booking' && selectedBiz && (
        <Booking 
          business={selectedBiz} 
          services={DATA.services[selectedBiz.id]} 
          workers={DATA.workers[selectedBiz.id]}
          onBack={() => setView('home')}
          onSubmit={() => setView('success')}
        />
      )}

      {view === 'admin' && <Admin />}
      
      {view === 'login' && <Login onLogin={handleLogin} />}

      {view === 'success' && (
        <div className="container fade-in" style={{textAlign:'center', marginTop:'4rem'}}>
          <div style={{width:80, height:80, background:'#dcfce7', color:'#166534', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem auto'}}>{Icons.Check}</div>
          <h2>ההזמנה בוצעה בהצלחה!</h2>
          <p style={{color:'#64748b'}}>אישור נשלח למייל שלך.</p>
          <button className="btn btn-secondary" style={{margin:'1rem auto'}} onClick={() => setView('home')}>חזרה לדף הבית</button>
        </div>
      )}
    </div>
  );
};

export default App;