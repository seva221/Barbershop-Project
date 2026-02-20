import React, { useState, useEffect } from 'react';
import * as api from './api';

// --- STYLES (מתוקן ליישור לימין ותמיכה ב-RTL) ---
const GLOBAL_STYLES = `
:root {
  --primary: #0f172a;
  --accent: #2563eb;
  --accent-light: #60a5fa;
  --bg: #f8fafc;
  --card-bg: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body { 
  margin: 0; 
  font-family: 'Inter', system-ui, -apple-system, sans-serif; 
  background: var(--bg); 
  color: var(--text-main); 
  direction: rtl; 
  text-align: right; /* יישור טקסט לימין */
  line-height: 1.6;
}

.container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

/* Navbar - תיקון יישור */
.navbar { 
  background: rgba(255, 255, 255, 0.8); 
  backdrop-filter: blur(10px); 
  border-bottom: 1px solid var(--border); 
  position: sticky; 
  top: 0; 
  z-index: 1000; 
  padding: 1rem 0; 
}
.nav-inner { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-direction: row-reverse; /* הופך את הסדר עבור עברית */
}
.brand { 
  font-size: 1.5rem; 
  font-weight: 900; 
  color: var(--primary); 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 0.5rem;
}
.brand span { color: var(--accent); }

/* Hero Section */
.hero { 
  text-align: center; 
  padding: 6rem 1rem; 
  background: radial-gradient(circle at top left, #eff6ff, transparent);
}
.hero h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; color: var(--primary); }
.hero h1 span { 
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Grid & Cards */
.grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-top: 2rem; }
.card { 
  background: var(--card-bg); 
  border-radius: 24px; 
  overflow: hidden; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.02); 
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
}
.card:hover { transform: translateY(-10px); box-shadow: var(--shadow); border-color: var(--accent-light); }
.card-img { width: 100%; height: 220px; object-fit: cover; }
.card-content { padding: 1.5rem; }

/* Inputs & Forms - תיקון יישור */
.input-field {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 1rem;
  box-sizing: border-box;
  font-size: 1rem;
  transition: 0.2s;
  background: #fff;
  text-align: right; /* יישור הקלדה לימין */
}
.input-field:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }

/* Tabs for Auth */
.tabs {
  display: flex;
  background: #f1f5f9;
  padding: 0.3rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  direction: ltr; /* כפתורי הטאבים יישארו משמאל לימין למראה מודרני */
}
.tab {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
  background: transparent;
}
.tab.active {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  color: var(--accent);
}

.wizard-container { max-width: 650px; margin: 3rem auto; padding: 2.5rem; background: white; border-radius: 28px; box-shadow: var(--shadow); }

.fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

const Icons = {
  Scissors: <span>✂️</span>,
  Check: <span>✅</span>,
  MapPin: <span>📍</span>,
  LogOut: <span>🚪</span>
};

// --- COMPONENTS ---

const Navbar = ({ user, setView, onLogout }) => (
  <nav className="navbar">
    <div className="container nav-inner">
      <div className="brand" onClick={() => setView('home')}>
        Style<span>Queue</span> {Icons.Scissors}
      </div>
      <div>
        {user ? (
          <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:'800', fontSize:'0.9rem'}}>{user.name}</div>
              <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>
                {user.role === 'admin' ? 'מנהל עסק' : 'לקוח'}
              </div>
            </div>
            <button onClick={onLogout} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem'}}>{Icons.LogOut}</button>
          </div>
        ) : (
          <button className="btn btn-primary" style={{padding:'0.6rem 1.5rem'}} onClick={() => setView('login')}>התחברות</button>
        )}
      </div>
    </div>
  </nav>
);

const Auth = ({ onLogin, onRegisterUser, onRegisterBusiness }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [regType, setRegType] = useState('customer');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '', 
    category: 'Barbershop' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.email.trim(), formData.password);
    } else {
      if (regType === 'business') {
        onRegisterBusiness(formData);
      } else {
        onRegisterUser(formData.name, formData.email.trim(), formData.password);
      }
    }
  };

  return (
    <div className="container fade-in" style={{display:'flex', justifyContent:'center', padding:'4rem 0'}}>
      <div className="wizard-container" style={{margin:0, width:'100%', maxWidth:'460px'}}>
        <h2 style={{textAlign:'center', fontSize:'2.2rem', marginBottom:'1.5rem'}}>{isLogin ? 'ברוכים השבים' : 'הצטרפו אלינו'}</h2>
        
        {!isLogin && (
          <div className="tabs">
            <button type="button" className={`tab ${regType === 'customer' ? 'active' : ''}`} onClick={() => setRegType('customer')}>אני לקוח</button>
            <button type="button" className={`tab ${regType === 'business' ? 'active' : ''}`} onClick={() => setRegType('business')}>אני עסק</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input className="input-field" placeholder={regType === 'business' ? "שם העסק" : "שם מלא"} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          )}
          <input className="input-field" type="email" placeholder="אימייל" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input className="input-field" type="password" placeholder="סיסמה" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          
          {!isLogin && regType === 'business' && (
            <>
              <input className="input-field" placeholder="כתובת העסק" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Barbershop">מספרה</option>
                <option value="Spa">יופי וטיפוח</option>
                <option value="Clinic">קליניקה</option>
              </select>
            </>
          )}

          <button className="btn btn-primary" style={{width:'100%', padding:'1rem', borderRadius:'12px'}} type="submit">
            {isLogin ? 'כניסה למערכת' : 'הרשמה עכשיו'}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'2rem', borderTop:'1px solid var(--border)', paddingTop:'1.5rem'}}>
          <button onClick={() => { setIsLogin(!isLogin); setRegType('customer'); }} style={{background:'none', border:'none', color:'var(--accent)', fontWeight:'800', cursor:'pointer', textDecoration:'underline'}}>
            {isLogin ? 'אין לך חשבון? הירשם כאן' : 'כבר רשום? התחבר למערכת'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    api.getAllBusinesses().then(setBusinesses).catch(console.error);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setUser(data.user); setToken(data.token);
      localStorage.setItem('token', data.token);
      setView('home');
    } catch (err) { alert("שגיאת התחברות: " + err.message); }
  };

  const handleRegisterUser = async (name, email, password) => {
    try {
      const data = await api.register(name, email, password);
      setUser(data.user); setToken(data.token);
      localStorage.setItem('token', data.token);
      setView('home');
    } catch (err) { 
      const msg = err.errors ? err.errors.join("\n") : err.message;
      alert("שגיאת הרשמה:\n" + msg); 
    }
  };

  const handleRegisterBusiness = async (data) => {
    try {
      const res = await api.registerBusiness(data);
      setUser(res.business); setToken(res.token);
      localStorage.setItem('token', res.token);
      alert("העסק נוצר בהצלחה!");
      setView('home');
    } catch (err) { 
      const msg = err.errors ? err.errors.join("\n") : err.message;
      alert("שגיאת אימות עסק:\n" + msg); 
    }
  };

  return (
    <div style={{minHeight:'100vh', background:'var(--bg)'}}>
      <Navbar user={user} setView={setView} onLogout={() => { setUser(null); setToken(null); localStorage.removeItem('token'); setView('home'); }} />
      {view === 'home' && (
        <div className="container fade-in">
          <div className="hero">
            <h1>תראה במיטבך.<br/><span>בקלות ובסטייל.</span></h1>
            <p style={{fontSize:'1.2rem', color:'var(--text-muted)'}}>הפלטפורמה המובילה לקביעת תורים</p>
          </div>
          <h2 style={{fontWeight:'900', marginBottom:'1.5rem'}}>המספרות המומלצות</h2>
          <div className="grid">
            {businesses.map(b => (
              <div key={b._id} className="card" onClick={() => setView('home')} style={{cursor:'pointer'}}>
                <img src={b.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500'} className="card-img" alt={b.name}/>
                <div className="card-content">
                  <h3 style={{margin:'0 0 0.5rem 0', fontSize:'1.4rem'}}>{b.name}</h3>
                  <p style={{margin:0, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6}}>
                    {Icons.MapPin} {b.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {view === 'login' && <Auth onLogin={handleLogin} onRegisterUser={handleRegisterUser} onRegisterBusiness={handleRegisterBusiness} />}
    </div>
  );
};

export default App;