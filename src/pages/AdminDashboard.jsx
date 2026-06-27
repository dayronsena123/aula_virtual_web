import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Layout from '../components/Layout';
import { Users, Upload, Plus, FileText, Check, AlertCircle, Database, HelpCircle, Calendar, X, Clock } from 'lucide-react';

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

  // 1. Create Student using RPC SQL function helper
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const { dni, fullName, password, cycleId } = newStudent;

    if (!dni || !fullName || !password) {
      showMessage('error', 'Por favor completa todos los campos del estudiante.');
      return;
    }

    try {
      setLoading(true);

      // Call the security definer Postgres function in Supabase
      const { data, error } = await supabase.rpc('admin_create_student', {
        student_dni: dni.trim(),
        student_password: password,
        student_full_name: fullName.trim(),
        cycle_id: cycleId || null
      });

      if (error) throw error;

      showMessage('success', `Estudiante ${fullName} registrado con éxito.`);
      setNewStudent({ dni: '', fullName: '', password: '', cycleId: '' });
      loadAdminData();
    } catch (err) {
      console.error('Error creating student:', err);
      showMessage('error', `Error al crear estudiante: ${err.message || 'Verifica que hayas corrido el script SQL inicial en Supabase'}`);
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

  // SQL Script text to display to user
  const sqlSetupScript = `-- 1. Habilita pgcrypto para encriptación de contraseñas si no está listo
create extension if not exists pgcrypto;

-- 2. Crea la función para registrar alumnos desde el panel de administrador
create or replace function admin_create_student(
  student_dni text,
  student_password text,
  student_full_name text,
  cycle_id uuid
) returns uuid as $$
declare
  new_user_id uuid;
  student_email text;
begin
  student_email := student_dni || '@ulema.edu.pe';
  
  -- Insert into auth.users (Supabase Auth table)
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    student_email,
    crypt(student_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', student_full_name, 'dni', student_dni),
    now(),
    now()
  ) returning id into new_user_id;

  -- Insert into public.profiles
  insert into public.profiles (id, dni, full_name, role)
  values (new_user_id, student_dni, student_full_name, 'student');

  -- Insert enrollment if cycle_id is provided
  if cycle_id is not null then
    insert into public.enrollments (student_id, cycle_id)
    values (new_user_id, cycle_id);
  end if;

  return new_user_id;
end;
$$ language plpgsql security definer;`;

  return (
    <Layout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Title */}
        <div>
          <h1 style={{ fontSize: '2rem' }}>Panel de Administración</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Gestiona los estudiantes, sube materiales de clase y configura el aula virtual.
          </p>
        </div>

        {/* Status Messages */}
        {msg.text && (
          <div style={{
            backgroundColor: msg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: msg.type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: msg.type === 'success' ? '#4ade80' : '#f87171',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {msg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button 
            className="btn"
            style={{
              backgroundColor: activeTab === 'students' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'students' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeTab === 'students' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.9rem'
            }}
            onClick={() => setActiveTab('students')}
          >
            <Users size={18} />
            Gestión de Alumnos
          </button>

          <button 
            className="btn"
            style={{
              backgroundColor: activeTab === 'classes' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'classes' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeTab === 'classes' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.9rem'
            }}
            onClick={() => setActiveTab('classes')}
          >
            <Upload size={18} />
            Subir Clases
          </button>

          <button 
            className="btn"
            style={{
              backgroundColor: activeTab === 'sql' ? 'var(--accent-red-muted)' : 'transparent',
              color: activeTab === 'sql' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeTab === 'sql' ? '1px solid var(--accent-red-border)' : '1px solid transparent',
              fontSize: '0.9rem'
            }}
            onClick={() => setActiveTab('sql')}
          >
            <Database size={18} />
            Configuración Base de Datos
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
            <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Alumnos Registrados</h3>
              
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>DNI (Usuario)</th>
                    <th>Nombre</th>
                    <th>Ciclos Matriculados</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No hay estudiantes registrados todavía.
                      </td>
                    </tr>
                  ) : (
                    students.map(student => (
                      <tr key={student.id}>
                        <td style={{ fontWeight: 600 }}>{student.dni}</td>
                        <td>{student.full_name}</td>
                        <td>
                          {student.enrollments && student.enrollments.length > 0
                            ? student.enrollments.map(e => e.cycles?.name).join(', ')
                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ninguno</span>
                          }
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => handleViewAttendance(student)}
                          >
                            <Calendar size={14} />
                            Ver Asistencia
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0' }}>o selecciona un archivo de video local (.mp4)</div>
                  <input 
                    aria-label="Subir archivo local de video"
                    type="file" 
                    accept="video/mp4"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', margin: '0 auto' }}
                  />
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
                    <input 
                      aria-label="Subir archivo local de problemas"
                      type="file" 
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => setProblemsFile(e.target.files[0])}
                      style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                    />
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
                    <input 
                      aria-label="Subir archivo local de apuntes de clase"
                      type="file" 
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => setTheoryFile(e.target.files[0])}
                      style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                    />
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

        {/* Tab 3: Database & SQL Setup Guide */}
        {activeTab === 'sql' && (
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ 
                padding: '10px', 
                backgroundColor: 'var(--accent-red-muted)', 
                color: 'var(--accent-red)', 
                borderRadius: '8px'
              }}>
                <Database size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Instalación del script de administración en Supabase</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Supabase requiere una función de base de datos segura para permitir al dueño crear cuentas de estudiantes con contraseña sin cerrar sesión en el navegador. Copia el siguiente script y ejecútalo en la pestaña <strong>SQL Editor</strong> de tu panel de Supabase.
                </p>
              </div>
            </div>

            <div style={{ position: 'relative', marginTop: '12px' }}>
              <pre style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                maxHeight: '260px'
              }}>
                {sqlSetupScript}
              </pre>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <HelpCircle size={18} color="var(--accent-red)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Nota:</strong> Asegúrate de tener también creadas las tablas base (\`profiles\`, \`cycles\`, \`enrollments\`, \`subjects\`, \`weeks\` y \`sessions\`) tal como se especifica en el plan de implementación aprobado.
              </span>
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
