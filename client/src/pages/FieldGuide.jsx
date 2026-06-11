import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import { useBuilders } from "../context/BuildersContext";
import PageTransition from "../components/PageTransition";

// Quick Numbers Reference Data
export const QUICK_NUMBERS = [
  { id: 1, type: "red", 
    label: `Egress Net Clear Opening`, labelPt: `Vão Livre de Saída (Egress)`, 
    val: "5.7 sq ft", valPt: "5.7 sq ft", 
    desc: "Minimum net clear opening for emergency escape windows. At grade level: 5.0 sq ft.",
    descPt: `Vão livre mínimo para janelas de saída de emergência. No nível do solo: 5.0 sq ft.` },
  { id: 2, type: "red", 
    label: `Max Sill Height (Egress)`, labelPt: `Altura Máx. Peitoril`, 
    val: "44 inches AFF", valPt: "44 polegadas do piso", 
    desc: "Maximum sill height above FINISH floor — not subfloor. Trim and finish reduce usable dimension.",
    descPt: `Altura máxima do peitoril acima do piso ACABADO (não do contrapiso). Acabamentos reduzem a dimensão útil.` },
  { id: 3, type: "amber", 
    label: `Egress Window Min Height`, labelPt: `Altura Mín. da Janela`, 
    val: "24 inches", valPt: "24 polegadas", 
    desc: "Minimum net clear opening height. Width minimum: 20 inches. Both must be met.",
    descPt: `Altura mínima do vão livre. Largura mínima: 20 polegadas. Ambas devem ser atendidas.` },
  { id: 4, type: "blue", 
    label: `Frost Depth (MA)`, labelPt: "Profundidade de Geada (MA)", 
    val: "48 inches", valPt: "48 polegadas", 
    desc: "Minimum footing depth below finished grade statewide. Some municipalities require deeper.",
    descPt: `Profundidade mínima da sapata abaixo do nível do solo. Algumas cidades exigem mais profundo.` },
  { id: 5, type: "blue", 
    label: `Ice & Water Shield`, labelPt: "Membrana Ice & Water", 
    val: "24 in. inside wall", valPt: "24 pol. internas", 
    desc: "Membrane must extend 24\" inside the exterior wall line. Required on ALL MA roofs.",
    descPt: `A membrana deve avançar 24" para dentro da linha da parede externa. Obrigatório em TODOS os telhados de MA.` },
  { id: 6, type: "green", 
    label: `Anchor Bolt Spacing`, labelPt: `Espaçamento de Chumbadores`, 
    val: "6 ft O.C. max", valPt: `Máx 6 pés (1.8m)`, 
    desc: `Sill plate anchor bolts: max 6' on center and within 12" of each plate end section.`,
    descPt: `Parafusos do sill plate: máx. de 6 pés entre centros e a menos de 12" das extremidades da seção.` },
  { id: 7, type: "amber", 
    label: `Smoke Detector Limit`, labelPt: `Limite de Detectores de Fumaça`, 
    val: "12 max residential", valPt: `Máx 12 residenciais`, 
    desc: "More than 12 smoke detectors = Fire Alarm System. Requires licensed Fire Protection Engineer.",
    descPt: `Mais de 12 detectores = Sistema de Alarme de Incêndio. Requer Engenheiro de Proteção contra Incêndio.` },
  { id: 8, type: "green", 
    label: `Attic Insulation Min`, labelPt: `Isolamento Mínimo Sótão`, 
    val: "R-60 10th Ed", valPt: "R-60 (10ª Ed.)", 
    desc: "Raised from R-49. Any project showing R-49 will not receive a Certificate of Occupancy.",
    descPt: `Aumentado de R-49. Projetos que especificam R-49 não receberão Certificado de Ocupação.` },
  { id: 9, type: "blue", 
    label: `Wall Insulation`, labelPt: "Isolamento de Parede", 
    val: "R-20 or R-13+5", valPt: "R-20 ou R-13+5", 
    desc: "R-20 full cavity OR R-13 cavity plus R-5 continuous insulation exterior. Zone 5A requirement.",
    descPt: `R-20 em toda cavidade OU R-13 mais R-5 contínuo externo. Requisito para a Zona 5A.` }
];

