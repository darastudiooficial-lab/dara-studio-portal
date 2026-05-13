const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  console.log('Checking profiles and projects...');
  
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  if (pError) console.error('Profiles error:', pError.message);
  else console.log('Profiles found:', profiles.length);

  const { data: projects, error: prError } = await supabase.from('projects').select('*');
  if (prError) console.error('Projects error:', prError.message);
  else console.log('Projects found:', projects.length);

  if (profiles && profiles.length > 0) {
    console.log('First profile:', profiles[0].id, profiles[0].role);
  }
}

checkData();
