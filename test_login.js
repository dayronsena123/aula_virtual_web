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
  const email = '75670458@ulema.edu.pe';
  const password = '75670458';

  console.log(`Intentando iniciar sesion con el alumno ${email}...`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Error de inicio de sesion:', JSON.stringify(error, null, 2));
    
    console.log('\n--- Diagnostico ---');
    console.log('El error "Invalid login credentials" significa que la contraseña o el correo no coinciden.');
    console.log('Vamos a verificar el estado del usuario en la base de datos...');
  } else {
    console.log('¡INICIO DE SESIÓN EXITOSO EN NODE! Los datos son correctos. Datos del usuario:', data.user.id);
  }
}

run();
