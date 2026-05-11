const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Client (Service Role for Admin operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Helper: Log Email to Database
async function logEmail(type, recipient, status, metadata = {}) {
  await supabase.from('emails_log').insert([{
    type,
    recipient,
    status,
    metadata
  }]);
}

// ══ ENDPOINTS ══

// POST /api/leads - New submission from Step 8 (Save for Later)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, project, estimate, lang } = req.body;
    
    // 1. Insert into leads
    const { data: lead, error } = await supabase.from('leads').insert([{
      name, email, phone, project_title: project, estimate_range: estimate, metadata: req.body
    }]).select().single();

    if (error) throw error;

    // 2. Log Email Attempt
    await logEmail('lead_confirmation', email, 'sent');

    res.json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error('Lead Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/accept - Formal acceptance from Step 9 (Confirm & Start)
app.post('/api/accept', async (req, res) => {
  try {
    const { name, email, project, estimate, pkg, delivery } = req.body;
    let clientId = null;

    // 1. Check if user exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingProfile) {
      clientId = existingProfile.id;
    } else {
      // 2. Invite User via Supabase Auth Admin
      const { data: invite, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { full_name: name },
        redirectTo: `${process.env.FRONTEND_URL}/portal`
      });

      if (inviteError) throw inviteError;
      clientId = invite.user.id;

      // 3. Create Profile (Role 'client' by default)
      await supabase.from('profiles').insert([{
        id: clientId,
        email: email,
        full_name: name,
        role: 'client'
      }]);
    }

    // 4. Create Project linked to client
    const { data: proj, error: projError } = await supabase.from('projects').insert([{
      client_id: clientId,
      title: project,
      status: 'waiting',
      estimate_range: estimate,
      package_type: pkg,
      delivery_speed: delivery,
      metadata: req.body
    }]).select().single();

    if (projError) throw projError;

    // 5. Send Welcome/Acceptance Email
    await logEmail('project_acceptance', email, 'sent');

    res.json({ ok: true, projectId: proj.id });
  } catch (err) {
    console.error('Accept Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`DARA Server running on port ${PORT}`);
});
