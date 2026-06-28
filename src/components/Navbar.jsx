import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-color)', 
      padding: '16px 0', 
      position: 'sticky', 
      top: 0, 
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(16px)',
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        {/* Logo */}
        <div 
          style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', zIndex: 51 }} 
          onClick={() => { navigate('/'); setMenuOpen(false); }}
        >
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>ULEMA</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Grupo de Estudio
          </span>
        </div>

        {/* Navigation Links (Desktop NavLinks) */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }} id="landing-navbar">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/ciclos" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
          >
            Ciclos
          </NavLink>
          <NavLink 
            to="/sobre-nosotros" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
          >
            Sobre nosotros
          </NavLink>
          <NavLink 
            to="/contacto" 
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
          >
            Contacto
          </NavLink>
        </nav>
        
        {/* Action Buttons (Desktop) */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }} id="landing-action-buttons">
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-primary"
            style={{ 
              padding: '8px 22px', 
              fontSize: '0.85rem', 
              backgroundColor: 'var(--accent-red)',
              borderColor: 'var(--accent-red)',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(204, 13, 57, 0.18)',
              fontWeight: 700,
              borderRadius: '8px'
            }}
          >
            Aula Virtual
            <ChevronRight size={16} />
          </button>

          <button 
            onClick={() => navigate('/login?admin=true')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '0.82rem', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'color 0.2s',
              textDecoration: 'underline'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Panel Admin
          </button>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          id="hamburger-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            zIndex: 51,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown Panel */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 16px)',
            left: '16px',
            right: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 49,
            animation: 'heroFadeIn 0.2s ease-out forwards'
          }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
              style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/ciclos" 
              className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
              style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Ciclos
            </NavLink>
            <NavLink 
              to="/sobre-nosotros" 
              className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
              style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Sobre nosotros
            </NavLink>
            <NavLink 
              to="/contacto" 
              className={({ isActive }) => `nav-link-btn ${isActive ? 'active-nav-link' : ''}`}
              style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </NavLink>
            
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />

            <button 
              onClick={() => { navigate('/login'); setMenuOpen(false); }} 
              className="btn btn-primary"
              style={{ 
                width: '100%',
                padding: '12px', 
                fontSize: '0.9rem', 
                backgroundColor: 'var(--accent-red)',
                borderColor: 'var(--accent-red)',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(204, 13, 57, 0.18)',
                fontWeight: 700,
                borderRadius: '8px',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Aula Virtual
              <ChevronRight size={16} />
            </button>

            <button 
              onClick={() => { navigate('/login?admin=true'); setMenuOpen(false); }} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                fontSize: '0.88rem', 
                fontWeight: 700, 
                cursor: 'pointer',
                textAlign: 'center',
                padding: '10px 0',
                textDecoration: 'underline'
              }}
            >
              Panel Admin
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
