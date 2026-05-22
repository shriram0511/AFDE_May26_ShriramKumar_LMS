import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ role, onSwitch }) {
  return (
    <nav className="navbar">
      <span className="navbar-brand">📚 LMS</span>
      <div className="navbar-links">
        {role === 'admin' && (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>📊 Dashboard</NavLink>
            <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>📖 Books</NavLink>
            <NavLink to="/borrowers" className={({ isActive }) => isActive ? 'active' : ''}>👥 Borrowers</NavLink>
            <NavLink to="/borrow-return" className={({ isActive }) => isActive ? 'active' : ''}>🔄 Transactions</NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>📈 Analytics</NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>🔎 Search</NavLink>
          </>
        )}
        {role === 'user' && (
          <>
            <NavLink to="/borrow-return" className={({ isActive }) => isActive ? 'active' : ''}>🔄 Borrow / Return</NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>🔎 Search</NavLink>
          </>
        )}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '0.3rem 0.9rem',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          border: '1px solid rgba(255,255,255,0.35)'
        }}>{role}</span>
        <button
          onClick={onSwitch}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            padding: '0.3rem 0.9rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
        >
          Switch Role
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
