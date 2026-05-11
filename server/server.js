const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const { 
  daraConfirmationEmail, 
  daraInternalNotificationEmail, 
  daraSaveForLaterEmail, 
  daraInternalLeadAlertEmail 
} = require('./templates/confirmation');
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

const STUDIO_EMAIL = process.env.STUDIO_EMAIL || 'darastudiooficial@gmail.com';


// Helper: Log Email to Database
async function logEmail(type, recipient, status, metadata = {}) {
  try {
    await supabase.from('emails_log').insert([{
      type,
      recipient,
      status,
      metadata
    }]);
  } catch (err) {
    console.error('Error logging email:', err);
  }
}

// Helper: Send Email with Logging
async function sendMailHelper(to, subject, html, type, metadata = {}) {
  try {
    const info = await transporter.sendMail({
      from: `"DARA Studio" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    await logEmail(type, to, 'sent', { ...metadata, messageId: info.messageId });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Failed to send email (${type}):`, err);
    await logEmail(type, to, 'failed', { ...metadata, error: err.message });
    return { ok: false, error: err.message };
  }
}


// ══ ENDPOINTS ══

// POST /api/leads - New submission from Step 8 (Save for Later)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, project, estimate, lang, region, address } = req.body;
    
    // 1. Insert into leads
    const { data: lead, error } = await supabase.from('leads').insert([{
      name, email, phone, project_title: project, estimate_range: estimate, metadata: req.body
    }]).select().single();

    if (error) throw error;

    // 2. Prepare Template Data
    const templateData = {
      client: { name, email, phone, role: 'Lead' },
      location: { address: address || 'TBD', region: region || 'US' },
      project: { propertyType: req.body.propertyType || 'Residential', sqft: req.body.totalSqft || 'TBD' },
      estimate: estimate,
      resumeUrl: `${process.env.FRONTEND_URL}/estimate?resume=${lead.id}`,
      timestamp: new Date().toLocaleString(),
      lang: lang || 'EN'
    };

    // 3. Send Emails
    const clientHtml = daraSaveForLaterEmail(templateData);
    const internalHtml = daraInternalLeadAlertEmail(templateData);

    await sendMailHelper(email, lang === 'PT' ? 'Seu projeto DARA está salvo' : 'Your DARA project is safe with us', clientHtml, 'lead_confirmation_client', { leadId: lead.id });
    await sendMailHelper(STUDIO_EMAIL, `🔔 Novo Lead: ${name}`, internalHtml, 'lead_alert_internal', { leadId: lead.id });

    res.json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error('Lead Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


// POST /api/accept - Formal acceptance from Step 9 (Confirm & Start)
app.post('/api/accept', async (req, res) => {
  try {
    const { name, email, phone, project, estimate, pkg, delivery, lang, address, region } = req.body;
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

      if (inviteError) {
        // Fallback: if user exists but PGRST116 failed (unlikely with single/eq, but safety first)
        console.warn('Invite error, might exist:', inviteError.message);
      } else {
        clientId = invite.user.id;
        // 3. Create Profile (Role 'client' by default)
        await supabase.from('profiles').insert([{
          id: clientId,
          email: email,
          full_name: name,
          role: 'client'
        }]);
      }
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

    // 5. Prepare Template Data
    const templateData = {
      client: { name, email, phone, role: 'Client' },
      location: { address: address || 'TBD', region: region || 'US' },
      project: { 
        propertyType: req.body.propertyType || 'Residential', 
        sqft: req.body.totalSqft || 'TBD',
        serviceType: project,
        floors: req.body.floors || 1
      },
      summary: {
        floorPlans: pkg,
        minFee: 'Included',
        total: estimate
      },
      notes: req.body.notes || '',
      projectId: proj.id,
      timestamp: new Date().toLocaleString(),
      lang: lang || 'EN'
    };

    // 6. Send Emails
    const clientHtml = daraConfirmationEmail(templateData);
    const internalHtml = daraInternalNotificationEmail(templateData);

    await sendMailHelper(email, lang === 'PT' ? 'Bem-vindo ao DARA Studio — Projeto Confirmado' : 'Welcome to DARA Studio — Project Confirmed', clientHtml, 'project_confirmation_client', { projectId: proj.id });
    await sendMailHelper(STUDIO_EMAIL, `🚀 Novo Projeto: ${name} (#${proj.id})`, internalHtml, 'project_notification_internal', { projectId: proj.id });

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
