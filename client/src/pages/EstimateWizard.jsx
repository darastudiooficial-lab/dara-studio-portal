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
    selectServices: "Select Services",
    servicesSub: "Choose the specific services you need for your project.",
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
    selectServices: "Selecionar Serviços",
    servicesSub: "Escolha os serviços específicos que você precisa para o seu projeto.",
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
  let s = val.trim();
  if (!isUS) {
    s = s.replace(',', '.');
  }
  
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
  const sym = isUS ? "$" : "R$";
  const fmt = (n) => sym + Math.round(n).toLocaleString(isUS ? "en-US" : "pt-BR");
  const fmtEx = (n) => sym + n.toLocaleString(isUS ? "en-US" : "pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const SVC_LABELS = lang === "EN" ? {
    new_construction: "New Construction", addition: "Addition", second_story: "Second Story",
    garage_only: "Garage", garage_conversion: "Garage Conversion", basement_finishing: "Basement Finishing",
    deck_covered: "Covered Deck", deck_open: "Open Deck", porch_covered: "Covered Porch", porch_open: "Open Porch",
    renovation: "Renovation", kitchen_remodel: "Kitchen Remodel", bath_remodel: "Bath Remodel",
    open_concept: "Open Concept Conversion", other_const: "Other Construction", other_int: "Other Interior"
  } : {
    new_construction: "Nova Construção", addition: "Ampliação", second_story: "Segundo Pavimento",
    garage_only: "Garagem", garage_conversion: "Conversão de Garagem", basement_finishing: "Acabamento de Subsolo",
    deck_covered: "Deck Coberto", deck_open: "Deck Aberto", porch_covered: "Varanda Coberta", porch_open: "Varanda Aberta",
    renovation: "Reforma", kitchen_remodel: "Reforma de Cozinha", bath_remodel: "Reforma de Banheiro",
    open_concept: "Conversão de Conceito Aberto", other_const: "Outra Construção", other_int: "Outro Interior"
  };

  const dims = d.dims || {};
  const dimExtras = d.dimExtras || [];
  const services = d.services || {};
  const selectedSvcs = Object.keys(services).filter(k => !!services[k] && SVC_LABELS[k]);
  const NO_FLOOR_MULT = ["deck_covered", "deck_open", "porch_covered", "porch_open"];

  let areaBlocks = [];
  (selectedSvcs || []).forEach(svcId => {
    const dim = dims[svcId] || {};
    const wi = parseDim(dim.w || "", isUS);
    const li = parseDim(dim.l || "", isUS);
    const a = isUS ? (wi * li / 144) : (wi * li);
    if (a > 0) areaBlocks.push({ label: SVC_LABELS[svcId], area: a, noMult: NO_FLOOR_MULT.includes(svcId), svcId });
  });

  (dimExtras || []).forEach(ex => {
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

  // Confidence logic (Step-based 12.5% per step for 8 steps)
  // Step 4 = 50%
  const currentStepNum = d.step === undefined ? 3 : d.step; 
  const conf = Math.min(((currentStepNum + 1) / 8) * 100, 100);

  if (!pkg || totalBaseArea <= 0) {
    const bd0 = [];
    if (totalBaseArea > 0) bd0.push({ l: T.totalArea, v: Math.round(totalBaseArea).toLocaleString() + " " + (isUS ? "sqft" : "m²") });
    const PROP_SHORT0 = lang === "EN" ? { single_family: "Single Family", multi_family: "Multi-Family", adu: "ADU" } : { single_family: "Residencial", multi_family: "Multifamiliar", adu: "ADU" };
    const primarySvc0 = selectedSvcs.map(k => SVC_LABELS[k])[0] || "";
    const propShort0 = PROP_SHORT0[d.propertyType] || d.propertyType || "";
    const projectTitle0 = primarySvc0 && propShort0 ? `${primarySvc0} — ${propShort0}` : primarySvc0 || propShort0 || "";
    return { lo: "--", hi: "--", conf, bd: bd0, totalArea: totalBaseArea, baseArea: totalBaseArea, noPkg: true, areaBlocks, projectTitle: projectTitle0 };
  }

  let cost = 0;
  const bd = [];
  let pkgName = "";

  const PKG_LABELS = lang === "EN" ? {
    as_built_permit: "As-Built & Permit Package",
    floor_plans_only: "Floor Plans Only",
    pdf_to_cad: "PDF to CAD Conversion",
    "3d_rendering": "3D Realistic Rendering"
  } : {
    as_built_permit: "Levantamento e Prefeitura",
    floor_plans_only: "Apenas Plantas Baixas",
    pdf_to_cad: "Conversão de PDF para CAD",
    "3d_rendering": "Renderização 3D Realista"
  };

  pkgName = PKG_LABELS[pkg] || pkg;

  // Calculate current extra rate per sqft
  let currentExtraPerSqft = 0;
  if (pkg === "as_built_permit") {
    Object.keys(EXTRA_RATES).forEach(key => {
      if (pkgExtras[key]) currentExtraPerSqft += EXTRA_RATES[key];
    });
  }

  if (pkg === "as_built_permit" || pkg === "floor_plans_only") {
    const currencyMult = isUS ? 1 : BRL;
    let totalCapReduction = 0;

    if (pkg === "floor_plans_only") {
      const rate = 0.55 * currencyMult;
      const flatFee = 200 * currencyMult;
      cost = (totalBaseArea * rate) + flatFee;
      
      bd.push({ 
        l: lang === "EN" ? `Floor Plans ($0.55/${isUS?"sqft":"m²"})` : `Plantas Baixas ($0.55/${isUS?"sqft":"m²"})`, 
        v: fmt(totalBaseArea * rate),
        block: "arch"
      });
      bd.push({ 
        l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima", 
        v: "+" + fmt(flatFee),
        block: "svc"
      });
    } else {
      // As-Built & Permit Package
      areaBlocks.forEach(blk => {
        const lvls = (d.svcLevels && blk.svcId && d.svcLevels[blk.svcId]) ? d.svcLevels[blk.svcId] : d.levels || {};
        const levelsToProcess = blk.noMult ? ["main"] : Object.keys(lvls).filter(k => lvls[k]);
        
        if (levelsToProcess.length === 0 && !blk.noMult) {
          levelsToProcess.push("main");
        }

        levelsToProcess.forEach(lvlKey => {
          let baseRate = (lvlKey === "attic" || lvlKey === "basement") ? BASE_RATE_SUB : BASE_RATE_MAIN;
          let finalRate = baseRate * currencyMult;
          const lvlCost = blk.area * finalRate;
          cost += lvlCost;
          
          const lvlName = (lvlKey === "main" || lvlKey === "ground") ? T.groundFloor : 
                          (lvlKey === "second") ? T.secondFloor :
                          (lvlKey === "basement") ? T.basement :
                          (lvlKey === "attic") ? T.attic : lvlKey;
          
          bd.push({ 
            l: `${blk.label}: ${lvlName} (${Math.round(blk.area)} ${isUS ? "sqft" : "m²"})`, 
            v: fmt(lvlCost), 
            block: "arch" 
          });
        });
      });

      // Per-sqft Extras
      Object.keys(EXTRA_RATES).forEach(key => {
        if (pkgExtras[key]) {
          const extraCost = totalBaseArea * EXTRA_RATES[key] * currencyMult;
          cost += extraCost;
          const labels = {
            ex_arch_design: lang === "EN" ? "Architectural Design Detail" : "Design Arquitetônico",
            ex_space_plan: lang === "EN" ? "Space Planning" : "Planejamento de Espaço",
            ex_interior_lay: lang === "EN" ? "Interior Layout" : "Layout de Interiores",
            ex_const_detail: lang === "EN" ? "Construction Detailing" : "Detalhamento Executivo",
            ex_code_comp: lang === "EN" ? "Code Compliance" : "Conformidade Técnica",
            ex_3d_ext: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior"
          };
          bd.push({ l: labels[key] || key, v: fmt(extraCost), block: "extra" });
        }
      });
      // Fixed Fee Extras (Interiors)
      Object.keys(FIXED_FEES).forEach(key => {
        if (pkgExtras[key]) {
          const fee = FIXED_FEES[key] * currencyMult;
          cost += fee;
          const labels = {
            ex_3d_kitchen: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha",
            ex_3d_bath: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro",
            ex_3d_laundry: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia"
          };
          bd.push({ l: labels[key] || key, v: "+" + fmt(fee), block: "extra" });
        }
      });
    }
  } else if (pkg === "pdf_to_cad") {
    const currencyMult = isUS ? 1 : BRL;
    const rate = 0.30 * currencyMult;
    const flatFee = 100 * currencyMult;
    cost = (totalBaseArea * rate) + flatFee;

    bd.push({ 
      l: lang === "EN" ? `PDF to CAD ($0.30/${isUS?"sqft":"m²"})` : `PDF para CAD ($0.30/${isUS?"sqft":"m²"})`, 
      v: fmt(totalBaseArea * rate),
      block: "arch"
    });
    bd.push({ 
      l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima", 
      v: "+" + fmt(flatFee),
      block: "svc"
    });
  } else if (pkg === "3d_rendering") {
    const currencyMult = isUS ? 1 : BRL;
    // Standalone 3D Rendering Package uses fixed fees: $250 Ext, $180 Int
    const standalone3D = {
      ex_3d_ext: 250,
      ex_3d_kitchen: 180,
      ex_3d_bath: 180,
      ex_3d_laundry: 180
    };
    Object.keys(standalone3D).forEach(key => {
      if (pkgExtras[key]) {
        const fee = standalone3D[key] * currencyMult;
        cost += fee;
        const labels = {
          ex_3d_ext: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior",
          ex_3d_kitchen: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha",
          ex_3d_bath: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro",
          ex_3d_laundry: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia"
        };
        bd.push({ l: labels[key] || key, v: "+" + fmt(fee), block: "extra" });
      }
    });
  }

  const lo = cost * 0.95, hi = cost * 1.05;
  const selectedSvcNames = selectedSvcs.map(k => SVC_LABELS[k]);
  const lvNames = [];
  const allLvls = new Set();
  if (d.svcLevels) {
    Object.values(d.svcLevels).forEach(lvls => { Object.keys(lvls).forEach(k => { if (lvls[k]) allLvls.add(k); }); });
  } else if (d.levels) {
    Object.keys(d.levels).forEach(k => { if (d.levels[k]) allLvls.add(k); });
  }
  if (allLvls.has("main") || allLvls.has("ground")) lvNames.push(T.groundFloor);
  if (allLvls.has("second")) lvNames.push(T.secondFloor);
  if (allLvls.has("basement")) lvNames.push(T.basement);
  if (allLvls.has("attic")) lvNames.push(T.attic);

  const PROP_SHORT = lang === "EN" ? { single_family: "Single Family", multi_family: "Multi-Family", adu: "ADU" } : { single_family: "Residencial", multi_family: "Multifamiliar", adu: "ADU" };
  const primarySvc = selectedSvcNames[0] || "";
  const propShort = PROP_SHORT[d.propertyType] || d.propertyType || "";
  const projectTitle = primarySvc && propShort ? `${primarySvc} — ${propShort}` : primarySvc || propShort || "";

  return { lo: fmtEx(lo), hi: fmtEx(hi), conf, bd, totalArea: totalBaseArea, baseArea: totalBaseArea, noPkg: false, pkgName, areaBlocks, selectedSvcNames, lvNames, projectTitle };
}


/* ═══ SVG HELPERS ═══ */
const Chk = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

/* ═══ UI COMPONENTS ═══ */
function Title({ label, sub }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 400, fontStyle: "italic", color: "var(--tx)", marginBottom: 8 }}>{label}</h2>
      {sub && <p style={{ fontSize: 15, color: "var(--mu)", lineHeight: 1.6, fontWeight: 300 }}>{sub}</p>}
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

  const est = calcEst({ ...data, step }, lang);

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
          <Stepper cur={step} steps={STEPS} />
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
function Stepper({ cur, steps }) {
  return (
    <div className="wz-stepper">
      {steps.map((lbl, i) => {
        const st = i < cur ? "done" : i === cur ? "active" : "future";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? "1" : "none" }}>
            <div className={`wz-step-dot ${st}`}>
              {st === "done" ? <Chk /> : i + 1}
            </div>
            {i < steps.length - 1 && (
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
  const getConfCol = (c) => {
    if (c <= 12.5) return "#FF0000";
    if (c <= 25.0) return "#FF8C00";
    if (c <= 37.5) return "#FFD700";
    if (c <= 50.0) return "#FFFF00";
    if (c <= 62.5) return "#CCFF00";
    if (c <= 75.0) return "#66FF00";
    if (c <= 87.5) return "#00FF00";
    return "#008080";
  };
  const col = getConfCol(conf);
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
            {data.goal && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", color: "var(--dm)" }}>Project Intent</span>
                <span style={{ fontSize: 10, color: "var(--tx)", fontWeight: "600" }}>
                  {data.goal === "permit" ? (lang === "EN" ? "Building Permit Only" : "Apenas Aprovação Legal") :
                   data.goal === "construction" ? (lang === "EN" ? "Construction Documentation" : "Documentação de Construção") :
                   data.goal === "investment" ? (lang === "EN" ? "Investment / Flip" : "Investimento / Flip") : 
                   data.goal === "personal" ? (lang === "EN" ? "Personal Residence" : "Residência Pessoal") : data.goal}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tx)", flex: 1 }}>{T.confidence}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: col, fontWeight: 700 }}>{conf}%</span>
        </div>
        <div className="wz-conf-track"><div className="wz-conf-fill" style={{ width: `${conf}%`, background: step === 4 ? "#CCFF00" : col }} /></div>
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
          <InputMask mask={isUS ? "+1 (999) 999-9999" : "+55 (99) 99999-9999"} maskChar={null} className={`wz-inp ${ferr("phone", d.phone) ? "inp-err" : ""}`} placeholder={isUS ? "+1 (000) 000-0000" : "+55 (00) 00000-0000"} 
            value={d.phone || ""} onChange={e => up("phone", e.target.value)} onBlur={() => touch("phone")} />
        </div>
      </div>

      <p className="wz-label" style={{ marginBottom: 12 }}>{T.whoAreYou} <span style={{ color: "var(--rd)" }}>*</span></p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {ROLES.map(r => (
          <div key={r.id} className={`wz-card ${d.role === r.id ? "active" : ""}`} onClick={() => { up("role", r.id); touch("role"); }} style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{isUS ? ROLES_EN[r.id] : ROLES_PT[r.id]}</div>
          </div>
        ))}
      </div>

      {d.role === "builder" && (
        <div className="wz-animate" style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(100, 108, 255, 0.08)", border: "1px solid var(--a)", borderRadius: "8px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🏗️</span>
          <p style={{ fontSize: 13, color: "var(--a)", fontWeight: 600, lineHeight: 1.4 }}>
            {isUS 
              ? "We speak 'Jobsite'. Our plans are optimized for fast permits and clear field execution."
              : "Falamos 'Obra'. Nossos projetos são otimizados para aprovações rápidas e execução clara em campo."}
          </p>
        </div>
      )}

      {showCo && (
        <div className="wz-animate" style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 16 }}>{T.companyInfo}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="wz-f">
                <label className="wz-label">{T.bizName} <span style={{ color: "var(--rd)" }}>*</span></label>
                <input className={`wz-inp ${ferr("companyName", d.companyName) ? "inp-err" : ""}`} placeholder="ACME Corp" value={d.companyName || ""} onChange={e => up("companyName", e.target.value)} onBlur={() => touch("companyName")} />
              </div>
              <div className="wz-f">
                <label className="wz-label">{T.website}</label>
                <input className="wz-inp" placeholder="https://" value={d.website || ""} onChange={e => up("website", e.target.value)} />
              </div>
            </div>
            <div className="wz-f">
              <label className="wz-label">{T.bizAddress} <span style={{ color: "var(--rd)" }}>*</span></label>
              <input className={`wz-inp ${ferr("bizAddress", d.bizAddress) ? "inp-err" : ""}`} placeholder="Address" value={d.bizAddress || ""} onChange={e => up("bizAddress", e.target.value)} onBlur={() => touch("bizAddress")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 14 }}>
              <div className="wz-f">
                <label className="wz-label">{T.bizCity} <span style={{ color: "var(--rd)" }}>*</span></label>
                <input className={`wz-inp ${ferr("bizCity", d.bizCity) ? "inp-err" : ""}`} placeholder="City" value={d.bizCity || ""} onChange={e => up("bizCity", e.target.value)} onBlur={() => touch("bizCity")} />
              </div>
              <div className="wz-f">
                <label className="wz-label">{T.bizState} <span style={{ color: "var(--rd)" }}>*</span></label>
                <input className={`wz-inp ${ferr("bizState", d.bizState) ? "inp-err" : ""}`} placeholder="State" value={d.bizState || ""} onChange={e => up("bizState", e.target.value)} onBlur={() => touch("bizState")} />
              </div>
              <div className="wz-f">
                <label className="wz-label">{T.bizZip} <span style={{ color: "var(--rd)" }}>*</span></label>
                <InputMask mask={isUS ? "99999" : "99999-999"} maskChar={null} className={`wz-inp ${ferr("bizZip", d.bizZip) ? "inp-err" : ""}`} placeholder={isUS ? "00000" : "00000-000"} value={d.bizZip || ""} onChange={e => up("bizZip", e.target.value)} onBlur={() => touch("bizZip")} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="wz-f">
                <label className="wz-label">{T.bizEmail} <span style={{ color: "var(--rd)" }}>*</span></label>
                <input className={`wz-inp ${ferr("bizEmail", d.bizEmail) ? "inp-err" : ""}`} type="email" placeholder="info@co.com" value={d.bizEmail || ""} onChange={e => up("bizEmail", e.target.value)} onBlur={() => touch("bizEmail")} />
              </div>
              <div className="wz-f">
                <label className="wz-label">{T.bizPhone} <span style={{ color: "var(--rd)" }}>*</span></label>
                <InputMask mask={isUS ? "+1 (999) 999-9999" : "+55 (99) 99999-9999"} maskChar={null} className={`wz-inp ${ferr("bizPhone", d.bizPhone) ? "inp-err" : ""}`} placeholder={isUS ? "+1 (000) 000-0000" : "+55 (00) 00000-0000"} value={d.bizPhone || ""} onChange={e => up("bizPhone", e.target.value)} onBlur={() => touch("bizPhone")} />
              </div>
            </div>
            <div className="wz-f">
              <label className="wz-label">INSTAGRAM</label>
              <input className="wz-inp" placeholder="@handle" value={d.instagram || ""} onChange={e => up("instagram", e.target.value)} />
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

      <p className="wz-label" style={{ marginBottom: 12 }}>PROPERTY TYPE</p>
      <div className="wz-g3" style={{ marginBottom: 28 }}>
        {[
          { id: "single_family", icon: "🏠", label: isUS ? "Single Family Home" : "Residencial Unifamiliar", sub: isUS ? "One family" : "Uma família" },
          { id: "multi_family", icon: "🏘️", label: isUS ? "Multi-Family" : "Multifamiliar", sub: isUS ? "Duplex, Triplex…" : "Duplex, Triplex…" },
          { id: "adu", icon: "🛖", label: "ADU", sub: isUS ? "Accessory Dwelling Unit" : "Unidade Acessória" },
        ].map(pt => (
          <div key={pt.id} className={`wz-card ${d.propertyType === pt.id ? "active" : ""}`} onClick={() => up("propertyType", pt.id)} style={{ textAlign: "center", padding: "18px 10px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{pt.icon}</div>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{pt.label}</p>
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

               const lvls = svcLevels[id] || {};
               const selectedLvlKeys = Object.keys(lvls).filter(k => lvls[k]);
               const count = selectedLvlKeys.length;
               
               if (count === 0) return null;
               
               const area = Math.round(getSvcArea(id));
               const lvlStr = selectedLvlKeys.map(k => levelLabels[k]).join(" + ");
               
               return (
                 <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, borderBottom: "1px dashed var(--border)", paddingBottom: 8 }}>
                   <span style={{ color: "var(--tx)" }}>{svcLabel} <span style={{ color: "var(--mu)" }}>({lvlStr})</span></span>
                   <span style={{ fontWeight: 600, color: "var(--tx)" }}>{area.toLocaleString()} {au}</span>
                 </div>
               );
             })}
           </div>
           
           <div style={{ borderTop: "2px solid var(--border)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <p style={{ fontSize: 13, fontWeight: 700, color: "var(--tx)", textTransform: "uppercase" }}>Grand Total</p>
             <p style={{ fontSize: 22, fontWeight: 800, color: "var(--a)" }}>{Math.round(calcGrandTotal()).toLocaleString()} {au}</p>
           </div>
        </div>
      )}

      <div className="wz-f" style={{ marginBottom: 28 }}>
        <label className="wz-label">LOT SIZE (OPTIONAL, {au.toUpperCase()})</label>
        <input className="wz-inp" placeholder="e.g. 5000" style={{ maxWidth: 240 }} value={d.lotSize || ""} onChange={e => up("lotSize", e.target.value)} />
      </div>
    </div>
  );
}

function S4({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const [openDet, setOpenDet] = useState({});
  const [openEx, setOpenEx] = useState({});

  const toggleDet = (id, e) => {
    e.stopPropagation();
    // Exclusive toggle: only one "More details" open at a time
    setOpenDet(p => ({ [id]: !p[id] }));
  };

  const toggleEx = (id, e) => {
    e.stopPropagation();
    setOpenEx(p => ({ ...p, [id]: !p[id] }));
  };

  const setPkg = (id) => {
    up("deliveryPkg", id);
    // Auto-collapse others when switching
    setOpenDet({}); 
  };

  const togglePkgExtra = (k, isIncluded) => {
    if (isIncluded) return;
    const current = d.pkgExtras || {};
    up("pkgExtras", { ...current, [k]: !current[k] });
  };

  const PKG = [
    {
      id: "as_built_permit",
      icon: "🏛️",
      title: "As-Built Drawings & Permit Packages",
      subtitle: "Customize your drawing set based on your project's needs.",
      tag: "HIGH COMPLEXITY",
      tagColor: "rgba(245, 158, 11, 0.15)",
      tagTextCol: "#F59E0B",
      desc: "Customize your drawing set based on your project's needs. Comprehensive package including all floor levels, design extras, and 3D visualization.",
      details: {
        summary: "Comprehensive architectural package tailored to your needs. From essential municipal documentation to full executive design, including 3D visualization and technical detailing.",
        whatYouReceiveItems: [
          { title: "Basic Permit Set (Fundamental)", desc: "Essential set including Existing/Demolition/Proposed plans, 2 Sections, 4 Elevations, and Roof Plan." },
          { title: "Design & Space Planning (Optional)", desc: "Aesthetic development, optimal room flow analysis, and micro-level interior layout." },
          { title: "Technical Construction Set (Optional)", desc: "Framing plans (pre-dimensioning), construction details, and schedules for the builder. Reduz desperdício de material e tempo de obra." },
          { title: "3D Visualization (Optional)", desc: "High-fidelity exterior rendering to see the final result before construction." }
        ],
        notIncluded: [
          "Material Procurement: We do not handle the purchase or delivery of construction materials.",
          "Landscape Design: Detailed outdoor greenery and garden planning are not included.",
          "Cabinetry Shop Drawings: Does not include millwork fabrication drawings (only layout/design)."
        ],
        idealFor: [
          "Homeowners: Anyone who needs to build, remodel, or obtain a building permit.",
          "Complex Projects: Full-scale renovations in Dover, Weston, and surrounding areas.",
          "Professional Approval: Streamlining the municipal code review process."
        ],
        extras: [
          { group: "DESIGN EXTRAS", items: [
            { id: "ex_arch_design", label: "Architectural Design Detail", price: "+ $0.15 / sqft", desc: "Focuses on the conceptual and aesthetic development of your project. Includes exterior elevations, structural style, and overall look and feel.", isIncluded: false },
            { id: "ex_space_plan", label: "Space Planning", price: "+ $0.15 / sqft", desc: "Macro-level design focusing on the optimal arrangement of walls, doors, and room flows. We analyze the best way to utilize the square footage for functionality and movement.", isIncluded: false },
            { id: "ex_interior_lay", label: "Interior Layout", price: "+ $0.10 / sqft", desc: "Micro-level design detailing the placement of furniture, custom cabinetry (like kitchen or bathroom vanities), appliances, and specific fixtures within the defined spaces.", isIncluded: false }
          ]},
          { group: "TECHNICAL & CONSTRUCTION", items: [
            { id: "ex_const_detail", label: "Construction Detailing & Framing", price: "+ $0.20 / sqft", desc: "Technical framing plans (pre-dimensioning), essential construction details, and schedules (doors/windows). This module provides the necessary information for your builder to execute the project accurately, reducing material waste and construction time.", isIncluded: false },
            { id: "ex_code_comp", label: "Code Compliance & Technical Notes", price: "+ $0.05 / sqft", desc: "Detailed municipal code citations, safety notes, and professional annotations required to streamline the permit approval process and ensure legal compliance.", isIncluded: false }
          ]},
          { group: "3D VISUALIZATION & SPECIFIC ROOMS", items: [
            { id: "ex_3d_ext", label: "3D Exterior Rendering", price: "+ $0.10 / sqft", desc: "High-fidelity 3D visualization of the exterior architecture.", isIncluded: false },
            { id: "ex_3d_kitchen", label: "3D Kitchen Design", price: "+ $180.00", isIncluded: false },
            { id: "ex_3d_bath", label: "3D Bathroom Design", price: "+ $180.00", isIncluded: false },
            { id: "ex_3d_laundry", label: "3D Laundry Design", price: "+ $180.00", isIncluded: false }
          ]}
        ]
      }
    },
    {
      id: "floor_plans_only",
      icon: "📐",
      title: "Floor Plans Only",
      tag: "LOW COMPLEXITY",
      tagColor: "rgba(59, 130, 246, 0.15)",
      tagTextCol: "#60A5FA",
      desc: "Essential spatial layouts and dimensioned floor plans. Does not include exterior design or 3D renderings.",
      details: {
        summary: "A streamlined service delivering fundamental interior spatial layouts and dimensioned floor plans. This is the functional \"skeleton\" of your project, focusing on internal organization.",
        whatYouReceiveItems: [
          { title: "Fundamental Spatial Layouts", desc: "Basic organization and distribution of rooms and internal spaces." },
          { title: "Dimensioned Floor Plans", desc: "Technical drawings showing precise measurements and dimensions of walls and openings." }
        ],
        notIncluded: [
          "Exterior Design: No elevations (fachadas) or roof plans.",
          "3D Renderings: No three-dimensional images or realistic visualizations.",
          "Building Permits: Does not include documentation or technical notes for municipal approval.",
          "Structural Engineering: No load calculations or framing details."
        ],
        idealFor: [
          "Initial Planning: Clients who want to decide on a layout before hiring engineers.",
          "Cosmetic Renovations: Aesthetic updates that do not require structural changes.",
          "Concept Only: When you don't yet need a full set of documents for legal permit."
        ]
      }
    },
    {
      id: "3d_rendering",
      icon: "🎨",
      title: "3D Realistic Rendering",
      tag: "VISUALIZATION",
      tagColor: "rgba(139, 92, 246, 0.15)",
      tagTextCol: "#A78BFA",
      desc: "The \"photo\" of the future.",
      details: {
        summary: "The \"photo\" of the future. This service provides high-quality imagery that brings your project to life with realistic textures, lighting, and colors.",
        whatYouReceiveItems: [
          { title: "Photorealistic Images", desc: "High-resolution renderings that simulate real-world materials and environmental lighting." },
          { title: "Material Visualization", desc: "Clear representation of textures, finishes, and color palettes applied to the design." },
          { title: "Atmospheric Lighting", desc: "Realistic sun studies or artificial lighting setups to showcase the project at different times of day." }
        ],
        notIncluded: [
          "Technical Blueprints: No floor plans, sections, or elevations for construction or permits.",
          "Structural Engineering: No technical details regarding the building's integrity or framing.",
          "Interior Design Specification: While we visualize materials, this does not include a full procurement list or furniture shopping links.",
          "Revisions to the Core Design: Renderings are based on a pre-approved layout; major architectural changes are handled in the design phase."
        ],
        idealFor: [
          "Visualizing the Final Result: Seeing exactly how your space will look before any construction begins.",
          "Selling the Property: Creating high-impact marketing materials to attract buyers or investors.",
          "Deciding Finishes: Testing different colors and materials in a realistic environment to ensure the perfect choice."
        ],
        extras: [
          { group: "3D VISUALIZATION MODULES", items: [
            { id: "ex_3d_ext", label: "3D Exterior Rendering", price: "+ $250.00", desc: "High-fidelity 3D visualization of the exterior architecture.", isIncluded: false },
            { id: "ex_3d_kitchen", label: "3D Kitchen Design", price: "+ $180.00", desc: "Photorealistic visualization of your kitchen with materials and lighting.", isIncluded: false },
            { id: "ex_3d_bath", label: "3D Bathroom Design", price: "+ $180.00", desc: "Detailed 3D rendering of your primary bathroom.", isIncluded: false },
            { id: "ex_3d_laundry", label: "3D Laundry Design", price: "+ $180.00", desc: "Functional and aesthetic visualization of the laundry space.", isIncluded: false }
          ]}
        ]
      }
    },
    {
      id: "pdf_to_cad",
      icon: "💻",
      title: "PDF to CAD Conversion",
      tag: "DRAFTING ONLY",
      tagColor: "rgba(245, 158, 11, 0.15)",
      tagTextCol: "#F59E0B",
      desc: "Convert existing PDF blueprints or hand-drawn sketches into fully editable digital CAD files.",
      details: {
        summary: "Technical drafting service to convert existing PDF blueprints, hand-drawn sketches, or old plans into fully editable and scaled digital CAD (.dwg) files. This service is purely focused on digitization and does not include new design work.",
        whatYouReceiveItems: [
          { title: "Fully Editable CAD Files", desc: "Your existing documentation converted into professional .dwg format." },
          { title: "Accurate Scaling", desc: "Conversion of old plans or sketches into precise, scaled digital drawings." },
          { title: "Layer Organization", desc: "Standard CAD layering for easy future editing by architects or engineers." }
        ],
        notIncluded: [
          "Architectural Design: No changes or improvements to the original layout.",
          "Code Review: No verification if the old plans meet current municipal building codes.",
          "Field Measurements: Based strictly on the documents provided by the client.",
          "3D Modeling: This is a 2D technical drafting service only."
        ],
        idealFor: [
          "Digital Archiving: Clients who have old paper plans and need them digitized for safe keeping.",
          "Renovation Base: Providing a digital starting point for future architectural projects.",
          "Contractors: Professionals who need a clean digital file from a hard copy to perform their own take-offs."
        ]
      }
    }
  ];

  return (
    <div className="wz-animate">
      <Title label={T.deliveryPackage} sub={T.packageSub} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        {PKG.map(pkg => {
          const isActive = d.deliveryPkg === pkg.id;
          const isDetOpen = openDet[pkg.id];
          return (
            <div 
              key={pkg.id} 
              className={`wz-card ${isActive ? "active" : ""}`} 
              onClick={() => setPkg(pkg.id)} 
              style={{ padding: 20, borderColor: isActive ? "var(--a)" : "var(--border)", transition: "all 0.2s" }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, border: "2px solid", borderColor: isActive ? "var(--a)" : "var(--border)", background: isActive ? "var(--a)" : "transparent", marginTop: 4, transition: "all 0.2s" }}>
                  {isActive && <Chk />}
                </div>
                <div style={{ fontSize: 24, marginTop: 2 }}>{pkg.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "var(--tx)" }}>{pkg.title}</p>
                    {pkg.tag && (
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".05em", background: pkg.tagColor, color: pkg.tagTextCol, padding: "2px 8px", borderRadius: 4 }}>
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--mu)", lineHeight: 1.5, marginBottom: 12 }}>{pkg.desc}</p>
                  
                  <div 
                    onClick={(e) => toggleDet(pkg.id, e)} 
                    style={{ fontSize: 12, color: "var(--a)", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, userSelect: "none" }}
                  >
                    More details <span style={{ transform: isDetOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 10, display: "inline-block" }}>▼</span>
                  </div>

                  {isDetOpen && pkg.details && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: "var(--r)", marginBottom: 16 }}>
                        {pkg.details.summary && (
                          <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--dm)", marginBottom: 8, textTransform: "uppercase" }}>SUMMARY</p>
                            <p style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.5 }}>{pkg.details.summary}</p>
                          </div>
                        )}

                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--dm)", marginBottom: 12, textTransform: "uppercase" }}>WHAT YOU RECEIVE</p>
                        
                        {pkg.details.whatYouReceiveItems ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                            {pkg.details.whatYouReceiveItems.map((item, idx) => (
                              <div key={idx} style={{ background: "rgba(0,0,0,0.15)", padding: 12, borderRadius: "6px", borderLeft: "3px solid var(--a)" }}>
                                <p style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.5 }}>
                                  <span style={{ fontWeight: 700, color: "var(--a)" }}>{item.title}: </span>
                                  <span style={{ color: "var(--mu)" }}>{item.desc}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.5, marginBottom: 12 }}>{pkg.details.whatYouReceive}</p>
                        )}

                        {pkg.details.notIncluded && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--rd)", marginBottom: 10, textTransform: "uppercase" }}>WHAT IS NOT INCLUDED</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {pkg.details.notIncluded.map((it, idx) => (
                                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                  <span style={{ color: "var(--rd)", fontSize: 12 }}>✕</span>
                                  <p style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.4 }}>{it}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--gn)", marginBottom: 10, textTransform: "uppercase" }}>IDEAL FOR</p>
                          {Array.isArray(pkg.details.idealFor) ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {pkg.details.idealFor.map((it, idx) => (
                                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "start" }}>
                                  <span style={{ color: "var(--gn)", fontSize: 12 }}>✓</span>
                                  <p style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.4 }}>{it}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: 6, alignItems: "start" }}>
                              <span style={{ color: "var(--gn)", fontSize: 14, fontWeight: 700 }}>✓</span>
                              <p style={{ fontSize: 13, color: "var(--mu)", lineHeight: 1.5 }}>{pkg.details.idealFor}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {isActive && pkg.details.extras && (
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "var(--dm)", marginBottom: 16, textTransform: "uppercase" }}>SERVICE CUSTOMIZATION</p>
                      {pkg.details.extras.map(group => (
                        <div key={group.group} style={{ marginBottom: 20 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--dm)", marginBottom: 10, textTransform: "uppercase" }}>{group.group}</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {group.items.map(item => {
                              const isChecked = item.isIncluded || d.pkgExtras?.[item.id];
                              const isExOpen = openEx[item.id];
                              return (
                                <div 
                                  key={item.id} 
                                  style={{ border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 16, background: isChecked ? "rgba(255,255,255,0.02)" : "transparent", cursor: item.isIncluded ? "default" : "pointer", transition: "all 0.2s" }}
                                  onClick={() => togglePkgExtra(item.id, item.isIncluded)}
                                >
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                      <div style={{ width: 18, height: 18, borderRadius: 4, border: "1.5px solid", borderColor: isChecked ? (item.isIncluded ? "var(--gn)" : "var(--a)") : "var(--border)", background: isChecked ? (item.isIncluded ? "var(--gn)" : "var(--a)") : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                                        {isChecked && <Chk />}
                                      </div>
                                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tx)" }}>{item.label}</span>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: item.isIncluded ? "var(--gn)" : "var(--a)" }}>{item.price}</span>
                                  </div>
                                  
                                  {item.desc && (
                                    <div style={{ marginTop: 12, marginLeft: 30 }}>
                                      <div 
                                        onClick={(e) => toggleEx(item.id, e)} 
                                        style={{ fontSize: 11, color: "var(--a)", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, userSelect: "none", marginBottom: isExOpen ? 8 : 0 }}
                                      >
                                        More details <span style={{ transform: isExOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 9, display: "inline-block" }}>▼</span>
                                      </div>
                                      {isExOpen && (
                                        <p style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.5, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: "6px", marginTop: 8, borderLeft: "2px solid var(--a)" }}>
                                          {item.desc}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function S5({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
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

  const services = d.services || {};
  const setSvc = (k) => up("services", { ...services, [k]: !services[k] });

  return (
    <div className="wz-animate">
      <Title label={T.selectServices} sub={T.servicesSub} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {Object.entries(SVC_LABELS).map(([k, label]) => (
          <div key={k} className={`wz-card ${services[k] ? "active" : ""}`} onClick={() => setSvc(k)} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid var(--border2)", background: services[k] ? "var(--a)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {services[k] && <Chk />}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function S5({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const [showDetails, setShowDetails] = useState(false);

  const goals = [
    { id: "permit", label: isUS ? "Building Permit Only" : "Apenas Aprovação Legal" },
    { id: "construction", label: isUS ? "Construction Documentation" : "Documentação de Construção" },
    { id: "investment", label: isUS ? "Investment / Flip" : "Investimento / Flip" },
    { id: "personal", label: isUS ? "Personal Residence" : "Residência Pessoal" },
  ];

  const constraints = [
    { id: "c_hoa", label: "HOA" },
    { id: "c_history", label: "Historical District" },
    { id: "c_nature", label: "Conservation / Wetland" },
    { id: "c_setback", label: "Specific Setbacks" },
  ];

  return (
    <div className="wz-animate">
      <Title 
        label={isUS ? "Project Specifications" : "Especificações do Projeto"} 
        sub={isUS ? "Tell us more about the goals and constraints of your project." : "Conte-nos mais sobre os objetivos e restrições do seu projeto."} 
      />

      <div className="wz-card" style={{ marginBottom: "32px", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>⚙️</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--mu)" }}>{isUS ? "Project Goals & Constraints" : "Objetivos e Restrições"}</span>
          </div>
          <button onClick={() => setShowDetails(!showDetails)} style={{ background: "none", border: "none", color: "var(--a)", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>
            {showDetails ? (isUS ? "- Less details" : "- Menos detalhes") : (isUS ? "+ More details" : "+ Mais detalhes")}
          </button>
        </div>
        {showDetails && (
          <div className="wz-animate" style={{ marginTop: "16px", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: "13px", color: "var(--mu)", lineHeight: "1.6", marginBottom: "12px" }}>
              <strong>{isUS ? "Technical Alignment:" : "Alinhamento Técnico:"}</strong> {isUS ? "This stage ensures that our design team understands the physical and legal constraints of your property." : "Esta etapa garante que nossa equipe de design entenda as restrições físicas e legais de sua propriedade."}
            </p>
            <p style={{ fontSize: "13px", color: "var(--mu)", lineHeight: "1.6" }}>
              <strong>{isUS ? "Customized Scope:" : "Escopo Personalizado:"}</strong> {isUS ? "We will adjust the documentation level based on your specific requirements for zoning, setbacks, or HOA guidelines." : "Ajustaremos o nível de documentação com base em seus requisitos específicos de zoneamento, recuos ou diretrizes de condomínio."}
            </p>
          </div>
        )}
      </div>

      <div className="wz-f" style={{ marginBottom: "32px" }}>
        <label className="wz-label">{isUS ? "Project Goal" : "Objetivo do Projeto"}</label>
        <select className="wz-inp" value={d.goal || ""} onChange={e => up("goal", e.target.value)} style={{ appearance: "none", background: "var(--bg1) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E\") no-repeat right 16px center" }}>
          <option value="">{isUS ? "Select a goal..." : "Selecione um objetivo..."}</option>
          {goals.map(g => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <p className="wz-label" style={{ marginBottom: "16px" }}>{isUS ? "Property Constraints" : "Restrições da Propriedade"}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {constraints.map(c => (
            <div key={c.id} className={`wz-card ${d[c.id] ? "active" : ""}`} onClick={() => up(c.id, !d[c.id])} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid var(--border2)", background: d[c.id] ? "var(--a)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {d[c.id] && <Chk />}
              </div>
              <span style={{ fontSize: "13px", color: d[c.id] ? "var(--tx)" : "var(--mu)", fontWeight: d[c.id] ? "600" : "500" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="wz-label" style={{ marginBottom: "16px" }}>{isUS ? "Additional Notes" : "Notas Adicionais"}</p>
        <textarea 
          placeholder={isUS ? "Share details about your property in Massachusetts (Weston, Dover, etc.)" : "Compartilhe detalhes sobre sua propriedade em Massachusetts (Weston, Dover, etc.)"} 
          value={d.notes || ""} 
          onChange={e => up("notes", e.target.value)}
          style={{ width: "100%", background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", color: "var(--tx)", fontSize: "14px", minHeight: "120px", resize: "vertical" }}
        />
      </div>
    </div>
  );
}

function S6({ d, up, lang }) {
  const T = TRANSLATIONS[lang];
  const rooms = d.rooms || { ...ROOM_DEF };
  const setR = (k, v) => up("rooms", { ...rooms, [k]: v });

  return (
    <div className="wz-animate">
      <Title label={T.programReqs} sub={T.programSub} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {ROOM_GROUPS.map(g => (
          <div key={g.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--tx)" }}>{g.label}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {g.items.map((item, idx) => {
                const val = rooms[item.id] || 0;
                // Borders logic for 3-column grid
                const hasRightBorder = (idx + 1) % 3 !== 0;
                const isNotLastRow = idx < g.items.length - (g.items.length % 3 === 0 ? 3 : g.items.length % 3);

                return (
                  <div key={item.id} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "16px 20px", 
                    borderBottom: isNotLastRow ? "1px solid var(--border)" : "none",
                    borderRight: hasRightBorder ? "1px solid var(--border)" : "none"
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: val > 0 ? "var(--tx)" : "var(--mu)" }}>
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

      <div style={{ marginTop: 40 }}>
        <p className="wz-label" style={{ fontSize: 10, opacity: 0.8, marginBottom: 12 }}>{T.specialReqs}</p>
        <textarea 
          className="wz-textarea" 
          placeholder={T.specialReqsPlaceholder} 
          style={{ background: "#0c0c14", minHeight: 140, borderRadius: "10px" }}
          value={d.specialReqs || ""} 
          onChange={e => up("specialReqs", e.target.value)} 
        />
      </div>
    </div>
  );
}

function S7({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  
  const cats = [
    { 
      id: "inspiration", 
      label: isUS ? "Inspiration Images" : "Imagens de Inspiração", 
      icon: "🖼️", 
      types: "JPG · PNG · GIF · WEBP · max 100MB",
      accept: ".jpg,.jpeg,.png,.gif,.webp",
      color: "#6366f1"
    },
    { 
      id: "videos", 
      label: isUS ? "Videos" : "Vídeos", 
      icon: "🎥", 
      types: "MP4 · MOV · WEBM · max 100MB",
      accept: ".mp4,.mov,.webm",
      color: "#d946ef"
    },
    { 
      id: "documents", 
      label: isUS ? "Technical Documents" : "Documentos Técnicos", 
      icon: "📋", 
      types: "PDF · DOC · DWG · DXF · max 100MB",
      accept: ".pdf,.doc,.docx,.dwg,.dxf",
      color: "#f59e0b"
    },
    { 
      id: "other", 
      label: isUS ? "Other Files" : "Outros Arquivos", 
      icon: "📎", 
      types: "Any file type · max 100MB",
      accept: "*",
      color: "#10b981"
    },
  ];

  const uploads = d.uploads || {};

  return (
    <div className="wz-animate">
      <Title label={isUS ? "Upload Reference Files" : "Upload de Referências"} sub={isUS ? "Upload by category — up to 100MB per file." : "Upload por categoria — até 100MB por arquivo."} />

      {/* Info Alert */}
      <div style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "12px", padding: "20px", display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div style={{ color: "#818cf8", fontSize: "20px" }}>ⓘ</div>
        <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--mu)" }}>
          {isUS ? (
            <>Please upload any relevant documents such as: Existing Floor Plans, Site Surveys, sketches, or photos of the property. <strong>Clear documentation helps us provide a more accurate and faster design service.</strong></>
          ) : (
            <>Por favor, envie documentos relevantes como: Plantas Existentes, Levantamentos, croquis ou fotos da propriedade. <strong>Documentação clara nos ajuda a fornecer um serviço de design mais preciso e rápido.</strong></>
          )}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {cats.map(cat => (
          <div key={cat.id} style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{cat.icon}</span>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--tx)" }}>{cat.label}</h3>
                  <p style={{ fontSize: "10px", color: "var(--dm)", letterSpacing: ".05em", marginTop: "2px" }}>{cat.types}</p>
                </div>
              </div>
            </div>
            <div style={{ padding: "20px" }}>
              <div className="wz-drop" style={{ padding: "32px 16px", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ marginBottom: "12px", color: "var(--mu)", fontSize: "24px", opacity: 0.8 }}>☁️</div>
                <p style={{ fontSize: "13px", color: "var(--mu)" }}>
                  {isUS ? "Drop here or " : "Arraste ou "}
                  <span style={{ color: cat.color, fontWeight: "700", cursor: "pointer" }}>{isUS ? "browse" : "procurar"}</span>
                </p>
                <input type="file" multiple accept={cat.accept} style={{ display: "none" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function S8({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const [feedback, setFeedback] = useState("");
  const fileRefs = useRef({});

  const checklist = [
    { id: "chk_survey", label: isUS ? "Property Survey / Site Plan" : "Levantamento Topográfico / Site Plan", required: true },
    { id: "chk_photos", label: isUS ? "Clear Photos of all sides of the property" : "Fotos claras de todos os lados da propriedade", required: true },
    { id: "chk_measure", label: isUS ? "Rough measurements (Sketches or existing plans)" : "Medidas básicas (Croquis ou plantas existentes)", required: true },
    { id: "chk_listing", label: isUS ? "Current real estate listing (Zillow, Redfin, etc.)" : "Anúncio imobiliário atual (Zillow, Redfin, etc.)", sub: isUS ? "Recommended" : "Recomendado" },
    { id: "chk_matter", label: isUS ? "Matterport or 3D Virtual Tour" : "Matterport ou Tour Virtual 3D", sub: isUS ? "If available" : "Se disponível" },
    { id: "chk_reports", label: isUS ? "Appraisal or structural reports" : "Laudos de avaliação ou estruturais", sub: isUS ? "If available" : "Se disponível" },
  ];

  const requiredCount = 3; // First 3 are mandatory
  const completedRequired = checklist.slice(0, 3).filter(c => d[c.id]).length;
  const remaining = requiredCount - completedRequired;
  const isUnlocked = remaining === 0;

  const handleFileChange = (id, e) => {
    if (e.target.files && e.target.files.length > 0) {
      up(id, true);
      setFeedback("");
    }
  };

  const handleLockedClick = () => {
    setFeedback(isUS ? "Please upload the 3 mandatory files above to unlock faster delivery timelines." : "Por favor, faça o upload dos 3 arquivos obrigatórios acima para desbloquear prazos de entrega mais rápidos.");
    setTimeout(() => setFeedback(""), 4000);
  };

  const options = [
    { 
      id: "standard", 
      label: isUS ? "Standard Delivery" : "Entrega Padrão", 
      sub: isUS ? "Included in base price — no additional charge." : "Incluído no preço base — sem custo adicional.", 
      icon: "📦", 
      fee: "FREE",
      locked: false 
    },
    { 
      id: "rush", 
      label: isUS ? "Rush Delivery" : "Entrega Prioritária", 
      tag: "+40%",
      sub: isUS ? "+40% on subtotal. Studio will contact you to confirm exact timeline." : "+40% no subtotal. O Studio entrará em contato para confirmar o cronograma.", 
      days: isUS ? "8–16 Business Days (depends on project size)." : "8–16 Dias Úteis (depende do tamanho do projeto).",
      icon: "🔒", 
      fee: "+40%",
      locked: !isUnlocked 
    },
    { 
      id: "express", 
      label: isUS ? "Express Delivery" : "Entrega Expressa", 
      tag: "+60%",
      sub: isUS ? "+60% on subtotal. Studio will contact you to confirm exact timeline." : "+60% no subtotal. O Studio entrará em contato para confirmar o cronograma.", 
      days: isUS ? "5–10 Business Days (depends on project size)." : "5–10 Dias Úteis (depende do tamanho do projeto).",
      icon: "🔒", 
      fee: "+60%",
      locked: !isUnlocked 
    },
  ];

  return (
    <div className="wz-animate">
      <Title label={isUS ? "Rush Fees & Delivery" : "Taxas de Urgência & Entrega"} sub={isUS ? "Confirm your documents to unlock faster delivery options." : "Confirme seus documentos para desbloquear opções de entrega mais rápidas."} />

      {/* Checklist Box */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".1em", color: "var(--mu)", textTransform: "uppercase" }}>{isUS ? "DOCUMENT CHECKLIST" : "CHECKLIST DE DOCUMENTOS"}</h3>
          <span style={{ fontSize: "11px", color: "var(--dm)" }}>{remaining} {isUS ? "required remaining" : "obrigatórios restantes"}</span>
        </div>
        <div>
          {checklist.map((item, idx) => {
            const isDone = !!d[item.id];
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: idx < checklist.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ 
                    width: "18px", height: "18px", borderRadius: "4px", 
                    border: `1.5px solid ${isDone ? "var(--gn)" : "var(--border2)"}`,
                    background: isDone ? "var(--gn)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .2s"
                  }}>
                    {isDone && <Chk />}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: isDone ? "var(--tx)" : "var(--mu)" }}>{item.label}</p>
                    {item.sub && <p style={{ fontSize: "11px", color: "var(--dm)", marginTop: "2px" }}>{item.sub}</p>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {idx < 3 && !isDone && <span style={{ fontSize: "11px", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>{isUS ? "Required" : "Obrigatório"}</span>}
                  <button 
                    className="wz-btn-ghost" 
                    onClick={() => fileRefs.current[item.id]?.click()}
                    style={{ padding: "6px 12px", fontSize: "11px", height: "auto", borderColor: isDone ? "var(--gn)" : "var(--border2)", color: isDone ? "var(--gn)" : "var(--mu)" }}
                  >
                    {isDone ? (isUS ? "Uploaded" : "Enviado") : (isUS ? "+ Upload" : "+ Enviar")}
                  </button>
                  <input type="file" ref={el => fileRefs.current[item.id] = el} style={{ display: "none" }} onChange={(e) => handleFileChange(item.id, e)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Red Alert Card (Exact Match) */}
      {!isUnlocked && (
        <div style={{ 
          background: "rgba(239, 68, 68, 0.02)", 
          border: "1px solid rgba(239, 68, 68, 0.25)", 
          borderRadius: "12px", 
          padding: "18px 24px", 
          display: "flex", 
          alignItems: "center", 
          gap: "16px", 
          marginBottom: "32px" 
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <p style={{ fontSize: "14px", color: "#ef4444", fontWeight: "400", lineHeight: "1.4", opacity: 0.9 }}>
            {isUS ? "Confirm the 3 required documents above to unlock Rush and Express delivery options." : "Confirme os 3 documentos obrigatórios acima para desbloquear as opções Rush e Express."}
          </p>
        </div>
      )}

      {/* Feedback message (floating if trying to click locked) */}
      {feedback && (
        <div className="wz-animate" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", fontWeight: "500" }}>
          ⚠️ {feedback}
        </div>
      )}

      <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".1em", color: "var(--mu)", textTransform: "uppercase", marginBottom: "16px" }}>SELECT DELIVERY TIMELINE</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {options.map(opt => {
          const isSelected = d.rush === opt.id;
          return (
            <div 
              key={opt.id} 
              className={`wz-card ${isSelected ? "active" : ""} ${opt.locked ? "locked" : ""}`} 
              onClick={() => opt.locked ? handleLockedClick() : up("rush", opt.id)}
              style={{ 
                padding: "24px", 
                opacity: opt.locked ? 0.3 : 1, 
                cursor: opt.locked ? "not-allowed" : "pointer",
                filter: opt.locked ? "grayscale(1) brightness(0.7)" : "none",
                position: "relative",
                transition: "all .4s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {opt.locked ? (
                  <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyItems: "center", fontSize: 24, color: "#d97706" }}>🔒</div>
                ) : (
                  <div style={{ fontSize: "32px" }}>{opt.icon}</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <h4 style={{ fontSize: "18px", fontWeight: "600", color: opt.locked ? "var(--mu)" : "var(--tx)" }}>{opt.label}</h4>
                    {opt.tag && <span style={{ background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "var(--dm)" }}>{opt.tag}</span>}
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--mu)", marginBottom: opt.days ? "8px" : 0 }}>{opt.sub}</p>
                  {opt.days && <p style={{ fontSize: "13px", color: "#818cf8", fontStyle: "italic" }}>{opt.days}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function S9({ d, est, setStep, lang }) {
  const isUS = d.region !== "BR";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // Profile marking for CRM
      const profileType = d.role || "unknown";
      const crmUrl = `https://crm.darastudio.com/leads?source=wizard&profile=${profileType}&name=${encodeURIComponent(d.name || "")}&email=${encodeURIComponent(d.email || "")}`;

      // In a real scenario, we might post to our backend first
      // For now, we simulate the submission and redirect
      setTimeout(() => {
        window.location.href = crmUrl;
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(isUS ? "An error occurred. Please try again." : "Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  };

  const ReviewRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
      <span style={{ fontSize: "12px", color: "var(--dm)", textTransform: "capitalize" }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--tx)", textAlign: "right" }}>{value || "—"}</span>
    </div>
  );

  const Section = ({ icon, title, step, children }) => (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px" }}>{icon}</span>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--tx)" }}>{title}</h3>
        </div>
        <button onClick={() => setStep(step)} style={{ background: "none", border: "none", color: "#6366f1", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          Edit <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div className="wz-animate">
      {d.role === "builder" && (
        <div style={{ background: "rgba(0, 128, 128, 0.1)", border: "2px solid #008080", padding: "20px 24px", borderRadius: "12px", marginBottom: "32px", boxShadow: "0 8px 32px rgba(0, 128, 128, 0.15)" }}>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#008080", lineHeight: "1.4" }}>
            {isUS 
              ? "Professional Builder? Register your firm below to unlock a 10% volume discount on all future permit sets in MA."
              : "Construtor Profissional? Registre sua empresa abaixo para desbloquear um desconto de volume de 10% em todos os futuros conjuntos de licenças em MA."}
          </p>
        </div>
      )}

      <Title label={isUS ? "Review your brief." : "Revise seu resumo."} sub={isUS ? "Verify every detail before submitting. Click any section to edit." : "Verifique cada detalhe antes de enviar. Clique em qualquer seção para editar."} />


      {/* Review Sections */}
      <Section icon="👤" title="Client" step={1}>
        <ReviewRow label="Name" value={d.name} />
        <ReviewRow label="Email" value={d.email} />
        <ReviewRow label="Phone" value={d.phone} />
        <ReviewRow label="Role" value={d.role} />
      </Section>

      <Section icon="📍" title="Location" step={0}>
        <ReviewRow label="Address" value={d.address} />
        <ReviewRow label="Region" value={d.region === "BR" ? "Brazil" : "United States"} />
      </Section>

      <Section icon="🏗️" title="Project" step={2}>
        <ReviewRow label="Property Type" value={d.propertyType} />
        <ReviewRow label="Levels" value={d.levels === "single" ? "Ground Floor" : "Multiple Floors"} />
        <ReviewRow label="Services" value={d.service} />
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--dm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>DIMENSIONS</p>
          <ReviewRow label={d.service} value={`${d.area || 0} sqft`} />
        </div>
      </Section>

      <Section icon="📋" title={isUS ? "Final Summary" : "Resumo Final"} step={3}>
        <ReviewRow label={isUS ? "Total Square Footage" : "Área Total"} value={`${Math.round(est.totalArea).toLocaleString()} ${isUS ? "sqft" : "m²"}`} />
        <div style={{ marginTop: "12px", padding: "12px", background: "rgba(255,255,255,0.01)", borderRadius: "8px" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--dm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>{isUS ? "SELECTED SERVICES" : "SERVIÇOS SELECIONADOS"}</p>
          {est.bd.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
              <span style={{ color: "var(--mu)" }}>{it.l}</span>
              <span style={{ fontWeight: "600", color: "var(--tx)" }}>{it.v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px" }}>
          <ReviewRow 
            label={isUS ? "Estimated Timeline" : "Cronograma Estimado"} 
            value={d.rush === "express" ? (isUS ? "5–10 Business Days" : "5–10 Dias Úteis") : 
                   d.rush === "rush" ? (isUS ? "8–16 Business Days" : "8–16 Dias Úteis") : 
                   (isUS ? "Standard (Contact Studio)" : "Padrão (Contate o Studio)")} 
          />
        </div>
      </Section>

      <Section icon="📂" title="Documentation" step={5}>
        <p style={{ fontSize: "13px", color: "var(--dm)", fontStyle: "italic" }}>
          {Object.keys(d).some(k => k.startsWith('chk_') && d[k]) ? "Documents successfully verified." : "No documents attached"}
        </p>
      </Section>

      {/* What Happens Next */}
      <div style={{ marginTop: "48px", marginBottom: "48px" }}>
        <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".15em", color: "var(--mu)", textTransform: "uppercase", marginBottom: "24px" }}>WHAT HAPPENS NEXT</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: "14px", fontWeight: "700", flexShrink: 0 }}>01</div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--tx)", marginBottom: "4px" }}>Estimate Review</h4>
              <p style={{ fontSize: "13px", color: "var(--mu)" }}>Our team reviews your brief within 24 hours.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: "14px", fontWeight: "700", flexShrink: 0 }}>02</div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--tx)", marginBottom: "4px" }}>Formal Quote</h4>
              <p style={{ fontSize: "13px", color: "var(--mu)" }}>You receive a detailed, no-surprise proposal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #ef444466", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ color: "#f59e0b" }}>⚠️</span>
          <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".05em" }}>IMPORTANT LEGAL DISCLAIMER</h4>
        </div>
        <p style={{ fontSize: "12px", color: "var(--mu)", lineHeight: "1.8" }}>
          This estimate is strictly for initial design and drafting services. It <strong>DOES NOT INCLUDE</strong> professional engineering seals (PE/SE stamps) or architectural stamps required for building permit submission. The client is solely responsible for retaining and paying a licensed Engineer or Architect of Record to review, certify, and stamp the final drawings for municipal approval.
        </p>
      </div>

      {/* Agreement Box */}
      <div style={{ background: "rgba(239, 68, 68, 0.03)", border: "1px solid #ef444444", borderRadius: "12px", padding: "20px", marginBottom: "40px", display: "flex", gap: "16px" }}>
        <span style={{ color: "#ef4444", marginTop: "2px" }}>⚠️</span>
        <p style={{ fontSize: "13px", color: "#ef4444", lineHeight: "1.5" }}>
          The value above is an estimate based on the information provided. The final fee will be confirmed after our team reviews your brief. By proceeding, you agree to receive a formal proposal.
        </p>
      </div>

      {/* Final Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
        {error && (
          <div style={{ width: "100%", padding: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid var(--rd)", color: "var(--rd)", fontSize: 13, borderRadius: "6px", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ width: "100%", textAlign: "center" }}>
          <button className="wz-btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%", height: "56px", fontSize: "16px", opacity: loading ? 0.7 : 1, background: "var(--a)", boxShadow: "0 0 32px var(--a-glow)" }}>
            {loading ? (isUS ? "⌛ Processing..." : "⌛ Processando...") : (isUS ? "🛡️ Pay Retainer & Start Project" : "🛡️ Pagar Sinal e Iniciar Projeto")}
          </button>
          <p style={{ fontSize: "11px", color: "var(--dm)", marginTop: "12px" }}>{isUS ? "Secure payment via Stripe or Bank Transfer" : "Pagamento seguro via Stripe ou Transferência"}</p>
        </div>

        <div style={{ width: "100%", textAlign: "center" }}>
          <button className="wz-btn-ghost" style={{ width: "100%", height: "56px", fontSize: "15px" }}>
            💾 Save for Later
          </button>
          <p style={{ fontSize: "11px", color: "var(--dm)", marginTop: "12px" }}>Just email me this estimate for now</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
          <span style={{ fontSize: "12px", color: "#f59e0b" }}>🔒</span>
          <p style={{ fontSize: "11px", color: "var(--dm)" }}>You will be redirected to our secure client portal to finalize your order.</p>
        </div>
      </div>
    </div>
  );
}

