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
  console.log('Creando función temporal para inspeccionar al usuario Kleyber...');

  // 1. Crear la función SQL
  console.log('Por favor, ejecuta temporalmente este bloque SQL en Supabase:');
  console.log('\n---------------- SQL A EJECUTAR ----------------');
  console.log(`
create or replace function public.inspect_kleyber_user()
returns json as $$
declare
  val json;
begin
  select row_to_json(t) from (
    select id, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at from auth.users where email = '75670458@ulema.edu.pe'
  ) t into val;
  return val;
end;
$$ language plpgsql security definer;
  `);
  console.log('------------------------------------------------\n');

  console.log('Esperando 6 segundos y consultando...');
  await new Promise(resolve => setTimeout(resolve, 6000));

  const { data, error } = await supabase.rpc('inspect_kleyber_user');
  if (error) {
    console.log('Error o función no encontrada:', error.message);
  } else {
    console.log('Datos reales del usuario Kleyber en auth.users:');
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