// Critical Rules Data
export const CRITICAL_RULES = [
  {
    id: 1, type: "red", icon: "🚫", badge: "Plumbing — Automatic Fail", badgePt: `Encanamento — Falha Automática`,
    title: `248 CMR — Not IPC`, titlePt: "248 CMR — Nunca IPC",
    desc: "Massachusetts does NOT adopt the International Plumbing Code (IPC). Every plumbing note, specification, and drawing must reference 248 CMR. Any document citing IPC as the governing standard will be rejected at plan review.",
    descPt: `Massachusetts NÃO adota o International Plumbing Code (IPC). Todo projeto de encanamento deve citar o 248 CMR. Qualquer documento citando IPC será rejeitado na análise do projeto.`,
    code: "ALL PLUMBING SHALL COMPLY WITH 248 CMR. IPC / IRC-P FOR COORDINATION ONLY.",
    codePt: `TODO ENCANAMENTO DEVE CUMPRIR COM 248 CMR. IPC/IRC-P APENAS PARA COORDENAÇÃO.`,
    tip: `Never cite 'IPC Section...' on a Massachusetts project. The plan reviewer will reject the submission and require a full revision. Use 248 CMR exclusively.`,
    tipPt: `Nunca cite 'IPC Section...' num projeto em MA. O revisor rejeitará o envio e exigirá revisão total. Use exclusivamente 248 CMR.`
  },
  {
    id: 2, type: "red", icon: "📅", badge: "Code Edition — Expired", badgePt: `Edição do Código — Expirada`,
    title: `10th Edition Only (Since Oct 11, 2024)`, titlePt: `Apenas 10ª Edição (Desde Out 2024)`,
    desc: `The 9th Edition of 780 CMR expired on October 11, 2024. Projects submitted under the 9th Edition are void. All permits, drawings, and specifications must reference the 10th Edition of 780 CMR.`,
    descPt: `A 9ª Edição do 780 CMR expirou em 11 de Outubro de 2024. Projetos submetidos sob a 9ª Edição são inválidos. Todos os alvarás e projetos devem referenciar a 10ª Edição.`,
    code: `780 CMR 10TH EDITION — EFFECTIVE OCT 11, 2024. 9TH EDITION REFERENCES ARE INVALID.`,
    codePt: `780 CMR 10ª EDIÇÃO — EM VIGOR 11 OUT 2024. REFERÊNCIAS À 9ª EDIÇÃO SÃO INVÁLIDAS.`,
    tip: `Check every spec section, cover sheet, and drawing note. A single '9th Edition' reference can flag the entire permit application.`,
    tipPt: `Verifique todas as seções, folhas de rosto e notas. Uma única referência à '9th Edition' pode travar o alvará inteiro.`
  },
  {
    id: 3, type: "red", icon: "🪟", badge: "Egress — Life Safety", badgePt: `Saída (Egress) — Segurança Vital`,
    title: `Egress Windows — 4 Numbers to Know`, titlePt: `Janelas de Saída — 4 Números Fundamentais`,
    desc: `Every sleeping room requires a compliant egress opening. Inspectors check all four dimensions: net clear area, height, width, and sill height from FINISH floor — not subfloor.`,
    descPt: `Todo dormitório exige uma abertura de saída adequada. O fiscal verificará as 4 dimensões: área livre, altura, largura e altura do peitoril a partir do piso ACABADO.`,
    code: "NET CLEAR: 5.7 SQ FT (5.0 AT GRADE) | MIN HEIGHT: 24\" · MIN WIDTH: 20\" | MAX SILL HEIGHT: 44\" AFF (FINISH FLOOR)",
    codePt: `VÃO LIVRE: 5.7 SQ FT (5.0 TÉRREO) | ALTURA MÍN: 24" · LARGURA MÍN: 20" | PEITORIL MÁX: 44" (PISO ACABADO)`,
    tip: "The 44\" max sill height is measured from FINISH floor. Floor finish and trim reduce the usable dimension. Verify window selection accounts for this before ordering.",
    tipPt: `A altura máxima de 44" é do piso ACABADO. O piso e rodapés diminuem a medida útil. Considere isso ao encomendar as janelas.`
  },
  {
    id: 4, type: "amber", icon: "🔥", badge: "Fire Safety — NFPA 72", badgePt: `Incêndio — NFPA 72`,
    title: `Smoke Detectors: 12-Device Limit`, titlePt: `Detectores de Fumaça: Limite de 12 Dispositivos`,
    desc: "Any residential system with more than 12 smoke detectors OR more than 18 total interconnected devices (smoke + CO + heat combined) is classified as a Fire Alarm System under MA Fire Code and requires design by a licensed Fire Protection Engineer with NFPA 72 certification.",
    descPt: `Qualquer sistema residencial com mais de 12 detectores de fumaça OU mais de 18 no total (fumaça+CO+calor) exige um projeto de Sistema de Alarme assinado por um Engenheiro credenciado.`,
    code: "RESIDENTIAL: MAX 12 SMOKE DETECTORS. >12 DETECTORS = FPE STAMP REQUIRED (NFPA 72).",
    codePt: `RESIDENCIAL: MÁX 12 DETECTORES. >12 DETECTORES = ASSINATURA FPE EXIGIDA (NFPA 72).`,
    tip: `Large homes frequently exceed 12 smoke detectors. Design at 12 or fewer for residential classification, or bring in a licensed Fire Protection Engineer before permit submission.`,
    tipPt: `Casas grandes facilmente ultrapassam 12 detectores. Mantenha 12 ou menos para manter como residencial, ou contrate o Engenheiro antes do alvará.`
  },
  {
    id: 5, type: "amber", icon: "❄️", badge: "Plumbing — Freeze Risk", badgePt: "Encanamento — Risco de Congelamento",
    title: `Freeze Protection — Exterior Walls`, titlePt: `Proteção Térmica — Paredes Externas`,
    desc: "All water supply and drainage piping in unconditioned spaces or exterior wall assemblies must have freeze protection per 248 CMR. Massachusetts winter temperatures regularly reach below 0°F.",
    descPt: `Toda a tubulação de água e esgoto em áreas não climatizadas ou paredes externas deve possuir proteção térmica segundo o 248 CMR. O inverno de MA frequentemente cai abaixo de 0°F (-18°C).`,
    code: "FREEZE PROTECTION REQUIRED FOR ALL PIPING IN UNCONDITIONED SPACES OR EXT. WALLS PER 248 CMR.",
    codePt: `PROTEÇÃO CONTRA CONGELAMENTO OBRIGATÓRIA PARA TUBULAÇÃO EM PAREDES EXTERNAS CONFORME 248 CMR.`,
    tip: `Never route plumbing in exterior walls without a thermal protection strategy shown on drawings. Accepted methods: pipe insulation, heat tape with thermostat, or relocation to conditioned space.`,
    tipPt: `Nunca passe encanamento em parede externa sem especificar isolamento no projeto. Opções: tubos isolados, fitas de aquecimento, ou mover para parede interna.`
  },
  {
    id: 6, type: "blue", icon: "🏠", badge: "Roofing — MA Specific", badgePt: "Telhados — Regra de MA",
    title: `Ice & Water Shield — Mandatory Extent`, titlePt: `Ice & Water Shield — Extensão Obrigatória`,
    desc: `Self-adhering polymer-modified bitumen membrane is required on every Massachusetts roof, extending from the eave edge to a point 24 inches inside the exterior wall line of the building.`,
    descPt: `A membrana autoadesiva de betume (Ice & Water Shield) é obrigatória em todo telhado de MA, começando da calha até 24 polegadas (60 cm) para dentro do alinhamento da parede exterior.`,
    code: "ICE & WATER SHIELD: EAVE TO 24\" INSIDE EXTERIOR WALL LINE. 780 CMR R905.1.2. REQUIRED ON ALL MA ROOFS.",
    codePt: `ICE & WATER SHIELD: DA BORDA ATÉ 24" DENTRO DA PAREDE EXTERNA. 780 CMR R905.1.2. OBRIGATÓRIO EM MA.`,
    tip: `The 24" measurement is inside the wall line — not the eave edge. If not dimensioned on the roof plan, expect a plan review comment. No exceptions for any roof pitch.`,
    tipPt: `A medida de 24" é da linha da parede para dentro (rumo ao interior). Se faltar essa cota no projeto, a prefeitura rejeitará. Não há exceção para qualquer tipo de telhado.`
  },
  {
    id: 7, type: "blue", icon: "🔩", badge: "Roofing — Tie-In Method", badgePt: `Telhados — Conexões de Ampliação`,
    title: `Shingle Weaving — New-to-Old Tie-In`, titlePt: `Entrelaçamento (Weaving) — Telhado Novo e Velho`,
    desc: `When a new roof addition meets an existing roof, the shingle weaving method is required. Remove existing shingles 3 feet beyond the join point and interlay new shingles alternating with old courses. Butting shingles without weaving creates a water trap.`,
    descPt: `Quando uma nova adição de telhado encontra o antigo, o entrelaçamento das telhas é obrigatório. Remova 3 pés (90 cm) de telhas velhas do encontro e trance as novas camadas com as velhas. Apenas encostar criará vazamentos.`,
    code: "ROOF TIE-IN: REMOVE SHINGLES 3FT BEYOND JOIN. WEAVE NEW WITH EXISTING COURSES. ICE & WATER SHIELD OVER FULL TRANSITION.",
    codePt: `CONEXÃO DE TELHADO: REMOVA 3 PÉS ALÉM DO ENCONTRO. ENTRELAÇAR TELHAS NOVAS NAS ANTIGAS COM ICE & WATER SHIELD.`,
    tip: "Inspectors can see the transition pattern from ground level after the shingles are laid. Simply butting new shingles against old creates a step where water backs up under the old course.",
    tipPt: `Fiscais veem facilmente do chão se houve entrelaçamento ou não. Apenas encostar as telhas cria uma barreira (degrau) onde a água se acumula.`
  },
  {
    id: 8, type: "red", icon: "🔗", badge: "Deck — Life Safety", badgePt: `Decks — Segurança Vital`,
    title: `Ledger Connection — No Nails Ever`, titlePt: `Conexão de Ledger — Pregos Jamais`,
    desc: "Nails are never permitted as the primary ledger fastener in Massachusetts. Use lag screws or through-bolts sized and spaced per 780 CMR Table R507.9.1.3(1). Provide complete metal ledger flashing with self-adhering membrane.",
    descPt: `Pregos nunca são permitidos como fixador principal do ledger (tábua de apoio) em Massachusetts. Use parafusos lag ou passantes dimensionados pela Tabela R507.9.1.3(1). Utilize também rufos metálicos.`,
    code: "LEDGER: LAG SCREWS OR THRU-BOLTS PER TABLE R507.9.1.3(1). NAILS PROHIBITED. FULL METAL FLASHING WITH MEMBRANE.",
    codePt: `LEDGER: PARAFUSOS LAG OU PASSANTES P/ TAB. R507.9.1.3(1). PREGOS PROIBIDOS. RUFO METÁLICO COMPLETO.`,
    tip: "Ledger connection failure is the #1 cause of deck collapse fatalities in the US. MA inspectors will not approve any ledger detail showing nails. This is non-negotiable.",
    tipPt: `A falha na fixação do ledger é a principal causa de mortes por colapso de decks nos EUA. O fiscal não aprovará nenhum detalhe mostrando pregos.`
  },
  {
    id: 9, type: "blue", icon: "⚡", badge: "Electrical — NEC 2023", badgePt: `Elétrica — NEC 2023`,
    title: `Electrical Panel Working Clearance`, titlePt: `Espaço Livre do Quadro de Energia`,
    desc: "The working space in front of any electrical panel must maintain minimum clearances per NEC 2023 Article 110.26. Massachusetts adopted NEC 2023 with 527 CMR 12.00.",
    descPt: `O espaço de trabalho à frente de qualquer quadro elétrico deve manter os afastamentos mínimos exigidos pelo NEC 2023 Artigo 110.26, adotado em MA.`,
    code: `PANEL CLEARANCE: 36" DEEP × 30" WIDE × 6'-8" HIGH. NEC 2023 ART. 110.26. 527 CMR 12.00.`,
    codePt: `ESPAÇO LIVRE QUADRO: 36" PROF. × 30" LARG. × 6'-8" ALT. NEC 2023 ART. 110.26.`,
    tip: `Interior remodels that add walls, closets, or storage near a panel frequently violate NEC 110.26. A door swing within the working clearance zone will be rejected at final inspection.`,
    tipPt: `Reformas internas que adicionam armários ou paredes próximos ao quadro frequentemente violam essa regra. O giro de uma porta invadindo a zona também será reprovado.`
  }
];

