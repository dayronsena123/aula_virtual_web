import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, User, LogOut, Menu, X, Users, Upload } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          setUserProfile(data);
        }
      } catch (err) {
        console.error('Error loading profile in Layout:', err);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar for Desktop */}
      <aside 
        className="glass-panel" 
        style={{
          width: '260px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 0,
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: '1px solid var(--border-color)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-normal)',
          height: '100vh'
        }}
        id="sidebar-desktop"
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            #sidebar-desktop {
              transform: translateX(0) !important;
            }
            #main-content {
              margin-left: 260px;
            }
            #menu-toggle-btn {
              display: none !important;
            }
          }
        `}} />
        <div>
          {/* Logo Section */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '40px', 
            paddingBottom: '20px', 
            borderBottom: '1px solid var(--border-color)' 
          }}>
            <span style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '1.4rem', 
              fontWeight: 800, 
              color: 'var(--text-primary)',
              letterSpacing: '1px'
            }}>
              ULEMA
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--accent-red)', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginTop: '2px'
            }}>
              Grupo de Estudio
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link 
              to="/dashboard" 
              className="btn" 
              style={{
                justifyContent: 'flex-start',
                backgroundColor: isActive('/dashboard') ? 'var(--accent-red)' : 'transparent',
                color: isActive('/dashboard') ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: isActive('/dashboard') ? '0 4px 10px rgba(204, 13, 57, 0.15)' : 'none',
                transition: 'all 0.2s'
              }}
              onClick={() => setSidebarOpen(false)}
            >
              <BookOpen size={20} color={isActive('/dashboard') ? '#ffffff' : 'var(--text-secondary)'} />
              Mis Cursos
            </Link>

            {isAdmin && (
              <Link 
                to="/admin" 
                className="btn" 
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: isActive('/admin') ? 'var(--accent-red)' : 'transparent',
                  color: isActive('/admin') ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  boxShadow: isActive('/admin') ? '0 4px 10px rgba(204, 13, 57, 0.15)' : 'none',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Users size={20} color={isActive('/admin') ? '#ffffff' : 'var(--text-secondary)'} />
                Administración
              </Link>
            )}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          {userProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', gap: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {userProfile.full_name}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                DNI: {userProfile.dni}
              </span>
              <span style={{ 
                fontSize: '0.7rem', 
                backgroundColor: userProfile.role === 'admin' ? 'rgba(225, 29, 72, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                color: userProfile.role === 'admin' ? 'var(--accent-red)' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: '12px',
                alignSelf: 'flex-start',
                fontWeight: 600,
                marginTop: '4px'
              }}>
                {userProfile.role === 'admin' ? 'Administrador' : 'Estudiante'}
              </span>
            </div>
          )}
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 35
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div 
        id="main-content" 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin var(--transition-normal)'
        }}
      >
        {/* Mobile Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <button 
            id="menu-toggle-btn"
            className="btn btn-secondary" 
            style={{ padding: '8px' }}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>ULEMA</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-red)', fontWeight: 600 }}>AULA VIRTUAL</span>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '32px 24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
