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
  console.log('Creando función temporal en Postgres para inspeccionar las identidades...');
  
  // Registrar una función RPC para ver las columnas reales
  // Usamos el cliente anon de supabase para llamar la función una vez creada
  console.log('Por favor, ejecuta temporalmente este bloque SQL en tu editor SQL de Supabase para poder inspeccionar:');
  console.log('\n----------------------------------------');
  console.log(`
create or replace function public.inspect_admin_identity()
returns json as $$
declare
  val json;
begin
  select row_to_json(t) from (
    select * from auth.identities where user_id = 'c37234a3-9b5e-4fed-a645-40d09bbbf804'
  ) t into val;
  return val;
end;
$$ language plpgsql security definer;
`);
  console.log('----------------------------------------\n');

  // Esperar a que el usuario presione una tecla o llamar después de un rato
  console.log('Intentando llamar a la función en 10 segundos para ver si la ejecutaste...');
  await new Promise(resolve => setTimeout(resolve, 8000));

  try {
    const { data, error } = await supabase.rpc('inspect_admin_identity');
    if (error) {
      console.log('La función inspect_admin_identity no se ha creado o falló:', error.message);
    } else {
      console.log('¡Estructura de la identidad encontrada!:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error al llamar inspect_admin_identity:', err);
  }
}

run();
