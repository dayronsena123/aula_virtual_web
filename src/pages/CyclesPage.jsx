import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, MessageCircle, ChevronRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappFloat from '../components/WhatsappFloat';

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

export default function CyclesPage() {
  const navigate = useNavigate();
  const pageRef = useScrollReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCycles, setExpandedCycles] = useState({});

  const toggleCycleExpansion = (index) => {
    setExpandedCycles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const whatsappNumber = "51907040190";
  const getWhatsappLink = (cycleName) => {
    const text = encodeURIComponent(`Hola, deseo solicitar información e inscribirme en el ciclo: ${cycleName} del Grupo de Estudio ULEMA.`);
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  const cycles = [
    {
      title: "Matemáticas desde Cero",
      description: "Construye hoy tu base, asegura tu futuro universitario y domina las matemáticas paso a paso.",
      subjects: ["Aritmética desde Cero", "Álgebra", "Geometría", "Trigonometría"],
      badge: "CICLO BASE",
      price: "S/. 39",
      features: [
        "1 hora diaria en vivo (Lunes a Viernes 7:00 PM - 8:00 PM)",
        "Acceso ilimitado a grabaciones de clases las 24 horas",
        "Pizarras virtuales de cada sesión en formato PDF",
        "Sistema de constancia y participación interactiva",
        "Sorteos trimestrales de tablets, becas y más"
      ]
    },
    {
      title: "Repaso Intensivo UNI (Matemática)",
      description: "Preparación avanzada con foco en el examen de admisión UNI. Domina los temas más recurrentes del temario de matemáticas.",
      subjects: ["Álgebra", "Aritmética", "Geometría", "Trigonometría"],
      badge: "PREUNIVERSITARIO",
      price: "S/.",
      features: [
        "Resolución guiada de exámenes de admisión UNI anteriores",
        "Ejercicios y problemas selectos de nivel avanzado",
        "Material académico descargable en formato PDF",
        "Asignaturas completas con docentes especializados"
      ]
    },
    {
      title: "Cálculo Diferencial",
      description: "Curso teórico-práctico de nivel universitario enfocado en el análisis de funciones, límites, continuidad y derivadas.",
      subjects: ["Funciones reales", "Límites y Continuidad", "Derivadas y Reglas", "Aplicaciones de la derivada"],
      badge: "UNIVERSITARIO",
      price: "S/.",
      features: [
        "Temario adaptado al currículo universitario nacional",
        "Explicación teórica paso a paso de fórmulas y teoremas",
        "Prácticas y exámenes pasados resueltos en vivo",
        "Material de apuntes teóricos y pizarras virtuales"
      ]
    },
    {
      title: "Cálculo Integral",
      description: "Domina las técnicas de integración, teoremas fundamentales del cálculo y sus aplicaciones en áreas, volúmenes y física.",
      subjects: ["Integrales Indefinidas", "Métodos de Integración", "Integral Definida", "Áreas y Volúmenes de Revolución"],
      badge: "UNIVERSITARIO",
      price: "S/.",
      features: [
        "Análisis profundo de técnicas de integración avanzada",
        "Aplicación física y geométrica de las integrales",
        "Soporte con diapositivas y pizarras digitales PDF",
        "Ejercicios resueltos de alta complejidad de exámenes reales"
      ]
    }
  ];

  const filteredCycles = cycles.filter(c => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return c.title.toLowerCase().includes(query) || 
           c.badge.toLowerCase().includes(query) || 
           c.subjects.some(sub => sub.toLowerCase().includes(query));
  });

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
        top: '10%',
        right: '-5%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204, 13, 57, 0.03) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <section style={{ padding: '80px 0', zIndex: 1, position: 'relative' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
              FORMACIÓN ACADÉMICA
            </span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px', textTransform: 'uppercase' }}>
              NUESTROS CICLOS DE PREPARACIÓN
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', margin: '0 auto 20px auto', borderRadius: '2px' }} />
            <p style={{ maxWidth: '600px', margin: '0 auto 30px auto', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
              Elige el ciclo que se adapte a tu objetivo académico. Todos los cursos cuentan con acceso completo a las clases grabadas, materiales didácticos y pizarras.
            </p>

            {/* Search Bar for Cycles */}
            <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto 40px auto' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Buscar ciclo o asignatura..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 46px',
                  borderRadius: '30px',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-red)';
                  e.target.style.boxShadow = '0 4px 15px rgba(204, 13, 57, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02)';
                }}
              />
            </div>
          </div>

          <div className="grid-3">
            {filteredCycles.length > 0 ? (
              filteredCycles.map((cycle, index) => (
                <div 
                  key={index} 
                  className={`glass-panel cycle-card scroll-reveal delay-${(index % 3) + 1}`}
                  style={{ 
                    padding: '36px 32px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    minHeight: '460px',
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
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {cycle.price}
                        </span>
                        {cycle.price === "S/. 39" && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>/ mes</span>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', lineHeight: 1.3, color: 'var(--text-primary)', fontWeight: 800 }}>
                      {cycle.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5, fontWeight: 500 }}>
                      {cycle.description}
                    </p>

                    {/* Toggle Collapsible Details (Ver más) */}
                    <div style={{ marginBottom: '24px' }}>
                      <button
                        onClick={() => toggleCycleExpansion(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-red)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        {expandedCycles[index] ? 'Ocultar detalles' : 'Ver más detalles'}
                        <ChevronRight 
                          size={14} 
                          style={{ 
                            transform: expandedCycles[index] ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.25s ease'
                          }} 
                        />
                      </button>

                      {expandedCycles[index] && (
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '16px', 
                          backgroundColor: '#f8fafc', 
                          borderRadius: '12px', 
                          border: '1px solid var(--border-color)',
                          textAlign: 'left',
                          animation: 'heroFadeIn 0.25s ease-out forwards'
                        }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Beneficios del Ciclo:
                          </span>
                          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 500 }}>
                            {cycle.features.map((feat, fIdx) => (
                              <li key={fIdx}>{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
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
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                No se encontraron ciclos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappFloat />
    </div>
  );
}
