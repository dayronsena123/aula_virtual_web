import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:yTKR3nCNFFYtxJ8n@db.yzwbftviyvltxprzcfdk.supabase.co:5432/postgres'
});

async function main() {
  await client.connect();
  console.log('Connected to Supabase Postgres database.');

  try {
    console.log('\n--- Profiles ---');
    const resProfiles = await client.query('SELECT id, dni, full_name, role FROM public.profiles');
    console.log(resProfiles.rows);

    console.log('\n--- Auth Users ---');
    const resUsers = await client.query('SELECT id, email, encrypted_password, email_confirmed_at, confirmed_at, is_sso_user, raw_app_meta_data, raw_user_meta_data FROM auth.users');
    console.log(resUsers.rows);

    console.log('\n--- Auth Identities ---');
    const resIdentities = await client.query('SELECT id, user_id, identity_data, provider, provider_id FROM auth.identities');
    console.log(resIdentities.rows);
  } catch (err) {
    console.error('Error during query:', err);
  } finally {
    await client.end();
  }
}

main();
