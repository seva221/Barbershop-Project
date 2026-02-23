import React, { useState, useEffect } from 'react';
import * as api from './api';



// --- STYLES (Premium Calmark Design) ---
const GLOBAL_STYLES = `
:root {
  --primary: #0f172a;
  --accent: #2563eb;
  --accent-soft: #eff6ff;
  --bg: #f8fafc;
  --card-bg: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
}

body { 
  margin: 0; 
  font-family: 'Inter', system-ui, -apple-system, sans-serif; 
  background: var(--bg); 
  color: var(--text-main); 
  direction: rtl; 
  text-align: right; 
  line-height: 1.6;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

/* Navbar - Glassmorphism */
.navbar { 
  background: rgba(255, 255, 255, 0.85); 
  backdrop-filter: blur(12px); 
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
  flex-direction: row-reverse; 
}
.brand { 
  font-size: 1.6rem; 
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
  padding: 8rem 1rem; 
  background: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 0 0 50px 50px;
}
.hero h1 { font-size: 3.8rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; }
.hero h1 span { color: #60a5fa; }

/* Grid & Cards */
.grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); margin-top: 2rem; }
.card { 
  background: var(--card-bg); 
  border-radius: 24px; 
  overflow: hidden; 
  box-shadow: var(--shadow); 
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
}
.card-hover:hover { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-color: var(--accent); }
.card-img { width: 100%; height: 240px; object-fit: cover; }
.card-content { padding: 1.5rem; }

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
  text-align: right; 
}

.btn { padding: 0.8rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; border: none; display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center; }
.btn-primary { background: var(--primary); color: white; width: 100%; }
.btn-primary:hover { background: #000; transform: translateY(-2px); }
.btn-danger { background: #fee2e2; color: #b91c1c; }

.booking-modal {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: white; padding: 2.5rem; border-radius: 30px; z-index: 2000;
  width: 90%; maxWidth: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1500; backdrop-filter: blur(4px); }

.fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

const Icons = {
  Scissors: <span>✂️</span>, Check: <span>✅</span>, MapPin: <span>📍</span>, LogOut: <span>🚪</span>, Calendar: <span>📅</span>,
  Clock: <span>🕒</span>, Chart: <span>📊</span>, Trash: <span>🗑️</span>, Star: <span>⭐</span>, X: <span>❌</span>
};

// --- COMPONENTS ---

const Navbar = ({ user, setView, onLogout }) => (
  <nav className="navbar">
    <div className="container nav-inner">
      <div className="brand" onClick={() => setView('home')}>Style<span>Queue</span> {Icons.Scissors}</div>
      <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
        {user ? (
          <>
            <div style={{textAlign:'right', cursor:'pointer'}} onClick={() => setView(user.role === 'business' ? 'admin' : 'profile')}>
              <div style={{fontWeight:'800', fontSize:'0.9rem'}}>{user.name}</div>
              <div style={{fontSize:'0.75rem', color:'var(--accent)'}}>{user.role === 'business' ? 'ניהול עסק' : 'הפרופיל שלי'}</div>
            </div>
            <button onClick={onLogout} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem'}}>{Icons.LogOut}</button>
          </>
        ) : <button className="btn btn-primary" style={{width:'auto'}} onClick={() => setView('login')}>התחברות</button>}
      </div>
    </div>
  </nav>
);

const AdminDashboard = ({ user, appointments = [], onStatusUpdate, onApprove, setUser }) => {
  const businessId = user?._id || user?.id || '';
  const token = user?.token || user?._token || '';
  const totalIncome = appointments?.reduce((sum, app) => sum + (app.serviceId?.price || 0), 0) || 0;

  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false); // למודל שירות
  const [serviceData, setServiceData] = useState({ name: '', duration: '', price: '' });
  
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false); // למודל עובד
  const [workerData, setWorkerData] = useState({ name: '', phone: '', businessId: businessId });
  
  // --- Handlers ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        
        // Call the API function from image_e3c4b9.png
        const response = await api.updateBusinessImage(businessId, base64String, token);
        
        if (response.business) {
          setUser(prev => ({ ...prev, image: response.business.image }));
          alert("תמונת העסק עודכנה בהצלחה!");
        }
      } catch (err) {
        alert("שגיאה בעדכון התמונה: " + err.message);
      }
    };
    reader.readAsDataURL(file); // Converts image to string for the backend
  };
  
  // פונקציה להוספת שירות
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: serviceData.name,
        duration: Number(serviceData.duration),
        price: Number(serviceData.price),
        businessId: businessId 
      };

      await api.createService(payload, token); 
      alert('השירות נוסף בהצלחה!');
      setIsModalOpen(false);
      setServiceData({ name: '', duration: '', price: '' });
    } catch (error) {
      console.error("Failed to add service. Error details:", error);
      alert('שגיאה בהוספת השירות, אנא נסה שוב.');
    }
  };

  // פונקציה להוספת עובד
  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: workerData.name,
        phone: workerData.phone,
        businessId: businessId
      };

      await api.createWorker(payload, token); 
      alert('העובד נוסף בהצלחה!');
      setIsWorkerModalOpen(false);
      setWorkerData({ name: '', phone: '', businessId: '' });
    } catch (error) {
      console.error("Failed to add worker. Error details:", error);
      alert('שגיאה בהוספת העובד, אנא נסה שוב.');
      console.error("name " + workerData.name);
      console.error("phone " + workerData.phone);
      console.error("businessId " + businessId);
    }
  };

  // פונקציית עזר לסגירת מודלים בלחיצה על הרקע (האזור הכהה)
  const handleOverlayClick = (e, setter) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };

  return (
  <div className="container fade-in" style={{padding:'3rem 0'}}>
    
    {/* --- Header & Buttons --- */}
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <h1 style={{fontSize:'2.5rem'}}>לוח ניהול {user?.name} {/* {Icons?.Chart} */}</h1>
        
        <label className="btn" style={{backgroundColor: '#6366f1', color: 'white', width:'auto', fontWeight: 'bold', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer'}}>
            {Icons.Camera} שינוי תמונת עסק
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </label>
        
        <div style={{display: 'flex', gap: '1rem'}}>
          <button 
            className="btn" 
            style={{backgroundColor: '#10b981', color: 'white', width:'auto', fontWeight: 'bold', padding: '0.8rem 1.5rem', borderRadius: '8px'}}
            onClick={() => setIsWorkerModalOpen(true)}>
            + הוסף עובד
          </button>
          <button 
            className="btn" 
            style={{backgroundColor: '#0f172a', color: 'white', width:'auto', fontWeight: 'bold', padding: '0.8rem 1.5rem', borderRadius: '8px'}}
            onClick={() => setIsModalOpen(true)}>
            + הוסף שירות
          </button>
        </div>
    </div>
    
    {/* --- מודל הוספת עובד --- */}
    {isWorkerModalOpen && (
    <div 
        onClick={(e) => handleOverlayClick(e, setIsWorkerModalOpen)}
        style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
        <div style={{
            backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', 
            width: '90%', maxWidth: '900px', textAlign: 'right',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{marginTop: 0, marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold'}}>הוספת עובד חדש</h2>
            <form onSubmit={handleAddWorker} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input 
                    className="input-field" type="text" placeholder="שם העובד באנגלית" 
                    value={workerData.name} onChange={e => setWorkerData({...workerData, name: e.target.value})} required 
                    style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} 
                />
                <input 
                    className="input-field" type="text" placeholder="טלפון" 
                    value={workerData.phone} onChange={e => setWorkerData({...workerData, phone: e.target.value})} required 
                    style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} 
                />
                
                <button type="submit" style={{
                    width: '100%', backgroundColor: '#10b981', color: 'white', 
                    padding: '1rem', borderRadius: '8px', border: 'none', 
                    fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer'
                }}>
                    שמור עובד
                </button>
            </form>
        </div>
    </div>
    )}

    {/* --- מודל הוספת שירות --- */}
    {isModalOpen && (
    <div 
        onClick={(e) => handleOverlayClick(e, setIsModalOpen)}
        style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
        <div style={{
            backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', 
            width: '90%', maxWidth: '900px', textAlign: 'right',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{marginTop: 0, marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold'}}>הוספת שירות חדש</h2>
            <form onSubmit={handleAddService} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input 
                    className="input-field" type="text" placeholder="שם השירות (לדוגמה: תספורת גברים)" 
                    value={serviceData.name} onChange={e => setServiceData({...serviceData, name: e.target.value})} required 
                    style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} 
                />
                <input 
                    className="input-field" type="number" placeholder="מחיר (₪)" 
                    value={serviceData.price} onChange={e => setServiceData({...serviceData, price: e.target.value})} required 
                    style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} 
                />
                <input 
                    className="input-field" type="number" placeholder="משך זמן (בדקות)" 
                    value={serviceData.duration} onChange={e => setServiceData({...serviceData, duration: e.target.value})} required 
                    style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} 
                />
                
                <button type="submit" style={{
                    width: '100%', backgroundColor: '#0f172a', color: 'white', 
                    padding: '1rem', borderRadius: '8px', border: 'none', 
                    fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer'
                }}>
                    שמור שירות
                </button>
            </form>
        </div>
    </div>
    )}
    
    {/* --- שאר הדשבורד --- */}
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'3rem'}}>
      <div className="card" style={{padding: '2rem', textAlign:'center'}}>
        <div style={{color:'var(--text-muted)'}}>תורים היום</div>
        <div style={{fontSize:'2.5rem', fontWeight:900}}>{appointments?.length || 0}</div>
      </div>
      <div className="card" style={{padding: '2rem', textAlign:'center', borderColor:'#10b981'}}>
        <div style={{color:'var(--text-muted)'}}>הכנסה צפויה (₪)</div>
        <div style={{fontSize:'2.5rem', fontWeight:900}}>{totalIncome}</div>
      </div>
      {/* @@@@@@@@ NO IMPLEMENTATION YET @@@@@@@@
      <div className="card" style={{padding: '2rem', textAlign:'center'}}>
        <div style={{color:'var(--text-muted)'}}>דירוג ממוצע</div>
        <div style={{fontSize:'2.5rem', fontWeight:900}}>4.9 {}</div>
      </div>
      */}
    </div>
    
    <div className="card">
        <h3 style={{padding:'1.5rem', marginBottom:0}}>ניהול יומן תורים</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
            <tr style={{textAlign:'right', borderBottom:'2px solid #e2e8f0'}}>
                <th style={{padding:'1rem'}}>מי יש לנו?</th>
                <th style={{padding:'1rem'}}>עד מתי הוא מתעקב?</th>
                <th style={{padding:'1rem'}}>מה הוא רוצה ממני?</th>
                <th style={{padding:'1rem'}}>האם הוא היה נחמד?</th>
            </tr>
            </thead>
            <tbody>
            {appointments?.map(app => (
                <tr key={app._id} style={{borderBottom:'1px solid #f8fafc'}}>
                <td style={{padding:'1rem', fontWeight:700}}> {app.userId?.name || app.guestDetails?.name || 'אורח'}</td>
                <td style={{padding:'1rem'}}>{new Date(app.date).toLocaleDateString('he-IL')} | {new Date(app.date).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</td>
                <td style={{padding:'1rem'}}>{app.serviceId?.name || 'שירות כללי'}</td>
                <td style={{padding:'1rem'}}>
                  <div style={{display:'flex', gap:'5px'}}>
                    <button className="btn" style={{padding:'0.4rem', background:'#dcfce7'}} onClick={() => onApprove(app._id)} title="אשר תור">✓</button>
                    <button className="btn" style={{padding:'0.4rem', background:'#fee2e2'}} onClick={() => onStatusUpdate(app._id)} title="דחה תור">✕</button>
                  </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  </div>)
};

const UserProfile = ({ user, appointments = [], onCancel, onReschedule }) => {
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  // התיקון הקריטי: הוספת הסטייט החסר
  const [newTime, setNewTime] = useState('');

  const handleSaveReschedule = () => {
    if (!newDate || !newTime) return alert("אנא בחר תאריך ושעה חדשים");
    
    // שילוב של התאריך והשעה לפורמט הרצוי (למשל ISO או מחרוזת משולבת)
    // הערה: תלוי מה ה-Backend שלך מצפה לקבל ב-onReschedule
    const combinedDateTime = `${newDate}T${newTime}`;
    
    onReschedule(editingId, combinedDateTime);
    
    // איפוס
    setEditingId(null);
    setNewDate('');
    setNewTime('');
  };

  return (
    <div className="container fade-in" style={{ padding: '3rem 0', direction: 'rtl' }}>
      <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {Icons.Calendar} התורים שלי
      </h1>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {appointments.map(app => {
          const appointmentDate = new Date(app.date);
          
          return (
            <div key={app._id} className="card" style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.5rem', 
              flexWrap: 'wrap', 
              gap: '1rem',
              borderRight: '5px solid var(--accent)'
            }}>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ 
                  background: 'var(--accent-soft)', 
                  padding: '1.2rem', 
                  borderRadius: '20px', 
                  fontSize: '1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {Icons.Clock}
                </div>
                
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>
                    {app.businessId?.name || 'המספרה'}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {appointmentDate.toLocaleDateString('he-IL')} בשעה {appointmentDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {editingId === app._id ? (
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    alignItems: 'center', 
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end'
                  }}>
                    <input
                      type="date"
                      className="input-field"
                      style={{ marginBottom: 0, width: 'auto', padding: '0.5rem' }}
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="input-field"
                      style={{ marginBottom: 0, width: 'auto', padding: '0.5rem' }}
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                    />
                    
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.8rem 1rem' }} 
                        onClick={handleSaveReschedule}
                      >
                        {Icons.Check} שמור
                      </button>
                      <button 
                        className="btn" 
                        style={{ padding: '0.8rem 1rem', background: '#e2e8f0' }} 
                        onClick={() => { 
                          setEditingId(null); 
                          setNewDate(''); 
                          setNewTime(''); 
                        }}
                      >
                        {Icons.X}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: 'auto', background: 'var(--accent)' }} 
                      onClick={() => {
                        setEditingId(app._id);
                        const d = new Date(app.date);
                        // מילוי ערכים ראשוני בשדות העריכה
                        setNewDate(d.toISOString().split('T')[0]);
                        setNewTime(d.toTimeString().split(' ')[0].substring(0, 5));
                      }}
                    >
                      שינוי מועד
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ width: 'auto' }} 
                      onClick={() => onCancel(app._id)}
                    >
                      {Icons.Trash} ביטול תור
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {appointments.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            טרם הזמנת תורים במערכת.
          </div>
        )}
      </div>
    </div>
  );
};

const Auth = ({ onLogin, onLoginBusiness, onRegisterUser, onRegisterBusiness }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [regType, setRegType] = useState('customer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', phone: '', category: 'Barbershop' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (regType === 'business') onLoginBusiness(formData.email.trim(), formData.password);
      else onLogin(formData.email.trim(), formData.password);
    } else {
      if (regType === 'business') onRegisterBusiness(formData);
      else onRegisterUser(formData);
    }
  };

  return (
    <div className="container fade-in" style={{display:'flex', justifyContent:'center', padding:'4rem 0'}}>
      <div className="card" style={{width:'100%', maxWidth:'460px', padding:'2.5rem'}}>
        <h2 style={{textAlign:'center', fontSize:'2.2rem', marginBottom:'1.5rem'}}>{isLogin ? 'ברוכים השבים' : 'הצטרפו אלינו'}</h2>
        <div style={{display:'flex', background:'#f1f5f9', padding:'0.3rem', borderRadius:'12px', marginBottom:'1.5rem'}}>
          <button type="button" style={{flex:1, padding:'0.6rem', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:600, background: regType === 'customer' ? 'white' : 'transparent'}} onClick={() => setRegType('customer')}>לקוח</button>
          <button type="button" style={{flex:1, padding:'0.6rem', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:600, background: regType === 'business' ? 'white' : 'transparent'}} onClick={() => setRegType('business')}>עסק</button>
        </div>
        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <input 
                    className="input-field" 
                    placeholder={regType === 'business' ? "שם העסק" : "שם מלא"} 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                />
             )}
            
            {!isLogin && regType === 'business' && (
            <select className="input-field" value={formData.serviceType || ''} onChange={e => setFormData({...formData, serviceType: e.target.value})} required>
              <option value="" disabled>בחר סוג שירות...</option>
              <option value="מספרה">מספרה</option>
              <option value="מכון יופי">מכון יופי וקוסמטיקה</option>
              <option value="ספא">ספא ועיסוי</option>
            </select>
            )}
            <input 
                className="input-field" 
                type="email" 
                placeholder="אימייל" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
            />
            <input 
                className="input-field" 
                type="password" 
                placeholder="סיסמה" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
            />
            {!isLogin && regType === 'customer' && (
            <input 
                className="input-field" 
                type="phone" 
                placeholder="טלפון" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                required 
            />
            )}
            {!isLogin && regType === 'business' && (
            <input 
                className="input-field" 
                type="text" 
                placeholder="כתובת" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                required 
            />
            )}
            <button className="btn btn-primary" type="submit">
                {isLogin ? 'כניסה למערכת' : 'הרשמה עכשיו'}
            </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} style={{background:'none', border:'none', color:'var(--accent)', fontWeight:'800', cursor:'pointer', textDecoration:'underline', width:'100%', marginTop:'1.5rem'}}>{isLogin ? 'אין לך חשבון? הירשם כאן' : 'כבר רשום? התחבר למערכת'}</button>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [businesses, setBusinesses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [bookingBusiness, setBookingBusiness] = useState(null);
  const [businessResources, setBusinessResources] = useState({ services: [], workers: [] });
  const [bookingForm, setBookingForm] = useState({ serviceId: '', workerId: '', date: '', time: '' }); // time is collapsed to date

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    
    // משיכת נתונים עם בדיקה שהם מגיעים מה-Backend בפורט 5000
    api.getAllBusinesses()
      .then(data => {
        // רשת ביטחון: מוודא שקיבלנו מערך ולא HTML בגלל שגיאת 404/500
        if (Array.isArray(data)) {
            setBusinesses(data);
        } else {
            console.error("The server returned something other than an array:", data);
        }
        setLoading(false);
      })
      .catch(err => {
          console.error("Error loading businesses:", err);
          setLoading(false);
      });

    // מנגנון אימות עסק דרך קישור במייל
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verifyToken');
    if (verifyToken) {
      api.verifyBusiness(verifyToken)
        .then(() => {
          alert("העסק אומת והופעל בהצלחה!");
          window.location.href = '/'; 
        })
        .catch(err => alert("שגיאה באימות: " + err.message));
    }
  }, []);

  useEffect(() => {
    if (token) api.getAppointments(token).then(setAppointments).catch(console.error);
  }, [token, view]);

  const safeFetch = async (endpoint, options) => {
    const response = await fetch(endpoint, { ...options, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...options.headers } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'פעולה נכשלה');
    return data;
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await safeFetch('/api/auth/user/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setUser(data.user); if (data.token) { setToken(data.token); localStorage.setItem('token', data.token); }
      setView('home');
    } catch (err) { alert(err.message); }
  };

  const handleLoginBusiness = async (email, password) => {
    try {
      const data = await safeFetch('/api/auth/business/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setUser({ ...data.business, role: 'business' }); 
      if (data.token) { setToken(data.token); localStorage.setItem('token', data.token); }
      setView('admin');
    } catch (err) { alert(err.message); }
  };

  const handleBookingClick = async (business) => {
    if (!user) return setView('login');
    setBookingBusiness(business);
    try {
        const data = await api.getBusinessData(business._id);
        setBusinessResources(data);
    } catch (e) { console.error(e); }
  };

  const handleConfirmBooking = async () => {
    if (!bookingForm.serviceId || !bookingForm.date || !bookingForm.time) {
      return alert("בחר שירות, תאריך ושעה");
    }
  
    try {
      const currentUserId = user?._id || user?.id;
      // 1. קריאה לשרת כדי להביא את פרטי המשתמש המלאים (כולל טלפון)
      const fetchedUser = await api.getUser(currentUserId, token);
      
      const [hours, minutes] = bookingForm.time.split(':');
      const combinedDate = new Date(bookingForm.date);
      combinedDate.setHours(parseInt(hours), parseInt(minutes), 0);

      // 2. בניית האובייקט לשליחה לפי מה ש-Zod דורש
      const payload = { 
        businessId: bookingBusiness._id, 
        serviceId: bookingForm.serviceId, 
        workerId: bookingForm.workerId, 
        date: combinedDate, // includes time
        customerId: currentUserId,
        guestDetails: {
          name: fetchedUser.name,
          phone: fetchedUser.phone || "0000000000" 
        }
      };
  
      // 3. שליחה לשרת
      await api.createAppointment(payload, token); 
      
      alert("תור נקבע בהצלחה!");
      setBookingBusiness(null);
      setView('profile');
      
    } catch (e) { 
      console.error("Booking error:", e);
      alert(e.message || "שגיאה בקביעת התור"); 
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm("לבטל את התור?")) {
      try {
        await api.deleteAppointment(id, token);
        setAppointments(appointments.filter(a => a._id !== id));
      } catch (err) { alert(err.message); }
    }
  };

  const handleChangeAppointment = async (id, formattedDate) => {
    try {
      // שליחת אובייקט עם השדה date (מוכן בפורמט DD/MM/YYYY) לשרת
      await api.updateAppointment(id, { date: formattedDate }, token);
      
      // עדכון התצוגה של המשתמש מיידית
      setAppointments(appointments.map(a => a._id === id ? { ...a, date: formattedDate } : a));
      
      alert("תאריך התור עודכן בהצלחה!");
    } catch (err) { 
      alert(err.message || "שגיאה בעדכון התור"); 
    }
  };

  const handleAppointmentAction = async (id, actionType) => {
    try {
      // 1. Perform the API call (Using the delete logic for both for now as requested)
      await api.deleteAppointment(id, token); //
  
      // 2. Perform action-specific logic
      if (actionType === 'approve') {
        console.log(`Appointment ${id} approved and removed from queue.`);
        alert("התור אושר בהצלחה");
      } else {
        console.log(`Appointment ${id} rejected and removed from queue.`);
        alert("התור בוטל");
      }
  
      // 3. Remove from local state so it disappears from the dashboard
      setAppointments(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      alert("שגיאה בביצוע הפעולה: " + err.message);
    }
  };

  const handleRegisterUser = async (formData) => {
  try {
    const data = await api.register(formData);
    alert("נרשמת בהצלחה!");
    setUser(data.user);
    setView("home");
  } catch (err) {
    alert(err.message);
  }
};

const handleRegisterBusiness = async (formData) => {
  try {
    const data = await api.registerBusiness(formData);
    alert("העסק נרשם בהצלחה! בדוק מייל לאימות.");
    setView("login");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={{minHeight:'100vh', background:'var(--bg)'}}>
      <Navbar user={user} setView={setView} onLogout={() => { setUser(null); setToken(null); localStorage.removeItem('token'); setView('home'); }} />
      
      {view === 'home' && (
        <div className="fade-in">
          <div className="hero">
            <h1>תראה במיטבך.<br/><span>בקלות ובסטייל.</span></h1>
            <p style={{fontSize:'1.3rem', opacity:0.9}}>הזמן תור למספרות המובילות בלחיצת כפתור</p>
            {!user && <button className="btn btn-primary" style={{marginTop:'1.5rem', padding:'1rem 3rem', width:'auto'}} onClick={() => setView('login')}>הזמן תור עכשיו</button>}
          </div>
          <div className="container" style={{paddingBottom:'5rem'}}>
            <h2 style={{fontWeight:'900', marginBottom:'2rem', marginTop: '3rem'}}>המספרות המומלצות בסביבתך</h2>
            
            {loading ? (
                <p style={{textAlign: 'center'}}>מתחבר ל-API...</p>
            ) : (
                <div className="grid">
                  {businesses && businesses.length > 0 ? (
                    businesses.map((b, index) => (
                      <div key={b._id} className="card card-hover" onClick={() => handleBookingClick(b)} style={{cursor:'pointer'}}>
                        <img 
                          /* Priority: Use the uploaded string (b.image), otherwise use a placeholder */
                          src={b.image ? b.image : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800'} 
                          className="card-img" 
                          alt={b.name}
                          onError={(e) => {
                            /* If the string is corrupted, revert to placeholder */
                            e.target.src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800';
                          }}
                        />
                        <div className="card-content">
                          <h3 style={{margin:'0'}}>{b.name}</h3>
                          <p style={{color:'var(--text-muted)'}}>{Icons.MapPin} {b.address || 'כתובת לא צוינה'}</p>
                          <button className="btn btn-primary" style={{marginTop:'1.2rem'}}>קבע תור עכשיו</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', border: '2px dashed var(--border)', borderRadius: '20px'}}>
                        <p>לא נמצאו מספרות פעילות.</p>
                        <p style={{fontSize: '0.8rem'}}>וודא שה-Backend דולק בפורט 5000 ושהסטטוס הוא approved.</p>
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>
      )}

      {bookingBusiness && (
          <>
            <div className="overlay" onClick={() => setBookingBusiness(null)}></div>
            <div className="booking-modal fade-in">
                <h2 style={{marginTop:0}}>הזמנה ל-{bookingBusiness.name}</h2>
                <label>בחר שירות:</label>
                <select className="input-field" onChange={e => setBookingForm({...bookingForm, serviceId: e.target.value})}>
                    <option value="">בחר שירות...</option>
                    {businessResources.services.map(s => <option key={s._id} value={s._id}>{s.name} - ₪{s.price}</option>)}
                </select>
                <label>בחר ספר:</label>
                <select className="input-field" onChange={e => setBookingForm({...bookingForm, workerId: e.target.value})}>
                    <option value="">כל ספר פנוי</option>
                    {businessResources.workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                </select>
                <label>בחר תאריך:</label>
                <input type="date" className="input-field" onChange={e => setBookingForm({...bookingForm, date: e.target.value})} />
                <label>בחר שעה:</label>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px'}}>
                    {['10:00', '11:00', '12:00', '16:00', '17:00', '18:00'].map(t => (
                        <button key={t} className="btn" style={{background: bookingForm.time === t ? 'var(--accent)' : 'var(--accent-soft)', color: bookingForm.time === t ? 'white' : 'var(--primary)'}} onClick={() => setBookingForm({...bookingForm, time: t})}>{t}</button>
                    ))}
                </div>
                <button className="btn btn-primary" style={{width:'100%', marginTop:'2rem'}} onClick={handleConfirmBooking}>אישור הזמנה</button>
            </div>
          </>
      )}
      {view === 'admin' && <AdminDashboard user={user} appointments={appointments} onStatusUpdate={(id) => handleAppointmentAction(id, 'reject')} onApprove={(id) => handleAppointmentAction(id, 'approve')}  setUser={setUser} />}
      {view === 'profile' && user && <UserProfile user={user} appointments={appointments} onCancel={handleCancelAppointment} onReschedule={handleChangeAppointment}  />}
      {view === 'login' && <Auth onLogin={handleLogin} onLoginBusiness={handleLoginBusiness} onRegisterUser={handleRegisterUser} onRegisterBusiness={handleRegisterBusiness} />}
    </div>
  );
};

export default App;