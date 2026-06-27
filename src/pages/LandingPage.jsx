import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, Shield, MessageCircle, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

// Scroll animation hook
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
  const getWhatsappLink = (cycleName) => {
    const text = encodeURIComponent(`Hola, deseo solicitar información e inscribirme en el ciclo: ${cycleName} del Grupo de Estudio ULEMA.`);
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  const cycles = [
    {
      title: "Repaso Intensivo UNI (Matematica)",
      description: "Preparacion avanzada con foco en el examen de admision UNI. Domina los temas mas recurrentes del temario de matematicas.",
      subjects: ["Algebra", "Aritmetica", "Geometria", "Trigonometria"],
      badge: "PREUNIVERSITARIO"
    },
    {
      title: "Calculo Diferencial",
      description: "Curso teorico-practico de nivel universitario enfocado en el analisis de funciones, limites, continuidad y derivadas.",
      subjects: ["Funciones reales", "Limites y Continuidad", "Derivadas y Reglas", "Aplicaciones de la derivada"],
      badge: "UNIVERSITARIO"
    },
    {
      title: "Calculo Integral",
      description: "Domina las tecnicas de integracion, teoremas fundamentales del calculo y sus aplicaciones en areas, volumenes y fisica.",
      subjects: ["Integrales Indefinidas", "Metodos de Integracion", "Integral Definida", "Areas y Volumenes de Revolucion"],
      badge: "UNIVERSITARIO"
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={pageRef} style={{ 
      backgroundColor: '#f6f8fb', 
      minHeight: '100vh', 
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Inline Styles for scroll-reveal animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-reveal.delay-1 { transition-delay: 0.1s; }
        .scroll-reveal.delay-2 { transition-delay: 0.2s; }
        .scroll-reveal.delay-3 { transition-delay: 0.3s; }
        .scroll-reveal.delay-4 { transition-delay: 0.4s; }

        .hero-title {
          animation: heroFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .hero-subtitle {
          animation: heroFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }
        .hero-cta {
          animation: heroFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }
        .hero-banner {
          animation: heroFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
          opacity: 0;
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cycle-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .cycle-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 50px rgba(204, 13, 57, 0.06), 0 0 0 1px rgba(204, 13, 57, 0.1) !important;
          border-color: rgba(204, 13, 57, 0.15) !important;
        }

        .contact-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
          border-color: rgba(204, 13, 57, 0.12);
        }

        .stat-item {
          transition: transform 0.3s ease;
        }
        .stat-item:hover {
          transform: scale(1.05);
        }

        .nav-link-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          position: relative;
          padding: 6px 0;
          transition: color 0.2s;
        }
        .nav-link-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: var(--accent-red);
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-link-btn:hover {
          color: var(--accent-red);
        }
        .nav-link-btn:hover::after {
          width: 100%;
        }

        .whatsapp-float {
          animation: floatBounce 3s ease-in-out infinite;
        }
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }

        @media (max-width: 768px) {
          #landing-navbar {
            display: none !important;
          }
          .hero-heading {
            font-size: 2.2rem !important;
          }
        }
      `}} />

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

      {/* Navigation Header */}
      <header style={{ 
        borderBottom: '1px solid var(--border-color)', 
        padding: '16px 0', 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(16px)',
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>ULEMA</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Grupo de Estudio
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }} id="landing-navbar">
            <button className="nav-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Inicio
            </button>
            <button className="nav-link-btn" onClick={() => scrollToSection('ciclos')}>
              Ciclos
            </button>
            <button className="nav-link-btn" onClick={() => scrollToSection('contacto')}>
              Contacto
            </button>
          </nav>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
        </div>
      </header>

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
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>PREPARACION DE ALTO NIVEL CON ENFOQUE EN LA:</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 20px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <img 
                src="/uni-logo.png" 
                alt="Logo UNI" 
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#7a1921', letterSpacing: '0.5px' }}>UNIVERSIDAD NACIONAL DE INGENIERIA</span>
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
            Accede a tus clases grabadas en alta definicion, materiales didacticos, guias de problemas selectos y pizarras virtuales. Todo disponible 24/7 en tu intranet de estudios.
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary hover-scale" 
              style={{ padding: '14px 32px', fontSize: '1rem', backgroundColor: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#ffffff', fontWeight: 700, boxShadow: '0 6px 20px rgba(204, 13, 57, 0.22)', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              INGRESAR AL AULA
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
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Clases disponibles todo el dia</p>
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

      {/* Cycles Section */}
      <section id="ciclos" style={{ padding: '100px 0', zIndex: 1, position: 'relative' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>FORMACION ACADEMICA</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px', textTransform: 'uppercase' }}>NUESTROS CICLOS DE PREPARACION</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', margin: '0 auto 20px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
              Elige el ciclo que se adapte a tu objetivo academico. Todos los cursos cuentan con acceso completo a las clases grabadas y pizarras de clase.
            </p>
          </div>

          <div className="grid-3">
            {cycles.map((cycle, index) => (
              <div 
                key={index} 
                className={`glass-panel cycle-card scroll-reveal delay-${index + 1}`}
                style={{ 
                  padding: '36px 32px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  minHeight: '440px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      backgroundColor: 'var(--accent-red-muted)', 
                      padding: '6px 14px', 
                      borderRadius: '20px',
                      color: 'var(--accent-red)',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {cycle.badge}
                    </span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={18} color="var(--accent-red)" />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', lineHeight: 1.3, color: 'var(--text-primary)', fontWeight: 800 }}>
                    {cycle.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5, fontWeight: 500 }}>
                    {cycle.description}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      ASIGNATURAS INCLUIDAS
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {cycle.subjects.map((sub, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          <CheckCircle2 size={15} color="var(--accent-red)" />
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="btn btn-secondary hover-scale" 
                      style={{ flex: 1, padding: '10px 12px', fontSize: '0.85rem', backgroundColor: '#ffffff', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}
                    >
                      INGRESAR
                    </button>
                    <a 
                      href={getWhatsappLink(cycle.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary hover-scale" 
                      style={{ 
                        flex: 1.6, 
                        padding: '10px 12px', 
                        fontSize: '0.85rem', 
                        backgroundColor: '#25D366', 
                        borderColor: '#25D366',
                        color: '#ffffff',
                        boxShadow: '0 4px 10px rgba(37, 211, 102, 0.15)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}
                    >
                      <MessageCircle size={16} />
                      MATRICULARSE
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section id="contacto" style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>CONTACTANOS</span>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px', textTransform: 'uppercase' }}>PONTE EN CONTACTO</h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', margin: '14px auto 0 auto', borderRadius: '2px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '14px' }}>
              Tienes dudas sobre los inicios de clases o formas de pago? Escribenos o llamanos directamente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div className="scroll-reveal delay-1 contact-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'default' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={20} color="var(--accent-red)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>TELEFONO / WHATSAPP</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>+51 907 040 190</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Atencion inmediata por el director de admisiones.</p>
              </div>
            </div>

            <div className="scroll-reveal delay-2 contact-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'default' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} color="var(--accent-red)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>CORREO ELECTRONICO</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>contacto@ulema.edu.pe</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Soporte administrativo y consultas generales.</p>
              </div>
            </div>

            <div className="scroll-reveal delay-3 contact-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'default' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-red-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={20} color="var(--accent-red)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>SEDE CENTRAL</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lima, Peru</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Preparacion presencial y virtual de alto nivel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Widget */}
      <a 
        href={`https://wa.me/${whatsappNumber}?text=Hola,%20deseo%20más%20información%20sobre%20el%20Grupo%20de%20Estudio%20ULEMA.`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(37, 211, 102, 0.3)',
          zIndex: 99,
          textDecoration: 'none'
        }}
      >
        <MessageCircle size={30} />
      </a>

      {/* Footer Premium */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        backgroundColor: '#0f172a', 
        color: '#94a3b8', 
        fontSize: '0.85rem',
        zIndex: 1,
        position: 'relative'
      }}>
        {/* Decorative red line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--accent-red), #e11d48, var(--accent-red))' }} />
        <div style={{ padding: '40px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.3px' }}>ULEMA</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Grupo de Estudio</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, textAlign: 'right' }}>
              <div>&copy; {new Date().getFullYear()} ULEMA. Todos los derechos reservados.</div>
              <div style={{ marginTop: '4px', fontSize: '0.75rem' }}>Plataforma de preparacion academica de alto nivel.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
