/**
 * DARA Studio — Confirmation Templates
 * High-fidelity HTML/CSS for Email and PDF.
 */

const DARA_COLORS = {
  bg: "#0F1035",
  card: "#1A1B41",
  accent: "#6366f1",
  text: "#F0F2F9",
  secondary: "#7077A1",
  gold: "#D4AF37",
  border: "rgba(255,255,255,0.12)"
};

const DARA_FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Instrument+Serif:ital@1&display=swap');
`;

function getCommonStyles() {
  return `
    body { margin:0; padding:0; background-color:${DARA_COLORS.bg}; color:${DARA_COLORS.text}; font-family:'DM Sans', sans-serif; }
    .serif { font-family:'Instrument Serif', serif; font-style:italic; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: ${DARA_COLORS.text}; }
    .headline { font-size: 32px; line-height: 1.2; font-weight: 400; margin-bottom: 8px; }
    .subline { color: ${DARA_COLORS.secondary}; font-size: 14px; margin-bottom: 30px; }
    
    .card-row { display: flex; gap: 16px; margin-bottom: 30px; }
    .card { flex: 1; background: ${DARA_COLORS.card}; padding: 20px; border-radius: 12px; border: 1px solid ${DARA_COLORS.border}; }
    .card-label { font-size: 10px; font-weight: 700; color: ${DARA_COLORS.secondary}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .card-value { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }
    
    .table-container { margin-bottom: 40px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; font-size: 11px; color: ${DARA_COLORS.secondary}; text-transform: uppercase; padding: 12px 0; border-bottom: 1px solid ${DARA_COLORS.border}; }
    .table td { padding: 16px 0; border-bottom: 1px solid ${DARA_COLORS.border}; font-size: 14px; }
    .highlight { color: ${DARA_COLORS.accent}; font-weight: 700; }
    
    .summary-box { background: ${DARA_COLORS.card}; padding: 24px; border-radius: 16px; border: 1px solid ${DARA_COLORS.accent}; margin-bottom: 40px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
    .summary-row.total { border-top: 1px solid ${DARA_COLORS.border}; padding-top: 16px; margin-top: 16px; font-size: 18px; font-weight: 700; color: ${DARA_COLORS.text}; }
    
    .steps { margin-bottom: 40px; }
    .step { display: flex; gap: 16px; margin-bottom: 20px; }
    .step-num { width: 24px; height: 24px; background: ${DARA_COLORS.accent}; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0; }
    .step-text { font-size: 14px; line-height: 1.5; }
    .step-title { font-weight: 700; margin-bottom: 4px; display: block; }
    
    .disclaimer { background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; font-size: 11px; color: ${DARA_COLORS.secondary}; line-height: 1.6; }
    
    .btn-container { text-align: center; margin: 40px 0; }
    .btn { display: inline-block; background-color: ${DARA_COLORS.accent}; color: #ffffff !important; padding: 16px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; }
    .btn-secondary { background-color: rgba(255,255,255,0.1); border: 1px solid ${DARA_COLORS.border}; }
    
    .badge-internal { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; }
    .badge-lead { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); color: ${DARA_COLORS.gold}; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; }
    
    .project-preview { background: linear-gradient(135deg, ${DARA_COLORS.card} 0%, #25264d 100%); padding: 30px; border-radius: 20px; border: 1px solid ${DARA_COLORS.border}; margin-bottom: 30px; position: relative; overflow: hidden; }
    .project-preview::after { content: '🔔'; position: absolute; right: -10px; bottom: -10px; font-size: 80px; opacity: 0.05; }
    .preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    .notes-box { background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); padding: 20px; border-radius: 12px; margin-top: 30px; }
    .notes-title { font-size: 11px; font-weight: 700; color: ${DARA_COLORS.gold}; text-transform: uppercase; margin-bottom: 10px; }
    .notes-content { font-size: 13px; line-height: 1.6; color: ${DARA_COLORS.text}; }

    @media (max-width: 600px) {
      .card-row { flex-direction: column; }
      .preview-grid { grid-template-columns: 1fr; }
    }
  `;
}

/**
 * Generate Confirmation Email HTML
 */
function daraConfirmationEmail(data) {
  const { client, location, project, summary, lang = 'EN' } = data;
  const isPT = lang === 'PT';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${DARA_FONTS}
        ${getCommonStyles()}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DARA STUDIO</div>
          <h1 class="headline serif">
            ${isPT ? "O primeiro traço do seu novo capítulo foi desenhado" : "The first stroke of your new chapter has been drawn"}
          </h1>
          <p class="subline">
            ${isPT ? "Você não está apenas construindo uma casa — você está criando o lugar onde sua história vai acontecer." 
                   : "You are not just building a house — you are creating the place where your story will happen."}
          </p>
        </div>

        <div class="card-row">
          <div class="card">
            <div class="card-label">${isPT ? "Cliente" : "Client"}</div>
            <div class="card-value"><strong>${client.name}</strong></div>
            <div class="card-value">${client.email}</div>
            <div class="card-value">${client.phone}</div>
            <div class="card-value">${client.role}</div>
          </div>
          <div class="card">
            <div class="card-label">${isPT ? "Localização" : "Location"}</div>
            <div class="card-value"><strong>${location.address}</strong></div>
            <div class="card-value">${location.region}</div>
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>${isPT ? "Detalhes do Projeto" : "Project Details"}</th>
                <th style="text-align: right;">${isPT ? "Valor" : "Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Property Type</td>
                <td style="text-align: right;">${project.propertyType}</td>
              </tr>
              <tr>
                <td>Floors</td>
                <td style="text-align: right;">${project.floors}</td>
              </tr>
              <tr>
                <td>Type of Service</td>
                <td style="text-align: right;">${project.serviceType}</td>
              </tr>
              <tr>
                <td><strong>Total Square Footage</strong></td>
                <td style="text-align: right;" class="highlight">${project.sqft} ${isPT ? "m²" : "sqft"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary-box">
          <div class="card-label" style="margin-bottom: 16px;">${isPT ? "Resumo Final" : "Final Summary"}</div>
          <div class="summary-row">
            <span>Floor Plans</span>
            <span>${summary.floorPlans}</span>
          </div>
          <div class="summary-row">
            <span>Minimum Fee Adjustment</span>
            <span>${summary.minFee}</span>
          </div>
          <div class="summary-row total">
            <span>Total Estimated Fee</span>
            <span>${summary.total}</span>
          </div>
        </div>

        <div class="steps">
          <h2 class="card-label" style="margin-bottom: 20px;">${isPT ? "Próximos Passos" : "What Happens Next"}</h2>
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-text">
              <span class="step-title">Estimate Review</span>
              ${isPT ? "Nossa equipe analisará sua solicitação para garantir que todos os detalhes técnicos estejam alinhados." 
                     : "Our team will review your request to ensure all technical details are aligned."}
            </div>
          </div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-text">
              <span class="step-title">Formal Quote</span>
              ${isPT ? "Você receberá uma proposta formal com o cronograma detalhado e contrato em até 2 dias úteis." 
                     : "You will receive a formal proposal with the detailed schedule and contract within 2 business days."}
            </div>
          </div>
        </div>

        <div class="disclaimer">
          <strong>Legal Disclaimer:</strong> This document is an estimate based on the information provided. The final value may vary after technical analysis and formal quoting. All prices are in USD unless otherwise specified.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Confirmation PDF HTML
 */
function daraConfirmationPDF(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${DARA_FONTS}
        ${getCommonStyles()}
        @page { size: A4; margin: 0; }
        .container { max-width: 800px; padding: 60px; }
        .summary-box { page-break-inside: avoid; }
      </style>
    </head>
    <body>
      ${daraConfirmationEmail(data)}
    </body>
    </html>
  `;
}

/**
 * Generate Save for Later Email HTML
 */
function daraSaveForLaterEmail(data) {
  const { client, location, project, resumeUrl, lang = 'EN' } = data;
  const isPT = lang === 'PT';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${DARA_FONTS}
        ${getCommonStyles()}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DARA STUDIO</div>
          <h1 class="headline serif">
            ${isPT ? "O seu progresso foi guardado" : "Your project is safe with us"}
          </h1>
          <p class="subline">
            ${isPT ? "Você deu o primeiro passo. Estamos aqui para garantir que cada detalhe da sua visão seja preservado." 
                   : "You've taken the first step. We are here to ensure every detail of your vision is preserved."}
          </p>
        </div>

        <div class="project-preview">
          <div class="card-label" style="color: ${DARA_COLORS.accent}; margin-bottom: 20px;">
            ${isPT ? "Rascunho do Projeto" : "Project Draft"}
          </div>
          <div class="preview-grid">
            <div>
              <div class="card-label">${isPT ? "Localização" : "Location"}</div>
              <div class="card-value">${location.address || (isPT ? "Não informada" : "Not specified")}</div>
            </div>
            <div>
              <div class="card-label">${isPT ? "Tipo de Propriedade" : "Property Type"}</div>
              <div class="card-value">${project.propertyType || "—"}</div>
            </div>
            <div>
              <div class="card-label">${isPT ? "Área Estimada" : "Estimated Area"}</div>
              <div class="card-value">${project.sqft} ${isPT ? "m²" : "sqft"}</div>
            </div>
            <div>
              <div class="card-label">${isPT ? "Status" : "Status"}</div>
              <div class="card-value" style="color: ${DARA_COLORS.gold}; font-weight: bold;">
                ${isPT ? "Em Progresso" : "In Progress"}
              </div>
            </div>
          </div>
        </div>

        <p style="text-align: center; font-size: 15px; line-height: 1.6; color: ${DARA_COLORS.secondary}; margin-bottom: 0;">
          ${isPT ? "Retome de onde parou e continue transformando seu sonho em realidade." 
                 : "Pick up right where you left off and continue transforming your dream into reality."}
        </p>

        <div class="btn-container">
          <a href="${resumeUrl}" class="btn">
            ${isPT ? "Continuar Projeto →" : "Continue Building →"}
          </a>
        </div>

        <div class="disclaimer">
          <strong>Legal Disclaimer:</strong> ${isPT ? "Este é um link de acesso único para o seu rascunho. Não compartilhe este e-mail com terceiros." : "This is a unique access link for your draft. Do not share this email with third parties."}
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Internal Notification Email HTML
 */
function daraInternalNotificationEmail(data) {
  const { client, location, project, summary, notes, projectId, timestamp } = data;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${DARA_FONTS}
        ${getCommonStyles()}
      </style>
    </head>
    <body>
      <div class="container" style="max-width: 700px;">
        <div class="header" style="text-align: left;">
          <div class="badge-internal">Escritório DARA Studio</div>
          <h1 class="headline serif" style="font-size: 28px;">
            Novo Projeto Recebido: ${client.name}
          </h1>
          <p class="subline" style="margin-bottom: 10px;">
            ID: #${projectId} &middot; Recebido em: ${timestamp}
          </p>
        </div>

        <div class="card-row">
          <div class="card">
            <div class="card-label">Cliente</div>
            <div class="card-value"><strong>${client.name}</strong></div>
            <div class="card-value"><a href="mailto:${client.email}" style="color: ${DARA_COLORS.accent}; text-decoration: none;">${client.email}</a></div>
            <div class="card-value">${client.phone}</div>
            <div class="card-value">${client.role}</div>
          </div>
          <div class="card">
            <div class="card-label">Localização</div>
            <div class="card-value"><strong>${location.address}</strong></div>
            <div class="card-value">${location.region}</div>
            <div style="margin-top: 10px;">
              <a href="${mapsUrl}" style="font-size: 11px; color: ${DARA_COLORS.gold}; text-decoration: none; font-weight: bold;">VER NO GOOGLE MAPS ↗</a>
            </div>
          </div>
        </div>

        <div class="card-row">
          <div class="card" style="flex: 2;">
            <div class="card-label">Especificações Técnicas</div>
            <div class="preview-grid" style="margin-top: 10px;">
              <div>
                <div class="card-label" style="font-size: 9px;">Property Type</div>
                <div class="card-value">${project.propertyType}</div>
              </div>
              <div>
                <div class="card-label" style="font-size: 9px;">Floors</div>
                <div class="card-value">${project.floors}</div>
              </div>
              <div>
                <div class="card-label" style="font-size: 9px;">Total Square Footage</div>
                <div class="card-value" style="color: ${DARA_COLORS.accent}; font-weight: bold;">${project.sqft} sqft</div>
              </div>
              <div>
                <div class="card-label" style="font-size: 9px;">Tipo de Serviço</div>
                <div class="card-value">${project.serviceType}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-box" style="margin-top: 20px;">
          <div class="card-label" style="margin-bottom: 16px;">Resumo Financeiro (Estimativa)</div>
          <div class="summary-row">
            <span>Floor Plans</span>
            <span>${summary.floorPlans}</span>
          </div>
          <div class="summary-row">
            <span>Minimum Fee Adjustment</span>
            <span>${summary.minFee}</span>
          </div>
          <div class="summary-row total">
            <span>Total Estimated Fee</span>
            <span>${summary.total}</span>
          </div>
        </div>

        ${notes ? `
        <div class="notes-box">
          <div class="notes-title">Notas Adicionais do Cliente</div>
          <div class="notes-content">${notes}</div>
        </div>
        ` : ''}

        <div class="btn-container" style="display: flex; gap: 16px; justify-content: center;">
          <a href="#" class="btn" style="flex: 1; text-align: center;">Abrir PDF do Cliente</a>
          <a href="https://portal.darastudio.com" class="btn btn-secondary" style="flex: 1; text-align: center;">Gestão Interna</a>
        </div>

        <div class="disclaimer" style="text-align: center;">
          Este é um e-mail de notificação automática. Por favor, inicie o processo de triagem técnica em até 24 horas.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Internal Lead Alert Email HTML
 */
function daraInternalLeadAlertEmail(data) {
  const { client, location, project, estimate, timestamp } = data;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${DARA_FONTS}
        ${getCommonStyles()}
      </style>
    </head>
    <body>
      <div class="container" style="max-width: 700px;">
        <div class="header" style="text-align: left;">
          <div class="badge-lead">🔔 Lead Quente — Rascunho Salvo</div>
          <h1 class="headline serif" style="font-size: 28px;">
            Novo Rascunho: ${client.name}
          </h1>
          <p class="subline" style="margin-bottom: 10px;">
            Status: <strong>Saved / Draft</strong> &middot; Salvo em: ${timestamp}
          </p>
        </div>

        <div class="card-row">
          <div class="card">
            <div class="card-label">Perfil do Lead</div>
            <div class="card-value"><strong>${client.name}</strong></div>
            <div class="card-value"><a href="mailto:${client.email}" style="color: ${DARA_COLORS.accent}; text-decoration: none;">${client.email}</a></div>
            <div class="card-value">${client.phone}</div>
            <div class="card-value">Região: ${location.region}</div>
          </div>
          <div class="card">
            <div class="card-label">Interesse do Projeto</div>
            <div class="card-value"><strong>${project.propertyType || "Não definido"}</strong></div>
            <div class="card-value">Área: ${project.sqft} sqft</div>
            <div class="card-value" style="color: ${DARA_COLORS.gold}; font-weight: bold; font-size: 16px; margin-top: 10px;">
              ${estimate}
            </div>
          </div>
        </div>

        <div class="card" style="background: rgba(255,255,255,0.02); border-color: ${DARA_COLORS.border};">
          <div class="card-label">Localização Informada</div>
          <div class="card-value">${location.address}</div>
          <div style="margin-top: 8px;">
            <a href="${mapsUrl}" style="font-size: 11px; color: ${DARA_COLORS.gold}; text-decoration: none; font-weight: bold;">ABRIR NO MAPA ↗</a>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; border-radius: 12px; background: rgba(99, 102, 241, 0.05); border: 1px dashed ${DARA_COLORS.accent};">
          <div class="card-label" style="color: ${DARA_COLORS.accent};">Dica de Vendas</div>
          <p style="font-size: 13px; margin: 5px 0 0; line-height: 1.5; color: ${DARA_COLORS.text};">
            Este lead demonstrou interesse real ao salvar o progresso. Recomendamos um follow-up em 24h caso o projeto não seja confirmado automaticamente.
          </p>
        </div>

        <div class="btn-container">
          <a href="https://portal.darastudio.com" class="btn" style="width: 100%; box-sizing: border-box; text-align: center;">Visualizar Detalhes no Admin Portal</a>
        </div>

        <div class="disclaimer" style="text-align: center;">
          DARA Studio &copy; ${new Date().getFullYear()} &middot; Inteligência de Leads
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Save for Later PDF HTML
 */
function daraDraftPDF(data) {
  const { client, location, project, estimate, lang = 'EN' } = data;
  const isPT = lang === 'PT';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${DARA_FONTS}
        ${getCommonStyles()}
        body { background-color: #0d0d1a !important; }
        .container { max-width: 800px; padding: 60px; background-color: #0d0d1a !important; }
        .project-preview { background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); }
        .badge-lead { background: rgba(99, 102, 241, 0.1); color: #6366f1; border-color: rgba(99, 102, 241, 0.2); }
        @page { size: A4; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo" style="color: #6366f1;">DARA STUDIO</div>
          <div class="badge-lead">${isPT ? "RASCUNHO DO PROJETO" : "PROJECT DRAFT"}</div>
          <h1 class="headline serif">
            ${isPT ? "Sua visão está segura conosco" : "Your vision is safe with us"}
          </h1>
          <p class="subline">
            ${isPT ? "Este documento contém o resumo do seu progresso técnico até o momento." 
                   : "This document contains a summary of your technical progress so far."}
          </p>
        </div>

        <div class="card-row">
          <div class="card">
            <div class="card-label">${isPT ? "Cliente" : "Client"}</div>
            <div class="card-value"><strong>${client.name}</strong></div>
            <div class="card-value">${client.email}</div>
            <div class="card-value">${client.phone}</div>
          </div>
          <div class="card">
            <div class="card-label">${isPT ? "Localização" : "Location"}</div>
            <div class="card-value"><strong>${location.address || (isPT ? "A definir" : "TBD")}</strong></div>
            <div class="card-value">${location.region}</div>
          </div>
        </div>

        <div class="project-preview">
          <div class="preview-grid">
            <div>
              <div class="card-label">${isPT ? "Tipo de Propriedade" : "Property Type"}</div>
              <div class="card-value">${project.propertyType || "—"}</div>
            </div>
            <div>
              <div class="card-label">${isPT ? "Área Estimada" : "Estimated Area"}</div>
              <div class="card-value">${project.sqft} ${isPT ? "m²" : "sqft"}</div>
            </div>
          </div>
        </div>

        <div class="summary-box" style="border-color: #6366f1;">
          <div class="card-label" style="color: #6366f1;">${isPT ? "Estimativa de Investimento" : "Investment Estimate"}</div>
          <div class="summary-row total" style="border: none; padding: 0; margin: 10px 0 0;">
            <span>${isPT ? "Valor Estimado" : "Estimated Fee"}</span>
            <span style="color: #6366f1;">${estimate}</span>
          </div>
        </div>

        <div class="disclaimer">
          <strong>Note:</strong> ${isPT 
            ? "Este documento é um rascunho técnico gerado automaticamente. O valor final será confirmado após a análise detalhada da nossa equipe de arquitetura." 
            : "This document is an automatically generated technical draft. Final pricing will be confirmed after a detailed review by our architecture team."}
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #7077A1;">
          DARA Studio &middot; Architectural Design &middot; darastudio.com
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Follow-up Email HTML for missing files
 */
function daraFollowUpEmail(data) {
  const { client, project, lang = 'EN' } = data;
  const isPT = lang === 'PT';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        \${DARA_FONTS}
        \${getCommonStyles()}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DARA STUDIO</div>
          <h1 class="headline serif">
            \${isPT ? "Precisamos de alguns arquivos para começar" : "We need a few files to get started"}
          </h1>
          <p class="subline">
            \${isPT ? "Olá " + client.name + ", notamos que você iniciou seu projeto mas ainda não anexou os documentos técnicos." 
                   : "Hi " + client.name + ", we noticed you started your project but haven't attached the technical documents yet."}
          </p>
        </div>

        <div class="project-preview" style="background: rgba(212, 175, 55, 0.05); border-color: rgba(212, 175, 55, 0.2);">
          <div class="card-label" style="color: \${DARA_COLORS.gold}; margin-bottom: 20px;">
            \${isPT ? "Documentação Pendente" : "Pending Documentation"}
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: \${DARA_COLORS.text}; margin-bottom: 20px;">
            \${isPT ? "Para que nossa equipe possa realizar uma revisão precisa do seu projeto e manter os prazos selecionados, precisamos de:" 
                   : "In order for our team to perform an accurate review of your project and maintain your selected timelines, we need:"}
          </p>
          <ul style="font-size: 13px; color: \${DARA_COLORS.secondary}; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
            <li>\${isPT ? "Levantamento Topográfico / Site Plan" : "Property Survey / Site Plan"}</li>
            <li>\${isPT ? "Fotos de todos os lados da propriedade" : "Clear Photos of all sides of the property"}</li>
            <li>\${isPT ? "Medidas básicas ou plantas existentes" : "Rough measurements or existing plans"}</li>
          </ul>
        </div>

        <p style="text-align: center; font-size: 15px; line-height: 1.6; color: \${DARA_COLORS.secondary}; margin-bottom: 30px;">
          \${isPT ? "Você pode responder a este e-mail com os arquivos ou carregá-los diretamente no seu Portal do Cliente." 
                 : "You can reply to this email with the files or upload them directly to your Client Portal."}
        </p>

        <div class="btn-container">
          <a href="https://portal.darastudio.com" class="btn" style="background-color: \${DARA_COLORS.gold}; color: #000 !important;">
            \${isPT ? "Acessar Portal do Cliente →" : "Access Client Portal →"}
          </a>
        </div>

        <div class="disclaimer" style="text-align: center;">
          \${isPT ? "Se você já enviou esses arquivos por outro canal, por favor desconsidere este aviso." 
                 : "If you have already sent these files through another channel, please disregard this notice."}
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  daraConfirmationEmail,
  daraConfirmationPDF,
  daraSaveForLaterEmail,
  daraInternalNotificationEmail,
  daraInternalLeadAlertEmail,
  daraDraftPDF,
  daraFollowUpEmail
};
