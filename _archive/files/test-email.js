/**
 * DARA Studio — Email Test Script
 *
 * Run with the server already started (node server.js in another terminal):
 *   node test-email.js
 *
 * Or test without the server (direct Nodemailer, reads .env directly):
 *   node test-email.js --direct
 */

"use strict";
require("dotenv").config();

const SERVER_URL = `http://localhost:${process.env.PORT || 3001}`;
const DIRECT     = process.argv.includes("--direct");

/* ── Colour helpers for terminal output ── */
const G = (s) => `\x1b[32m${s}\x1b[0m`;  // green
const R = (s) => `\x1b[31m${s}\x1b[0m`;  // red
const Y = (s) => `\x1b[33m${s}\x1b[0m`;  // yellow
const B = (s) => `\x1b[36m${s}\x1b[0m`;  // cyan

/* ── Test payloads ── */
const SCENARIO_A = {
  name:     "Teste Lead DARA",
  email:    process.env.GMAIL_USER,   // sends to yourself for verification
  phone:    "+1 (508) 330-7085",
  project:  "New Construction — Single Family",
  estimate: "$492.90 – $522.47",
  pkg:      "As-Built Drawings",
  delivery: "Standard",
};

const SCENARIO_B = {
  name:     "Teste Cliente DARA",
  email:    process.env.GMAIL_USER,
  phone:    "+1 (508) 330-7085",
  project:  "As-Built Drawings — Single Family",
  estimate: "$1,200.00 – $1,272.00",
  pkg:      "As-Built Drawings",
  delivery: "Rush",
};

