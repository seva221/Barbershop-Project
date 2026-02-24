import React, { useState, useEffect } from 'react';
import * as api from './api';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import { Icons } from './components/Icons';

const App = () => {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [businesses, setBusinesses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [bookingBusiness, setBookingBusiness] = useState(null);
  const [businessResources, setBusinessResources] = useState({ services: [], workers: [] });
  const [bookingForm, setBookingForm] = useState({ serviceId: '', workerId: '', date: '', time: '' });

  useEffect(() => {
    api.getAllBusinesses()
      .then(data => {
        if (Array.isArray(data)) setBusinesses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading businesses:", err);
        setLoading(false);
      });

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      setUser(data.user); 
      setToken(data.token); 
      setView('home');
    } catch (err) { alert(err.message); }
  };

  const handleLoginBusiness = async (email, password) => {
    try {
      const data = await safeFetch('/api/auth/business/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      const businessUser = { ...data.business, role: 'business' };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(businessUser)); 
      setUser(businessUser); 
      setToken(data.token); 
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
      const fetchedUser = await api.getUser(currentUserId, token);
      
      const [hours, minutes] = bookingForm.time.split(':');
      const combinedDate = new Date(bookingForm.date);
      combinedDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const payload = { 
        businessId: bookingBusiness._id, 
        serviceId: bookingForm.serviceId, 
        workerId: bookingForm.workerId, 
        date: combinedDate, 
        customerId: currentUserId,
        guestDetails: {
          name: fetchedUser.name,
          phone: fetchedUser.phone || "0000000000" 
        }
      };
  
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
      // 1. מקבלים את התשובה מהשרת
      const response = await api.updateAppointment(id, { date: formattedDate }, token);
      
      // 2. בודקים אם השרת אמר שהפעולה נכשלה (למשל: תאריך בעבר)
      if (response && response.success === false) {
        // זה יזרוק אותנו ישר ל-catch למטה עם ההודעה מהשרת!
        throw new Error(response.message || "לא ניתן לעדכן לתאריך זה");
      }

      // 3. אם הכל עבר בהצלחה, רק אז מעדכנים את המסך ומקפיצים הצלחה
      setAppointments(appointments.map(a => a._id === id ? { ...a, date: formattedDate } : a));
      alert("תאריך התור עודכן בהצלחה!");
      
    } catch (err) { 
      // 4. עכשיו, השגיאה מהשרת ("לא ניתן לקבוע תור לתאריך שעבר") תופיע כאן
      alert(err.message || "שגיאה בעדכון התור"); 
    }
  };

  const handleAppointmentAction = async (id, actionType) => {
    try {
      await api.deleteAppointment(id, token);
      if (actionType === 'approve') {
        alert("התור אושר בהצלחה");
      } else {
        alert("התור בוטל");
      }
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
    } catch (err) { alert(err.message); }
  };

  const handleRegisterBusiness = async (formData) => {
    try {
      await api.registerBusiness(formData);
      alert("העסק נרשם בהצלחה! בדוק מייל לאימות.");
      setView("login");
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{minHeight:'100vh', background:'var(--bg)'}}>
      <Navbar user={user} setView={setView} onLogout={() => { setUser(null); setToken(null); localStorage.removeItem('token'); localStorage.removeItem('user'); setView('home'); }} />
      
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
                          src={b.image ? b.image : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800'} 
                          className="card-img" 
                          alt={b.name}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800'; }}
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
          <div className="overlay" onClick={() => setBookingBusiness(null)}>
            
            <div className="booking-modal fade-in-modal" onClick={(e) => e.stopPropagation()}>
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
            
          </div>
      )}
      
      {view === 'admin' && <AdminDashboard user={user} appointments={appointments} onStatusUpdate={(id) => handleAppointmentAction(id, 'reject')} onApprove={(id) => handleAppointmentAction(id, 'approve')}  setUser={setUser} />}
      {view === 'profile' && user && <UserProfile user={user} appointments={appointments} onCancel={handleCancelAppointment} onReschedule={handleChangeAppointment}  />}
      {view === 'login' && <Auth onLogin={handleLogin} onLoginBusiness={handleLoginBusiness} onRegisterUser={handleRegisterUser} onRegisterBusiness={handleRegisterBusiness} />}
    </div>
  );
};

export default App;