import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

/* ═══ CONSTANTS ═══ */
const STEPS_EN = ["Location", "About You", "Project", "Scope", "Program", "Files", "Rush", "Review"];
const STEPS_PT = ["Localização", "Sobre Você", "Projeto", "Escopo", "Programa", "Arquivos", "Urgência", "Revisão"];

const TRANSLATIONS = {
  EN: {
    backToSite: "← Back to Site",
    step: "Step",
    of: "of",
    back: "← Back",
    continue: "Continue →",
    submit: "Submit Request & Access Portal →",
    whereProject: "Where is your project located?",
    locationSub: "This helps us apply the right codes, rates, and regulations.",
    streetAddress: "Street Address",
    city: "City",
    state: "State",
    zipCode: "ZIP Code",
    confirmLocation: "Confirm Location ✓",
    locationConfirmed: "✓ Location confirmed",
    verifyLocation: "Verify your project is correctly pinned, then confirm.",
    tellAboutYou: "Tell us about you.",
    aboutYouSub: "We'll use this to personalize your estimate and reach out.",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    whoAreYou: "Who are you?",
    companyInfo: "Company Information",
    bizName: "Business Name",
    website: "Website",
    bizAddress: "Business Address",
    bizCity: "City",
    bizState: "State",
    bizZip: "ZIP Code",
    bizEmail: "Business Email",
    bizPhone: "Business Phone",
    tellAboutProject: "Tell us about the project.",
    projectSub: "Don't worry about exactness — a rough estimate works here.",
    propType: "Property Type",
    dimensions: "Project Dimensions",
    width: "Width",
    length: "Length",
    levels: "Levels / Floors",
    deliveryPackage: "Select Your Delivery Package",
    packageSub: "Choose the scope that best fits your needs.",
    programReqs: "Program Requirements",
    programSub: "How many of each space do you need? Start at 0 and add as needed.",
    specialReqs: "Special Requirements (Optional)",
    specialReqsPlaceholder: "Describe any special requirements, accessibility needs, or notes for the design team…",
    uploadFiles: "Upload Reference Files",
    uploadSub: "Upload by category — up to 100MB per file.",
    dragDrop: "Drag & drop or click to upload",
    deliverySpeed: "Select Delivery Speed",
    speedSub: "Need it faster? Choose a delivery option below.",
    reviewEstimate: "Review Your Estimate",
    reviewSub: "Please verify all details before submitting.",
    estimatedFee: "Estimated Design Fee",
    yourProject: "Your Project",
    summary: "Summary",
    confidence: "Estimate Confidence",
    approxEstimate: "*Approximate estimate. Final pricing confirmed upon project review.",
    enterDims: "Enter dimensions and select project type to see your estimate.",
    detected: "Detected",
    customArea: "Custom Area",
    totalArea: "Total Area",
    selectLevels: "Select levels below",
    groundFloor: "Ground Floor",
    secondFloor: "2nd Floor",
    basement: "Basement",
    attic: "Attic",
    standardDelivery: "Standard Delivery",
    rushDelivery: "Rush Delivery",
    expressDelivery: "Express Delivery",
    standardTimeline: "Standard turnaround time",
    rushTimeline: "Priority scheduling",
    expressTimeline: "Fastest possible turnaround",
    includedFree: "Included — FREE",
    idealFor: "Ideal for:",
    moreDetails: "More details",
    whatYouReceive: "What you receive",
    roomLabels: {
      bedrooms: "Bedrooms", bathrooms: "Bathrooms", halfBaths: "Half Baths",
      livingRooms: "Living Room", diningRoom: "Dining Room", familyRoom: "Family Room",
      kitchen: "Kitchen", pantry: "Pantry", laundry: "Laundry",
      closet: "Walk-in Closet", mudroom: "Mudroom", storage: "Storage / Deposit",
      office: "Home Office", gym: "Gym", studio: "Studio / Hobby Room",
      deck: "Covered Deck", porch: "Screened Porch", outdoorKit: "Outdoor Kitchen",
      fireplace: "Fireplace", wineCellar: "Wine Cellar", theater: "Home Theater",
      garageBays: "Garage Bays", mechanical: "Mechanical Room", elevator: "Elevator"
    },
    groupLabels: {
      core: "Core Rooms",
      service: "Kitchen & Service",
      work: "Work & Wellness",
      leisure: "Entertainment & Outdoor",
      tech: "Utilities & Tech"
    }
  },
  PT: {
    backToSite: "← Voltar ao Site",
    step: "Etapa",
    of: "de",
    back: "← Voltar",
    continue: "Continuar →",
    submit: "Enviar Solicitação e Acessar Portal →",
    whereProject: "Onde seu projeto está localizado?",
    locationSub: "Isso nos ajuda a aplicar os códigos, taxas e regulamentos corretos.",
    streetAddress: "Endereço",
    city: "Cidade",
    state: "Estado",
    zipCode: "CEP",
    confirmLocation: "Confirmar Localização ✓",
    locationConfirmed: "✓ Localização confirmada",
    verifyLocation: "Verifique se o seu projeto está fixado corretamente e confirme.",
    tellAboutYou: "Conte-nos sobre você.",
    aboutYouSub: "Usaremos isso para personalizar sua estimativa e entrar em contato.",
    fullName: "Nome Completo",
    email: "E-mail",
    phone: "Telefone",
    whoAreYou: "Quem é você?",
    companyInfo: "Informações da Empresa",
    bizName: "Nome da Empresa",
    website: "Website",
    bizAddress: "Endereço Comercial",
    bizCity: "Cidade",
    bizState: "Estado",
    bizZip: "CEP",
    bizEmail: "E-mail Comercial",
    bizPhone: "Telefone Comercial",
    tellAboutProject: "Conte-nos sobre o projeto.",
    projectSub: "Não se preocupe com a precisão exata — uma estimativa aproximada funciona aqui.",
    propType: "Tipo de Propriedade",
    dimensions: "Dimensões do Projeto",
    width: "Largura",
    length: "Comprimento",
    levels: "Níveis / Andares",
    deliveryPackage: "Selecione seu Pacote de Entrega",
    packageSub: "Escolha o escopo que melhor se adapta às suas necessidades.",
    programReqs: "Requisitos do Programa",
    programSub: "Quantos de cada espaço você precisa? Comece em 0 e adicione conforme necessário.",
    specialReqs: "Requisitos Especiais (Opcional)",
    specialReqsPlaceholder: "Descreva quaisquer requisitos especiais, necessidades de acessibilidade ou notas para a equipe de design…",
    uploadFiles: "Carregar Arquivos de Referência",
    uploadSub: "Carregar por categoria — até 100MB por arquivo.",
    dragDrop: "Arraste e solte ou clique para carregar",
    deliverySpeed: "Selecione a Velocidade de Entrega",
    speedSub: "Precisa mais rápido? Escolha uma opção de entrega abaixo.",
    reviewEstimate: "Revise sua Estimativa",
    reviewSub: "Verifique todos os detalhes antes de enviar.",
    estimatedFee: "Taxa de Design Estimada",
    yourProject: "Seu Projeto",
    summary: "Resumo",
    confidence: "Confiança da Estimativa",
    approxEstimate: "*Estimativa aproximada. Preço final confirmado após revisão do projeto.",
    enterDims: "Insira as dimensões e selecione o tipo de projeto para ver sua estimativa.",
    detected: "Detectado",
    customArea: "Área Personalizada",
    totalArea: "Área Total",
    selectLevels: "Selecione os níveis abaixo",
    groundFloor: "Térreo",
    secondFloor: "2º Pavimento",
    basement: "Subsolo",
    attic: "Sótão",
    standardDelivery: "Entrega Padrão",
    rushDelivery: "Entrega Prioritária",
    expressDelivery: "Entrega Expressa",
    standardTimeline: "Tempo de resposta padrão",
    rushTimeline: "Agendamento prioritário",
    expressTimeline: "Resposta mais rápida possível",
    includedFree: "Incluso — GRÁTIS",
    idealFor: "Ideal para:",
    moreDetails: "Mais detalhes",
    whatYouReceive: "O que você recebe",
    roomLabels: {
      bedrooms: "Quartos", bathrooms: "Banheiros", halfBaths: "Lavabos",
      livingRooms: "Sala de Estar", diningRoom: "Sala de Jantar", familyRoom: "Sala de TV",
      kitchen: "Cozinha", pantry: "Despensa", laundry: "Lavanderia",
      closet: "Closet", mudroom: "Mudroom", storage: "Depósito / Estocagem",
      office: "Escritório", gym: "Academia", studio: "Ateliê / Hobby",
      deck: "Deck Coberto", porch: "Varanda com Tela", outdoorKit: "Cozinha Externa",
      fireplace: "Lareira", wineCellar: "Adega", theater: "Home Theater",
      garageBays: "Vagas de Garagem", mechanical: "Sala de Máquinas", elevator: "Elevador"
    },
    groupLabels: {
      core: "Cômodos Principais",
      service: "Cozinha e Serviço",
      work: "Trabalho e Bem-Estar",
      leisure: "Lazer e Externo",
      tech: "Utilidades e Técnica"
    }
  }
};

