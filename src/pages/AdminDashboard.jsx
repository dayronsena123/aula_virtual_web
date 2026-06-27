import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';
import { Users, Upload, Plus, FileText, Check, AlertCircle, Calendar, X, Clock, Search, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Data lists
  const [students, setStudents] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [weeks, setWeeks] = useState([]);

  // Form states - Create Student
  const [newStudent, setNewStudent] = useState({ dni: '', fullName: '', password: '', cycleId: '' });

  // Form states - Upload Class
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState('');
  const [newWeekNumber, setNewWeekNumber] = useState('');
  const [sessionDay, setSessionDay] = useState('Lunes');
  const [sessionTitle, setSessionTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfProblemsUrl, setPdfProblemsUrl] = useState('');
  const [pdfTheoryUrl, setPdfTheoryUrl] = useState('');

  // File Upload states
  const [problemsFile, setProblemsFile] = useState(null);
  const [theoryFile, setTheoryFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [currentSessions, setCurrentSessions] = useState([]);

  // Student Attendance Modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Search / Filter state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (selectedCycleId) {
      loadSubjectsForCycle(selectedCycleId);
    } else {
      setSubjects([]);
      setSelectedSubjectId('');
    }
  }, [selectedCycleId]);

  useEffect(() => {
    if (selectedSubjectId) {
      loadWeeksForSubject(selectedSubjectId);
    } else {
      setWeeks([]);
      setSelectedWeekId('');
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (selectedWeekId) {
      loadSessionsForWeek(selectedWeekId);
    } else {
      setCurrentSessions([]);
    }
  }, [selectedWeekId]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      // Fetch cycles
      const { data: cyclesData } = await supabase.from('cycles').select('*').order('name');
      setCycles(cyclesData || []);

      // Fetch students list (profiles with role student)
      const { data: studentsData } = await supabase
        .from('profiles')
        .select(`
          id,
          dni,
          full_name,
          enrollments (
            cycles (
              name
            )
          )
        `)
        .eq('role', 'student')
        .order('created_at', { ascending: false });
      
      setStudents(studentsData || []);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjectsForCycle = async (cycleId) => {
    const { data } = await supabase.from('subjects').select('*').eq('cycle_id', cycleId).order('name');
    setSubjects(data || []);
  };

  const loadWeeksForSubject = async (subjectId) => {
    const { data } = await supabase.from('weeks').select('*').eq('subject_id', subjectId).order('week_number');
    setWeeks(data || []);
  };

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 6000);
  };

  // 1. Create Student using Supabase Client API to avoid DB 500 errors
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const { dni, fullName, password, cycleId } = newStudent;

    if (!dni || !fullName || !password) {
      showMessage('error', 'Por favor completa todos los campos del estudiante.');
      return;
    }

    try {
      setLoading(true);

      // Crear cliente temporal sin guardar sesión en localStorage
      const tempSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      );

      const studentEmail = `${dni.trim()}@ulema.edu.pe`;

      // Registrar al estudiante mediante la API oficial de Supabase
      const { data, error: signUpError } = await tempSupabase.auth.signUp({
        email: studentEmail,
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            dni: dni.trim(),
            role: 'student'
          }
        }
      });

      if (signUpError) throw signUpError;

      const newUserId = data.user?.id;
      if (!newUserId) throw new Error('No se pudo obtener el ID del nuevo estudiante.');

      // Confirmar el correo electrónico del estudiante usando el RPC seguro del admin
      const { error: confirmError } = await supabase.rpc('admin_confirm_student_email', {
        user_email: studentEmail
      });

      if (confirmError) throw confirmError;

      // Vincular la matrícula en la tabla de matrículas
      if (cycleId) {
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert({
            student_id: newUserId,
            cycle_id: cycleId
          });

        if (enrollError) throw enrollError;
      }

      showMessage('success', `Estudiante ${fullName} registrado con éxito.`);
      setNewStudent({ dni: '', fullName: '', password: '', cycleId: '' });
      loadAdminData();
    } catch (err) {
      console.error('Error creating student:', err);
      showMessage('error', `Error al crear estudiante: ${err.message || 'Ocurrió un error inesperado'}`);
    } finally {
      setLoading(false);
    }
  };

  // Upload file helper
  const uploadFile = async (file, bucket) => {
    const fileExt = file.name.split('.').pop();
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 5)}-${cleanBaseName}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;

    if (bucket === 'videos') {
      return `videos/${filePath}`;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  // 2. Create Week
  const handleCreateWeek = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId || !newWeekNumber) {
      showMessage('error', 'Selecciona asignatura e ingresa el número de semana.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('weeks')
        .insert([
          {
            subject_id: selectedSubjectId,
            week_number: parseInt(newWeekNumber),
            name: `Semana ${newWeekNumber}`
          }
        ])
        .select()
        .single();

      if (error) throw error;

      showMessage('success', `Semana ${newWeekNumber} creada con éxito.`);
      setNewWeekNumber('');
      loadWeeksForSubject(selectedSubjectId);
      setSelectedWeekId(data.id);
    } catch (err) {
      console.error('Error creating week:', err);
      showMessage('error', `Error al crear semana: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Upload Class Session & materials
  const handleUploadClass = async (e) => {
    e.preventDefault();

    if (!selectedWeekId || !sessionTitle) {
      showMessage('error', 'Selecciona la semana y completa el tema de la sesión.');
      return;
    }

    try {
      setLoading(true);
      let problemsUrl = pdfProblemsUrl;
      let theoryUrl = pdfTheoryUrl;
      let finalVideoUrl = videoUrl;

      // Check if files are selected and upload them
      if (problemsFile) {
        problemsUrl = await uploadFile(problemsFile, 'materials');
      }
      if (theoryFile) {
        theoryUrl = await uploadFile(theoryFile, 'materials');
      }
      if (videoFile) {
        finalVideoUrl = await uploadFile(videoFile, 'videos');
      }

      const { error } = await supabase
        .from('sessions')
        .insert([
          {
            week_id: selectedWeekId,
            day_of_week: sessionDay,
            title: sessionTitle.trim(),
            video_url: finalVideoUrl.trim() || null,
            pdf_problems_url: problemsUrl || null,
            pdf_theory_url: theoryUrl || null
          }
        ]);

      if (error) throw error;

      showMessage('success', `Clase "${sessionTitle}" del día ${sessionDay} guardada.`);
      
      // Reload sessions list
      loadSessionsForWeek(selectedWeekId);
      
      // Clear forms
      setSessionTitle('');
      setVideoUrl('');
      setPdfProblemsUrl('');
      setPdfTheoryUrl('');
      setProblemsFile(null);
      setTheoryFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error('Error uploading class:', err);
      showMessage('error', `Error al subir clase: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionsForWeek = async (weekId) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('week_id', weekId);
      
      if (error) throw error;
      
      const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const sorted = (data || []).sort((a, b) => dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week));
      setCurrentSessions(sorted);
    } catch (err) {
      console.error('Error loading sessions for week:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta clase de la semana?')) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      
      showMessage('success', 'Clase eliminada.');
      loadSessionsForWeek(selectedWeekId);
    } catch (err) {
      console.error('Error deleting session:', err);
      showMessage('error', 'Error al eliminar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. View student attendance
  const handleViewAttendance = async (student) => {
    try {
      setSelectedStudent(student);
      setLoadingAttendance(true);
      setStudentAttendance([]);

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', student.id)
        .order('check_in_date', { ascending: false });

      if (error) throw error;
      setStudentAttendance(data || []);
    } catch (err) {
      console.error('Error fetching attendance list:', err);
      alert('Error al cargar la asistencia: ' + err.message);
    } finally {
      setLoadingAttendance(false);
    }
  };

  // 5. Delete a student (profile, enrollments, attendance)
  const handleDeleteStudent = async (student) => {
    const confirm = window.confirm(`Estas seguro que deseas eliminar al alumno "${student.full_name}" (DNI: ${student.dni})? Esta accion no se puede deshacer.`);
    if (!confirm) return;

    try {
      setLoading(true);
      // Delete enrollments
      await supabase.from('enrollments').delete().eq('student_id', student.id);
      // Delete attendance
      await supabase.from('attendance').delete().eq('student_id', student.id);
      // Delete profile
      const { error } = await supabase.from('profiles').delete().eq('id', student.id);
      if (error) throw error;

      setMsg({ type: 'success', text: `Alumno "${student.full_name}" eliminado correctamente.` });
      setStudents(prev => prev.filter(s => s.id !== student.id));
    } catch (err) {
      console.error('Error deleting student:', err);
      setMsg({ type: 'error', text: 'Error al eliminar: ' + err.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Title */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>PANEL DE ADMINISTRACION</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Gestiona estudiantes, sube materiales de clase y controla el aula virtual.
          </p>
        </div>

        {/* Status Messages */}
        {msg.text && (
          <div className="animate-slide-up" style={{
            backgroundColor: msg.type === 'success' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: msg.type === 'success' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: msg.type === 'success' ? '#16a34a' : '#ef4444',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600
          }}>
            {msg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
          <button 
            className="btn"
            style={{
              backgroundColor: activeTab === 'students' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'students' ? 'var(--accent-red)' : 'var(--text-secondary)',
              border: activeTab === 'students' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('students')}
          >
            <Users size={18} />
            GESTION DE ALUMNOS
          </button>

          <button 
            className="btn"
            style={{
              backgroundColor: activeTab === 'classes' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'classes' ? 'var(--accent-red)' : 'var(--text-secondary)',
              border: activeTab === 'classes' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('classes')}
          >
            <Upload size={18} />
            SUBIR CLASES
          </button>
        </div>

        {/* Tab 1: Students Management */}
        {activeTab === 'students' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} id="admin-students-layout">
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 1024px) {
                #admin-students-layout {
                  grid-template-columns: 360px 1fr;
                }
              }
            `}} />
            
            {/* Left: Add Student Form */}
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 700 }}>Registrar Alumno</h3>
              
              <form onSubmit={handleCreateStudent}>
                <div className="form-group">
                  <label className="form-label" htmlFor="student-dni">DNI (Usuario)</label>
                  <input 
                    id="student-dni"
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. 73458921"
                    value={newStudent.dni}
                    onChange={(e) => setNewStudent({...newStudent, dni: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="student-name">Nombre Completo</label>
                  <input 
                    id="student-name"
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Carlos Mendoza"
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="student-pass">Contraseña Inicial</label>
                  <input 
                    id="student-pass"
                    type="text" 
                    className="form-input" 
                    placeholder="Min. 6 caracteres"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="student-cycle">Matricular en Ciclo</label>
                  <select 
                    id="student-cycle"
                    className="form-select"
                    value={newStudent.cycleId}
                    onChange={(e) => setNewStudent({...newStudent, cycleId: e.target.value})}
                  >
                    <option value="">-- Sin Matrícula Inicial --</option>
                    {cycles.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    width: '100%', 
                    marginTop: '16px',
                    padding: '12px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: 'var(--accent-red)',
                    borderColor: 'var(--accent-red)',
                    boxShadow: '0 4px 12px rgba(204, 13, 57, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }} 
                  disabled={loading}
                >
                  <Plus size={18} />
                  Crear Estudiante
                </button>
              </form>
            </div>

            {/* Right: Students List */}
            <div className="glass-panel animate-scale-in" style={{ padding: '24px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Alumnos Registrados</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{students.length} alumno{students.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Buscar por DNI o nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>DNI (USUARIO)</th>
                    <th>NOMBRE</th>
                    <th>CICLOS MATRICULADOS</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = students.filter(s => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return s.dni?.toLowerCase().includes(q) || s.full_name?.toLowerCase().includes(q);
                    });
                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 16px' }}>
                            {searchQuery ? 'No se encontraron resultados para la busqueda.' : 'No hay estudiantes registrados todavia.'}
                          </td>
                        </tr>
                      );
                    }
                    return filtered.map(student => (
                      <tr key={student.id}>
                        <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.88rem' }}>{student.dni}</td>
                        <td style={{ fontWeight: 600 }}>{student.full_name}</td>
                        <td>
                          {student.enrollments && student.enrollments.length > 0
                            ? student.enrollments.map(e => e.cycles?.name).join(', ')
                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ninguno</span>
                          }
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                              onClick={() => handleViewAttendance(student)}
                            >
                              <Calendar size={13} />
                              Asistencia
                            </button>
                            <button 
                              className="btn-delete-subtle"
                              onClick={() => handleDeleteStudent(student)}
                              disabled={loading}
                            >
                              <Trash2 size={13} />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Upload Classes & Weeks */}
        {activeTab === 'classes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} id="admin-classes-layout">
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 1024px) {
                #admin-classes-layout {
                  grid-template-columns: 360px 1fr;
                }
              }
            `}} />
            
            {/* Left Panel: Week Management */}
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 700 }}>1. Crear Semana</h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="week-cycle">Ciclo</label>
                <select 
                  id="week-cycle"
                  className="form-select"
                  value={selectedCycleId}
                  onChange={(e) => setSelectedCycleId(e.target.value)}
                >
                  <option value="">-- Seleccionar Ciclo --</option>
                  {cycles.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="week-subject">Asignatura</label>
                <select 
                  id="week-subject"
                  className="form-select"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  disabled={!selectedCycleId}
                >
                  <option value="">-- Seleccionar Asignatura --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleCreateWeek} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="week-num">Número de Semana</label>
                  <input 
                    id="week-num"
                    type="number" 
                    className="form-input" 
                    placeholder="Ej. 1" 
                    value={newWeekNumber}
                    onChange={(e) => setNewWeekNumber(e.target.value)}
                    disabled={!selectedSubjectId}
                  />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} disabled={!selectedSubjectId || loading}>
                  Crear Semana
                </button>
              </form>
            </div>

            {/* Right Panel: Class Session Upload */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 700 }}>2. Subir Sesión de Clase</h3>
              
              <form onSubmit={handleUploadClass}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="session-week">Semana Destino</label>
                    <select 
                      id="session-week"
                      className="form-select"
                      value={selectedWeekId}
                      onChange={(e) => setSelectedWeekId(e.target.value)}
                      disabled={!selectedSubjectId}
                      required
                    >
                      <option value="">-- Seleccionar Semana --</option>
                      {weeks.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="session-day">Día de la Semana</label>
                    <select 
                      id="session-day"
                      className="form-select"
                      value={sessionDay}
                      onChange={(e) => setSessionDay(e.target.value)}
                      required
                    >
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="session-title">Tema de la Clase / Título</label>
                  <input 
                    id="session-title"
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Límites de funciones indeterminadas" 
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="session-video">Enlace de Video (Zoom, Google Drive, Vimeo, YouTube)</label>
                  <input 
                    id="session-video"
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. https://drive.google.com/file/d/XYZ/view" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={!!videoFile}
                    style={{ marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                    <label 
                      htmlFor="session-video-file" 
                      className="btn btn-secondary hover-scale"
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        padding: '10px 16px',
                        fontSize: '0.82rem',
                        borderRadius: '8px',
                        border: '2px dashed var(--accent-red-border)',
                        backgroundColor: 'var(--accent-red-muted)',
                        color: 'var(--accent-red)',
                        width: '100%',
                        justifyContent: 'center',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      <Upload size={14} />
                      {videoFile ? 'VIDEO SELECCIONADO' : 'SELECCIONAR VIDEO LOCAL (.MP4)'}
                    </label>
                    {videoFile && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: 600, wordBreak: 'break-all' }}>
                        {videoFile.name}
                      </span>
                    )}
                    <input 
                      id="session-video-file"
                      type="file" 
                      accept="video/mp4"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} id="admin-files-grid">
                  <style dangerouslySetInnerHTML={{__html: `
                    @media (min-width: 768px) {
                      #admin-files-grid {
                        grid-template-columns: 1fr 1fr;
                      }
                    }
                  `}} />
                  {/* Problems Material */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Material de Problemas (PDF, Diapositivas, Zip, Imagen)</h4>
                    <div className="form-group">
                      <label className="form-label" htmlFor="session-problems-url">URL Externa</label>
                      <input 
                        id="session-problems-url"
                        type="text" 
                        className="form-input" 
                        placeholder="http://..." 
                        value={pdfProblemsUrl}
                        onChange={(e) => setPdfProblemsUrl(e.target.value)}
                        disabled={!!problemsFile}
                      />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0' }}>o selecciona un archivo local</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label 
                        htmlFor="session-problems-file" 
                        className="btn btn-secondary hover-scale"
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center', 
                          gap: '8px', 
                          cursor: 'pointer',
                          padding: '10px 16px',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '2px dashed var(--accent-red-border)',
                          backgroundColor: 'var(--accent-red-muted)',
                          color: 'var(--accent-red)',
                          width: '100%',
                          justifyContent: 'center',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <Upload size={14} />
                        {problemsFile ? 'MATERIAL SELECCIONADO' : 'SELECCIONAR ARCHIVO LOCAL'}
                      </label>
                      {problemsFile && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: 600, wordBreak: 'break-all' }}>
                          {problemsFile.name}
                        </span>
                      )}
                      <input 
                        id="session-problems-file"
                        type="file" 
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.zip"
                        onChange={(e) => setProblemsFile(e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Theory/Class notes Material */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Pizarra / Apuntes / Clases (PDF, Diapositivas, Zip, Imagen)</h4>
                    <div className="form-group">
                      <label className="form-label" htmlFor="session-theory-url">URL Externa</label>
                      <input 
                        id="session-theory-url"
                        type="text" 
                        className="form-input" 
                        placeholder="http://..." 
                        value={pdfTheoryUrl}
                        onChange={(e) => setPdfTheoryUrl(e.target.value)}
                        disabled={!!theoryFile}
                      />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0' }}>o selecciona un archivo local</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label 
                        htmlFor="session-theory-file" 
                        className="btn btn-secondary hover-scale"
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center', 
                          gap: '8px', 
                          cursor: 'pointer',
                          padding: '10px 16px',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '2px dashed var(--accent-red-border)',
                          backgroundColor: 'var(--accent-red-muted)',
                          color: 'var(--accent-red)',
                          width: '100%',
                          justifyContent: 'center',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <Upload size={14} />
                        {theoryFile ? 'APUNTES SELECCIONADOS' : 'SELECCIONAR ARCHIVO LOCAL'}
                      </label>
                      {theoryFile && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: 600, wordBreak: 'break-all' }}>
                          {theoryFile.name}
                        </span>
                      )}
                      <input 
                        id="session-theory-file"
                        type="file" 
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.zip"
                        onChange={(e) => setTheoryFile(e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    width: '100%', 
                    marginTop: '32px',
                    padding: '14px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backgroundColor: 'var(--accent-red)',
                    borderColor: 'var(--accent-red)',
                    boxShadow: '0 4px 15px rgba(204, 13, 57, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} 
                  disabled={!selectedWeekId || loading}
                >
                  {loading ? 'Guardando Clase...' : 'Guardar Clase y Materiales'}
                </button>
              </form>

              {selectedWeekId && (
                <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Clases Subidas en esta Semana</h4>
                  {currentSessions.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No hay sesiones registradas en esta semana.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {currentSessions.map(s => (
                        <div key={s.id} style={{
                          padding: '12px 16px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', display: 'block', textTransform: 'uppercase' }}>{s.day_of_week}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</span>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {s.video_url && <span>• Video vinculado</span>}
                              {s.pdf_problems_url && <span>• Práctica subida</span>}
                              {s.pdf_theory_url && <span>• Apuntes subidos</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSession(s.id)}
                            className="btn"
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.8rem', 
                              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}



      </div>

      {/* Attendance Detail Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '32px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative'
          }}>
            <button 
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedStudent(null)}
            >
              <X size={20} />
            </button>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase' }}>
                Historial de Asistencia
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
                {selectedStudent.full_name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                DNI: {selectedStudent.dni}
              </p>
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loadingAttendance ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>Cargando asistencias...</div>
              ) : studentAttendance.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  <AlertCircle size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>No registra asistencias aún.</p>
                </div>
              ) : (
                studentAttendance.map(record => (
                  <div key={record.id} style={{
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{record.check_in_date}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({record.check_in_time})</span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#4ade80'
                    }}>
                      {record.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total de días asistidos:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>{studentAttendance.length}</span>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