// 20-Point Pre-Inspection Checklist Data
export const CHECKLIST_SECTIONS = [
  {
    title: `Foundation & Framing`, titlePt: `Fundação & Estrutura`,
    items: [
      { id: "c1", 
        title: `Anchor bolt spacing verified — max 6' O.C.`, titlePt: `Chumbadores verificados — máx 6' espaçamento`, 
        detail: "Every bolt within 12\" of each plate end. Measure with tape at every section end.", detailPt: `A até 12" de distância da extremidade da tábua. Meça com trena.`, 
        code: "780 CMR R403.1.6" },
      { id: "c2", 
        title: `Deck / structure footings at 48" below grade min.`, titlePt: `Sapatas de deck/estrutura mín. 48" abaixo do solo`, 
        detail: "Below frost line. Confirm with local AHJ before pouring — some towns require deeper.", detailPt: "Abaixo da linha de congelamento. Confirme a profundidade local antes de concretar.", 
        code: "780 CMR TABLE R301.2(1)" },
      { id: "c3", 
        title: `Deck ledger uses lag screws or through-bolts (NO nails)`, titlePt: "Ledger de deck usando parafusos lag ou passantes (SEM pregos)", 
        detail: "Fasteners sized and spaced per table. Metal flashing with membrane installed.", detailPt: `Pregos não suportam a carga de cisalhamento exigida para decks e varandas.`, 
        code: "780 CMR TABLE R507.9.1.3(1)", fail: "NAILS = FAIL", failPt: `PREGOS = REPROVAÇÃO` },
      { id: "c4", 
        title: `Headers in bearing walls sized per table or engineer stamp`, titlePt: "Vigas de carga (Headers) dimensionadas conforme tabela ou engenheiro", 
        detail: "Load path must be traceable from header to foundation. Verify before framing starts.", detailPt: `O caminho da carga estrutural deve ser transferido diretamente à fundação.`, 
        code: "780 CMR TABLE R602.7" },
      { id: "c5", 
        title: `Hurricane ties at every rafter-to-plate connection`, titlePt: `Clipes contra furacão instalados em cada junta entre caibro e viga`, 
        detail: "Required on every rafter. Inspectors count them individually.", detailPt: "Exigido em cada encaixe de caibro (rafter). Inspetores contam um por um.", 
        code: "780 CMR R802.11" }
    ]
  },
  {
    title: `Roof System`, titlePt: "Sistema de Telhado",
    items: [
      { id: "c6", 
        title: `Ice & Water Shield extends 24" inside exterior wall line`, titlePt: "Ice & Water Shield se estende a 24\" para dentro da linha da parede exterior", 
        detail: "Measure from the wall line — not the eave edge. Must be installed before any other roofing.", detailPt: `Meça a partir do alinhamento da parede, não do beiral. Obrigatório.`, 
        code: "780 CMR R905.1.2", fail: "REQUIRED ALL MA ROOFS", failPt: `OBRIGATÓRIO EM MA` },
      { id: "c7", 
        title: `Roof tie-in uses shingle weaving method`, titlePt: `Conexões de telhado utilizam a técnica de entrelaçamento (Weaving)`, 
        detail: "Existing shingles removed 3 feet beyond join. New shingles interlayed alternating with old.", detailPt: `Remova telhas antigas a 3 pés do ponto de encontro e trance com as novas.`, 
        code: "780 CMR / MANUFACTURER SPECS" },
      { id: "c8", 
        title: `Step flashing installed at all roof-to-wall junctions`, titlePt: "Rufo em degraus (Step Flashing) em todos os encontros telhado-parede", 
        detail: "One L-shaped piece per shingle course. Counter-flashing inserted behind siding — NOT over it.", detailPt: `Um rufo L por fileira de telha, fixado por trás do revestimento externo.`, 
        code: "780 CMR R905", fail: "NEVER OVER SIDING", failPt: "NUNCA SOBRE REVESTIMENTO" },
      { id: "c9", 
        title: `Attic ventilation: 1/300 net free area (soffit + ridge)`, titlePt: `Ventilação de sótão garante fator 1/300 de área livre de respiração`, 
        detail: "50% at lower (soffit) and 50% at upper (ridge). Calculations shown on drawings.", detailPt: `Garantir no mínimo 50% no beiral inferior e 50% na cumeeira.`, 
        code: "780 CMR R806.1" }
    ]
  },
  {
    title: `Thermal & Insulation`, titlePt: `Isolamento Térmico`,
    items: [
      { id: "c10", 
        title: `Attic insulation meets R-60 minimum (NOT R-49)`, titlePt: `Isolamento de sótão com fator térmico mínimo R-60 (Nunca R-49)`, 
        detail: "10th Edition raised minimum from R-49. A project showing R-49 will not receive a CO.", detailPt: `A nova 10ª Edição estipula mínimo de R-60 para aprovação em MA.`, 
        code: "IECC 2021 TABLE R402.1.3", fail: "R-49 = FAIL", failPt: `R-49 = REPROVAÇÃO` },
      { id: "c11", 
        title: `Wall insulation: R-20 cavity OR R-13 + R-5 CI`, titlePt: `Isolamento de parede externa em fator R-20 ou R-13 + R-5 (contínuo)`, 
        detail: "R-13 cavity alone does not comply in MA Zone 5A. Verify local Stretch Code adoption.", detailPt: `Um fator R-13 isolado não atende mais à zona de clima 5A.`, 
        code: "IECC 2021 / MA STRETCH CODE", fail: "R-13 ALONE = FAIL", failPt: `APENAS R-13 = REPROVAÇÃO` },
      { id: "c12", 
        title: `Vapor retarder Class II on warm-in-winter side`, titlePt: "Retardador de Vapor (Papel Kraft) posicionado no lado aquecido interno", 
        detail: "Kraft-faced batts or approved membrane. Wrong side causes condensation and structural rot.", detailPt: `A instalação virada para a parede externa causa condensação e apodrece a madeira.`, 
        code: "780 CMR R702.7" }
    ]
  },
  {
    title: `MEP Systems`, titlePt: `Instalações MEP`,
    items: [
      { id: "c13", 
        title: `All plumbing notes cite 248 CMR (NOT IPC)`, titlePt: `Notas e projetos hidráulicos citam 248 CMR (Apenas, nunca IPC)`, 
        detail: "Check every note, spec, and drawing. IPC reference = automatic plan review rejection.", detailPt: `Massachusetts desconsidera normas da IPC para projetos de água e esgoto.`, 
        code: "248 CMR", fail: "IPC = FAIL", failPt: `IPC = REJEIÇÃO TOTAL` },
      { id: "c14", 
        title: `Freeze protection for all piping in exterior walls`, titlePt: `Prevenção anticongelante especificada para canos em paredes externas`, 
        detail: `Method shown on drawings: insulation, heat tape, or relocation to conditioned space.`, detailPt: `Indique como a água que passa em paredes externas será aquecida no rigor do inverno.`, 
        code: "248 CMR" },
      { id: "c15", 
        title: `Electrical panel working clearance: 36" × 30" × 6'8"`, titlePt: `Área de escape do quadro de energia mantida (36" × 30" × 6'8")`, 
        detail: `No door swings, shelves, or storage in the clearance zone. Confirmed at final inspection.`, detailPt: `A área frontal ao quadro deve estar inteiramente livre, sem armários ou móveis.`, 
        code: "NEC 2023 ART. 110.26" },
      { id: "c16", 
        title: `GFCI protection at all required locations`, titlePt: `Proteção GFCI instalada em banheiros, cozinhas, porões e área externa`, 
        detail: `Bathrooms, kitchens, garages, exterior, basements, crawl spaces, and enclosed porches.`, detailPt: `Dispositivos contra choques acidentais por contato com água devem estar acessíveis.`, 
        code: "NEC 2023 SEC. 210.8" }
    ]
  },
  {
    title: `Fire & Life Safety`, titlePt: `Segurança Vital e Incêndio`,
    items: [
      { id: "c17", 
        title: `Smoke alarms in every sleeping room + outside + every level`, titlePt: `Detectores de fumaça operantes em todos os dormitórios e corredores`, 
        detail: "All interconnected. 10-year non-removable battery backup required.", detailPt: `Todos devem ser interligados via fio ou rádio. Baterias seladas de 10 anos.`, 
        code: "780 CMR R314 / NFPA 72" },
      { id: "c18", 
        title: `Total smoke detector count does not exceed 12`, titlePt: `Total da residência não ultrapassa 12 detectores de fumaça instalados`, 
        detail: "Over 12 smoke detectors triggers full Fire Alarm System classification requiring FPE stamp.", detailPt: `Ultrapassar isso engatilha o código comercial para sistemas com projeto assinado.`, 
        code: "NFPA 72 / 527 CMR 1.00", fail: ">12 = FPE REQUIRED", failPt: ">12 = EXIGE ENGENHEIRO" },
      { id: "c19", 
        title: `Egress windows in all sleeping rooms verified (5.7 sq ft)`, titlePt: `Abertura livre em janelas de quartos superior a 5.7 sq ft, altura < 44"`, 
        detail: "Measure net clear opening after window is fully open. Sill height from finish floor max 44\".", detailPt: `Tire as medidas após a janela ser totalmente instalada e com piso interno finalizado.`, 
        code: "780 CMR R310" },
      { id: "c20", 
        title: `Garage fire separation verified (5/8" Type X on walls)`, titlePt: "Isolamento antichamas da garagem com Gesso Acartonado 5/8\" Type X", 
        detail: "Separation on garage side + self-closing 20-minute fire-rated door.", detailPt: `Instalado no teto e paredes que fazem fronteira com a casa. Porta também resistente.`, 
        code: "780 CMR R302.6" }
    ]
  }
];

