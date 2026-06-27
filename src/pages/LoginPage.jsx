import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdminLogin = searchParams.get('admin') === 'true';

  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!dni || !password) {
      setErrorMsg('Por favor, ingresa tu DNI y contraseña.');
      setLoading(false);
      return;
    }

    try {
      const cleanedDni = dni.trim();
      const email = cleanedDni.includes('@') ? cleanedDni : `${cleanedDni}@ulema.edu.pe`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Invalid login credentials') {
        setErrorMsg('El DNI o la contraseña son incorrectos.');
      } else {
        setErrorMsg('Ocurrió un error al intentar ingresar. Revisa tu conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f6f8fb',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204, 13, 57, 0.05) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div 
        className="glass-panel animate-scale-in" 
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          zIndex: 1,
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'var(--accent-red-muted)', 
            width: '54px', 
            height: '54px', 
            borderRadius: '14px',
            color: 'var(--accent-red)',
            marginBottom: '16px',
            border: '1px solid rgba(204, 13, 57, 0.15)'
          }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {isAdminLogin ? 'Panel Administrativo' : 'Aula Virtual'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {isAdminLogin ? 'Control de Administración' : 'Grupo de Estudio ULEMA'}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-dni" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              {isAdminLogin ? 'Administrador (Usuario / Correo)' : 'DNI, Correo o Usuario'}
            </label>
            <input
              id="login-dni"
              type="text"
              className="form-input"
              placeholder={isAdminLogin ? "Ingresa tu usuario o correo" : "Ingresa tu DNI o Correo"}
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              disabled={loading}
              autoComplete="username"
              style={{
                boxShadow: 'none',
                borderColor: 'var(--border-color)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" htmlFor="login-pass" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Contraseña</label>
            <input
              id="login-pass"
              type="password"
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              style={{
                boxShadow: 'none',
                borderColor: 'var(--border-color)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary hover-scale"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              justifyContent: 'center', 
              backgroundColor: 'var(--accent-red)',
              borderColor: 'var(--accent-red)',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(204, 13, 57, 0.18)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            disabled={loading}
          >
            {loading ? 'VERIFICANDO...' : (isAdminLogin ? 'INGRESAR AL PANEL' : 'INGRESAR AL AULA')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-secondary" 
            style={{ 
              border: 'none', 
              background: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '0.82rem', 
              cursor: 'pointer',
              fontWeight: 500,
              textDecoration: 'underline'
            }}
          >
            Volver a la página de inicio
          </button>
        </div>
      </div>
    </div>
  );
}
