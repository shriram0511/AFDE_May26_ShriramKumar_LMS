import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import RolePicker from './pages/RolePicker';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Borrowers from './pages/Borrowers';
import BorrowReturn from './pages/BorrowReturn';
import Search from './pages/Search';

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return <RolePicker onSelect={setRole} />;
  }

  return (
    <BrowserRouter>
      <Navbar role={role} onSwitch={() => setRole(null)} />
      <Routes>
        {role === 'admin' && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/borrowers" element={<Borrowers />} />
            <Route path="/borrow-return" element={<BorrowReturn />} />
            <Route path="/search" element={<Search />} />
          </>
        )}
        {role === 'user' && (
          <>
            <Route path="/borrow-return" element={<BorrowReturn role="user" />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/borrow-return" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
