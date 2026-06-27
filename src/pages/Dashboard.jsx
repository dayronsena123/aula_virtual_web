import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Layout from '../components/Layout';
import { BookOpen, GraduationCap, ArrowRight, ShieldCheck, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Attendance states
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceMarkedToday, setAttendanceMarkedToday] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'attendance'

  useEffect(() => {
    loadDashboardData();
  }, [navigate]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // 1. Get profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData);

      // 2. Get enrollments and related cycles/subjects
      const { data: enrollData, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          id,
          cycles (
            id,
            name,
            description,
            subjects (
              id,
              name
            )
          )
        `)
        .eq('student_id', session.user.id);

      if (enrollError) throw enrollError;
      setEnrollments(enrollData || []);

      // 3. Get attendance list
      const { data: attData, error: attError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', session.user.id)
        .order('check_in_date', { ascending: false });

      if (attError) throw attError;
      setAttendanceList(attData || []);

      // Check if today is already in the check-in list
      const todayString = new Date().toISOString().split('T')[0];
      const markedToday = (attData || []).some(
        record => record.check_in_date === todayString
      );
      setAttendanceMarkedToday(markedToday);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAttendance = async () => {
    if (attendanceMarkedToday || markingAttendance || !profile) return;

    try {
      setMarkingAttendance(true);
      
      const { error } = await supabase
        .from('attendance')
        .insert([
          {
            student_id: profile.id,
            status: 'Presente'
          }
        ]);

      if (error) throw error;

      // Reload dashboard data to refresh list
      await loadDashboardData();
    } catch (err) {
      console.error('Error marking attendance:', err);
      alert('Error al registrar asistencia: ' + err.message);
    } finally {
      setMarkingAttendance(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
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

  const isAdmin = profile?.role === 'admin';
  const cycleName = enrollments.length > 0 ? enrollments[0].cycles?.name : '';

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Welcome Section */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '32px', 
            marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(204, 13, 57, 0.03) 0%, rgba(255, 255, 255, 1) 100%)',
            borderLeft: '4px solid var(--accent-red)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--accent-red)', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px',
            display: 'block',
            marginBottom: '8px'
          }}>
            Aula Virtual ULEMA
          </span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {profile?.full_name}
          </h1>
          
          {/* Display Student Cycle Name immediately below DNI/Name */}
          {cycleName && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ 
                fontSize: '0.8rem', 
                backgroundColor: 'var(--accent-red-muted)', 
                color: 'var(--accent-red)', 
                border: '1px solid var(--accent-red-border)',
                padding: '4px 14px', 
                borderRadius: '20px', 
                fontWeight: 700,
                letterSpacing: '1px',
                display: 'inline-block'
              }}>
                {cycleName.toUpperCase()}
              </span>
            </div>
          )}

          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Revisa tus asignaturas asignadas, descarga tus separatas de clase y mantén un registro de tu asistencia diaria.
          </p>

          {isAdmin && (
            <div style={{ marginTop: '20px' }}>
              <Link to="/admin" className="btn btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem', backgroundColor: 'var(--accent-red)' }}>
                <ShieldCheck size={18} />
                Ir al Panel de Administración
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
          <button
            className="btn"
            style={{
              backgroundColor: activeTab === 'courses' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'courses' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeTab === 'courses' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.9rem',
              borderRadius: '8px 8px 0 0',
              padding: '12px 24px'
            }}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={18} />
            Asignaturas
          </button>
          <button
            className="btn"
            style={{
              backgroundColor: activeTab === 'attendance' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'attendance' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeTab === 'attendance' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.9rem',
              borderRadius: '8px 8px 0 0',
              padding: '12px 24px'
            }}
            onClick={() => setActiveTab('attendance')}
          >
            <Calendar size={18} />
            Mi Asistencia
          </button>
        </div>

        {/* Tab 1: Courses view */}
        {activeTab === 'courses' && (
          <div>
            {enrollments.length === 0 ? (
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '48px', 
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderColor: 'var(--border-color)'
                }}
              >
                <GraduationCap size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Sin Matrículas Activas</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem' }}>
                  Aún no estás matriculado en ningún ciclo académico. Comunícate con la administración para que activen tu acceso.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {enrollments.map((enrollment) => {
                  const cycle = enrollment.cycles;
                  const isRepasoUNI = cycle.name.toLowerCase().includes('repaso');
                  
                  return (
                    <div key={enrollment.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '8px'
                      }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>Asignaturas del Ciclo</h3>
                      </div>

                      {/* Render Subjects Grid */}
                      <div className="grid-3">
                        {cycle.subjects && cycle.subjects.length > 0 ? (
                          cycle.subjects.map((subject) => (
                            <div 
                              key={subject.id} 
                              className="glass-panel glass-panel-hover"
                              style={{
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '180px'
                              }}
                            >
                              <div>
                                <div style={{ 
                                  display: 'inline-flex', 
                                  padding: '8px', 
                                  backgroundColor: 'var(--accent-red-muted)', 
                                  borderRadius: '8px', 
                                  color: 'var(--accent-red)',
                                  marginBottom: '16px'
                                }}>
                                  <BookOpen size={20} />
                                </div>
                                <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{subject.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                  {isRepasoUNI 
                                    ? `Temario completo de ${subject.name} dirigido a la UNI` 
                                    : `Curso enfocado en temas semanales de Cálculo`}
                                </p>
                              </div>

                              <div style={{ marginTop: '16px' }}>
                                <Link 
                                  to={`/course/${subject.id}`} 
                                  className="btn btn-secondary" 
                                  style={{ 
                                    width: '100%', 
                                    justifyContent: 'space-between',
                                    fontSize: '0.85rem',
                                    padding: '8px 16px'
                                  }}
                                >
                                  Ver Clases
                                  <ArrowRight size={16} />
                                </Link>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aún no se han configurado asignaturas en este ciclo.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Attendance view */}
        {activeTab === 'attendance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} id="attendance-grid-layout">
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 768px) {
                #attendance-grid-layout {
                  grid-template-columns: 1fr 1.5fr;
                }
              }
            `}} />

            {/* Left Column: Mark Attendance Panel */}
            <div className="glass-panel" style={{ padding: '28px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--accent-red)" />
                Registro de Hoy
              </h3>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Registra tu asistencia diaria al ingresar a la plataforma. Recuerda marcar tu entrada todos los días.
              </p>

              {attendanceMarkedToday ? (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#4ade80'
                }}>
                  <CheckCircle size={24} />
                  <div>
                    <span style={{ fontWeight: 700, display: 'block', fontSize: '0.95rem' }}>Asistencia Registrada</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>¡Ya marcaste tu asistencia el día de hoy!</span>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
                  onClick={handleMarkAttendance}
                  disabled={markingAttendance}
                >
                  {markingAttendance ? 'Registrando...' : 'Marcar Asistencia Hoy'}
                </button>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Clases Asistidas:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-red)' }}>{attendanceList.length} días</span>
              </div>
            </div>

            {/* Right Column: Attendance History */}
            <div className="glass-panel" style={{ padding: '28px', maxHeight: '420px', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="var(--accent-red)" />
                Historial de Asistencia
              </h3>

              {attendanceList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.9rem' }}>No registras asistencias todavía.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {attendanceList.map((record) => (
                    <div 
                      key={record.id}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{record.check_in_date}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hora: {record.check_in_time}</span>
                      </div>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}
