import React from 'react';

function App() {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '16px',
        padding: '40px 28px',
        maxWidth: '500px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: '#ef4444', letterSpacing: '-0.5px' }}>
          SERVICIO TEMPORALMENTE SUSPENDIDO
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', textAlign: 'justify' }}>
          El acceso a la plataforma virtual y sitio web del <strong>Grupo de Estudio ULEMA</strong> ha sido inhabilitado temporalmente debido a la falta de pago por el desarrollo del software.
        </p>
        <div style={{ height: '1px', backgroundColor: '#334155', margin: '20px 0' }} />
        <p style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 500 }}>
          Si eres el administrador de la academia, comunícate con el desarrollador encargado para regularizar el pago pendiente y restablecer el servicio.
        </p>
      </div>
    </div>
  );
}

export default App;
