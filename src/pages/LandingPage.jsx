import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, Shield, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const whatsappNumber = "51907040190";
  const getWhatsappLink = (cycleName) => {
    const text = encodeURIComponent(`Hola, deseo solicitar información e inscribirme en el ciclo: ${cycleName} del Grupo de Estudio ULEMA.`);
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  const cycles = [
    {
      title: "Repaso Intensivo UNI (Matemática)",
      description: "Preparación avanzada con foco en el examen de admisión UNI. Domina los temas más recurrentes del temario de matemáticas.",
      subjects: ["Álgebra", "Aritmética", "Geometría", "Trigonometría"],
      badge: "Preuniversitario"
    },
    {
      title: "Cálculo Diferencial",
      description: "Curso teórico-práctico de nivel universitario enfocado en el análisis de funciones, límites, continuidad y derivadas.",
      subjects: ["Funciones reales", "Límites y Continuidad", "Derivadas y Reglas", "Aplicaciones de la derivada"],
      badge: "Universitario"
    },
    {
      title: "Cálculo Integral",
      description: "Domina las técnicas de integración, teoremas fundamentales del cálculo y sus aplicaciones en áreas, volúmenes y física.",
      subjects: ["Integrales Indefinidas", "Métodos de Integración", "Integral Definida", "Áreas y Volúmenes de Revolución"],
      badge: "Universitario"
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f6f8fb', 
      minHeight: '100vh', 
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
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
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }} id="landing-navbar">
            <style dangerouslySetInnerHTML={{__html: `
              @media (max-width: 768px) {
                #landing-navbar {
                  display: none !important;
                }
              }
            `}} />
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-red)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('ciclos')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-red)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              Ciclos
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-red)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
            >
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
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
          
          <h1 style={{ 
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
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, fontWeight: 500 }}>
            Accede a tus clases grabadas en alta definición, materiales didácticos, guías de problemas selectos y pizarras virtuales. Todo disponible 24/7 en tu intranet de estudios.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', backgroundColor: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#ffffff', fontWeight: 600, boxShadow: '0 6px 20px rgba(204, 13, 57, 0.22)' }}>
              Ingresar al Aula
            </button>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hola,%20deseo%20más%20información%20sobre%20los%20ciclos%20de%20estudio%20de%20ULEMA`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
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
            <div>
              <h3 style={{ fontSize: '2.6rem', color: 'var(--accent-red)', fontWeight: 800 }}>24/7</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Clases disponibles todo el día</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.6rem', color: 'var(--text-primary)', fontWeight: 800 }}>100%</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Contenido estructurado y dirigido</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.6rem', color: 'var(--text-primary)', fontWeight: 800 }}>Materiales</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Diapositivas, Pizarras y PDFs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cycles Section */}
      <section id="ciclos" style={{ padding: '100px 0', zIndex: 1, position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px', textTransform: 'uppercase' }}>NUESTROS CICLOS DE PREPARACIÓN</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
              Elige el ciclo que se adapte a tu objetivo académico. Todos los cursos cuentan con acceso completo a las clases grabadas y pizarras de clase.
            </p>
          </div>

          <div className="grid-3">
            {cycles.map((cycle, index) => (
              <div 
                key={index} 
                className="glass-panel" 
                style={{ 
                  padding: '36px 32px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  minHeight: '440px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.02)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: 'var(--accent-red-muted)', 
                      padding: '6px 14px', 
                      borderRadius: '20px',
                      color: 'var(--accent-red)',
                      fontWeight: 700
                    }}>
                      {cycle.badge}
                    </span>
                    <BookOpen size={20} color="var(--accent-red)" />
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
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Asignaturas Incluidas
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
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '10px 12px', fontSize: '0.85rem', backgroundColor: '#ffffff', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontWeight: 600 }}
                    >
                      Ingresar
                    </button>
                    <a 
                      href={getWhatsappLink(cycle.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary" 
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
                        fontWeight: 600
                      }}
                    >
                      <MessageCircle size={16} />
                      Matricularse
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
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px' }}>Ponte en Contacto</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '8px' }}>
              ¿Tienes dudas sobre los inicios de clases o formas de pago? Escríbenos o llámanos directamente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Phone size={24} color="var(--accent-red)" style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Teléfono / WhatsApp</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>+51 907 040 190</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Atención inmediata por el director de admisiones.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Mail size={24} color="var(--accent-red)" style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Correo Electrónico</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>contacto@ulema.edu.pe</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Soporte administrativo y consultas generales.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <MapPin size={24} color="var(--accent-red)" style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Sede Central</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lima, Perú</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Preparación presencial y virtual de alto nivel.</p>
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
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={30} />
      </a>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '40px 0', 
        backgroundColor: '#f8fafc', 
        color: 'var(--text-secondary)', 
        fontSize: '0.85rem',
        zIndex: 1,
        position: 'relative'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>ULEMA</span> © {new Date().getFullYear()} Grupo de Estudio. Todos los derechos reservados.
          </div>
          <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>
            Diseñado para preparación de alto rendimiento académico.
          </div>
        </div>
      </footer>
    </div>
  );
}
