import React, { useState } from 'react';
import { Icons } from '../components/Icons';

const UserProfile = ({ user, appointments = [], onCancel, onReschedule }) => {
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleSaveReschedule = () => {
    if (!newDate || !newTime) return alert("אנא בחר תאריך ושעה חדשים");
    
    const combinedDateTime = `${newDate}T${newTime}`;
    onReschedule(editingId, combinedDateTime);
    
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

export default UserProfile;