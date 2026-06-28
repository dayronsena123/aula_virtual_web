import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const elements = ref.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingPage() {
  const navigate = useNavigate();
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
        top: '-10%',
        right: '-5%',
        width: '60vw',
        height: '60vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204, 13, 57, 0.04) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.02) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero Section */}
      <section style={{ 
        padding: '90px 0 100px 0', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          {/* Logo UNI Banner */}
          <div className="hero-banner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>PREPARACIÓN DE ALTO NIVEL CON ENFOQUE EN LA:</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 20px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <img 
                src="/uni-logo.png" 
                alt="Logo UNI" 
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#7a1921', letterSpacing: '0.5px' }}>UNIVERSIDAD NACIONAL DE INGENIERÍA</span>
            </div>
          </div>
          
          <h1 className="hero-title hero-heading" style={{ 
            fontSize: '3.6rem', 
            lineHeight: 1.15, 
            marginBottom: '24px', 
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-1.5px',
            textTransform: 'uppercase'
          }}>
            LLEVA TU APRENDIZAJE AL SIGUIENTE NIVEL CON <span style={{ color: 'var(--accent-red)' }}>ULEMA</span>
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, fontWeight: 500 }}>
            Accede a tus clases grabadas en alta definición, materiales didácticos, guías de problemas selectos y pizarras virtuales. Todo disponible 24/7 en tu intranet de estudios.
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/ciclos')} 
              className="btn btn-primary hover-scale" 
              style={{ padding: '14px 32px', fontSize: '1rem', backgroundColor: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#ffffff', fontWeight: 700, boxShadow: '0 6px 20px rgba(204, 13, 57, 0.22)', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              VER CICLOS DISPONIBLES
              <ArrowRight size={18} />
            </button>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hola,%20deseo%20más%20información%20sobre%20los%20ciclos%20de%20estudio%20de%20ULEMA`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary hover-scale" 
              style={{ padding: '14px 32px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontWeight: 600 }}
            >
              <MessageCircle size={20} color="#25D366" />
              Escribir al WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats / Features Grid */}
      <section style={{ 
        padding: '50px 0', 
        borderTop: '1px solid var(--border-color)', 
        borderBottom: '1px solid var(--border-color)', 
        backgroundColor: '#ffffff',
        zIndex: 1,
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '32px',
            textAlign: 'center'
          }}>
            <div className="scroll-reveal stat-item" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '2.6rem', color: 'var(--accent-red)', fontWeight: 800 }}>24/7</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Clases disponibles todo el día</p>
            </div>
            <div className="scroll-reveal delay-1 stat-item" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '2.6rem', color: 'var(--text-primary)', fontWeight: 800 }}>100%</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Contenido estructurado y dirigido</p>
            </div>
            <div className="scroll-reveal delay-2 stat-item" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '2.6rem', color: 'var(--text-primary)', fontWeight: 800 }}>MATERIALES</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Diapositivas, Pizarras y PDFs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '90px 0', textAlign: 'center', zIndex: 1, position: 'relative' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 className="scroll-reveal" style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            ¿LISTO PARA COMENZAR TU PREPARACIÓN?
          </h2>
          <div className="scroll-reveal" style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', margin: '14px auto 20px auto', borderRadius: '2px' }} />
          <p className="scroll-reveal delay-1" style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
            Inscríbete hoy en nuestro ciclo "Matemáticas desde Cero" o solicita informes para preparación universitaria de Cálculo y Repasos UNI. ¡Logra tus metas académicas con Ulema!
          </p>
          <div className="scroll-reveal delay-2">
            <button 
              onClick={() => navigate('/ciclos')}
              className="btn btn-primary hover-scale"
              style={{ 
                padding: '14px 32px', 
                fontSize: '1rem', 
                backgroundColor: 'var(--accent-red)', 
                borderColor: 'var(--accent-red)', 
                fontWeight: 700, 
                boxShadow: '0 6px 20px rgba(204, 13, 57, 0.18)',
                borderRadius: '30px'
              }}
            >
              Explorar Ciclos Académicos
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
