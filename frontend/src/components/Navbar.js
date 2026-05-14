import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">LibraryMS</span>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>Books</NavLink>
        <NavLink to="/borrowers" className={({ isActive }) => isActive ? 'active' : ''}>Borrowers</NavLink>
        <NavLink to="/borrow-return" className={({ isActive }) => isActive ? 'active' : ''}>Borrow / Return</NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>Search</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
