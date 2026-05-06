/**
 * DARA Studio — API Server
 * Handles email API routes (leads, accept).
 * Frontend is served by Vite dev server on port 5173.
 *
 * Setup:
 *   1. cp .env.example .env  →  fill GMAIL_USER + GMAIL_APP_PASSWORD
 *   2. npm install && node server.js
 *   3. Frontend proxies /api → http://localhost:5000
 */
"use strict";
require("dotenv").config();

const express    = require("express");
const nodemailer = require("nodemailer");
const cors       = require("cors");
const path       = require("path");

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.set("trust proxy", 1); // for HTTPS behind proxy

const ALLOWED_ORIGINS = [
  "http://localhost:5173",  // Vite dev server
  "http://localhost:4173",  // Vite preview
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Permissive in dev, strict in prod with FRONTEND_URL
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      if (process.env.NODE_ENV === "production") {
        cb(new Error("Not allowed by CORS"));
      } else {
        cb(null, true);
      }
    }
  },
  methods: ["GET","POST","OPTIONS"],
}));
app.use(express.json({ limit: "500kb" }));

/* ── Credentials (never hardcode — always from .env) ── */
const GMAIL_USER = (process.env.GMAIL_USER || "").trim();
const GMAIL_PASS = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

if (!GMAIL_USER || !GMAIL_PASS) {
  console.error("\n❌  Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env");
  console.error("    Copy .env.example → .env and fill in your credentials.\n");
  process.exit(1);
}

/* ── Gmail SMTP ── */
const transporter = nodemailer.createTransport({
  host:   "smtp.gmail.com",
  port:   465,
  secure: true,
  auth:   { user: GMAIL_USER, pass: GMAIL_PASS },
  tls:    { rejectUnauthorized: false },
});

transporter.verify((err) => {
  if (err) {
    console.error("\n❌  SMTP FAILED:", err.message);
    if (err.message.includes("535")) {
      console.error("    → Wrong App Password. Get one at: myaccount.google.com/apppasswords\n");
    }
  } else {
    console.log("\n✅  DARA Email Server is ready");
    console.log(`    Gmail : ${GMAIL_USER}`);
    console.log(`    URL   : http://localhost:${PORT}\n`);
  }
});

