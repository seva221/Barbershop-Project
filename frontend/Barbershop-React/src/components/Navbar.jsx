import React from 'react';
import { Icons } from './Icons';

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

export default Navbar;