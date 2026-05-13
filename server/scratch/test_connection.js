const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testConnection(url) {
  console.log('\n--- Testing connection to:', url);
  const supabase = createClient(url, supabaseServiceKey);
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Connection failed:', error.message);
    } else {
      console.log('Connection successful! Profiles count accessible.');
      return true;
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
  return false;
}

async function runTests() {
  const urlFromEnv = process.env.SUPABASE_URL;
  const urlFromKey = 'https://hdujhkinaakqspqkhynt.supabase.co';

  await testConnection(urlFromEnv);
  await testConnection(urlFromKey);
}

runTests();

