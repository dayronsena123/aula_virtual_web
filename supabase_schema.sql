-- ====================================================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS - AULA VIRTUAL ULEMA
-- Ejecuta este script en el SQL Editor de tu panel de Supabase
-- ====================================================================

-- Limpieza preventiva para recrear el esquema de forma limpia si se vuelve a correr
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.admin_create_student(text, text, text, uuid);
drop table if exists public.attendance cascade;
drop table if exists public.sessions cascade;
drop table if exists public.weeks cascade;
drop table if exists public.subjects cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.cycles cascade;
drop table if exists public.profiles cascade;

-- Habilitar pgcrypto para encriptación de contraseñas si no está listo
create extension if not exists pgcrypto;

-- 1. TABLAS PRINCIPALES

-- Tabla de Perfiles (Extiende los datos de auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  dni text unique not null,
  full_name text not null,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de Ciclos Académicos
create table public.cycles (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- Ej. 'Repaso Intensivo UNI (Matemática)'
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de Matrículas (Estudiantes inscritos en Ciclos)
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  cycle_id uuid references public.cycles(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, cycle_id)
);

-- Tabla de Asignaturas (Cursos)
create table public.subjects (
  id uuid default gen_random_uuid() primary key,
  cycle_id uuid references public.cycles(id) on delete cascade not null,
  name text not null, -- Ej. 'Álgebra', 'Aritmética'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de Semanas de Clase
create table public.weeks (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  week_number integer not null, -- 1, 2, 3...
  name text not null, -- Ej. 'Semana 1'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(subject_id, week_number)
);

-- Tabla de Sesiones Diarias (Días de clase)
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  week_id uuid references public.weeks(id) on delete cascade not null,
  day_of_week text not null check (day_of_week in ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')),
  title text not null, -- Ej. 'Límites Algebraicos'
  video_url text, -- Ruta de Supabase Storage o URL externa
  pdf_problems_url text, -- Material de problemas (PDF)
  pdf_theory_url text, -- Clase dictada / pizarra (PDF)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de Asistencia (Asistencia diaria del Estudiante)
create table public.attendance (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  check_in_date date default current_date not null,
  check_in_time time without time zone default current_time not null,
  status text default 'Presente' check (status in ('Presente', 'Tardanza', 'Falta')),
  unique(student_id, check_in_date)
);


-- 2. REGISTRO AUTOMÁTICO DE PERFILES (TRIGGER)
-- Cuando un usuario se crea en auth.users, se inserta su perfil automáticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, dni, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'dni', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', 'Estudiante'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. FUNCIÓN DE ADMINISTRADOR PARA CREAR ALUMNOS
-- Permite al admin registrar nuevos usuarios sin cerrar su sesión en el navegador
-- Modificado para insertar en auth.identities para evitar el error 500 de base de datos
create or replace function public.admin_create_student(
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
  
  -- 1. Insertar en la tabla auth.users de Supabase
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

  -- 2. Insertar en auth.identities (Crítico para que Gotrue no lance un error 500 al iniciar sesión)
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    new_user_id,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', student_email, 'email_verified', true),
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );

  -- 3. Vincular matrícula si se seleccionó un ciclo
  if cycle_id is not null then
    insert into public.enrollments (student_id, cycle_id)
    values (new_user_id, cycle_id);
  end if;

  return new_user_id;
end;
$$ language plpgsql security definer;


-- 4. INSERTAR DATOS POR DEFECTO (CICLOS Y ASIGNATURAS)
-- Ciclos
insert into public.cycles (id, name, description) values
  ('c1000000-0000-0000-0000-000000000001', 'Repaso Intensivo UNI (Matemática)', 'Ciclo intensivo enfocado en resolver temas de examen UNI.'),
  ('c2000000-0000-0000-0000-000000000002', 'Cálculo Diferencial', 'Curso universitario enfocado en límites, continuidad y derivadas.'),
  ('c3000000-0000-0000-0000-000000000003', 'Cálculo Integral', 'Curso universitario de integraciones y sus aplicaciones.');

-- Asignaturas para Repaso UNI
insert into public.subjects (cycle_id, name) values
  ('c1000000-0000-0000-0000-000000000001', 'Álgebra'),
  ('c1000000-0000-0000-0000-000000000001', 'Aritmética'),
  ('c1000000-0000-0000-0000-000000000001', 'Geometría'),
  ('c1000000-0000-0000-0000-000000000001', 'Trigonometría');

-- Asignaturas para Cálculo Diferencial
insert into public.subjects (cycle_id, name) values
  ('c2000000-0000-0000-0000-000000000002', 'Límites y Derivadas');

-- Asignaturas para Cálculo Integral
insert into public.subjects (cycle_id, name) values
  ('c3000000-0000-0000-0000-000000000003', 'Integrales y Aplicaciones');


-- 5. PRECARGA DE CUENTAS DE PRUEBA (SEEDS DE ADMINISTRADOR CON SUS RESPECTIVAS IDENTIDADES)

-- Limpiar usuarios de semilla anteriores de auth.users si ya existen para evitar conflictos e identidades huérfanas
delete from auth.users where id in ('d0000000-0000-0000-0000-000000000000', 'e6163528-0000-0000-0000-000000002810') or email in ('ulema2026@gmail.com', 'dayronfrankvallesena661@gmail.com', '61635281@ulema.edu.pe');

-- A. ADMINISTRADOR PRINCIPAL: ulema2026@gmail.com / grupoulema
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
  'd0000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'ulema2026@gmail.com',
  crypt('grupoulema', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador Ulema", "dni": "ulema2026"}',
  now(),
  now()
);

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  'd0000000-0000-0000-0000-000000000000',
  'd0000000-0000-0000-0000-000000000000',
  '{"sub": "d0000000-0000-0000-0000-000000000000", "email": "ulema2026@gmail.com", "email_verified": true}',
  'email',
  'ulema2026@gmail.com',
  now(),
  now(),
  now()
);

insert into public.profiles (id, dni, full_name, role)
values ('d0000000-0000-0000-0000-000000000000', 'ulema2026', 'Administrador Ulema', 'admin')
on conflict (id) do update set role = 'admin';


-- 6. POLÍTICAS DE SEGURIDAD (RLS)
alter table public.profiles enable row level security;
alter table public.cycles enable row level security;
alter table public.enrollments enable row level security;
alter table public.subjects enable row level security;
alter table public.weeks enable row level security;
alter table public.sessions enable row level security;
alter table public.attendance enable row level security;

-- Función helper para verificar rol de administrador de forma segura
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Políticas de Profiles
create policy "Perfiles legibles por usuarios autenticados" on public.profiles
  for select to authenticated using (true);

create policy "Admin inserta perfiles" on public.profiles
  for insert to authenticated with check (id = auth.uid() or public.is_admin());

create policy "Admin actualiza perfiles" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin());

create policy "Admin borra perfiles" on public.profiles
  for delete to authenticated using (public.is_admin());

-- Políticas de Cycles
create policy "Ciclos legibles por cualquiera" on public.cycles
  for select to authenticated using (true);

create policy "Admin gestiona ciclos" on public.cycles
  for all to authenticated using (public.is_admin());

-- Políticas de Enrollments
create policy "Estudiantes ven sus propias matrículas" on public.enrollments
  for select to authenticated using (student_id = auth.uid());

create policy "Admin gestiona matrículas" on public.enrollments
  for all to authenticated using (public.is_admin());

-- Políticas de Subjects
create policy "Asignaturas legibles por estudiantes matriculados" on public.subjects
  for select to authenticated using (
    exists (
      select 1 from public.enrollments
      where student_id = auth.uid() and cycle_id = subjects.cycle_id
    ) or public.is_admin()
  );

create policy "Admin gestiona asignaturas" on public.subjects
  for all to authenticated using (public.is_admin());

-- Políticas de Weeks
create policy "Semanas legibles por alumnos autorizados" on public.weeks
  for select to authenticated using (
    exists (
      select 1 from public.subjects s
      join public.enrollments e on e.cycle_id = s.cycle_id
      where s.id = weeks.subject_id and e.student_id = auth.uid()
    ) or public.is_admin()
  );

create policy "Admin gestiona semanas" on public.weeks
  for all to authenticated using (public.is_admin());

-- Políticas de Sessions
create policy "Sesiones legibles por alumnos autorizados" on public.sessions
  for select to authenticated using (
    exists (
      select 1 from public.weeks w
      join public.subjects s on s.id = w.subject_id
      join public.enrollments e on e.cycle_id = s.cycle_id
      where w.id = sessions.week_id and e.student_id = auth.uid()
    ) or public.is_admin()
  );

create policy "Admin gestiona sesiones" on public.sessions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Políticas de Attendance
create policy "Estudiantes gestionan su propia asistencia" on public.attendance
  for select to authenticated using (student_id = auth.uid());

create policy "Estudiantes insertan su propia asistencia" on public.attendance
  for insert to authenticated with check (student_id = auth.uid());

create policy "Admin gestiona asistencias" on public.attendance
  for all to authenticated using (public.is_admin());

-- 7. CONFIGURACIÓN DE STORAGE (BUCKETS Y POLÍTICAS RLS)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('materials', 'materials', true, null, null),
  ('videos', 'videos', false, null, null)
on conflict (id) do update set public = excluded.public;

-- Limpiar políticas viejas de storage para evitar errores de duplicado
drop policy if exists "Cualquiera puede leer materiales" on storage.objects;
drop policy if exists "Admins pueden subir materiales" on storage.objects;
drop policy if exists "Admins pueden actualizar materiales" on storage.objects;
drop policy if exists "Admins pueden borrar materiales" on storage.objects;
drop policy if exists "Alumnos pueden leer videos" on storage.objects;
drop policy if exists "Admins pueden subir videos" on storage.objects;
drop policy if exists "Admins pueden actualizar videos" on storage.objects;
drop policy if exists "Admins pueden borrar videos" on storage.objects;

create policy "Cualquiera puede leer materiales" on storage.objects
  for select using (bucket_id = 'materials');

create policy "Admins pueden subir materiales" on storage.objects
  for insert with check (bucket_id = 'materials' and public.is_admin());

create policy "Admins pueden actualizar materiales" on storage.objects
  for update using (bucket_id = 'materials' and public.is_admin());

create policy "Admins pueden borrar materiales" on storage.objects
  for delete using (bucket_id = 'materials' and public.is_admin());

create policy "Alumnos pueden leer videos" on storage.objects
  for select to authenticated using (bucket_id = 'videos');

create policy "Admins pueden subir videos" on storage.objects
  for insert to authenticated with check (bucket_id = 'videos' and public.is_admin());

create policy "Admins pueden actualizar videos" on storage.objects
  for update to authenticated using (bucket_id = 'videos' and public.is_admin());

create policy "Admins pueden borrar videos" on storage.objects
  for delete to authenticated using (bucket_id = 'videos' and public.is_admin());
