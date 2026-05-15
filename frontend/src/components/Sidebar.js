import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ role, onSwitch }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">📚</div>
        <span className="sidebar-brand-text">LibraryMS</span>
      </div>

      <nav className="sidebar-nav">
        {role === 'admin' && (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">📊</span>
              Dashboard
            </NavLink>
            <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">📖</span>
              Books
            </NavLink>
            <NavLink to="/borrowers" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">👥</span>
              Borrowers
            </NavLink>
            <NavLink to="/borrow-return" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">🔄</span>
              Borrow / Return
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">🔍</span>
              Search
            </NavLink>
          </>
        )}
        {role === 'user' && (
          <>
            <NavLink to="/borrow-return" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">🔄</span>
              Borrow / Return
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-nav-icon">🔍</span>
              Search
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-role-badge">{role}</div>
        <button className="sidebar-switch-btn" onClick={onSwitch}>Switch Role</button>
      </div>
    </aside>
  );
}

export default Sidebar;
