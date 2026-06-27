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
  // Crear funcion inspect temporal
  console.log('Consultando identidades...');
  
  // Vamos a intentar obtener las identidades creando un rpc temporal
  try {
    const { data, error } = await supabase.rpc('inspect_admin_identity');
    console.log('Resultado inspect_admin_identity:', data);
  } catch (e) {}

  // Vamos a crear una funcion generica para listar todas las identidades y ver que esta mal
  console.log('Creando funcion para listar identidades...');
  
  // Le pedimos al usuario que corra esto en su editor de Supabase:
  console.log('\n---------------- SQL A EJECUTAR EN SUPABASE ----------------');
  console.log(`
create or replace function public.list_all_identities()
returns json as $$
declare
  val json;
begin
  select json_agg(t) from (
    select id, user_id, provider, provider_id, identity_data from auth.identities
  ) t into val;
  return val;
end;
$$ language plpgsql security definer;
  `);
  console.log('------------------------------------------------------------\n');

  console.log('Esperando 6 segundos y consultando...');
  await new Promise(resolve => setTimeout(resolve, 6000));

  const { data: list, error: listError } = await supabase.rpc('list_all_identities');
  if (listError) {
    console.log('Error al listar identidades:', listError.message);
  } else {
    console.log('Identidades en base de datos:');
    console.log(JSON.stringify(list, null, 2));
  }
}

run();
