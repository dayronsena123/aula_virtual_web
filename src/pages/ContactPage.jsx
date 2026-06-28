import React, { useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    const elements = ref.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function ContactPage() {
  const pageRef = useScrollReveal();
  const whatsappNumber = "51907040190";

  return (
    <div ref={pageRef} style={{ 
      backgroundColor: '#f6f8fb', 
      minHeight: '100vh', 
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <Navbar />

      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204, 13, 57, 0.02) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <section style={{ padding: '80px 0', zIndex: 1, position: 'relative' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
              CONTÁCTANOS
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px', textTransform: 'uppercase' }}>
              PONTE EN CONTACTO
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', margin: '14px auto 0 auto', borderRadius: '2px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500, marginTop: '20px', lineHeight: 1.6 }}>
              ¿Tienes dudas sobre el inicio de clases, matrículas o formas de pago? Escríbenos o llámanos directamente. ¡Estamos para ayudarte!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {/* Phone Card */}
            <div className="scroll-reveal delay-1 contact-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '28px 24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', cursor: 'default' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={22} color="var(--accent-red)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>TELÉFONO / LLAMADAS</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>+51 907 040 190</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Atención inmediata para informes generales.</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="scroll-reveal delay-2 contact-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '28px 24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', cursor: 'default' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} color="var(--accent-red)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>CORREO ELECTRÓNICO</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>contacto@ulema.edu.pe</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Consultas administrativas y soporte.</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="scroll-reveal delay-3 contact-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '28px 24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', cursor: 'default' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={22} color="var(--accent-red)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>SEDE PRINCIPAL</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lima, Perú</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Preparación virtual de alto nivel a nivel nacional.</p>
              </div>
            </div>
          </div>

          {/* Call to Action Box (WhatsApp Link) */}
          <div className="scroll-reveal" style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
            padding: '48px 32px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              ¿Listo para matricularte o solicitar una asesoría?
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto', fontWeight: 500, lineHeight: 1.6 }}>
              Escríbenos directamente a nuestro canal oficial de WhatsApp y un asesor académico te guiará en el proceso de inscripción y métodos de pago disponibles.
            </p>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hola,%20deseo%20más%20información%20sobre%20los%20ciclos%20y%20matrícula%20en%20el%20Grupo%20de%20Estudio%20ULEMA.`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary hover-scale" 
              style={{ 
                padding: '16px 36px', 
                fontSize: '1.05rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                backgroundColor: '#25D366', 
                borderColor: '#25D366', 
                color: '#ffffff', 
                fontWeight: 700,
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.22)',
                borderRadius: '30px'
              }}
            >
              <MessageCircle size={22} />
              Enviar mensaje de WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
