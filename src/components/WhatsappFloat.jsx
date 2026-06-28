import React from 'react';

export default function WhatsappFloat() {
  const whatsappNumber = "51907040190";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola,%20deseo%20solicitar%20información%20sobre%20los%20ciclos%20del%20Grupo%20de%20Estudio%20ULEMA.`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank" 
      rel="noopener noreferrer"
      className="whatsapp-float hover-scale"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
        zIndex: 999,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        border: 'none',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <img 
        src="/logowhatsaap.png" 
        alt="WhatsApp" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          borderRadius: '50%'
        }} 
      />
    </a>
  );
}
