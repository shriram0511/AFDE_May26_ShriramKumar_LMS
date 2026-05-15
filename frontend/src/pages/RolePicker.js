import React, { useState } from 'react';

function RoleCard({ icon, title, description, headerGradient, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '20px',
        width: '260px',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 20px 48px rgba(5,150,105,0.25)'
          : '0 4px 24px rgba(0,0,0,0.1)',
        border: `2px solid ${hovered ? '#059669' : '#e5e7eb'}`,
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Coloured header */}
      <div style={{
        background: headerGradient,
        padding: '2.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3.5rem',
      }}>
        {icon}
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem 1.5rem 1.75rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '1.2rem', fontWeight: '700',
          color: '#0f172a', marginBottom: '0.5rem',
          letterSpacing: '0.2px',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '0.84rem', color: '#6b7280',
          lineHeight: '1.6', marginBottom: '1.5rem',
        }}>
          {description}
        </div>
        <div style={{
          background: '#059669',
          color: '#fff',
          padding: '0.6rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontWeight: '600',
          display: 'inline-block',
        }}>
          Continue as {title}
        </div>
      </div>
    </div>
  );
}

function RolePicker({ onSelect }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Branding */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          width: '76px', height: '76px',
          background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
          borderRadius: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.2rem',
          margin: '0 auto 1.5rem',
          boxShadow: '0 12px 32px rgba(5,150,105,0.4)',
        }}>📚</div>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '2rem', fontWeight: '800',
          color: '#064e3b', letterSpacing: '-0.5px',
          marginBottom: '0.5rem',
        }}>
          Library Management System
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.3px' }}>
          Select your role to continue
        </p>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <RoleCard
          icon="🛡️"
          title="Admin"
          description="Manage books, borrowers & all transactions"
          headerGradient="linear-gradient(135deg, #064e3b 0%, #065f46 100%)"
          onClick={() => onSelect('admin')}
        />
        <RoleCard
          icon="🎓"
          title="User"
          description="Borrow, return books & search catalogue"
          headerGradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
          onClick={() => onSelect('user')}
        />
      </div>
    </div>
  );
}

export default RolePicker;
