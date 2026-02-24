import React, { useState } from 'react';

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

export default Auth;