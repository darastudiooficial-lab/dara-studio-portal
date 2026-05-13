const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const fs = require('fs');
const clientEnv = fs.readFileSync(path.join(__dirname, '../../client/.env'), 'utf8');
const anonKeyMatch = clientEnv.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const anonKey = anonKeyMatch ? anonKeyMatch[1].trim() : '';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRLS() {
  console.log('--- Starting RLS Test ---');

  try {
    // 1. Create Test Users
    console.log('Creating test users...');
    const emailA = `user_a_${Date.now()}@test.com`;
    const emailB = `user_b_${Date.now()}@test.com`;
    const password = 'TestPassword123!';

    const { data: userA, error: errA } = await adminSupabase.auth.admin.createUser({
      email: emailA,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: 'User A' }
    });
    if (errA) throw new Error('Failed to create User A: ' + errA.message);

    const { data: userB, error: errB } = await adminSupabase.auth.admin.createUser({
      email: emailB,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: 'User B' }
    });
    if (errB) throw new Error('Failed to create User B: ' + errB.message);

    console.log(`Users created: A(${userA.user.id}), B(${userB.user.id})`);

    // Ensure profiles are created (manual insert if trigger not active)
    await adminSupabase.from('profiles').upsert([
      { id: userA.user.id, email: emailA, full_name: 'User A', role: 'client' },
      { id: userB.user.id, email: emailB, full_name: 'User B', role: 'client' }
    ]);

    // 2. Create Projects
    console.log('Creating projects...');
    const { error: pErrA } = await adminSupabase.from('projects').insert({
      client_id: userA.user.id,
      title: 'Project for User A',
      status: 'on_track'
    });
    if (pErrA) throw new Error('Failed to create project A: ' + pErrA.message);

    const { error: pErrB } = await adminSupabase.from('projects').insert({
      client_id: userB.user.id,
      title: 'Project for User B',
      status: 'on_track'
    });
    if (pErrB) throw new Error('Failed to create project B: ' + pErrB.message);

    // 3. Login as User A and test RLS
    console.log('Logging in as User A...');
    const { data: sessionA, error: sErrA } = await adminSupabase.auth.signInWithPassword({
      email: emailA,
      password: password
    });
    if (sErrA) throw new Error('Failed to login as User A: ' + sErrA.message);

    const userASupabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${sessionA.session.access_token}`
        }
      }
    });

    console.log('Fetching projects as User A...');
    const { data: projectsA, error: fetchErrA } = await userASupabase.from('projects').select('*');
    if (fetchErrA) throw new Error('Failed to fetch projects as A: ' + fetchErrA.message);

    console.log(`User A found ${projectsA.length} projects.`);
    projectsA.forEach(p => console.log(`- ${p.title} (Owner: ${p.client_id})`));

    // VALIDATION
    if (projectsA.length === 1 && projectsA[0].client_id === userA.user.id) {
      console.log('✅ SUCCESS: User A can only see their own project.');
    } else {
      console.log('❌ FAILURE: RLS did not filter projects correctly.');
      console.log('Visible projects:', projectsA);
    }

    // 4. Cleanup (Optional but good)
    console.log('Cleaning up...');
    await adminSupabase.auth.admin.deleteUser(userA.user.id);
    await adminSupabase.auth.admin.deleteUser(userB.user.id);
    // Projects and profiles will be deleted via CASCADE or manually if needed
    console.log('Test completed.');

  } catch (err) {
    console.error('Test failed with error:', err.message);
  }
}

testRLS();
