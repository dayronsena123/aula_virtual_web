import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer .env
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function run() {
  const email = 'ulema2026@gmail.com';
  const password = 'grupoulema';

  console.log('Paso 1: Intentando iniciar sesion para ver si el usuario ya existe...');
  
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginData?.user) {
    console.log('El usuario ya existe y se puede loguear! ID:', loginData.user.id);
    console.log('Ahora solo falta asignarle rol admin.');
    console.log('Ejecuta este SQL en Supabase:');
    console.log(`UPDATE public.profiles SET role = 'admin' WHERE id = '${loginData.user.id}';`);
    return;
  }

  console.log('Login falló:', loginError?.message);
  console.log('');
  console.log('Paso 2: Intentando registrar usuario nuevo via signUp...');
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Administrador Ulema',
        dni: 'ulema2026',
        role: 'admin'
      }
    }
  });

  if (signUpError) {
    console.error('Error en signUp:', JSON.stringify(signUpError, null, 2));
    console.log('');
    console.log('El usuario probablemente ya existe en auth.users pero sin identidades.');
    console.log('Ejecuta este SQL en tu Supabase SQL Editor para limpiar y poder recrearlo:');
    console.log('');
    console.log("DELETE FROM auth.users WHERE email = 'ulema2026@gmail.com';");
    console.log('');
    console.log('Luego vuelve a ejecutar este script: node create_admin_api.js');
    return;
  }

  if (signUpData?.user) {
    console.log('Usuario creado exitosamente con ID:', signUpData.user.id);
    console.log('');
    console.log('Ahora ejecuta este SQL en Supabase para confirmar email y asignar admin:');
    console.log('');
    console.log(`UPDATE auth.users SET email_confirmed_at = now() WHERE email = '${email}';`);
    console.log(`UPDATE public.profiles SET role = 'admin' WHERE id = '${signUpData.user.id}';`);
    // Si no existe el perfil, insertarlo
    console.log(`INSERT INTO public.profiles (id, dni, full_name, role) VALUES ('${signUpData.user.id}', 'ulema2026', 'Administrador Ulema', 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin';`);
  } else {
    console.log('Respuesta inesperada:', JSON.stringify(signUpData, null, 2));
  }
}

run();