function Autocomplete({ label, placeholder, value, options, onChange, error, onBlur }) {
  const [open, setOpen] = useState(false);
  const [filt, setFilt] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onInpChange = (e) => {
    const v = e.target.value;
    onChange(v);
    if (v.length > 0) {
      const f = options.filter(o => o.toLowerCase().includes(v.toLowerCase())).slice(0, 8);
      setFilt(f);
      setOpen(f.length > 0);
    } else {
      setOpen(false);
    }
  };

  const onSel = (o) => {
    onChange(o);
    setOpen(false);
  };

  return (
    <div className="wz-f" ref={wrapRef} style={{ position: "relative" }}>
      <label className="wz-label">{label} <span style={{ color: "var(--rd)" }}>*</span></label>
      <input
        className={`wz-inp ${error ? "inp-err" : ""}`}
        placeholder={placeholder}
        value={value || ""}
        onChange={onInpChange}
        onBlur={onBlur}
        onFocus={() => { if (value && value.length > 0) setOpen(true); }}
      />
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "6px", marginTop: 4, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", maxHeight: 200, overflowY: "auto" }}>
          {filt.map((o, i) => (
            <div key={i} onClick={() => onSel(o)} style={{ padding: "10px 12px", cursor: "pointer", fontSize: 13, borderBottom: i < filt.length - 1 ? "1px solid var(--border)" : "none" }} onMouseEnter={e => e.target.style.background = "var(--bg3)"} onMouseLeave={e => e.target.style.background = "transparent"}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const BR_STATES = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", 
  "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", 
  "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

const COMMON_CITIES = {
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Long Beach", "Omaha", "Raleigh", "Colorado Springs", "Miami", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "New Orleans", "Wichita"],
  BR: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Natal", "Campo Grande", "Teresina", "São Bernardo do Campo", "Nova Iguaçu", "João Pessoa", "Santo André", "São José dos Campos", "Jaboatão dos Guararapes", "Ribeirão Preto", "Uberlândia", "Contagem", "Sorocaba", "Aracaju", "Feira de Santana", "Cuiabá", "Joinville", "Juiz de Fora", "Londrina", "Aparecida de Goiânia", "Ananindeua", "Porto Velho", "Serra", "Niterói", "Belford Roxo", "Caxias do Sul", "Campos dos Goytacazes", "Macapá", "Florianópolis", "Vila Velha", "Mauá", "São João de Meriti"]
};

const ROLES_EN = { homeowner: "Homeowner", builder: "Builder", architect: "Architect", developer: "Developer", investor: "Investor", agent: "Real Estate Agent" };
const ROLES_PT = { homeowner: "Proprietário", builder: "Construtor", architect: "Arquiteto", developer: "Incorporador", investor: "Investidor", agent: "Corretor" };

const ROLES = [
  { id: "homeowner", icon: "🏠" },
  { id: "builder", icon: "🔨" },
  { id: "architect", icon: "📐" },
  { id: "developer", icon: "🏗️" },
  { id: "investor", icon: "💼" },
  { id: "agent", icon: "🤝" },
];

const ROOM_GROUPS = [
  {
    label: "Core Rooms", items: [
      { id: "bedrooms", label: "Bedrooms" },
      { id: "bathrooms", label: "Bathrooms" },
      { id: "halfBaths", label: "Half Baths" },
      { id: "livingRooms", label: "Living Room" },
      { id: "diningRoom", label: "Dining Room" },
      { id: "familyRoom", label: "Family Room" },
    ]
  },
  {
    label: "Kitchen & Service", items: [
      { id: "kitchen", label: "Kitchen" },
      { id: "pantry", label: "Pantry" },
      { id: "laundry", label: "Laundry" },
      { id: "closet", label: "Walk-in Closet" },
      { id: "mudroom", label: "Mudroom" },
      { id: "storage", label: "Storage / Deposit" },
    ]
  },
  {
    label: "Work & Wellness", items: [
      { id: "office", label: "Home Office" },
      { id: "gym", label: "Gym" },
      { id: "studio", label: "Studio / Hobby Room" },
    ]
  },
  {
    label: "Entertainment & Outdoor", items: [
      { id: "deck", label: "Covered Deck" },
      { id: "porch", label: "Screened Porch" },
      { id: "outdoorKit", label: "Outdoor Kitchen" },
      { id: "fireplace", label: "Fireplace" },
      { id: "wineCellar", label: "Wine Cellar" },
      { id: "theater", label: "Home Theater" },
    ]
  },
  {
    label: "Utilities & Tech", items: [
      { id: "garageBays", label: "Garage Bays" },
      { id: "mechanical", label: "Mechanical Room" },
      { id: "elevator", label: "Elevator" },
    ]
  },
];

const ROOM_DEF = {
  bedrooms: 0, bathrooms: 0, halfBaths: 0, livingRooms: 0, diningRoom: 0, familyRoom: 0,
  kitchen: 0, pantry: 0, laundry: 0, closet: 0, mudroom: 0, storage: 0,
  office: 0, gym: 0, studio: 0, deck: 0, porch: 0, outdoorKit: 0,
  fireplace: 0, wineCellar: 0, theater: 0, garageBays: 0, mechanical: 0, elevator: 0
};

/* ═══ PRICING ENGINE ═══ */
function parseDim(val, isUS) {
  if (!val || typeof val !== "string" || !val.trim()) return 0;
  const s = val.trim();
  
  // feet'inches" → e.g. 10'6" or 10'-6"
  const m1 = s.match(/^(\d+)['’]\s*-?\s*(\d+(?:\.\d+)?)(?:\s*(\d+)\/(\d+))?["”]?$/);
  if (m1) {
    const ft = parseInt(m1[1], 10);
    let inch = parseFloat(m1[2] || 0);
    if (m1[3] && m1[4]) inch += parseInt(m1[3], 10) / parseInt(m1[4], 10);
    return ft * 12 + inch;
  }
  
  // e.g. 10'6 (no quote)
  const m2 = s.match(/^(\d+)['’]\s*(\d+(?:\.\d+)?)?$/);
  if (m2) return parseInt(m2[1], 10) * 12 + parseFloat(m2[2] || 0);
  
  // fraction only: 1/2
  const m3 = s.match(/^(\d+)\/(\d+)$/);
  if (m3) return parseInt(m3[1], 10) / parseInt(m3[2], 10);
  
  // number + fraction: 15 1/2
  const m4 = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m4) return parseInt(m4[1], 10) + parseInt(m4[2], 10) / parseInt(m4[3], 10);
  
  // plain decimal or integer
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function fmtInches(totalInches) {
  if (!totalInches || totalInches <= 0) return null;
  const ft = Math.floor(totalInches / 12);
  const inch = Math.round((totalInches - ft * 12) * 100) / 100;
  return `${ft}'-${inch}"`;
}

function calcEst(d, lang = "EN") {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const BRL = 9.5;
  const RATES = { ground: 1.65, second: 1.35, basement: 0.80, attic: 0.80 };
  const sym = isUS ? "$" : "R$";
  const fmt = (n) => sym + Math.round(n).toLocaleString(isUS ? "en-US" : "pt-BR");
  const fmtEx = (n) => sym + n.toLocaleString(isUS ? "en-US" : "pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const SVC_LABELS = lang === "EN" ? {
    new_construction: "New Construction", addition: "Addition", second_story: "Second Story",
    garage_only: "Garage", garage_conversion: "Garage Conversion", basement_finishing: "Basement Finishing",
    deck_covered: "Covered Deck", deck_open: "Open Deck", porch_covered: "Covered Porch", porch_open: "Open Porch",
    renovation: "Renovation", kitchen_remodel: "Kitchen Remodel", bath_remodel: "Bath Remodel",
    open_concept: "Open Concept Conversion"
  } : {
    new_construction: "Nova Construção", addition: "Ampliação", second_story: "Segundo Pavimento",
    garage_only: "Garagem", garage_conversion: "Conversão de Garagem", basement_finishing: "Acabamento de Subsolo",
    deck_covered: "Deck Coberto", deck_open: "Deck Aberto", porch_covered: "Varanda Coberta", porch_open: "Varanda Aberta",
    renovation: "Reforma", kitchen_remodel: "Reforma de Cozinha", bath_remodel: "Reforma de Banheiro",
    open_concept: "Conversão de Conceito Aberto"
  };

  const dims = d.dims || {};
  const dimExtras = d.dimExtras || [];
  const services = d.services || {};
  const selectedSvcs = Object.keys(services).filter(k => !!services[k] && SVC_LABELS[k]);
  const NO_FLOOR_MULT = ["deck_covered", "deck_open", "porch_covered", "porch_open"];

  let areaBlocks = [];
  selectedSvcs.forEach(svcId => {
    const dim = dims[svcId] || {};
    const wi = parseDim(dim.w || "", isUS);
    const li = parseDim(dim.l || "", isUS);
    const a = isUS ? (wi * li / 144) : (wi * li);
    if (a > 0) areaBlocks.push({ label: SVC_LABELS[svcId], area: a, noMult: NO_FLOOR_MULT.includes(svcId) });
  });

  dimExtras.forEach(ex => {
    const wi = parseDim(ex.w || "", isUS);
    const li = parseDim(ex.l || "", isUS);
    const a = isUS ? (wi * li / 144) : (wi * li);
    if (a > 0) areaBlocks.push({ label: ex.label || T.customArea, area: a, noMult: false });
  });

  if (areaBlocks.length === 0) {
    const w0 = parseDim(d.width || "", isUS);
    const l0 = parseDim(d.length || "", isUS);
    const a0 = isUS ? (w0 * l0 / 144) : (w0 * l0);
    if (a0 > 0) areaBlocks.push({ label: lang === "EN" ? "Project Area" : "Área do Projeto", area: a0, noMult: false });
  }

  const totalBaseArea = areaBlocks.reduce((s, b) => s + b.area, 0);
  const lv = d.levels || {};
  const mainFloors = (lv.ground ? 1 : 0) + (lv.second ? 1 : 0);
  const mainFactor = mainFloors > 0 ? mainFloors : 1;
  const lvFactor = mainFactor + (lv.basement ? 1 : 0) + (lv.attic ? 1 : 0);
  const totalArea = totalBaseArea * lvFactor;

  const pkg = d.deliveryPkg || "";
  const pkgExtras = d.pkgExtras || {};

  const conf = Math.min(
    20 + (d.region ? 10 : 0) + (totalBaseArea > 0 ? 20 : 0) + (d.role ? 10 : 0) + (d.propertyType ? 5 : 0) + (pkg ? 15 : 0) + (d.rush ? 10 : 0),
    100
  );

  if (!pkg || totalBaseArea <= 0) {
    const bd0 = [];
    if (totalBaseArea > 0) bd0.push({ l: T.totalArea, v: Math.round(totalArea).toLocaleString() + " " + (isUS ? "sqft" : "m²") });
    const PROP_SHORT0 = lang === "EN" ? { single_family: "Single Family", multi_family: "Multi-Family", adu: "ADU" } : { single_family: "Residencial", multi_family: "Multifamiliar", adu: "ADU" };
    const primarySvc0 = selectedSvcs.map(k => SVC_LABELS[k])[0] || "";
    const propShort0 = PROP_SHORT0[d.propertyType] || d.propertyType || "";
    const projectTitle0 = primarySvc0 && propShort0 ? `${primarySvc0} — ${propShort0}` : primarySvc0 || propShort0 || "";
    return { lo: "--", hi: "--", conf, bd: bd0, totalArea, baseArea: totalBaseArea, noPkg: true, areaBlocks, projectTitle: projectTitle0 };
  }

  let cost = 0;
  const bd = [];
  let pkgName = "";

  const PKG_LABELS = lang === "EN" ? {
    full_construction: "As-Built Drawings",
    floor_plans_only: "Floor Plans Only",
    pdf_to_cad: "PDF to CAD Conversion",
    3d_rendering: "3D Realistic Rendering"
  } : {
    full_construction: "Levantamento Arquitetônico",
    floor_plans_only: "Apenas Plantas Baixas",
    pdf_to_cad: "Conversão de PDF para CAD",
    3d_rendering: "Renderização 3D Realista"
  };

  pkgName = PKG_LABELS[pkg] || pkg;

  if (pkg === "full_construction" || pkg === "floor_plans_only") {
    const mult = pkg === "floor_plans_only" ? 0.60 : 1.00;
    const rateGround = RATES.ground * (isUS ? 1 : BRL) * mult;
    const rateSecond = RATES.second * (isUS ? 1 : BRL) * mult;

    areaBlocks.forEach(blk => {
      if (blk.noMult) {
        const blkCost = blk.area * rateGround;
        cost += blkCost;
        bd.push({ l: `${blk.label}: ${T.groundFloor} (${Math.round(blk.area)} ${isUS ? "sqft" : "m²"})`, v: fmt(blkCost), block: "arch" });
      } else {
        if (lv.ground) {
          const gCost = blk.area * rateGround;
          cost += gCost;
          bd.push({ l: `${blk.label}: ${T.groundFloor} (${Math.round(blk.area)} ${isUS ? "sqft" : "m²"})`, v: fmt(gCost), block: "arch" });
        }
        if (lv.second) {
          const sCost = blk.area * rateSecond;
          cost += sCost;
          bd.push({ l: `${blk.label}: ${T.secondFloor} (${Math.round(blk.area)} ${isUS ? "sqft" : "m²"})`, v: fmt(sCost), block: "arch" });
        }
      }
    });

    if (lv.basement) {
      const basCost = totalBaseArea * RATES.basement * (isUS ? 1 : BRL) * mult;
      cost += basCost;
      bd.push({ l: `${T.basement} (${Math.round(totalBaseArea)} ${isUS ? "sqft" : "m²"})`, v: fmt(basCost), block: "arch" });
    }
    if (lv.attic) {
      const attCost = totalBaseArea * RATES.attic * (isUS ? 1 : BRL) * mult;
      cost += attCost;
      bd.push({ l: `${T.attic} (${Math.round(totalBaseArea)} ${isUS ? "sqft" : "m²"})`, v: fmt(attCost), block: "arch" });
    }

    if (pkg === "floor_plans_only") bd.push({ l: lang === "EN" ? "Floor Plans Only (60% rate applied)" : "Apenas Plantas (taxa de 60%)", v: "x0.60", block: "svc" });
    if (pkg === "full_construction") {
      if (pkgExtras["inc_arch_design"]) bd.push({ l: lang === "EN" ? "Architectural Design" : "Design Arquitetônico", v: "Selected", block: "extra" });
      if (pkgExtras["inc_space_plan"]) bd.push({ l: lang === "EN" ? "Space Planning" : "Planejamento de Espaço", v: "Selected", block: "extra" });
      if (pkgExtras["inc_interior_lay"]) bd.push({ l: lang === "EN" ? "Interior Layout" : "Layout de Interiores", v: "Selected", block: "extra" });
      if (pkgExtras["fc_ext"]) bd.push({ l: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior", v: T.includedFree, block: "extra", free: true });
      if (pkgExtras["fc_kitchen"]) { cost += 180; bd.push({ l: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha", v: "+"+fmt(180), block: "extra" }); }
      if (pkgExtras["fc_bath"]) { cost += 180; bd.push({ l: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro", v: "+"+fmt(180), block: "extra" }); }
      if (pkgExtras["fc_laundry"]) { cost += 180; bd.push({ l: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia", v: "+"+fmt(180), block: "extra" }); }
    }
  } else if (pkg === "pdf_to_cad") {
    const rate = isUS ? 0.80 : 0.80 * BRL;
    areaBlocks.forEach(blk => {
      const effectiveFactor = blk.noMult ? 1 : mainFactor;
      const blkCost = blk.area * effectiveFactor * rate;
      cost += blkCost;
      bd.push({ l: `${blk.label} (${Math.round(blk.area * effectiveFactor)} ${isUS ? "sqft" : "m²"})`, v: fmt(blkCost), block: "arch" });
    });
  } else if (pkg === "3d_rendering") {
    const items = [
      { k: "3d_ext", label: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior", price: 600 },
      { k: "3d_kitchen", label: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha", price: 180 },
      { k: "3d_bath", label: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro", price: 180 },
      { k: "3d_laundry", label: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia", price: 180 },
    ];
    items.forEach(it => {
      if (pkgExtras[it.k]) { cost += it.price; bd.push({ l: it.label, v: fmt(it.price), block: "extra" }); }
    });
    if (bd.length === 0) bd.push({ l: lang === "EN" ? "Select items in the panel below" : "Selecione os itens no painel abaixo", v: "--", block: "svc" });
  }

  if (d.rush === "rush") {
    const rushFee = cost * 0.4;
    cost += rushFee;
    bd.push({ l: `${T.rushDelivery} (+40%)`, v: `+${fmt(rushFee)}`, highlight: true });
  } else if (d.rush === "express") {
    const expFee = cost * 0.6;
    cost += expFee;
    bd.push({ l: `${T.expressDelivery} (+60%)`, v: `+${fmt(expFee)}`, highlight: true });
  }

  const lo = cost, hi = cost * 1.06;
  const selectedSvcNames = selectedSvcs.map(k => SVC_LABELS[k]);
  const lvNames = [];
  if (lv.ground) lvNames.push(T.groundFloor);
  if (lv.second) lvNames.push(T.secondFloor);
  if (lv.basement) lvNames.push(T.basement);
  if (lv.attic) lvNames.push(T.attic);

  const PROP_SHORT = lang === "EN" ? { single_family: "Single Family", multi_family: "Multi-Family", adu: "ADU" } : { single_family: "Residencial", multi_family: "Multifamiliar", adu: "ADU" };
  const primarySvc = selectedSvcNames[0] || "";
  const propShort = PROP_SHORT[d.propertyType] || d.propertyType || "";
  const projectTitle = primarySvc && propShort ? `${primarySvc} — ${propShort}` : primarySvc || propShort || "";

  return { lo: fmtEx(lo), hi: fmtEx(hi), conf, bd, totalArea, baseArea: totalBaseArea, noPkg: false, pkgName, areaBlocks, selectedSvcNames, lvNames, projectTitle };
}


/* ═══ SVG HELPERS ═══ */
const Chk = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ═══ UI COMPONENTS ═══ */
function Title({ label, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, fontStyle: "italic", color: "var(--tx)", marginBottom: 6 }}>{label}</h2>
      {sub && <p style={{ fontSize: 13, color: "var(--mu)", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

/* ═══ MAIN WIZARD ═══ */
export default function EstimateWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("EN");
  const [theme, setTheme] = useState("dark");
  
  const T = TRANSLATIONS[lang];
  const STEPS = lang === "EN" ? STEPS_EN : STEPS_PT;
  const [data, setData] = useState({
    region: "US",
    levels: { ground: true },
    rooms: { ...ROOM_DEF },
    services: {},
    dims: {},
    dimExtras: [],
    uploads: {},
    pkgExtras: {},
  });
  const topRef = useRef(null);

  const up = useCallback((key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
  }, []);

  const est = calcEst(data, lang);

  // Validation
  const canGo = () => {
    if (step === 0) return !!(data.region && data.street && data.city && data.state && data.zip && data.mapConfirmed);
    if (step === 1) {
      const base = !!(data.name && data.email && data.phone && data.role);
      if (!base) return false;
      if (data.role !== "homeowner") {
        return !!(data.companyName && data.bizAddress && data.bizCity && data.bizState && data.bizZip && data.bizEmail && data.bizPhone);
      }
      return true;
    }
    if (step === 2) return !!(data.levels && (data.levels.ground || data.levels.second || data.levels.basement || data.levels.attic));
    return true; // Steps 5, 6, 7 are optional as per user request
  };

  const next = () => { if (step < STEPS.length - 1 && canGo()) setStep(s => s + 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const prev = () => { if (step > 0) setStep(s => s - 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className={`wz-root ${theme}`} style={{ minHeight: "100vh", background: "var(--bg0)", color: "var(--tx)" }}>
      {/* ── Top Bar ── */}
      <div ref={topRef} style={{ borderBottom: "1px solid var(--border)", padding: "16px 0", background: "var(--bg1)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--mu)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: "6px" }} onMouseEnter={e => e.target.style.color = "var(--tx)"} onMouseLeave={e => e.target.style.color = "var(--mu)"}>
                {T.backToSite}
              </button>
              <div style={{ height: 20, width: 1, background: "var(--border)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "#fff", fontStyle: "italic" }}>D</span>
                </div>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontStyle: "italic" }}>DARA Studio</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Theme & Lang Toggles */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", padding: "4px", borderRadius: "20px", border: "1px solid var(--border)" }}>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "none", border: "none", color: "var(--mu)", cursor: "pointer", fontSize: 14 }}>
                  {theme === "dark" ? "🌙" : "☀️"}
                </button>
                <div style={{ width: 1, height: 12, background: "var(--border)" }} />
                <button onClick={() => setLang(lang === "EN" ? "PT" : "EN")} style={{ background: "none", border: "none", color: "var(--tx)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {lang}
                </button>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, color: "var(--dm)", display: "block" }}>{T.step} {step + 1} {T.of} {STEPS.length}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--a)" }}>— {STEPS[step]}</span>
              </div>
            </div>
          </div>
          <Stepper cur={step} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: step >= 3 ? "1fr 320px" : "1fr", gap: 28, alignItems: "start" }}>
          <div className="wz-animate" key={step}>
            {step === 0 && <S1 d={data} up={up} lang={lang} />}
            {step === 1 && <S2 d={data} up={up} lang={lang} />}
            {step === 2 && <S3 d={data} up={up} lang={lang} />}
            {step === 3 && <S4 d={data} up={up} est={est} lang={lang} />}
            {step === 4 && <S6 d={data} up={up} lang={lang} />}
            {step === 5 && <S7 d={data} up={up} lang={lang} />}
            {step === 6 && <S8 d={data} up={up} lang={lang} />}
            {step === 7 && <S9 d={data} est={est} lang={lang} />}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <button className="wz-btn-ghost" onClick={prev} style={{ visibility: step === 0 ? "hidden" : "visible" }}>{T.back}</button>
              {step < STEPS.length - 1 && (
                <button className="wz-btn-primary" onClick={next} disabled={!canGo()}>{T.continue}</button>
              )}
            </div>
          </div>

          {step >= 3 && <Sidebar est={est} lang={lang} />}
        </div>
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */
function Stepper({ cur }) {
  return (
    <div className="wz-stepper">
      {STEPS.map((lbl, i) => {
        const st = i < cur ? "done" : i === cur ? "active" : "future";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "none" }}>
            <div className={`wz-step-dot ${st}`}>
              {st === "done" ? <Chk /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="wz-step-line">
                <div className="wz-step-line-fill" style={{ width: i < cur ? "100%" : "0%" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Sidebar({ est, lang }) {
  const { lo, hi, conf, bd, projectTitle, pkgName, lvNames, selectedSvcNames } = est;
  // Note: Sidebar currently uses values directly from est, which might be English.
  // Ideally, est labels should also be translated in calcEst.
  const col = conf < 40 ? "var(--rd)" : conf < 70 ? "var(--am)" : "var(--gn)";
  const hasEstimate = lo && lo !== "--";
  const T = TRANSLATIONS[lang];

  return (
    <div className="wz-sidebar">
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--dm)", marginBottom: 12 }}>{T.estimatedFee}</p>
      
      {projectTitle && (
        <div style={{ marginBottom: 12, padding: "12px 16px", background: "var(--a-dim)", border: "1.5px solid var(--a-glow)", borderRadius: "var(--r-sm)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 4 }}>{T.yourProject}</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontStyle: "italic", color: "var(--a)", lineHeight: 1.3 }}>{projectTitle}</p>
        </div>
      )}

      <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "16px", marginBottom: 12 }}>
        {hasEstimate ? (
          <div>
            {pkgName && <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 4 }}>{pkgName}</p>}
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontStyle: "italic", color: "var(--tx)", marginBottom: 4 }}>{lo} – {hi}</p>
            <p style={{ fontSize: 10, color: "var(--dm)", lineHeight: 1.5 }}>{T.approxEstimate}</p>
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.6 }}>{T.enterDims}</p>
        )}
      </div>

      {hasEstimate && (
        <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden", marginBottom: 14 }}>
          {/* Detailed breakdown blocks would go here, simplified for space */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
            <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", color: "var(--mu)" }}>{T.summary}</span>
          </div>
          <div style={{ padding: "8px 12px" }}>
            {bd.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "3px 0" }}>
                <span style={{ color: "var(--mu)" }}>{it.l}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--tx)" }}>{it.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tx)", flex: 1 }}>{T.confidence}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: col, fontWeight: 700 }}>{conf}%</span>
        </div>
        <div className="wz-conf-track"><div className="wz-conf-fill" style={{ width: `${conf}%`, background: col }} /></div>
      </div>
    </div>
  );
}

/* ── STEP COMPONENTS (S1-S9) ── */
function S1({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const [touched, setTouch] = useState({});
  const allFilled = !!(d.region && d.street && d.city && d.state && d.zip);
  const T = TRANSLATIONS[lang];

  const touch = (k) => setTouch(prev => ({ ...prev, [k]: true }));
  const ferr = (k, val) => !!(touched[k] && !val);

  const mapsUrl = () => {
    const addr = encodeURIComponent(`${d.street || ""}, ${d.city || ""}, ${d.state || ""} ${d.zip || ""}${isUS ? ", USA" : ", Brasil"}`);
    return `https://maps.google.com/maps?q=${addr}&output=embed&z=15`;
  };

  return (
    <div className="wz-animate">
      <Title label={T.whereProject} sub={T.locationSub} />

      <div style={{ display: "flex", gap: 12, marginBottom: d.region ? 24 : 0 }}>
        {[
          { id: "US", flag: "🇺🇸", title: "US", sub: "USD · sqft" },
          { id: "BR", flag: "🇧🇷", title: "BR", sub: "BRL · m²" }
        ].map(o => (
          <div key={o.id} className={`wz-toggle ${d.region === o.id ? "active" : ""}`} onClick={() => { up("region", o.id); up("mapConfirmed", false); }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{o.flag}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{o.title}</div>
            <div style={{ fontSize: 12, color: "var(--mu)", marginTop: 4 }}>{o.sub}</div>
          </div>
        ))}
      </div>

      {d.region && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0" }}>
            <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--dm)" }}>
              {isUS ? "Project address in the US" : "Endereço do projeto no Brasil"}
            </span>
            <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
          </div>

          <div className="wz-f">
            <label className="wz-label">{T.streetAddress} <span style={{ color: "var(--rd)" }}>*</span></label>
            <input className={`wz-inp ${ferr("street", d.street) ? "inp-err" : ""}`} placeholder={isUS ? "123 Main Street" : "Rua das Flores, 123"} 
              value={d.street || ""} onChange={e => { up("street", e.target.value); up("mapConfirmed", false); }} onBlur={() => touch("street")} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Autocomplete 
              label={T.city}
              placeholder={isUS ? "Boston" : "São Paulo"}
              value={d.city}
              options={COMMON_CITIES[d.region]}
              onChange={val => { up("city", val); up("mapConfirmed", false); }}
              error={ferr("city", d.city)}
              onBlur={() => touch("city")}
            />
            <Autocomplete 
              label={T.state}
              placeholder={isUS ? "Massachusetts" : "SP"}
              value={d.state}
              options={d.region === "US" ? US_STATES : BR_STATES}
              onChange={val => { up("state", val); up("mapConfirmed", false); }}
              error={ferr("state", d.state)}
              onBlur={() => touch("state")}
            />
          </div>

          <div className="wz-f">
            <label className="wz-label">{T.zipCode} <span style={{ color: "var(--rd)" }}>*</span></label>
            <InputMask mask={isUS ? "99999" : "99999-999"} className={`wz-inp ${ferr("zip", d.zip) ? "inp-err" : ""}`} placeholder={isUS ? "02101" : "01310-100"} style={{ maxWidth: 200 }}
              value={d.zip || ""} onChange={e => { up("zip", e.target.value); up("mapConfirmed", false); }} onBlur={() => touch("zip")} />
          </div>

          {allFilled && (
            <div style={{ marginTop: 18, borderRadius: "var(--r)", overflow: "hidden", border: "1.5px solid var(--a)", boxShadow: "0 0 24px var(--a-glow)" }}>
              <iframe key={d.street + d.city + d.state + d.zip} src={mapsUrl()} title="Project location" width="100%" height="280" style={{ border: "none", display: "block" }} allowFullScreen loading="lazy" />
              <div style={{ padding: "12px 16px", background: "var(--bg1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <p style={{ fontSize: 11, color: "var(--mu)", flex: 1, lineHeight: 1.5 }}>
                  {d.mapConfirmed 
                    ? <span style={{ color: "var(--gn)", fontWeight: 600 }}>{T.locationConfirmed}</span> 
                    : T.verifyLocation}
                </p>
                {!d.mapConfirmed && (
                  <button className="wz-btn-primary" style={{ padding: "8px 16px", fontSize: 12 }} onClick={() => up("mapConfirmed", true)}>{T.confirmLocation}</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function S2({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const [touched, setTouch] = useState({});
  const touch = (k) => setTouch(prev => ({ ...prev, [k]: true }));
  const ferr = (k, val) => !!(touched[k] && !val);
  const showCo = d.role && d.role !== "homeowner";

  return (
    <div className="wz-animate">
      <Title label={T.tellAboutYou} sub={T.aboutYouSub} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="wz-f">
            <label className="wz-label">{T.fullName} <span style={{ color: "var(--rd)" }}>*</span></label>
            <input className={`wz-inp ${ferr("name", d.name) ? "inp-err" : ""}`} placeholder="Jane Smith" 
              value={d.name || ""} onChange={e => up("name", e.target.value)} onBlur={() => touch("name")} />
          </div>
          <div className="wz-f">
            <label className="wz-label">{T.email} <span style={{ color: "var(--rd)" }}>*</span></label>
            <input className={`wz-inp ${ferr("email", d.email) ? "inp-err" : ""}`} type="email" placeholder="jane@example.com" 
              value={d.email || ""} onChange={e => up("email", e.target.value)} onBlur={() => touch("email")} />
          </div>
        </div>
        <div className="wz-f" style={{ maxWidth: 320 }}>
          <label className="wz-label">{T.phone} <span style={{ color: "var(--rd)" }}>*</span></label>
          <InputMask mask={isUS ? "+1 (999) 999-9999" : "+55 (99) 99999-9999"} className={`wz-inp ${ferr("phone", d.phone) ? "inp-err" : ""}`} placeholder={isUS ? "+1 (000) 000-0000" : "+55 (00) 00000-0000"} 
            value={d.phone || ""} onChange={e => up("phone", e.target.value)} onBlur={() => touch("phone")} />
        </div>
      </div>

      <p className="wz-label">{T.whoAreYou} <span style={{ color: "var(--rd)" }}>*</span></p>
      <div className="wz-g3" style={{ marginBottom: 24 }}>
        {ROLES.map(r => (
          <div key={r.id} className={`wz-card ${d.role === r.id ? "active" : ""}`} onClick={() => { up("role", r.id); touch("role"); }} style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{isUS ? ROLES_EN[r.id] : ROLES_PT[r.id]}</div>
          </div>
        ))}
      </div>

      {showCo && (
        <div className="wz-animate" style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 16 }}>{T.companyInfo}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="wz-f">
                <label className="wz-label">{T.bizName} <span style={{ color: "var(--rd)" }}>*</span></label>
                <input className={`wz-inp ${ferr("companyName", d.companyName) ? "inp-err" : ""}`} value={d.companyName || ""} onChange={e => up("companyName", e.target.value)} onBlur={() => touch("companyName")} />
              </div>
              <div className="wz-f">
                <label className="wz-label">{T.website}</label>
                <input className="wz-inp" placeholder="https://" value={d.website || ""} onChange={e => up("website", e.target.value)} />
              </div>
            </div>
            <div className="wz-f">
              <label className="wz-label">{T.bizAddress} <span style={{ color: "var(--rd)" }}>*</span></label>
              <input className={`wz-inp ${ferr("bizAddress", d.bizAddress) ? "inp-err" : ""}`} value={d.bizAddress || ""} onChange={e => up("bizAddress", e.target.value)} onBlur={() => touch("bizAddress")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function S3({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const unit = isUS ? "ft" : "m";
  const au = isUS ? "sqft" : "m²";

  const setLv = (k, v) => up("levels", { ...d.levels, [k]: v });
  const lvOpts = [
    { key: "ground", label: isUS ? "Ground Floor / Main Level" : "Térreo / Nível Principal", rate: isUS ? 1.65 : 15.68, isMain: true },
    { key: "second", label: isUS ? "2nd Floor" : "2º Pavimento", rate: isUS ? 1.35 : 12.83, isMain: true },
    { key: "basement", label: isUS ? "Basement" : "Subsolo / Porão", rate: isUS ? 0.80 : 7.60, isAddon: true },
    { key: "attic", label: isUS ? "Attic" : "Sótão", rate: isUS ? 0.80 : 7.60, isAddon: true },
  ];

  return (
    <div className="wz-animate">
      <Title label={T.tellAboutProject} sub={T.projectSub} />

      <p className="wz-label">{T.propType}</p>
      <div className="wz-g3" style={{ marginBottom: 28 }}>
        {[
          { id: "single_family", icon: "🏠", label: isUS ? "Single Family" : "Residencial Unifamiliar", sub: isUS ? "One family" : "Uma família" },
          { id: "multi_family", icon: "🏘️", label: isUS ? "Multi-Family" : "Multifamiliar", sub: isUS ? "Duplex, Triplex…" : "Duplex, Triplex…" },
          { id: "adu", icon: "🛖", label: "ADU", sub: isUS ? "Accessory Unit" : "Unidade Acessória" },
        ].map(pt => (
          <div key={pt.id} className={`wz-card ${d.propertyType === pt.id ? "active" : ""}`} onClick={() => up("propertyType", pt.id)} style={{ textAlign: "center", padding: "18px 10px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{pt.icon}</div>
            <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{pt.label}</p>
            <p style={{ fontSize: 10, color: "var(--mu)" }}>{pt.sub}</p>
          </div>
        ))}
      </div>

      <p className="wz-label">{T.dimensions}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "start", background: "var(--bg3)", padding: 20, borderRadius: "var(--r)", border: "1.5px solid var(--border)", marginBottom: 28 }}>
        <div className="wz-f">
          <label className="wz-label">{T.width} ({unit})</label>
          <input className="wz-inp" placeholder={isUS ? "e.g. 31'2\"" : "ex: 10.5"} value={d.width || ""} onChange={e => up("width", e.target.value)} />
          {isUS && <p style={{ fontSize: 10, color: "var(--a)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{T.detected}: {fmtInches(parseDim(d.width, true))}</p>}
        </div>
        <div style={{ fontSize: 20, color: "var(--dm)", marginTop: 28 }}>×</div>
        <div className="wz-f">
          <label className="wz-label">{T.length} ({unit})</label>
          <input className="wz-inp" placeholder={isUS ? "e.g. 45'0\"" : "ex: 15.5"} value={d.length || ""} onChange={e => up("length", e.target.value)} />
          {isUS && <p style={{ fontSize: 10, color: "var(--a)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{T.detected}: {fmtInches(parseDim(d.length, true))}</p>}
        </div>
      </div>

      <p className="wz-label">{T.levels}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {lvOpts.map(o => (
          <div key={o.key} className={`wz-card ${d.levels[o.key] ? "active" : ""}`} onClick={() => setLv(o.key, !d.levels[o.key])} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid var(--border2)", background: d.levels[o.key] ? "var(--a)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {d.levels[o.key] && <Chk />}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</span>
              {o.isAddon && <span style={{ fontSize: 10, color: "var(--dm)", marginLeft: 8 }}>+{isUS ? "$" : "R$"}{o.rate}/{au} add-on</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function S4({ d, up, est, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const packages = [
    { id: "full_construction", label: isUS ? "As-Built Drawings" : "Levantamento Arquitetônico", badge: isUS ? "HIGH COMPLEXITY" : "ALTA COMPLEXIDADE", icon: "🏗️", sub: isUS ? "Comprehensive package including all floor levels and 3D visualization." : "Pacote completo incluindo todos os níveis e visualização 3D." },
    { id: "floor_plans_only", label: isUS ? "Floor Plans Only" : "Apenas Plantas Baixas", badge: isUS ? "LOW COMPLEXITY" : "BAIXA COMPLEXIDADE", icon: "📐", sub: isUS ? "Essential spatial layouts and dimensioned floor plans." : "Layouts espaciais essenciais e plantas baixas dimensionadas." },
    { id: "pdf_to_cad", label: isUS ? "PDF to CAD Conversion" : "Conversão de PDF para CAD", badge: isUS ? "DRAFTING ONLY" : "APENAS DESENHO", icon: "💻", sub: isUS ? "Convert existing PDF blueprints or hand-drawn sketches into CAD files." : "Converta projetos em PDF ou croquis feitos à mão em arquivos CAD." },
    { id: "3d_rendering", label: isUS ? "3D Realistic Rendering" : "Renderização 3D Realista", badge: isUS ? "VISUALIZATION" : "VISUALIZAÇÃO", icon: "🎨", sub: isUS ? "High-quality images with real textures, lighting, and colors." : "Imagens de alta qualidade com texturas, iluminação e cores reais." },
  ];

  const extras = d.pkgExtras || {};
  const setExtra = (k) => up("pkgExtras", { ...extras, [k]: !extras[k] });

  return (
    <div className="wz-animate">
      <Title label={T.deliveryPackage} sub={T.packageSub} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {packages.map(pkg => (
          <div key={pkg.id} className={`wz-card ${d.deliveryPkg === pkg.id ? "active" : ""}`} onClick={() => up("deliveryPkg", pkg.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 22 }}>{pkg.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>{pkg.label}</p>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: "rgba(255,255,255,0.05)" }}>{pkg.badge}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--mu)", marginTop: 2 }}>{pkg.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function S6({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const rooms = d.rooms || { ...ROOM_DEF };
  const setR = (k, v) => up("rooms", { ...rooms, [k]: v });

  return (
    <div className="wz-animate">
      <Title label={T.programReqs} sub={T.programSub} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {ROOM_GROUPS.map(g => (
          <div key={g.label} style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)" }}>
                {g.label === "Core Rooms" ? T.groupLabels.core : 
                 g.label === "Kitchen & Service" ? T.groupLabels.service : 
                 g.label === "Work & Wellness" ? T.groupLabels.work : 
                 g.label === "Entertainment & Outdoor" ? T.groupLabels.leisure : 
                 T.groupLabels.tech}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
              {g.items.map((item, idx) => {
                const val = rooms[item.id] || 0;
                return (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", borderRight: idx % 2 === 0 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ fontSize: 12, color: val > 0 ? "var(--tx)" : "var(--mu)" }}>
                      {T.roomLabels[item.id] || item.label}
                    </span>
                    <div className="wz-counter">
                      <button className="wz-counter-btn" onClick={() => setR(item.id, Math.max(0, val - 1))}>−</button>
                      <div className="wz-counter-val">{val}</div>
                      <button className="wz-counter-btn" onClick={() => setR(item.id, Math.min(20, val + 1))}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <p className="wz-label">{T.specialReqs}</p>
        <textarea className="wz-textarea" placeholder={T.specialReqsPlaceholder} 
          value={d.specialReqs || ""} onChange={e => up("specialReqs", e.target.value)} />
      </div>
    </div>
  );
}

function S7({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const cats = [
    { id: "inspiration", label: isUS ? "Inspiration Images" : "Imagens de Inspiração", icon: "🖼️", accept: ".jpg,.jpeg,.png,.webp" },
    { id: "documents", label: isUS ? "Technical Documents" : "Documentos Técnicos", icon: "📋", accept: ".pdf,.doc,.docx,.dwg,.dxf" },
    { id: "other", label: isUS ? "Other Files" : "Outros Arquivos", icon: "📎", accept: "*" },
  ];
  const uploads = d.uploads || {};

  return (
    <div className="wz-animate">
      <Title label={T.uploadFiles} sub={T.uploadSub} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cats.map(cat => (
          <div key={cat.id} className="wz-drop">
            <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{cat.label}</p>
            <p style={{ fontSize: 12, color: "var(--dm)" }}>{T.dragDrop}</p>
            <input type="file" multiple accept={cat.accept} style={{ display: "none" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function S8({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const options = [
    { id: "standard", label: isUS ? "Standard Delivery" : "Entrega Padrão", sub: isUS ? "Standard turnaround time" : "Tempo de resposta padrão", icon: "🕒", fee: isUS ? "FREE" : "GRÁTIS" },
    { id: "rush", label: isUS ? "Rush Delivery (+40%)" : "Entrega Prioritária (+40%)", sub: isUS ? "Priority scheduling" : "Agendamento prioritário", icon: "🚀", fee: "+40%" },
    { id: "express", label: isUS ? "Express Delivery (+60%)" : "Entrega Expressa (+60%)", sub: isUS ? "Fastest possible turnaround" : "Resposta mais rápida possível", icon: "⚡", fee: "+60%" },
  ];

  return (
    <div className="wz-animate">
      <Title label={T.deliverySpeed} sub={T.speedSub} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map(opt => (
          <div key={opt.id} className={`wz-card ${d.rush === opt.id ? "active" : ""}`} onClick={() => up("rush", opt.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 22 }}>{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: "var(--mu)" }}>{opt.sub}</p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: d.rush === opt.id ? "var(--a)" : "var(--dm)" }}>{opt.fee}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function S9({ d, est, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const navigate = useNavigate();
  return (
    <div className="wz-animate">
      <Title label={T.reviewEstimate} sub={T.reviewSub} />
      <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 24, marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: "var(--mu)", lineHeight: 1.6, marginBottom: 20 }}>
          {isUS ? (
            <>You are requesting a <strong>{est.pkgName || "custom"}</strong> package for a <strong>{est.projectTitle || "new project"}</strong>. Total estimated area is <strong>{Math.round(est.totalArea).toLocaleString()} sqft</strong>.</>
          ) : (
            <>Você está solicitando um pacote <strong>{est.pkgName || "personalizado"}</strong> para um <strong>{est.projectTitle || "novo projeto"}</strong>. Área total estimada é de <strong>{Math.round(est.totalArea).toLocaleString()} m²</strong>.</>
          )}
        </p>
        <button className="wz-btn-primary" style={{ width: "100%", padding: "16px", fontSize: 16 }} onClick={() => navigate("/portal")}>
          {T.submit}
        </button>
      </div>
    </div>
  );
}