// CAD Notes Data
export const CAD_NOTES_DATA = [
  { id: 1, topic: "Foundation Anchorage", topicPt: `Chumbadores da Fundação`, cat: "foundation", cad: `SILL PLATES: 1/2" ANCHOR BOLTS @ MAX 6' O.C., 12" FROM ENDS.`, sheet: "FOUNDATION ANCHORAGE SHALL COMPLY WITH 780 CMR (10TH ED) SECTION R403.1.6. PROVIDE 1/2-INCH DIAMETER ANCHOR BOLTS SPACED A MAXIMUM OF 6 FEET ON CENTER AND WITHIN 12 INCHES OF EACH END OF EVERY SILL PLATE SECTION. MINIMUM EMBEDMENT 7 INCHES INTO CONCRETE.", sheetPt: `A ANCORAGEM DEVE ESTAR EM CONFORMIDADE COM 780 CMR SEÇÃO R403.1.6. PARAFUSOS DE 1/2 POLEGADA DE DIÂMETRO COM ESPAÇAMENTO MÁXIMO DE 6 PÉS E A 12 POLEGADAS DA EXTREMIDADE DA TÁBUA.` },
  { id: 2, topic: "Radon Rough-In", topicPt: `Preparo Gás Radônio`, cat: "foundation", cad: "RADON ROUGH-IN: 3\" SCH 40 PVC FROM SUB-SLAB TO 12\" ABOVE ROOF. CAPPED.", sheet: "A PASSIVE RADON MITIGATION ROUGH-IN SHALL BE PROVIDED PER 780 CMR AND EPA GUIDELINES. MINIMUM 3-INCH SCHEDULE 40 PVC FROM BELOW SLAB TO NOT LESS THAN 12 INCHES ABOVE ROOF LINE. TERMINATE WITH WATERTIGHT CAP.", sheetPt: `PREPARO PARA VENTILAÇÃO PASSIVA DE RADÔNIO CONFORME EPA. TUBO PVC DE 3 POLEGADAS DE BAIXO DO PISO ATÉ 12 POLEGADAS ACIMA DO TELHADO. TAMPADO.` },
  { id: 3, topic: "Deck Frost Footings", topicPt: "Sapatas Antigeada P/ Deck", cat: "foundation", cad: "DECK FOOTINGS MIN. 48\" BELOW FINISHED GRADE. 780 CMR TABLE R301.2(1).", sheet: "DECK FOOTINGS SHALL BE PLACED A MINIMUM OF 48 INCHES BELOW FINISHED GRADE TO COMPLY WITH FROST PROTECTION REQUIREMENTS OF 780 CMR TABLE R301.2(1). CONTRACTOR SHALL VERIFY LOCAL AHJ DEPTH REQUIREMENT PRIOR TO EXCAVATION.", sheetPt: `AS SAPATAS DO DECK DEVEM ESTAR A UM MÍNIMO DE 48 POLEGADAS ABAIXO DO NÍVEL ACABADO PARA CUMPRIR PROTEÇÃO ANTICONGELAMENTO.` },
  { id: 4, topic: "Deck Ledger Connection", topicPt: `Fixação Ledger do Deck`, cat: "framing", cad: "DECK LEDGER: LAG SCREWS OR THRU-BOLTS PER TABLE R507.9.1.3(1). NO NAILS. FULL FLASHING.", sheet: "DECK LEDGER SHALL BE CONNECTED TO HOUSE RIM JOIST USING LAG SCREWS OR CARRIAGE BOLTS SIZED AND SPACED PER 780 CMR TABLE R507.9.1.3(1). NAILS ARE NOT PERMITTED AS THE PRIMARY LEDGER FASTENER. PROVIDE COMPLETE METAL LEDGER FLASHING WITH SELF-ADHERING MEMBRANE INTEGRATED INTO HOUSE WEATHER BARRIER.", sheetPt: `FIXAR O LEDGER NA VIGA DA CASA UTILIZANDO PARAFUSOS LAG. PREGOS NÃO SÃO PERMITIDOS. INCLUIR RUFO METÁLICO INTEGRADO À BARREIRA DE VENTO.` },
  { id: 5, topic: "Header Sizing", topicPt: `Dimensão Vigas Estruturais`, cat: "framing", cad: "BEARING WALL HEADERS PER 780 CMR TABLE R602.7 OR STAMPED STRUCTURAL DESIGN.", sheet: "ALL HEADERS IN LOAD-BEARING WALLS SHALL BE SIZED PER 780 CMR TABLE R602.7 (10TH EDITION) OR PER STAMPED STRUCTURAL ENGINEER DRAWINGS. CONTRACTOR SHALL VERIFY CONTINUOUS LOAD PATH FROM HEADER TO FOUNDATION PRIOR TO FRAMING.", sheetPt: `AS VIGAS EM PAREDES DE CARGA DEVEM SER DIMENSIONADAS SEGUNDO 780 CMR TABELA R602.7. GARANTIR TRANSFERÊNCIA DIRETA DA CARGA PARA A FUNDAÇÃO.` },
  { id: 6, topic: "Ice & Water Shield", topicPt: "Cobertura Ice & Water", cat: "roof", cad: "ICE & WATER SHIELD: EAVE TO 24\" INSIDE EXT. WALL LINE. 780 CMR R905.1.2.", sheet: "ICE BARRIER MEMBRANE SHALL BE INSTALLED PER 780 CMR SECTION R905.1.2. SELF-ADHERING POLYMER-MODIFIED BITUMEN MEMBRANE SHALL EXTEND FROM EAVE EDGES TO A POINT NOT LESS THAN 24 INCHES INSIDE THE EXTERIOR WALL LINE OF THE BUILDING. REQUIRED ON ALL MASSACHUSETTS ROOFS.", sheetPt: `A MEMBRANA DEVE ESTENDER-SE DO BEIRAL ATÉ UM PONTO NÃO INFERIOR A 24 POLEGADAS PARA DENTRO DO ALINHAMENTO DA PAREDE EXTERNA. OBRIGATÓRIO EM MA.` },
  { id: 7, topic: "Shingle Weaving Tie-In", topicPt: `Amarração do Telhado Velho/Novo`, cat: "roof", cad: "ROOF TIE-IN: REMOVE SHINGLES 3FT BEYOND JOIN. WEAVE NEW WITH EXISTING COURSES.", sheet: "NEW ROOF TO EXISTING ROOF TIE-IN SHALL USE THE SHINGLE WEAVING METHOD. REMOVE EXISTING SHINGLES A MINIMUM OF 3 FEET BEYOND THE POINT OF INTERSECTION. INSTALL NEW ICE AND WATER SHIELD MEMBRANE OVER THE ENTIRE TRANSITION AREA. INTERLAY NEW ASPHALT SHINGLES WITH EXISTING COURSES IN AN ALTERNATING PATTERN.", sheetPt: `A TRANSIÇÃO NO TELHADO DEVE OCORRER POR MEIO DE ENTRELAÇAMENTO (WEAVING). REMOVER AS TELHAS ANTIGAS A 3 PÉS ALÉM DO ENCONTRO.` },
  { id: 8, topic: "Step & Counter Flashing", topicPt: `Rufos de Transição a Parede`, cat: "roof", cad: "INSTALL STEP & COUNTER-FLASHING AT ALL ROOF-TO-WALL JUNCTIONS. CUT SIDING 1\" ABOVE ROOF.", sheet: "ROOF-TO-WALL JUNCTIONS SHALL RECEIVE STEP FLASHING (L-SHAPED, ONE PIECE PER SHINGLE COURSE) AND COUNTER-FLASHING INSERTED INTO WALL SIDING OR MORTAR JOINT. EXISTING SIDING SHALL BE CUT BACK A MINIMUM OF 1 INCH FROM FINISHED ROOF SURFACE. FLASHING SHALL BE INSTALLED AGAINST RAW SHEATHING BEFORE SIDING IS APPLIED. NEVER INSTALL OVER EXISTING SIDING.", sheetPt: `ENCONTROS DO TELHADO COM PAREDE DEVEM RECEBER RUFO ESCALONADO E CONTRA-RUFO. O REVESTIMENTO DA PAREDE DEVE SER CORTADO 1" ACIMA DO NÍVEL DAS TELHAS.` },
  { id: 9, topic: "Attic Ventilation 1/300", topicPt: `Ventilação 1/300 do Sótão`, cat: "roof", cad: "ATTIC VENTILATION: MIN. 1/300 NET FREE AREA. 50% LOW (SOFFIT) / 50% HIGH (RIDGE). 780 CMR R806.", sheet: "ENCLOSED ATTIC SPACES SHALL BE CROSS-VENTILATED PER 780 CMR SECTION R806.1. NET FREE VENTILATING AREA SHALL BE A MINIMUM OF 1/300 OF THE ATTIC FLOOR AREA. PROVIDE NOT LESS THAN 50% OF REQUIRED VENTILATION AT THE UPPER PORTION (RIDGE) AND NOT LESS THAN 50% AT EAVE LEVEL (SOFFIT).", sheetPt: `O SÓTÃO DEVE TER ÁREA DE VENTILAÇÃO MÍNIMA DE 1/300 DA ÁREA DE PISO. NO MÍNIMO 50% DA ENTRADA PELA PARTE INFERIOR (SOFFIT) E 50% NO TOPO (CUMEEIRA).` },
  { id: 10, topic: "Wall Insulation R-20/R-13+5", topicPt: "Isolamento R-20 para Parede", cat: "thermal", cad: "EXT. WALL: R-20 CAVITY OR R-13+R-5 CI. IECC 2021 TABLE R402.1.3.", sheet: "EXTERIOR WALL ASSEMBLIES SHALL ACHIEVE MINIMUM R-20 (CAVITY) OR R-13 (CAVITY) PLUS R-5 CONTINUOUS INSULATION (CI) PER IECC 2021 TABLE R402.1.3 AND MASSACHUSETTS STRETCH ENERGY CODE FOR CLIMATE ZONE 5A.", sheetPt: `ASSEMBLÉIAS DE PAREDE EXTERNA DEVEM TER ISOLAMENTO MÍNIMO R-20 NA CAVIDADE, OU R-13 COM MAIS R-5 DE ISOLAMENTO CONTÍNUO (PLACA RÍGIDA).` },
  { id: 11, topic: "Attic Insulation R-60", topicPt: `Isolamento R-60 para Sótão`, cat: "thermal", cad: "ATTIC INSULATION: MIN. R-60 BLOWN-IN OR BATT. IECC 2021 TABLE R402.1.3.", sheet: "ROOF/CEILING ASSEMBLIES SHALL BE INSULATED TO A MINIMUM OF R-60 PER IECC 2021 TABLE R402.1.3 FOR CLIMATE ZONE 5A. NOTE: MA 780 CMR 10TH EDITION (EFFECTIVE OCTOBER 11, 2024) RAISED THE MINIMUM FROM R-49 TO R-60. CERTIFICATE OF OCCUPANCY WILL NOT BE ISSUED FOR ASSEMBLIES BELOW THIS VALUE.", sheetPt: `ISOLAMENTO DE SÓTÃO DEVE SER NO MÍNIMO R-60 (AUMENTADO DE R-49 A PARTIR DA 10A EDIÇÃO DO CÓDIGO MA). CERTIFICADOS DE OCUPAÇÃO SERÃO RECUSADOS ABAIXO DISSO.` },
  { id: 12, topic: "Vapor Retarder Class II", topicPt: "Barreira de Vapor Classe 2", cat: "thermal", cad: "PROVIDE CLASS II VAPOR RETARDER (KRAFT-FACED) ON WARM-IN-WINTER SIDE. 780 CMR R702.7.", sheet: "A CLASS II VAPOR RETARDER SHALL BE INSTALLED ON THE WARM-IN-WINTER SIDE OF ALL EXTERIOR WALL ASSEMBLIES IN ACCORDANCE WITH 780 CMR SECTION R702.7 AND IECC REQUIREMENTS FOR CLIMATE ZONE 5A. KRAFT-FACED BATTS OR APPROVED MEMBRANE ARE ACCEPTABLE.", sheetPt: `UM RETARDADOR DE VAPOR CLASSE II DEVE ESTAR NO LADO AQUECIDO DA PAREDE EXTERNA. MEMBRANAS APROVADAS OU REVESTIMENTO KRAFT NA MANTA SÃO ACEITOS.` },
  { id: 13, topic: "Plumbing Code — 248 CMR", topicPt: `248 CMR (Hidráulico de MA)`, cat: "mep", cad: "ALL PLUMBING: 248 CMR GOVERNS. IPC / IRC-P FOR COORDINATION ONLY.", sheet: "ALL PLUMBING AND GAS WORK SHALL COMPLY STRICTLY WITH THE MASSACHUSETTS STATE PLUMBING AND GAS CODE (248 CMR). THE INTERNATIONAL PLUMBING CODE (IPC) AND IRC PLUMBING PROVISIONS ARE REFERENCED FOR STRUCTURAL COORDINATION PURPOSES ONLY AND DO NOT GOVERN INSTALLATIONS IN THE COMMONWEALTH OF MASSACHUSETTS.", sheetPt: `TODO PROJETO HIDRÁULICO CUMPRE ESTRITAMENTE A NORMA ESTADUAL 248 CMR. O IPC SERVE APENAS COMO REFERÊNCIA DE COORDENAÇÃO.` },
  { id: 14, topic: "Freeze Protection", topicPt: `Prevenção Anticongelamento`, cat: "mep", cad: "FREEZE PROTECTION REQUIRED FOR ALL PIPING IN UNCONDITIONED SPACES / EXT. WALLS. 248 CMR.", sheet: "ALL WATER SUPPLY AND DRAINAGE PIPING LOCATED IN UNCONDITIONED SPACES OR WITHIN EXTERIOR WALL ASSEMBLIES SHALL BE PROTECTED FROM FREEZING IN ACCORDANCE WITH 248 CMR. ACCEPTABLE METHODS INCLUDE PIPE INSULATION (MIN. R-VALUE PER PIPE DIAMETER), HEAT TAPE WITH THERMOSTAT, OR RELOCATION TO CONDITIONED SPACE.", sheetPt: `TODAS AS TUBULAÇÕES EM ESPAÇOS NÃO AQUECIDOS OU PAREDES EXTERNAS DEVEM ESTAR PROTEGIDAS DO CONGELAMENTO SEGUNDO A 248 CMR.` },
  { id: 15, topic: "Electrical Panel Clearance", topicPt: "Livre Acesso do Quadro de Luz", cat: "mep", cad: `PANEL WORKING CLEARANCE: 36" DEEP × 30" WIDE × 6'-8" HIGH. NEC 2023 ART. 110.26.`, sheet: `WORKING SPACE IN FRONT OF ELECTRICAL PANEL SHALL COMPLY WITH NEC 2023 ARTICLE 110.26 AND 527 CMR 12.00. MINIMUM DEPTH: 36 INCHES. MINIMUM WIDTH: 30 INCHES OR WIDTH OF EQUIPMENT, WHICHEVER IS GREATER. MINIMUM HEIGHT: 6 FEET 8 INCHES. DEDICATED SPACE ABOVE PANEL TO STRUCTURAL CEILING REQUIRED.`, sheetPt: `ZONA FRONTAL E ACESSO AO QUADRO DE FORÇA EM CONFORMIDADE COM NEC 2023 110.26. ESPAÇO MÍNIMO DE 36X30 POLEGADAS POR 6 PÉS E 8 POLEGADAS DE ALTURA.` },
  { id: 16, topic: "Smoke & CO Alarms", topicPt: `Sinalizadores de Fumaça/CO`, cat: "fire", cad: "SMOKE/CO ALARMS: 780 CMR R314/R315 + NFPA 72. MAX 12 DETECTORS RESIDENTIAL.", sheet: `SMOKE ALARMS SHALL BE INSTALLED IN ALL SLEEPING ROOMS, OUTSIDE EACH SLEEPING AREA, AND ON EVERY LEVEL INCLUDING BASEMENT PER 780 CMR SECTIONS R314 AND R315. CARBON MONOXIDE ALARMS REQUIRED ON EACH LEVEL OUTSIDE SLEEPING AREAS. ALL DEVICES SHALL BE INTERCONNECTED PER NFPA 72. SYSTEMS EXCEEDING 12 SMOKE DETECTORS REQUIRE FIRE ALARM SYSTEM DESIGN BY LICENSED FIRE PROTECTION ENGINEER.`, sheetPt: `ALARMES SÃO EXIGIDOS NOS QUARTOS E NOS CORREDORES, ALÉM DE UM EM CADA PAVIMENTO DA CASA INCLUINDO SUB-SOLOS. MAIS DE 12 SISTEMAS NA CASA EXIGEM UM ENGENHEIRO DE INCÊNDIOS (FPE).` },
  { id: 17, topic: "Egress Window — Bedroom", topicPt: "Janela de Egress (Quarto)", cat: "fire", cad: "SLEEPING ROOM EGRESS: 5.7 SQ FT NET CLEAR. 24\"H × 20\"W MIN. SILL MAX 44\" AFF. R310.", sheet: "ALL SLEEPING ROOMS SHALL HAVE AT LEAST ONE EMERGENCY ESCAPE AND RESCUE OPENING IN ACCORDANCE WITH 780 CMR SECTION R310. NET CLEAR OPENING: MINIMUM 5.7 SQ FT (5.0 SQ FT AT GRADE). MINIMUM HEIGHT: 24 INCHES. MINIMUM WIDTH: 20 INCHES. MAXIMUM SILL HEIGHT: 44 INCHES ABOVE FINISH FLOOR.", sheetPt: `A JANELA DO DORMITÓRIO DEVE PROVER UMA ÁREA DE FUGA LIVRE DE 5.7 SQ FT (5.0 NO NÍVEL DO SOLO). PEITORIL NÃO EXCEDENDO 44 POLEGADAS ACIMA DO PISO PRONTO/ACABADO.` },
  { id: 18, topic: "Egress Window — Basement", topicPt: `Janela de Egress (Porão)`, cat: "fire", cad: "BASEMENT EGRESS: MIN. 5.0 SQ FT NET CLEAR (AT GRADE). SILL MAX 44\" AFF. R310.", sheet: "SLEEPING ROOMS IN FINISHED BASEMENTS SHALL HAVE EMERGENCY ESCAPE AND RESCUE OPENINGS PER 780 CMR SECTION R310. NET CLEAR OPENING AT GRADE OR BELOW: MINIMUM 5.0 SQ FT. MINIMUM HEIGHT: 24 INCHES. MINIMUM WIDTH: 20 INCHES. MAXIMUM SILL HEIGHT: 44 INCHES ABOVE FINISH FLOOR. WINDOW WELLS DEEPER THAN 44 INCHES REQUIRE A FIXED LADDER.", sheetPt: `PORÕES COM QUARTO ADAPTADO EXIGEM UMA JANELA DE FUGA LIVRE DE 5.0 SQ FT, PEITORIL ATÉ 44" ACIMA DO PISO, E UM POÇO SE FOR NECESSÁRIO. ESCADA MÍNIMA REQUERIDA.` },
  { id: 19, topic: "Garage Fire Separation", topicPt: `Resistência a Fogo (Garagem)`, cat: "fire", cad: "GARAGE SEPARATION: 5/8\" TYPE X GYP. BD. ON GARAGE SIDE + SELF-CLOSING FIRE DOOR. R302.6.", sheet: "SEPARATION BETWEEN GARAGE AND DWELLING SHALL COMPLY WITH 780 CMR SECTION R302.6. PROVIDE 5/8-INCH TYPE X GYPSUM BOARD ON THE GARAGE SIDE OF ALL SHARED WALLS AND CEILING. THE DOOR BETWEEN GARAGE AND DWELLING SHALL BE A MINIMUM 20-MINUTE FIRE-RATED DOOR WITH APPROVED SELF-CLOSING DEVICE.", sheetPt: `A FRONTEIRA ENTRE CASA E GARAGEM RECEBE PLACAS DE GESSO TYPE X DE 5/8" NA PAREDE DA GARAGEM PARA RESISTÊNCIA CONTRA INCÊNDIO. A PORTA EXIGE TAMBÉM RESISTÊNCIA E MOLA AUTO-FECHANTE.` }
];