/* ── Email HTML builder (Dark & Gold — responsive) ── */
function daraEmail({ headline, bodyHtml, ctaUrl, ctaLabel }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DARA Studio</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#000;font-family:Arial,Helvetica,sans-serif;color:#fff}
  .wrap{max-width:580px;margin:32px auto;background:#0d0d0d;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden}
  .hdr{background:linear-gradient(135deg,#0d0b1a,#13111f);padding:36px 40px;text-align:center;border-bottom:1px solid #1e1e2e}
  .logo{width:52px;height:52px;border-radius:12px;background:#D4AF37;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px}
  .brand{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(212,175,55,.6);margin:0 0 8px}
  .headline{font-family:Georgia,serif;font-size:22px;font-style:italic;color:#fff;line-height:1.35;margin:0}
  .body{padding:32px 40px;font-size:14px;color:rgba(255,255,255,.78);line-height:1.8}
  .est-box{background:rgba(212,175,55,.06);border:1.5px solid rgba(212,175,55,.25);border-radius:8px;padding:20px 24px;text-align:center;margin:20px 0}
  .est-label{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:8px}
  .est-value{font-family:Georgia,serif;font-size:30px;font-style:italic;color:#fff}
  .badge{display:inline-block;margin-top:10px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 12px;border-radius:20px;background:rgba(212,175,55,.12);color:#D4AF37;border:1px solid rgba(212,175,55,.3)}
  .cta-wrap{text-align:center;margin:28px 0 0}
  .cta{display:inline-block;padding:13px 36px;background:linear-gradient(135deg,#D4AF37,#b8963e);border-radius:8px;color:#000;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px}
  .row span:first-child{color:rgba(255,255,255,.4)}
  .ftr{padding:20px 40px;border-top:1px solid #1e1e2e;font-size:11px;color:rgba(255,255,255,.28);text-align:center;line-height:1.7}
  @media(max-width:600px){.wrap{margin:12px;border-radius:8px}.hdr,.body,.ftr{padding:24px 20px}.headline{font-size:18px}.est-value{font-size:22px}}
</style></head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="logo"><span style="font-family:Georgia,serif;font-size:26px;font-style:italic;color:#000">D</span></div>
    <p class="brand">DARA Studio</p>
    <h1 class="headline">${headline}</h1>
  </div>
  <div class="body">
    ${bodyHtml}
    ${ctaUrl ? `<div class="cta-wrap"><a href="${ctaUrl}" class="cta">${ctaLabel||"Open Portal"}</a></div>` : ""}
  </div>
  <div class="ftr">DARA Studio &middot; Design &amp; Architectural Services<br>
    <span style="color:rgba(212,175,55,.4)">This estimate is not a contract. Final pricing confirmed upon project review.</span>
  </div>
</div></body></html>`;
}

async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `"DARA Studio" <${GMAIL_USER}>`,
    to, subject, html,
  });
  console.log(`[✉]  Sent → ${to} (${info.messageId})`);
  return info;
}

function req_fields(body, fields) {
  const miss = fields.filter(f => !body[f]);
  if (miss.length) throw new Error("Missing: " + miss.join(", "));
}

/* ─────────────────────────────────────────────
   POST /api/leads  —  Scenario A: Save for Later
───────────────────────────────────────────── */
app.post("/api/leads", async (req, res) => {
  try {
    req_fields(req.body, ["name","email","project","estimate"]);
    const {
      name, email, phone = "—",
      project, estimate,
      pkg = "—", delivery = "Standard",
      lang = "en", region = "US"
    } = req.body;

    const first = name.split(" ")[0];
    const isPT  = lang === "pt";
    const isBR  = region === "BR";
    const unit  = isBR ? "m²"  : "sqft";
    const cur   = isBR ? "R$"  : "$";
    const url   = process.env.FRONTEND_URL && process.env.FRONTEND_URL !== "*"
                    ? process.env.FRONTEND_URL : `http://localhost:${PORT}`;

    /* — Client email — */
    const clientHtml = daraEmail({
      headline: isPT ? `Sua estimativa está salva, ${first}! ✨`
                     : `Your estimate is safe, ${first}. ✨`,
      bodyHtml: `
        <p>${isPT?"Olá":"Hi"} ${first}, ${isPT?"salvamos seu progresso para":"we saved your progress for"}
          <strong style="color:#fff">${project}</strong>.</p>
        <p style="font-size:11px;color:rgba(255,255,255,.35);margin-top:4px">
          ${isBR?"Brasil":"United States"} &middot; ${unit} &middot; ${cur}</p>
        <div class="est-box">
          <p class="est-label">${isPT?"Taxa de Design Estimada":"Estimated Design Fee"}</p>
          <p class="est-value">${estimate}</p>
          <span class="badge">${isPT?"🕒 Válida por 30 dias":"🕒 Valid for 30 days"}</span>
        </div>
        <p>${isPT?"Entre em contato quando estiver pronto para iniciar seu projeto."
                 :"Reach out whenever you're ready to bring your project to life."}</p>`,
      ctaUrl:   url,
      ctaLabel: isPT ? "Retornar à Estimativa" : "Return to My Estimate",
    });

    /* — Admin email — */
    const adminHtml = daraEmail({
      headline: `🔔 New Lead (Saved/Draft) — ${name}`,
      bodyHtml: `
        <div class="row"><span>Status</span><span>Saved / Draft</span></div>
        <div class="row"><span>Name</span><span>${name}</span></div>
        <div class="row"><span>Email</span><span><a href="mailto:${email}" style="color:#D4AF37">${email}</a></span></div>
        <div class="row"><span>Phone</span><span>${phone}</span></div>
        <div class="row"><span>Lang / Region</span><span>${lang.toUpperCase()} / ${region}</span></div>
        <div class="est-box" style="margin-top:16px">
          <p class="est-label">${project}</p><p class="est-value">${estimate}</p>
        </div>
        <div class="row"><span>Package</span><span>${pkg}</span></div>
        <div class="row"><span>Delivery</span><span>${delivery}</span></div>
        <div class="row"><span>Submitted</span><span>${new Date().toLocaleString("en-US")}</span></div>`,
      ctaUrl:   process.env.ADMIN_PORTAL_URL || "https://portal.darastudio.com",
      ctaLabel: "View in Admin Portal",
    });

    await Promise.all([
      sendMail({ to: email,      subject: isPT ? "Sua estimativa DARA está salva! ✨" : "Your DARA Studio Estimate is Ready! ✨", html: clientHtml }),
      sendMail({ to: GMAIL_USER, subject: `[Lead] Saved/Draft — ${name}`,                                                        html: adminHtml }),
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error("[/api/leads]", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────
   POST /api/accept  —  Scenario B: Accept
───────────────────────────────────────────── */
const { daraConfirmationEmail } = require("./templates/confirmation");

app.post("/api/accept", async (req, res) => {
  try {
    req_fields(req.body, ["name","email","project","estimate"]);
    const {
      name, email, phone = "—",
      project, estimate,
      pkg = "—", delivery = "Standard",
      lang = "en", region = "US",
      propertyType = "Single Family", floors = "1",
      totalSqft = 1800, address = "TBD"
    } = req.body;

    const isPT = lang === "pt";
    const isBR = region === "BR";
    const cur  = isBR ? "R$" : "$";
    
    // Pricing Breakdown Logic (Synced with Wizard)
    const currencyMult = isBR ? 5.2 : 1; // Example BRL rate if not in env
    const floorPlansValue = totalSqft * 0.55 * currencyMult;
    const minAdjustment = 200 * currencyMult;
    
    const fmt = (v) => cur + Number(v).toLocaleString(isBR ? "pt-BR" : "en-US", { minimumFractionDigits: 2 });

    const confirmationData = {
      client: { name, email, phone, role: "Homeowner" },
      location: { address, region: isBR ? "Brasil" : "United States" },
      project: { propertyType, floors, serviceType: pkg, sqft: totalSqft },
      summary: {
        floorPlans: fmt(floorPlansValue),
        minFee: fmt(minAdjustment),
        total: estimate // Range string from wizard
      },
      lang: isPT ? "PT" : "EN"
    };

    const welcomeHtml = daraConfirmationEmail(confirmationData);

    // Generate PDF Buffer
    const { generateProjectPDF } = require("./utils/pdfGenerator");
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateProjectPDF(confirmationData);
    } catch (pdfErr) {
      console.error("PDF Generation failed, sending email without attachment:", pdfErr.message);
    }

    /* — Admin email — */
    const adminHtml = daraEmail({
      headline: `✅ Project Confirmed — ${name}`,
      bodyHtml: `
        <div class="row"><span>Status</span><span>CONFIRMED</span></div>
        <div class="row"><span>Project</span><span>${project}</span></div>
        <div class="row"><span>Estimate</span><span>${estimate}</span></div>
        <div class="row"><span>Sqft</span><span>${totalSqft}</span></div>
        <div class="row"><span>Address</span><span>${address}</span></div>
        <div class="row"><span>Client</span><span>${name} (${email})</span></div>`
    });

    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `DARA_Project_Estimate_${name.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer
      });
    }

    await Promise.all([
      sendMail({ 
        to: email, 
        subject: isPT ? "Confirmação de Projeto — DARA Studio" : "Project Confirmation — DARA Studio", 
        html: welcomeHtml,
        attachments
      }),
      sendMail({ to: GMAIL_USER, subject: `[Confirmed] ${project} — ${name}`, html: adminHtml }),
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error("[/api/accept]", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});


/* ── Health check ── */
app.get("/health", (_req, res) => res.json({ status: "ok", smtp: "gmail:465", user: GMAIL_USER, port: PORT }));

/* --- SERVIR O FRONTEND NO DEPLOY --- */
const clientPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientPath));

app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(clientPath, "index.html"));
    }
});

app.listen(PORT, () => console.log(`[DARA Server] http://localhost:${PORT}`));
