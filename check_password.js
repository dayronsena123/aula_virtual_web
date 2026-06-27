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
  console.log('Creando función temporal en Postgres para verificar el hash de contraseña de Kleyber...');

  // 1. Crear la función SQL que usa pgcrypto.crypt para validar la contraseña
  console.log('Por favor, ejecuta temporalmente este bloque SQL en Supabase para validar la contraseña de Kleyber:');
  console.log('\n---------------- SQL A EJECUTAR ----------------');
  console.log(`
create or replace function public.verify_kleyber_password(plain_pwd text)
returns boolean as $$
declare
  stored_hash text;
begin
  select encrypted_password from auth.users where email = '75670458@ulema.edu.pe' into stored_hash;
  return stored_hash = crypt(plain_pwd, stored_hash);
end;
$$ language plpgsql security definer;
  `);
  console.log('------------------------------------------------\n');

  console.log('Esperando 6 segundos y verificando...');
  await new Promise(resolve => setTimeout(resolve, 6000));

  const { data: matches, error } = await supabase.rpc('verify_kleyber_password', { plain_pwd: '75670458' });
  if (error) {
    console.log('Error o función no encontrada:', error.message);
  } else {
    console.log(`¿La contraseña '75670458' coincide con el hash encriptado de Kleyber?:`, matches);
  }
}

run();
