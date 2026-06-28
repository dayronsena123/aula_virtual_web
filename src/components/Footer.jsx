import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      backgroundColor: '#0f172a', 
      color: '#94a3b8', 
      padding: '64px 0 32px 0', 
      borderTop: '1px solid #1e293b',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Logo & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>ULEMA</span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--accent-red)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '2px' }}>
                Grupo de Estudio
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
              Preparación matemática de alto nivel con disciplina, método, precisión y resultados.
            </p>
            {/* TikTok and WhatsApp Social Icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a 
                href="https://www.tiktok.com/@riudiaq" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok"
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  backgroundColor: '#1e293b', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid #334155'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#cc0d39';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(204, 13, 57, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* TikTok Custom SVG */}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                </svg>
              </a>

              <a 
                href="https://wa.me/51907040190?text=Hola,%20deseo%20solicitar%20información%20sobre%20los%20ciclos%20del%20Grupo%20de%20Estudio%20ULEMA." 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  backgroundColor: '#1e293b', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid #334155'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Enlaces Rápidos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Inicio</Link>
              <Link to="/ciclos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Ciclos</Link>
              <Link to="/sobre-nosotros" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Sobre nosotros</Link>
              <Link to="/contacto" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Contacto</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Contacto
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--accent-red)" />
                <span>+51 907 040 190</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--accent-red)" />
                <span>contacto@ulema.edu.pe</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--accent-red)" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid #1e293b', 
          paddingTop: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem'
        }}>
          <span>&copy; {currentYear} Grupo de Estudio ULEMA. Todos los derechos reservados.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Aula Virtual</Link>
            <span>&middot;</span>
            <Link to="/login?admin=true" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Administración</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
