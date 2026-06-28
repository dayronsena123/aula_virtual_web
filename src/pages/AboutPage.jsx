import React, { useEffect, useRef } from 'react';
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

export default function AboutPage() {
  const pageRef = useScrollReveal();

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
        left: '-5%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204, 13, 57, 0.02) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <section style={{ padding: '80px 0', zIndex: 1, position: 'relative' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
              SOBRE NOSOTROS
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: 900, letterSpacing: '-0.8px', textTransform: 'uppercase' }}>
              NUESTRA HISTORIA Y FUNDACIÓN
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', margin: '14px auto 0 auto', borderRadius: '2px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500, marginTop: '20px', lineHeight: 1.6 }}>
              Grupo de Estudio Ulema nace con la misión de ofrecer una preparación matemática rigurosa, precisa y enfocada a resultados para estudiantes de nivel escolar, preuniversitario y universitario.
            </p>
          </div>

          <div className="scroll-reveal" style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)', 
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)',
            padding: '54px 36px 42px 36px',
            textAlign: 'center',
            position: 'relative',
            marginTop: '80px'
          }}>
            {/* Profile image with white border and drop shadow */}
            <div style={{
              position: 'absolute',
              top: '-70px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '6px solid #ffffff',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              backgroundColor: '#f8fafc'
            }}>
              <img 
                src="/Riudin Acuña.jpeg" 
                alt="Riudin Acuña" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <div style={{ marginTop: '70px' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: 'var(--accent-red-muted)', 
                padding: '6px 16px', 
                borderRadius: '20px', 
                color: 'var(--accent-red)', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Fundador Ulema
              </span>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                Riudin Acuña
              </h3>
              
              <p style={{ fontSize: '0.95rem', color: 'var(--accent-red)', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Universidad Nacional de Ingeniería (UNI) - Ingeniería Estadística
              </p>

              <div style={{ maxWidth: '650px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, fontWeight: 500, textAlign: 'justify' }}>
                <p style={{ marginBottom: '16px' }}>
                  Como estudiante de <strong>Ingeniería Estadística</strong> en la prestigiosa <strong>Universidad Nacional de Ingeniería (UNI)</strong>, Riudin Acuña cuenta con una destacada trayectoria en la enseñanza de las matemáticas. Su pasión por los números y la pedagogía lo llevó a fundar <strong>Ulema</strong>, un grupo de estudio diseñado para romper los esquemas tradicionales de aprendizaje y proveer bases sólidas de alta exigencia.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  Riudin coordina y lidera a un equipo de profesores sumamente capacitados, dedicados a orientar a los alumnos en sus metas preuniversitarias (UNI, SAN MARCOS, etc.) y cursos avanzados universitarios. 
                </p>
                <p>
                  Bajo su dirección, <strong>Ulema</strong> se consolida como una plataforma educativa de alto rendimiento con metodología basada en disciplina, método, precisión y resultados, ofreciendo las herramientas tecnológicas de intranet para que el estudio nunca se detenga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
