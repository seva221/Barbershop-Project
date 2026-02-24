import React, { useState } from 'react';
import * as api from '../api'; // שים לב לנתיב
import { Icons } from '../components/Icons';

const AdminDashboard = ({ user, appointments = [], onStatusUpdate, onApprove, setUser }) => {
  const businessId = user?._id || user?.id || '';
  const token = user?.token || user?._token || '';
  const totalIncome = appointments?.reduce((sum, app) => sum + (app.serviceId?.price || 0), 0) || 0;

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [serviceData, setServiceData] = useState({ name: '', duration: '', price: '' });
  
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false); 
  const [workerData, setWorkerData] = useState({ name: '', phone: '', businessId: businessId });
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        const response = await api.updateBusinessImage(businessId, base64String, token);
        
        if (response.business) {
          setUser(prev => ({ ...prev, image: response.business.image }));
          alert("תמונת העסק עודכנה בהצלחה!");
        }
      } catch (err) {
        alert("שגיאה בעדכון התמונה: " + err.message);
      }
    };
    reader.readAsDataURL(file); 
  };
  
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
      console.error("Failed to add service.", error);
      alert('שגיאה בהוספת השירות, אנא נסה שוב.');
    }
  };

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
      console.error("Failed to add worker.", error);
      alert('שגיאה בהוספת העובד, אנא נסה שוב.');
    }
  };

  const handleOverlayClick = (e, setter) => {
    if (e.target === e.currentTarget) {
      setter(false);
    }
  };

  return (
  <div className="container fade-in" style={{padding:'3rem 0'}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <h1 style={{fontSize:'2.5rem'}}>לוח ניהול {user?.name}</h1>
        
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
    
    {isWorkerModalOpen && (
    <div onClick={(e) => handleOverlayClick(e, setIsWorkerModalOpen)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', width: '90%', maxWidth: '900px', textAlign: 'right', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h2 style={{marginTop: 0, marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold'}}>הוספת עובד חדש</h2>
            <form onSubmit={handleAddWorker} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input className="input-field" type="text" placeholder="שם העובד באנגלית" value={workerData.name} onChange={e => setWorkerData({...workerData, name: e.target.value})} required style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                <input className="input-field" type="text" placeholder="טלפון" value={workerData.phone} onChange={e => setWorkerData({...workerData, phone: e.target.value})} required style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                <button type="submit" style={{ width: '100%', backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' }}>שמור עובד</button>
            </form>
        </div>
    </div>
    )}

    {isModalOpen && (
    <div onClick={(e) => handleOverlayClick(e, setIsModalOpen)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', width: '90%', maxWidth: '900px', textAlign: 'right', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h2 style={{marginTop: 0, marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold'}}>הוספת שירות חדש</h2>
            <form onSubmit={handleAddService} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input className="input-field" type="text" placeholder="שם השירות (לדוגמה: תספורת גברים)" value={serviceData.name} onChange={e => setServiceData({...serviceData, name: e.target.value})} required style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                <input className="input-field" type="number" placeholder="מחיר (₪)" value={serviceData.price} onChange={e => setServiceData({...serviceData, price: e.target.value})} required style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                <input className="input-field" type="number" placeholder="משך זמן (בדקות)" value={serviceData.duration} onChange={e => setServiceData({...serviceData, duration: e.target.value})} required style={{width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                <button type="submit" style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' }}>שמור שירות</button>
            </form>
        </div>
    </div>
    )}
    
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'3rem'}}>
      <div className="card" style={{padding: '2rem', textAlign:'center'}}>
        <div style={{color:'var(--text-muted)'}}>תורים</div>
        <div style={{fontSize:'2.5rem', fontWeight:900}}>{appointments?.length || 0}</div>
      </div>
      <div className="card" style={{padding: '2rem', textAlign:'center', borderColor:'#10b981'}}>
        <div style={{color:'var(--text-muted)'}}>הכנסה צפויה (₪)</div>
        <div style={{fontSize:'2.5rem', fontWeight:900}}>{totalIncome}</div>
      </div>
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

export default AdminDashboard;