import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Layout from '../components/Layout';
import CustomPlayer from '../components/CustomPlayer';
import { BookOpen, FileText, ArrowLeft, ChevronDown, ChevronRight, Video, Calendar } from 'lucide-react';

export default function CourseView() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [videoUrl, setVideoUrl] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  // Prevent developer tools opening and copy behaviors in student page
  useEffect(() => {
    const preventDevTools = (e) => {
      // Disable Right Click
      if (e.type === 'contextmenu') {
        e.preventDefault();
      }
      // Disable keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
      if (e.type === 'keydown') {
        if (
          e.keyCode === 123 || 
          (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
          (e.ctrlKey && e.keyCode === 85)
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('contextmenu', preventDevTools);
    document.addEventListener('keydown', preventDevTools);

    return () => {
      document.removeEventListener('contextmenu', preventDevTools);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  useEffect(() => {
    async function loadCourseData() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        // 1. Get profile for watermark (DNI & Name)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('dni, full_name')
          .eq('id', session.user.id)
          .single();
        setStudentProfile(profileData);

        // 2. Get subject details
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('id, name, cycle_id, cycles(name)')
          .eq('id', subjectId)
          .single();
        
        if (subjectError) throw subjectError;
        setSubject(subjectData);

        // 3. Get weeks and their sessions
        const { data: weeksData, error: weeksError } = await supabase
          .from('weeks')
          .select(`
            id,
            week_number,
            name,
            sessions (
              id,
              day_of_week,
              title,
              video_url,
              pdf_problems_url,
              pdf_theory_url
            )
          `)
          .eq('subject_id', subjectId)
          .order('week_number', { ascending: true });

        if (weeksError) throw weeksError;

        // Sort sessions by day of week manually
        const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const processedWeeks = (weeksData || []).map(week => {
          const sortedSessions = (week.sessions || []).sort((a, b) => {
            return dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
          });
          return { ...week, sessions: sortedSessions };
        });

        setWeeks(processedWeeks);

        // Expand first week by default and select first session if available
        if (processedWeeks.length > 0) {
          setExpandedWeeks({ [processedWeeks[0].id]: true });
          if (processedWeeks[0].sessions.length > 0) {
            handleSessionSelect(processedWeeks[0].sessions[0]);
          }
        }

      } catch (err) {
        console.error('Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCourseData();
  }, [subjectId, navigate]);

  const handleSessionSelect = async (session) => {
    setActiveSession(session);
    if (!session.video_url) {
      setVideoUrl('');
      return;
    }

    // If the video URL is a Supabase storage path (starts with bucket or doesn't have http/https)
    // we generate a short-lived signed URL for extra security
    if (!session.video_url.startsWith('http://') && !session.video_url.startsWith('https://')) {
      try {
        setVideoLoading(true);
        // Expecting storage path as "bucket-name/filename.mp4"
        const parts = session.video_url.split('/');
        const bucket = parts[0];
        const path = parts.slice(1).join('/');

        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60); // 60 seconds expiration

        if (error) throw error;
        setVideoUrl(data.signedUrl);
      } catch (err) {
        console.error('Error creating signed URL for video:', err);
        setVideoUrl('');
      } finally {
        setVideoLoading(false);
      }
    } else {
      setVideoUrl(session.video_url);
    }
  };

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const getCleanFileName = (url) => {
    if (!url) return '';
    try {
      const decoded = decodeURIComponent(url);
      const parts = decoded.split('/');
      const fileNameWithStamp = parts[parts.length - 1];
      // Strip timestamp-random prefix: e.g. "178258699774-wp1-funciones1.pdf" -> "funciones1.pdf"
      const match = fileNameWithStamp.match(/^\d+-[a-z0-9]+-(.+)$/);
      if (match && match[1]) return match[1];
      const secondMatch = fileNameWithStamp.match(/^\d+-(.+)$/);
      if (secondMatch && secondMatch[1]) return secondMatch[1];
      return fileNameWithStamp;
    } catch (e) {
      return 'documento';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--accent-red-muted)',
          borderTop: '4px solid var(--accent-red)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '8px 12px' }}>
            <ArrowLeft size={16} />
            Volver
          </Link>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {subject?.cycles?.name}
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{subject?.name}</h1>
          </div>
        </div>

        {/* Two-Pane Workspace */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: '24px'
        }} id="course-split-pane">
          <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 1024px) {
              #course-split-pane {
                grid-template-columns: 320px 1fr;
              }
            }
          `}} />

          {/* Left Panel: Syllabus Structure */}
          <div className="glass-panel" style={{ padding: '20px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent-red)" />
              Temario Semanal
            </h3>

            {weeks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                No hay clases subidas en este curso.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {weeks.map((week) => {
                  const isExpanded = expandedWeeks[week.id];
                  return (
                    <div key={week.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {/* Week Header */}
                      <button
                        onClick={() => toggleWeek(week.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{week.name}</span>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      {/* Sessions List */}
                      {isExpanded && (
                        <div style={{ 
                          paddingLeft: '8px', 
                          marginTop: '4px',
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '4px',
                          borderLeft: '1px solid var(--border-color)',
                          marginLeft: '8px'
                        }}>
                          {week.sessions && week.sessions.length > 0 ? (
                            week.sessions.map((session) => {
                              const isActive = activeSession?.id === session.id;
                              return (
                                <button
                                  key={session.id}
                                  onClick={() => handleSessionSelect(session)}
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    padding: '10px 12px',
                                    backgroundColor: isActive ? 'var(--accent-red-muted)' : 'transparent',
                                    border: isActive ? '1px solid var(--accent-red-border)' : '1px solid transparent',
                                    borderRadius: '6px',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                  }}
                                >
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                                    {session.day_of_week}
                                  </span>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                    <Video size={12} />
                                    {session.title}
                                  </span>
                                </button>
                              );
                            })
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '6px 12px' }}>
                              Próximamente
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Class content & Player */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeSession ? (
              <>
                {/* Video Player Box */}
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--accent-red-muted)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-red)', fontWeight: 700 }}>
                      Clase en Línea - {activeSession.day_of_week}
                    </span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '6px' }}>{activeSession.title}</h2>
                  </div>

                  {videoLoading ? (
                    <div className="video-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Obteniendo conexión segura...</span>
                    </div>
                  ) : videoUrl ? (
                    <CustomPlayer 
                      src={videoUrl} 
                      watermarkText={studentProfile ? `${studentProfile.full_name} (${studentProfile.dni})` : 'ULEMA'} 
                    />
                  ) : (
                    <div className="video-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No hay grabación disponible para esta sesión.</span>
                    </div>
                  )}
                </div>

                {/* Materials & Downloads */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--accent-red)" />
                    Materiales de la Clase
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {/* Material 1: Problemas */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase' }}>Práctica</span>
                        <h4 style={{ fontSize: '0.95rem', margin: '4px 0', fontWeight: 600 }}>Material de Problemas</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guía de problemas propuestos para resolver en clase.</p>
                      </div>

                      {activeSession.pdf_problems_url ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => {
                                setPreviewUrl(activeSession.pdf_problems_url);
                                setPreviewTitle('Práctica: ' + getCleanFileName(activeSession.pdf_problems_url));
                              }}
                              className="btn btn-primary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                              Visualizar
                            </button>
                            <a 
                              href={activeSession.pdf_problems_url} 
                              download
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-secondary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                              Descargar
                            </a>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textAlign: 'center' }}>
                            Archivo: {getCleanFileName(activeSession.pdf_problems_url)}
                          </span>
                        </div>
                      ) : (
                        <button className="btn btn-secondary" disabled style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px', opacity: 0.5, cursor: 'not-allowed' }}>
                          No subido
                        </button>
                      )}
                    </div>

                    {/* Material 2: Teoría dictada */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase' }}>Teoría / Soluciones</span>
                        <h4 style={{ fontSize: '0.95rem', margin: '4px 0', fontWeight: 600 }}>Clase Dictada (Apuntes)</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pizarra virtual o apuntes desarrollados por el profesor.</p>
                      </div>

                      {activeSession.pdf_theory_url ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => {
                                setPreviewUrl(activeSession.pdf_theory_url);
                                setPreviewTitle('Apuntes: ' + getCleanFileName(activeSession.pdf_theory_url));
                              }}
                              className="btn btn-primary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                              Visualizar
                            </button>
                            <a 
                              href={activeSession.pdf_theory_url} 
                              download
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-secondary" 
                              style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                              Descargar
                            </a>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', textAlign: 'center' }}>
                            Archivo: {getCleanFileName(activeSession.pdf_theory_url)}
                          </span>
                        </div>
                      ) : (
                        <button className="btn btn-secondary" disabled style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px', opacity: 0.5, cursor: 'not-allowed' }}>
                          No subido
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '80px 24px', 
                  textAlign: 'center',
                  color: 'var(--text-secondary)'
                }}
              >
                <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Selecciona una Sesión</h3>
                <p style={{ fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto' }}>
                  Elige una semana y un día de la barra lateral para ver la grabación de la clase y los materiales didácticos.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* File Preview Modal */}
      {previewUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                {previewTitle}
              </span>
              <button 
                onClick={() => {
                  setPreviewUrl(null);
                  setPreviewTitle('');
                }}
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cerrar Vista
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ position: 'relative', padding: '12px', backgroundColor: '#e2e8f0', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {/* Floating Watermarks inside PDF preview */}
              {studentProfile && (
                <>
                  <div style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    fontSize: '0.85rem',
                    color: 'rgba(0, 0, 0, 0.15)',
                    fontWeight: 700,
                    zIndex: 20,
                    userSelect: 'none',
                    animation: 'floatWatermark1 26s infinite linear',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase'
                  }}>
                    {studentProfile.full_name} ({studentProfile.dni}) - ULEMA
                  </div>
                  <div style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    fontSize: '0.85rem',
                    color: 'rgba(0, 0, 0, 0.15)',
                    fontWeight: 700,
                    zIndex: 20,
                    userSelect: 'none',
                    animation: 'floatWatermark2 22s infinite linear',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase'
                  }}>
                    {studentProfile.full_name} ({studentProfile.dni}) - ULEMA
                  </div>
                </>
              )}

              {previewUrl.toLowerCase().endsWith('.pdf') || previewUrl.toLowerCase().includes('.pdf') ? (
                <iframe 
                  src={`${previewUrl}#toolbar=0&navpanes=0`} 
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '6px', zIndex: 1 }}
                  title="PDF Preview"
                />
              ) : (previewUrl.toLowerCase().endsWith('.png') || 
                   previewUrl.toLowerCase().endsWith('.jpg') || 
                   previewUrl.toLowerCase().endsWith('.jpeg') ||
                   previewUrl.toLowerCase().endsWith('.webp')) ? (
                <img 
                  src={previewUrl} 
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1 }} 
                  alt="Vista Previa"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '12px' }}>Previsualización no disponible para este tipo de archivo.</p>
                  <a 
                    href={previewUrl} 
                    download
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Descargar para abrir
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