const CAT_COLOR = { foundation: "blue", framing: "amber", roof: "blue", thermal: "green", mep: "amber", fire: "red" };
const CAT_LABEL = { foundation: "Foundation", framing: "Framing", roof: "Roof", thermal: "Thermal", mep: "MEP", fire: "Fire Safety" };
const CAT_LABEL_PT = { foundation: `Fundação`, framing: "Estrutura", roof: "Telhado", thermal: `Térmico`, mep: `Hidroelétrico`, fire: `Anti-Incêndio` };

export default function FieldGuide() {
  const { lang } = useAppContext();
  const { getCollection, seedCollection } = useBuilders();
  const [checkedItems, setCheckedItems] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [scanInput, setScanInput] = useState("");
  const [scanOutput, setScanOutput] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  // Seed context with default data on first mount
  useEffect(() => {
    seedCollection('fieldguideQuick', QUICK_NUMBERS);
    seedCollection('fieldguideRules', CRITICAL_RULES);
    // Flatten checklist sections into individual items for CRUD
    const flatChecklist = CHECKLIST_SECTIONS.flatMap(section =>
      section.items.map(item => ({ ...item, sectionTitle: section.title, sectionTitlePt: section.titlePt }))
    );
    seedCollection('fieldguideChecklist', flatChecklist);
    seedCollection('fieldguideCad', CAD_NOTES_DATA);
  }, [seedCollection]);

  // Read from context
  const quickNumbers = getCollection('fieldguideQuick');
  const criticalRules = getCollection('fieldguideRules');
  const checklistItems = getCollection('fieldguideChecklist');
  const cadNotes = getCollection('fieldguideCad');

  // Effective data with fallbacks
  const eQuick = quickNumbers.length > 0 ? quickNumbers : QUICK_NUMBERS;
  const eRules = criticalRules.length > 0 ? criticalRules : CRITICAL_RULES;
  const eCad = cadNotes.length > 0 ? cadNotes : CAD_NOTES_DATA;

  // Rebuild checklist sections from flat items
  const eChecklistSections = checklistItems.length > 0
    ? Object.values(checklistItems.reduce((acc, item) => {
        const key = item.sectionTitle || 'Uncategorized';
        if (!acc[key]) acc[key] = { title: key, titlePt: item.sectionTitlePt || key, items: [] };
        acc[key].items.push(item);
        return acc;
      }, {}))
    : CHECKLIST_SECTIONS;

  const totalChecks = 20;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  // Toggle checkbox state
  const handleToggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getVerifiedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const verifiedCount = getVerifiedCount();
  const progressPct = Math.round((verifiedCount / totalChecks) * 100);

  // Copy action
  const handleCopy = (id, topic, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      showToast(lang === "EN" ? `Copied: ${topic}` : `Copiado: ${topic}`);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // Real-time validation checker
  useEffect(() => {
    if (!scanInput.trim()) {
      setScanOutput([]);
      return;
    }

    const l = scanInput.toLowerCase();
    const results = [];

    if (/\b(9th edition|9th ed)\b/.test(l)) {
      results.push({
        cls: "err",
        msg: lang === "EN"
          ? `ERROR — 9th Edition reference: MA 780 CMR 10th Edition is mandatory effective October 11, 2024. Update references.`
          : `ERRO — Referência à 9ª Edição: O 780 CMR de MA 10ª Edição é obrigatório desde 11 out 2024.`
      });
    }

    if (/\bipc\b/.test(l) || l.includes("international plumbing code")) {
      results.push({
        cls: "err",
        msg: lang === "EN"
          ? "ERROR — IPC reference detected: Massachusetts does NOT adopt the International Plumbing Code. All plumbing must cite 248 CMR exclusively."
          : `ERRO — Referência ao IPC detectada: Massachusetts NÃO adota o IPC. Todo o encanamento deve citar exclusivamente a 248 CMR.`
      });
    }

    if ((l.includes("r-13") || l.includes("r13")) && !l.includes("r-5") && !l.includes("continuous") && !l.includes("r-20") && !l.includes("r20")) {
      results.push({
        cls: "err",
        msg: lang === "EN"
          ? "ERROR — R-13 cavity alone fails MA Climate Zone 5A. Specify either R-20 full cavity or R-13 cavity + R-5 continuous insulation."
          : `ERRO — Isolamento R-13 sozinho falha na Zona 5A de MA. Especifique R-20 na cavidade ou R-13 + R-5 contínuo.`
      });
    }

    if (l.includes("r-49") || l.includes("r49")) {
      results.push({
        cls: "err",
        msg: lang === "EN"
          ? "ERROR — R-49 is outdated. MA 780 CMR 10th Edition requires a minimum of R-60 for attic assemblies in Climate Zone 5A. CO will not be issued."
          : `ERRO — R-49 está obsoleto. A 10ª Edição do 780 CMR exige R-60 no sótão na Zona 5A. O Certificado de Ocupação será retido.`
      });
    }

    if ((l.includes("nail") || l.includes("toenail")) && l.includes("ledger")) {
      results.push({
        cls: "err",
        msg: lang === "EN"
          ? "ERROR — Ledger nailing: Nails are NOT permitted as primary ledger fasteners. Use lag screws per Table R507.9.1.3(1). Life-safety violation."
          : `ERRO — Pregagem de ledger: Pregos NÃO são permitidos. Use parafusos lag conforme Tabela R507.9.1.3(1). Risco à vida.`
      });
    }

    const sillM = scanInput.match(/sill[^0-9]*(\d+)/i);
    if (sillM && parseInt(sillM[1]) > 44) {
      results.push({
        cls: "err",
        msg: lang === "EN"
          ? `ERROR — Sill height ${sillM[1]}" exceeds 44-inch maximum from FINISH floor per 780 CMR R310.`
          : `ERRO — Altura de peitoril de ${sillM[1]}" excede o máximo de 44 polegadas do piso acabado conforme 780 CMR R310.`
      });
    }

    const smokeN = scanInput.match(/(\d{2,})\s*smoke/gi);
    if (smokeN) {
      smokeN.forEach(m => {
        const n = parseInt(m);
        if (n > 12) {
          results.push({
            cls: "err",
            msg: lang === "EN"
              ? `⚠ NFPA 72 ALERT — ${n} smoke detectors exceeds 12-detector residential limit under MA Fire Code. Triggers Fire Alarm System and FPE stamp.`
              : `⚠ ALERTA NFPA 72 — ${n} detectores excede o limite residencial de 12. Exige engenheiro de incêndio credenciado.`
          });
        }
      });
    }

    if (results.length === 0) {
      results.push({
        cls: "ok",
        msg: lang === "EN"
          ? `✓ No compliance issues detected. Note appears consistent with MA 780 CMR 10th Ed, 248 CMR, NEC 2023, and NFPA 72.`
          : `✓ Nenhum problema de conformidade detectado. A nota é consistente com o 780 CMR 10ª Ed, 248 CMR, NEC 2023 e NFPA 72.`
      });
    }

    setScanOutput(results);
  }, [scanInput, lang]);

  return (
    <PageTransition variant="default">
    <div className="lp-root">
      {/* Brilho radial roxo suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>
      <Navbar />

      <main className="independent-page">
        <header className="page-header-premium animate-float-up">
          <div className="badge" style={{ marginBottom: '16px' }}>
            <span className="badge-icon">☆</span>
            <span className="badge-text">
              {lang === "EN" ? "MASSACHUSETTS STATE BUILDING CODE REFERENCE" : `REFERÊNCIA DO CÓDIGO DE OBRAS DE MASSACHUSETTS`}
            </span>
          </div>
          <h1 className="page-main-title">
            {lang === "EN" ? (
              <>
                <span className="title-white">Don`t Get Rejected on</span> <span className="title-gradient-italic">Your Next MA Inspection</span>
              </>
            ) : (
              <>
                <span className="title-white">Evite Reprovações na</span> <span className="title-gradient-italic">Próxima Inspeção de MA</span>
              </>
            )}
          </h1>
          <p className="page-subtitle-standard">
            {lang === "EN"
              ? "Comprehensive field reference manual for builders, framers and general contractors working under the MA 780 CMR 10th Edition. Complete checklist to keep projects compliant."
              : "Manual abrangente de referência de campo para construtores, carpintaria e empreiteiros gerais sob a 10ª Edição do 780 CMR. Checklist completo para manter seu projeto aprovado."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
            {["780 CMR 10th Ed", "248 CMR Plumbing", "NEC 2023", "NFPA 72", "IECC 2021", "Effective Oct 11, 2024"].map((tag, idx) => (
              <span 
                key={tag} 
                style={{ 
                  background: idx === 5 ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", 
                  border: idx === 5 ? "1px solid rgba(34,197,94,0.2)" : "1px solid var(--glass-border)", 
                  color: idx === 5 ? "var(--gn)" : "inherit", 
                  borderRadius: "999px", 
                  padding: "4px 12px", 
                  fontSize: "11px", 
                  fontFamily: "monospace",
                  fontWeight: "600"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "80px", maxWidth: "1300px", margin: "0 auto", width: "100%", padding: "0 24px", boxSizing: "border-box", marginBottom: "80px" }} className="animate-float-up">

        {/* Quick Numbers Metrics Grid */}
        <section>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 4px" }}>
              {lang === "EN" ? "Quick Reference Metrics" : "Métricas Rápidas de Referência"}
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.6, margin: 0 }}>
              {lang === "EN" ? "Critical values and dimensions checked at every physical inspection." : "Dimensões e valores críticos verificados rigidamente em toda fiscalização."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {eQuick.map(num => (
              <div 
                key={num.id} 
                className="glass-premium" 
                style={{ 
                  borderRadius: "14px", 
                  padding: "20px", 
                  border: "1px solid var(--glass-border)", 
                  background: "var(--glass-bg)",
                  borderLeft: num.type === "red" ? "4px solid #ef4444" : (num.type === "amber" ? "4px solid #f59e0b" : "4px solid #3b82f6") 
                }}
              >
                <div style={{ fontSize: "9.5px", fontWeight: "700", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{lang === "EN" ? num.label : num.labelPt}</div>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "800", 
                  color: num.type === "red" ? "#f87171" : (num.type === "amber" ? "#fbbf24" : "#60a5fa"), 
                  fontFamily: "monospace", 
                  margin: "8px 0 4px" 
                }}>
                  {lang === "EN" ? num.val : num.valPt}
                </div>
                <div style={{ fontSize: "11.5px", opacity: 0.7, lineHeight: "1.5" }}>{lang === "EN" ? num.desc : num.descPt}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Critical Rules Section */}
        <section>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 4px" }}>
              {lang === "EN" ? "Critical Inspection Rules" : "Regras Críticas da Inspeção"}
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.6, margin: 0 }}>
              {lang === "EN" ? "Avoid the most common reasons for failed framing, electrical and plumbing layouts." : "Evite as falhas mais comuns de estrutura, elétrica e encanamento."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
            {eRules.map(rule => (
              <div 
                key={rule.id} 
                className="glass-premium" 
                style={{ 
                  borderRadius: "16px", 
                  padding: "24px", 
                  border: "1px solid var(--glass-border)", 
                  background: "var(--glass-bg)",
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "14px" 
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "20px" }}>{rule.icon}</div>
                  <span style={{ 
                    fontSize: "9px", 
                    fontWeight: "800", 
                    padding: "3px 8px", 
                    borderRadius: "20px", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.06em",
                    background: rule.type === "red" ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)",
                    color: rule.type === "red" ? "#f87171" : "#fbbf24",
                    border: rule.type === "red" ? "1px solid rgba(239,68,68,0.18)" : "1px solid rgba(245,158,11,0.18)"
                  }}>
                    {lang === "EN" ? rule.badge : rule.badgePt}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <h4 style={{ fontSize: "13.5px", fontWeight: "700", margin: 0 }}>{lang === "EN" ? rule.title : rule.titlePt}</h4>
                  <p style={{ fontSize: "12px", opacity: 0.75, lineHeight: "1.6", margin: 0 }}>{lang === "EN" ? rule.desc : rule.descPt}</p>
                </div>

                <div style={{ 
                  background: "rgba(0,0,0,0.15)", 
                  color: "#60a5fa", 
                  border: "1px solid rgba(96,165,250,0.1)", 
                  borderRadius: "8px", 
                  padding: "10px 12px", 
                  fontFamily: "monospace", 
                  fontSize: "10px", 
                  lineHeight: "1.6",
                  textTransform: "uppercase",
                  wordBreak: "break-word"
                }}>
                  {lang === "EN" ? rule.code : rule.codePt}
                </div>

                <div style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "8px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "8.5px", fontWeight: "800", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                    ⚠ {lang === "EN" ? "Field Warning" : "Alerta de Campo"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#fca5a5", lineHeight: "1.5" }}>
                    {lang === "EN" ? rule.tip : rule.tipPt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 20-Point Interactive Checklist Section */}
        <section className="glass-premium" style={{ borderRadius: "20px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>
                  {lang === "EN" ? "MA 780 CMR Pre-Inspection Field Checklist" : "Checklist de Inspeção do 780 CMR de MA"}
                </h3>
                <span style={{ fontSize: "11px", color: "var(--mu)" }}>
                  {lang === "EN" ? "Review checklist off completely before inspector arrives" : "Verifique todos os itens antes da chegada da fiscalização"}
                </span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-color)", fontFamily: "monospace" }}>
                {verifiedCount} / {totalChecks}
              </span>
              <div style={{ fontSize: "9px", color: "var(--gn)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>
                {lang === "EN" ? "VERIFIED COMPLIANT" : "CONFORMIDADE VERIFICADA"}
              </div>
            </div>
          </div>

          {/* Progress Bar Row */}
          <div style={{ padding: "12px 24px", background: "rgba(0,0,0,0.15)", borderBottom: "1px solid var(--glass-border)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--gn)", borderRadius: "3px", transition: "width 0.4s ease" }}></div>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "700", fontFamily: "monospace", color: "var(--mu)", whiteSpace: "nowrap" }}>
              {progressPct}% {lang === "EN" ? "Done" : "Concluído"}
            </span>
          </div>

          {/* Checklist Sections */}
          <div>
            {eChecklistSections.map((sec, sidx) => (
              <div key={sidx} style={{ borderBottom: sidx === eChecklistSections.length - 1 ? "none" : "1px solid var(--glass-border)" }}>
                <div style={{ 
                  background: "rgba(255,255,255,0.01)", 
                  padding: "10px 24px", 
                  fontSize: "10px", 
                  fontWeight: "800", 
                  color: "var(--color-neon-purple)", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.12em",
                  borderBottom: "1px solid var(--glass-border)"
                }}>
                  {lang === "EN" ? sec.title : sec.titlePt}
                </div>

                {sec.items.map(item => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => handleToggleCheck(item.id)}
                      style={{ 
                        display: "flex", 
                        alignItems: "flex-start", 
                        gap: "14px", 
                        padding: "16px 24px", 
                        borderBottom: "1px solid rgba(255,255,255,0.04)", 
                        cursor: "pointer",
                        background: isChecked ? "rgba(34,197,94,0.02)" : "transparent",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {/* Custom Checkbox */}
                      <div style={{ 
                        width: "18px", 
                        height: "18px", 
                        border: isChecked ? "2px solid var(--gn)" : "2px solid var(--glass-border)", 
                        background: isChecked ? "var(--gn)" : "transparent", 
                        borderRadius: "4px", 
                        flexShrink: 0,
                        marginTop: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease"
                      }}>
                        {isChecked && <span style={{ color: "#fff", fontSize: "10px", fontWeight: "800" }}>✓</span>}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: "13px", 
                          fontWeight: "600", 
                          color: isChecked ? "var(--mu)" : "var(--text-color)",
                          textDecoration: isChecked ? "line-through" : "none"
                        }}>
                          {lang === "EN" ? item.title : item.titlePt}
                        </div>
                        <p style={{ fontSize: "11px", color: "var(--mu)", lineHeight: "1.5", margin: "4px 0 0" }}>
                          {lang === "EN" ? item.detail : item.detailPt}
                        </p>
                        
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                          <span style={{ 
                            fontSize: "9px", 
                            fontFamily: "monospace", 
                            background: "rgba(255,255,255,0.03)", 
                            border: "1px solid var(--glass-border)", 
                            color: "#60a5fa", 
                            padding: "1px 6px", 
                            borderRadius: "4px" 
                          }}>
                            {item.code}
                          </span>
                          
                          {(item.fail || item.failPt) && (
                            <span style={{ 
                              fontSize: "9px", 
                              fontFamily: "monospace", 
                              background: "rgba(239,68,68,0.05)", 
                              border: "1px solid rgba(239,68,68,0.15)", 
                              color: "#f87171", 
                              padding: "1px 6px", 
                              borderRadius: "4px",
                              fontWeight: "700"
                            }}>
                              {lang === "EN" ? item.fail : (item.failPt || item.fail)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Copy-Paste CAD Notes Table */}
        <section className="glass-premium" style={{ borderRadius: "20px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", overflow: "hidden" }}>
          <div style={{ padding: "24px", borderBottom: "1px solid var(--glass-border)" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 4px" }}>
              {lang === "EN" ? "Ready-to-Use CAD Sheet Notes" : "Notas Prontas para Prancha CAD"}
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.6, margin: 0 }}>
              {lang === "EN" ? "Pre-written specifications citing correct codes. Click `Copy` to copy layout notes directly." : "Especificações pré-escritas citando os códigos corretos. Clique em `Copy` para copiar."}
            </p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.15)", borderBottom: "1px solid var(--glass-border)" }}>
                  <th style={{ padding: "12px 20px", fontSize: "9.5px", fontWeight: "800", textTransform: "uppercase", color: "var(--mu)" }}>{lang === "EN" ? "Topic" : "Tópico"}</th>
                  <th style={{ padding: "12px 20px", fontSize: "9.5px", fontWeight: "800", textTransform: "uppercase", color: "var(--mu)" }}>{lang === "EN" ? "Category" : "Categoria"}</th>
                  <th style={{ padding: "12px 20px", fontSize: "9.5px", fontWeight: "800", textTransform: "uppercase", color: "var(--mu)" }}>{lang === "EN" ? "Quick CAD Note" : "Nota CAD"}</th>
                  <th style={{ padding: "12px 20px", fontSize: "9.5px", fontWeight: "800", textTransform: "uppercase", color: "var(--mu)", textAlign: "right" }}>{lang === "EN" ? "Action" : "Ação"}</th>
                </tr>
              </thead>
              <tbody>
                {eCad.map(note => {
                  const isCopied = copiedId === note.id;
                  const tagColor = CAT_COLOR[note.cat] || "blue";
                  return (
                    <tr key={note.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="table-row-hover">
                      <td style={{ padding: "14px 20px", fontWeight: "600" }}>{lang === "EN" ? note.topic : note.topicPt}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ 
                          fontSize: "8.5px", 
                          fontWeight: "800", 
                          padding: "2px 8px", 
                          borderRadius: "4px", 
                          textTransform: "uppercase",
                          background: tagColor === "red" ? "rgba(239,68,68,0.06)" : (tagColor === "amber" ? "rgba(245,158,11,0.06)" : "rgba(59,130,246,0.06)"),
                          color: tagColor === "red" ? "#f87171" : (tagColor === "amber" ? "#fbbf24" : "#60a5fa"),
                          border: tagColor === "red" ? "1px solid rgba(239,68,68,0.15)" : (tagColor === "amber" ? "1px solid rgba(245,158,11,0.15)" : "1px solid rgba(59,130,246,0.15)")
                        }}>
                          {lang === "EN" ? (CAT_LABEL[note.cat] || note.cat) : (CAT_LABEL_PT[note.cat] || note.cat)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: "10.5px", color: "#60a5fa", textTransform: "uppercase" }}>
                        {lang === "EN" ? note.cad : (note.cadPt || note.cad)}
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <button 
                          onClick={() => handleCopy(note.id, lang === "EN" ? note.topic : note.topicPt, lang === "EN" ? note.sheet : note.sheetPt)}
                          style={{ 
                            background: isCopied ? "var(--gn)" : "rgba(255,255,255,0.03)", 
                            border: "1px solid var(--glass-border)", 
                            color: isCopied ? "#fff" : "inherit", 
                            padding: "4px 12px", 
                            borderRadius: "999px", 
                            fontSize: "11px", 
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          {isCopied ? (lang === "EN" ? "✓ Copied" : "✓ Copiado") : (
                            <>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              {lang === "EN" ? "Copy Sheet Note" : "Copiar Nota"}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real-time Validation Compliance Scanner */}
        <section className="glass-premium" style={{ borderRadius: "20px", padding: "24px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>
              {lang === "EN" ? "Real-Time Compliance Validation Scanner" : "Scanner de Validação de Conformidade em Tempo Real"}
            </h3>
          </div>
          <p style={{ fontSize: "11px", color: "var(--mu)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
            {lang === "EN" ? "Automatic compliance vetting · 780 CMR 10th Ed · 248 CMR · NEC 2023 · NFPA 72" : "Verificação de conformidade automática · 780 CMR 10ª Ed · 248 CMR · NEC 2023 · NFPA 72"}
          </p>

          <textarea 
            placeholder={lang === "EN" 
              ? "Paste any note or specification here to check for Massachusetts code violations...\nTry typing: `All plumbing per IPC Section 305' or 'Sill height at 48 inches above finish floor'..." 
              : "Cole qualquer nota ou especificação para verificar erros de código...\nTente digitar: 'All plumbing per IPC Section 305' ou 'Sill height at 48 inches above finish floor'..."}
            value={scanInput}
            onChange={e => setScanInput(e.target.value)}
            style={{ 
              width: "100%", 
              background: "rgba(0,0,0,0.2)", 
              border: "1px solid var(--glass-border)", 
              borderRadius: "10px", 
              padding: "14px", 
              fontSize: "12px", 
              fontFamily: "monospace", 
              color: "inherit", 
              outline: "none", 
              height: "100px", 
              resize: "vertical", 
              lineHeight: "1.6" 
            }} 
          />

          {scanOutput.map((out, idx) => (
            <div 
              key={idx} 
              style={{ 
                marginTop: "12px", 
                padding: "12px 16px", 
                borderRadius: "8px", 
                fontSize: "12.5px", 
                fontWeight: "600", 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "10px", 
                lineHeight: "1.5",
                background: out.cls === "err" ? "rgba(239,68,68,0.06)" : (out.cls === "wrn" ? "rgba(245,158,11,0.06)" : "rgba(34,197,94,0.06)"),
                border: out.cls === "err" ? "1px solid rgba(239,68,68,0.18)" : (out.cls === "wrn" ? "1px solid rgba(245,158,11,0.18)" : "1px solid rgba(34,197,94,0.18)"),
                color: out.cls === "err" ? "#f87171" : (out.cls === "wrn" ? "#fbbf24" : "#4ade80")
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "-2px" }}>
                {out.cls === "err" ? "🚫" : (out.cls === "wrn" ? "⚠" : "✓")}
              </span>
              <span>{out.msg}</span>
            </div>
          ))}
        </section>

        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="glass-premium" style={{ 
          position: "fixed", 
          bottom: "32px", 
          right: "32px", 
          background: "rgba(10, 10, 15, 0.9)", 
          border: "1px solid var(--color-neon-purple)", 
          color: "#fff", 
          padding: "12px 20px", 
          borderRadius: "12px", 
          fontSize: "13px", 
          fontWeight: "700",
          zIndex: 9999,
          boxShadow: "0 10px 30px rgba(123, 31, 162, 0.2)"
        }}>
          {toastMsg}
        </div>
      )}
      <Footer />
    </div>
    </PageTransition>
  );
}