/* ─────────────── MODE A: HTTP fetch → running server ─────────────── */
async function testViaServer() {
  console.log(B("\n══════════════════════════════════════════════"));
  console.log(B("  DARA Studio — Email Test via HTTP Server"));
  console.log(B(`  Target: ${SERVER_URL}`));
  console.log(B("══════════════════════════════════════════════\n"));

  async function post(route, payload, label) {
    console.log(Y(`▶ ${label}`));
    console.log("  Payload:", JSON.stringify(payload, null, 2));
    try {
      const res  = await fetch(`${SERVER_URL}${route}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        console.log(G(`  ✓ Server responded OK\n`));
      } else {
        console.log(R(`  ✗ Server error: ${json.error}\n`));
      }
      return json;
    } catch (err) {
      console.log(R(`  ✗ Connection failed: ${err.message}`));
      console.log(R("    → Is the server running? (node server.js)\n"));
    }
  }

  await post("/api/leads",  SCENARIO_A, "Scenario A — Save for Later (/api/leads)");
  await post("/api/accept", SCENARIO_B, "Scenario B — Accept & Continue (/api/accept)");

  console.log(B("══ Test complete. Check your inbox. ══\n"));
}

/* ─────────────── MODE B: Direct Nodemailer (no server needed) ─────────────── */
async function testDirect() {
  const nodemailer = require("nodemailer");

  console.log(B("\n══════════════════════════════════════════════"));
  console.log(B("  DARA Studio — Direct SMTP Test (Nodemailer)"));
  console.log(B(`  Gmail user: ${process.env.GMAIL_USER || "(not set)"}`));
  console.log(B("══════════════════════════════════════════════\n"));

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(R("✗ GMAIL_USER or GMAIL_APP_PASSWORD missing in .env"));
    process.exit(1);
  }

  const transport = nodemailer.createTransport({
    host:   "smtp.gmail.com",
    port:   465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  /* Verify SMTP */
  console.log(Y("▶ Verifying SMTP connection..."));
  try {
    await transport.verify();
    console.log(G("  ✓ SMTP connection OK\n"));
  } catch (err) {
    console.log(R(`  ✗ SMTP verify failed: ${err.message}`));
    console.log(R("  → Check GMAIL_APP_PASSWORD (16-char App Password, no spaces)"));
    console.log(R("  → Ensure 2-Step Verification is ON for your Gmail account\n"));
    process.exit(1);
  }

  function html(headline, rows, estimate) {
    const rowsHtml = rows.map(([k,v]) =>
      `<tr><td style="padding:6px 0;color:rgba(255,255,255,.45);font-size:12px">${k}</td>
       <td style="padding:6px 0;color:#fff;font-weight:600;font-size:13px;text-align:right">${v}</td></tr>`
    ).join("");
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:32px auto;background:#0d0d0d;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0d0b1a,#13111f);padding:32px 36px;text-align:center;border-bottom:1px solid #1e1e2e">
    <div style="width:48px;height:48px;border-radius:10px;background:#D4AF37;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
      <span style="font-family:Georgia,serif;font-size:24px;font-style:italic;color:#000">D</span>
    </div>
    <p style="font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,55,.6);margin:0 0 8px">DARA Studio</p>
    <h1 style="font-family:Georgia,serif;font-size:20px;font-style:italic;color:#fff;margin:0">${headline}</h1>
  </div>
  <div style="padding:28px 36px">
    <div style="background:rgba(212,175,55,.06);border:1.5px solid rgba(212,175,55,.25);border-radius:8px;padding:18px;text-align:center;margin-bottom:20px">
      <p style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(212,175,55,.55);margin:0 0 6px">Estimated Design Fee</p>
      <p style="font-family:Georgia,serif;font-size:28px;font-style:italic;color:#fff;margin:0">${estimate}</p>
      <span style="display:inline-block;margin-top:8px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:rgba(212,175,55,.12);color:#D4AF37;border:1px solid rgba(212,175,55,.3)">🕒 Valid for 30 days</span>
    </div>
    <table style="width:100%;border-collapse:collapse">${rowsHtml}</table>
    <div style="text-align:center;margin-top:24px">
      <a href="https://darastudio.com" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#D4AF37,#b8963e);border-radius:8px;color:#000;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;text-decoration:none">Return to My Estimate</a>
    </div>
  </div>
  <div style="padding:18px 36px;border-top:1px solid #1e1e2e;font-size:11px;color:rgba(255,255,255,.28);text-align:center">
    DARA Studio · Design &amp; Architectural Services<br>
    This estimate is not a contract.
  </div>
</div></body></html>`;
  }

  const tests = [
    {
      label: "Scenario A — Save for Later",
      subject: "🧪 [TEST] DARA Studio — Save for Later Email",
      html: html(
        "Your estimate is safe, Teste Lead! ✨",
        [
          ["Name",     SCENARIO_A.name],
          ["Project",  SCENARIO_A.project],
          ["Package",  SCENARIO_A.pkg],
          ["Delivery", SCENARIO_A.delivery],
          ["Submitted",new Date().toLocaleString("en-US")],
        ],
        SCENARIO_A.estimate
      ),
    },
    {
      label: "Scenario B — Accept & Continue",
      subject: "🧪 [TEST] DARA Studio — Accept & Continue Email",
      html: html(
        "You're all set, Teste Cliente! 🥳",
        [
          ["Name",     SCENARIO_B.name],
          ["Project",  SCENARIO_B.project],
          ["Package",  SCENARIO_B.pkg],
          ["Delivery", SCENARIO_B.delivery],
          ["Status",   "✅ Pending Payment"],
          ["Accepted", new Date().toLocaleString("en-US")],
        ],
        SCENARIO_B.estimate
      ),
    },
  ];

  for (const t of tests) {
    console.log(Y(`▶ Sending: ${t.label}`));
    try {
      const info = await transport.sendMail({
        from:    `"DARA Studio Test" <${process.env.GMAIL_USER}>`,
        to:      process.env.GMAIL_USER,
        subject: t.subject,
        html:    t.html,
      });
      console.log(G(`  ✓ Sent! Message ID: ${info.messageId}\n`));
    } catch (err) {
      console.log(R(`  ✗ Failed: ${err.message}\n`));
    }
  }

  console.log(B("══ Tests complete. Check your Gmail inbox. ══\n"));
}

/* ── Entry point ── */
if (DIRECT) {
  testDirect().catch((e) => { console.error(R("Fatal: " + e.message)); process.exit(1); });
} else {
  testViaServer().catch((e) => { console.error(R("Fatal: " + e.message)); process.exit(1); });
}
