import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import GlobalControls from "../components/GlobalControls";
import InputMask from "react-input-mask";

/* ═══ CONSTANTS ═══ */
const STEPS_EN = ["Location", "About You", "Project", "Scope", "Program", "Files", "Rush", "Review"];
const STEPS_PT = ["Localização", "Sobre Você", "Projeto", "Escopo", "Programa", "Arquivos", "Urgência", "Revisão"];

/* ═══ PRICING CONSTANTS ═══ */
const BASE_RATE_MAIN = 1.40;
const BASE_RATE_SUB = 0.80;
const EXTRA_RATES = {
  ex_arch_design: 0.15,
  ex_space_plan: 0.15,
  ex_interior_lay: 0.10,
  ex_const_detail: 0.20,
  ex_code_comp: 0.05,
  ex_3d_ext: 0.10
};

const FIXED_FEES = {
  ex_3d_kitchen: 180,
  ex_3d_bath: 180,
  ex_3d_laundry: 180
};

const MARKET_DATA = {
  US: {
    zipMask: "99999",
    phoneMask: "+1 (999) 999-9999",
    country: "USA",
    zipPlaceholder: "02101",
    phonePlaceholder: "+1 (000) 000-0000",
    dimW: "e.g. 31'2\" or 120",
    dimL: "e.g. 45'0\" or 540",
    addressLabel: { EN: "Project address in the US", PT: "Endereço do projeto nos EUA" }
  },
  BR: {
    zipMask: "99999-999",
    phoneMask: "+55 (99) 99999-9999",
    country: "Brasil",
    zipPlaceholder: "01310-100",
    phonePlaceholder: "+55 (00) 00000-0000",
    dimW: "ex: 10.5",
    dimL: "ex: 15.5",
    addressLabel: { EN: "Project address in Brazil", PT: "Endereço do projeto no Brasil" }
  }
};

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
    homeownerMsg: "Planning your dream home? We're here to help.",
    builderMsg: "We love working with builders! Let’s streamline the design process for your next project.",
    architectMsg: "Let's collaborate on some great designs together.",
    investorMsg: "Let's optimize your ROI with strategic design solutions.",
    realtorMsg: "Helping your clients visualize potential? You're in the right place.",
    otherMsg: "How can we help you transform your space today?",
    ircIbcStandardsMsg: "All designs are developed in accordance with IRC/IBC standards to ensure structural compliance and safety.",
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
    serviceCustomization: "SERVICE CUSTOMIZATION",
    summaryTitle: "SUMMARY",
    note: "Note",
    whatYouReceive: "What you receive",
    roles: { homeowner: "Homeowner", builder: "Builder", architect: "Architect", investor: "Investor", realtor: "Realtor", other: "Other" },
    constructionStructure: "Construction & Structure",
    interiors: "Interiors",
    typeOfService: "Type of Service",
    svcLabels: {
      new_construction: "New Construction", addition: "Addition", second_story: "Second Story Addition",
      garage_only: "Garage Only", garage_conversion: "Garage Conversion", basement_finishing: "Basement Finishing",
      deck_covered: "Covered Deck", deck_open: "Open Deck", porch_covered: "Covered Porch", porch_open: "Open / Screened Porch",
      renovation: "Renovations & Remodeling", other_const: "Other Construction",
      kitchen_remodel: "Kitchen Remodel", bath_remodel: "Bath Remodel", open_concept: "Open Concept Conversion", other_int: "Other Interior"
    },
    propertyTypes: {
      single_family: { label: "Single Family Home", sub: "One family" },
      multi_family: { label: "Multi-Family", sub: "Duplex, Triplex…" },
      adu: { label: "ADU", sub: "Accessory Dwelling Unit" }
    },
    svcSubs: {
      new_construction: "Complete project from scratch", addition: "New bedroom, wing or garage", second_story: "Build a new upper floor",
      garage_only: "Standalone garage project", garage_conversion: "Garage → livable area / ADU", basement_finishing: "Remodel and finish a basement",
      deck_covered: "Deck with roof structure", deck_open: "Deck without roof", porch_covered: "Porch with roof", porch_open: "Open or screened porch",
      renovation: "General remodel", other_const: "Other construction services",
      kitchen_remodel: "Focus on kitchen areas", bath_remodel: "Focus on bathroom areas", open_concept: "Remove walls, integrate spaces", other_int: "Other interior services"
    },
    pkgLabels: { as_built_permit: "As-Built & Permit Package", floor_plans_only: "Floor Plans Only", pdf_to_cad: "PDF to CAD", "3d_rendering": "3D Rendering" },
    price3DExt: "+ $250.00",
    price3DInt: "+ $180.00",
    unlockRush: "Please upload the 3 mandatory files above to unlock faster delivery timelines.",
    checklist: {
      survey: "Property Survey / Site Plan",
      photos: "Clear Photos of all sides of the property",
      measure: "Rough measurements (Sketches or existing plans)",
      listing: "Current real estate listing (Zillow, Redfin, etc.)",
      tour: "Matterport or 3D Virtual Tour",
      reports: "Appraisal or structural reports",
      recommended: "Recommended",
      ifAvailable: "If available"
    },
    unlockRushAlert: "Confirm the 3 required documents above to unlock Rush and Express delivery options.",
    pkgNotIncluded: "WHAT IS NOT INCLUDED",
    speeds: {
      standard: {
        sub: "Included in base price — no additional charge.",
        days: "Standard turnaround"
      },
      rush: {
        sub: "+40% on subtotal. Studio will contact you to confirm exact timeline.",
        days: "8–16 Business Days (depends on project size)."
      },
      express: {
        sub: "+60% on subtotal. Studio will contact you to confirm exact timeline.",
        days: "5–10 Business Days (depends on project size)."
      }
    },
    projectEstimate: "Project Estimate",
    uploadTitle: "Upload Reference Files",
    uploadHelp: "Please upload any relevant documents such as: Existing Floor Plans, Site Surveys, sketches, or photos of the property. Clear documentation helps us provide a more accurate and faster design service.",
    dropHere: "Drop here or ",
    browse: "click to browse",
    projectIntent: "Project Intent",
    detected: "Detected",
    dimInstructions: "Accepted formats: 10'1\", 5'-10\", 6'3 1/4\", 180. Please do not use periods (.) or commas (,).",
    rushFeesTitle: "Rush Fees & Delivery",
    rushFeesSub: "Confirm your documents to unlock faster delivery options.",
    docChecklist: "DOCUMENT CHECKLIST",
    requiredRemaining: "required remaining",
    required: "Required",
    uploaded: "Uploaded",
    uploadAction: "+ Upload",
    goals: {
      permit: "Building Permit Only",
      construction: "Construction Documentation",
      investment: "Investment / Flip",
      personal: "Personal Residence"
    },
    svcDescs: {
      new_construction: "Building a brand new house from the foundation up on an empty lot or after a full demolition.",
      addition: "Expanding the home's footprint horizontally by adding new rooms outward.",
      second_story: "Expanding vertically by removing the roof and adding a full new level.",
      garage_only: "Building a brand new detached or attached garage.",
      garage_conversion: "Transforming an existing garage into a livable space (office, game room, or ADU).",
      basement_finishing: "Turning an unfinished, concrete basement into a fully insulated and usable living area.",
      deck_covered: "An outdoor wooden or composite platform featuring a permanent roof structure.",
      deck_open: "A classic outdoor platform without a roof.",
      porch_covered: "A porch with a solid floor and a permanent roof.",
      porch_open: "A porch fully enclosed with insect screens for comfortable summer use.",
      renovation: "General updating of the home's interior or exterior without adding new square footage.",
      other_const: "Other construction services not listed.",
      kitchen_remodel: "Full kitchen update including new cabinets, islands, countertops, and appliances.",
      bath_remodel: "Full bathroom update including walk-in showers, new vanities, and tiling.",
      open_concept: "Removing structural or non-structural walls to integrate the kitchen, dining, and living areas.",
      other_int: "Other interior services not listed."
    },
    program: {
      living: "Living & Social",
      bed: "Bedrooms & Sleeping",
      kitchen: "Kitchen & Dining",
      bath: "Bathrooms & Laundry",
      work: "Working & Storage",
      leisure: "Entertainment & Outdoor",
      tech: "Utilities & Tech"
    },
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
    },
    projectDimensions: "Project Dimensions",
    addLevelsFloors: "Add Levels / Floors",
    propertyTypeLabel: "Property Type",
    lotSizeLabel: "Lot Size",
    grandTotalArea: "Grand Total Area",
    pkgTitles: {
      as_built_permit: "As-Built Drawings & Permit Packages",
      floor_plans_only: "Floor Plans Only",
      pdf_to_cad: "PDF to CAD Conversion",
      "3d_rendering": "3D Realistic Rendering"
    },
    pkgSubs: {
      as_built_permit: "Comprehensive package including all floor levels, design extras, and 3D visualization.",
      floor_plans_only: "Detailed 2D architectural drawings of your existing space.",
      pdf_to_cad: "High-precision conversion of your existing PDF plans into professional CAD format.",
      "3d_rendering": "Breathtaking photorealistic visualizations of your architectural project."
    },
    pkgDetails: {
      as_built_permit: {
        summary: "Comprehensive architectural package tailored to your needs. From essential municipal documentation to full executive design, including 3D visualization and technical detailing.",
        whatYouReceive: [
          { title: "Basic Permit Set (Fundamental)", desc: "Essential set including Existing/Demolition/Proposed plans, 2 Sections, 4 Elevations, and Roof Plan." },
          { title: "Design & Space Planning (Optional)", desc: "Aesthetic development, optimal room flow analysis, and micro-level interior layout." },
          { title: "Technical Construction Set (Optional)", desc: "Framing plans (pre-dimensioning), construction details, and schedules for the builder." },
          { title: "3D Visualization (Optional)", desc: "High-fidelity exterior rendering to see the final result before construction." },
          { title: "Existing Conditions / History", desc: "Detailed digital documentation of the property's current state and historical records." }
        ],
        notIncluded: ["Material Procurement", "Landscape Design", "Cabinetry Shop Drawings"],
        idealFor: ["Homeowners needing permits", "Complex Projects", "Professional Approval"]
      },
      floor_plans_only: {
        tag: "LOW COMPLEXITY",
        summary: "A streamlined service delivering fundamental interior spatial layouts and dimensioned floor plans.",
        whatYouReceive: [
          { title: "Fundamental Spatial Layouts", desc: "Basic interior walls, doors, and room identification." },
          { title: "Dimensioned Floor Plans", desc: "Precise measurements of all interior spaces and structural elements." }
        ],
        notIncluded: ["Exterior Design", "3D Renderings", "Building Permits", "Structural Engineering"],
        idealFor: ["Initial Planning", "Cosmetic Renovations", "Concept Only"]
      },
      pdf_to_cad: {
        tag: "PRECISION",
        summary: "Professional conversion of existing PDF drawings into editable CAD (DWG) format.",
        whatYouReceive: [
          { title: "Fully Editable CAD Files", desc: "Standard DWG format compatible with all major CAD software." },
          { title: "Accurate Scaling", desc: "Verification and adjustment to ensure real-world precision." },
          { title: "Layer Organization", desc: "Structured layers for walls, dimensions, and annotations." }
        ],
        notIncluded: ["Architectural Design", "Code Review", "Field Measurements", "3D Modeling"],
        idealFor: ["Digital Archiving", "Renovation Base", "Contractors"]
      },
      "3d_rendering": {
        tag: "VISUALIZATION",
        summary: "The \"photo\" of the future. This service provides high-quality imagery that brings your project to life with realistic textures, lighting, and colors.",
        whatYouReceive: [
          { title: "Photorealistic Images", desc: "High-resolution 3D renders with realistic materials and environments." },
          { title: "Material Visualization", desc: "See your choices for siding, roofing, and windows in context." },
          { title: "Atmospheric Lighting", desc: "Natural and artificial lighting simulation for a realistic feel." }
        ],
        notIncluded: ["Technical Blueprints", "Structural Engineering", "Interior Design Specification", "Revisions to the Core Design"],
        idealFor: ["Visualizing the Final Result", "Selling the Property", "Deciding Finishes"]
      }
    },
    pkgExtras: {
      groups: {
        design: "DESIGN EXTRAS",
        technical: "TECHNICAL & CONSTRUCTION",
        visualization: "3D VISUALIZATION & SPECIFIC ROOMS",
        modules_3d: "3D VISUALIZATION MODULES"
      },
      items: {
        ex_arch_design: { label: "Architectural Design Detail", desc: "Focuses on the conceptual and aesthetic development of your project. Includes exterior elevations, structural style, and overall look and feel." },
        ex_space_plan: { label: "Space Planning", desc: "Macro-level design focusing on the optimal arrangement of walls, doors, and room flows. We analyze the best way to utilize the square footage for functionality and movement." },
        ex_interior_lay: { label: "Interior Layout", desc: "Micro-level design detailing the placement of furniture, custom cabinetry (like kitchen or bathroom vanities), appliances, and specific fixtures within the defined spaces." },
        ex_const_detail: { label: "Construction Detailing & Framing", desc: "Technical framing plans (pre-dimensioning), essential construction details, and schedules (doors/windows). This module provides the necessary information for your builder to execute the project accurately, reducing material waste and construction time." },
        ex_code_comp: { label: "Code Compliance & Technical Notes", desc: "Detailed municipal code citations, safety notes, and professional annotations required to streamline the permit approval process and ensure legal compliance." },
        ex_3d_ext: { label: "3D Exterior Rendering", desc: "High-fidelity 3D visualization of the exterior architecture." },
        ex_3d_kitchen: { label: "3D Kitchen Design", desc: "Photorealistic visualization of your kitchen with materials and lighting." },
        ex_3d_bath: { label: "3D Bathroom Design", desc: "Detailed 3D rendering of your primary bathroom." },
        ex_3d_laundry: { label: "3D Laundry Design", desc: "Functional and aesthetic visualization of the laundry space." }
      }
    },
    review: {
      client: "Client",
      location: "Location",
      project: "Project",
      summary: "Final Summary",
      documentation: "Documentation",
      name: "Name",
      email: "Email",
      phone: "Phone",
      role: "Role",
      address: "Address",
      region: "Region",
      regionUS: "United States",
      regionBR: "Brazil",
      propType: "Property Type",
      levels: "Levels",
      services: "Services",
      dimensions: "DIMENSIONS",
      totalArea: "Total Square Footage",
      selectedSvcs: "SELECTED SERVICES",
      timeline: "Estimated Timeline",
      docsVerified: "Documents successfully verified.",
      noDocs: "No documents attached",
      edit: "Edit",
      builderDiscount: "Professional Builder? Register your firm below to unlock a 10% volume discount on all future permit sets in MA.",
      title: "Review your brief.",
      sub: "Verify every detail before submitting. Click any section to edit.",
      groundFloor: "Ground Floor",
      multipleFloors: "Multiple Floors",
      days510: "5–10 Business Days",
      days816: "8–16 Business Days",
      timelineStandard: "Standard (Contact Studio)",
      errorOccurred: "An error occurred. Please try again.",
      whatNext: "WHAT HAPPENS NEXT",
      nextSteps: [
        { title: "Estimate Review", desc: "Our team reviews your brief within 24 hours." },
        { title: "Formal Quote", desc: "You receive a detailed, no-surprise proposal." }
      ],
      legalTitle: "IMPORTANT LEGAL DISCLAIMER",
      legalBody: "This estimate is strictly for initial design and drafting services. It DOES NOT INCLUDE professional engineering seals (PE/SE stamps) or architectural stamps required for building permit submission. The client is solely responsible for retaining and paying a licensed Engineer or Architect of Record.",
      agreementBody: "The value above is an estimate based on the information provided. The final fee will be confirmed after our team reviews your brief. By proceeding, you agree to receive a formal proposal.",
      processing: "⌛ Processing...",
      payRetainer: "Confirm & Start My Project",
      secureNotice: "Secure payment via Stripe or Bank Transfer",
      saveLater: "Save for Later — Send me this estimate",
      saveLaterPDF: "You'll receive a PDF with your full brief and estimated fees — no commitment required.",
      emailEstimate: "Just email me this estimate for now",
      redirectNotice: "You will be redirected to our secure client portal to finalize your order.",
      resetButton: "↻ Reset",
      resetConfirm: "Reset all progress and start over?"
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
    homeownerMsg: "Planejando a casa dos seus sonhos? Estamos aqui para ajudar.",
    builderMsg: "Adoramos trabalhar com construtores! Vamos otimizar o processo de design para o seu próximo projeto.",
    architectMsg: "Vamos colaborar em grandes projetos juntos.",
    investorMsg: "Vamos otimizar seu ROI com soluções de design estratégico.",
    realtorMsg: "Ajudando seus clientes a visualizar o potencial? Você está no lugar certo.",
    otherMsg: "Como podemos ajudá-lo a transformar seu espaço hoje?",
    ircIbcStandardsMsg: "Todos os projetos são desenvolvidos de acordo com as normas IRC/IBC para garantir conformidade estrutural e segurança.",
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
    roles: { homeowner: "Proprietário", builder: "Construtor", architect: "Arquiteto", investor: "Investidor", realtor: "Corretor", other: "Outro" },
    constructionStructure: "Construção e Estrutura",
    interiors: "Interiores",
    typeOfService: "Tipo de Serviço",
    svcLabels: {
      new_construction: "Nova Construção", addition: "Ampliação / Extensão", second_story: "Adição de Segundo Pavimento",
      garage_only: "Apenas Garagem", garage_conversion: "Conversão de Garagem", basement_finishing: "Acabamento de Subsolo",
      deck_covered: "Deck Coberto", deck_open: "Deck Aberto", porch_covered: "Varanda Coberta", porch_open: "Varanda Aberta",
      renovation: "Reformas e Remodelações", other_const: "Outra Construção",
      kitchen_remodel: "Reforma de Cozinha", bath_remodel: "Reforma de Banheiro", open_concept: "Conversão de Conceito Aberto", other_int: "Outro Interior"
    },
    propertyTypes: {
      single_family: { label: "Residencial Unifamiliar", sub: "Uma família" },
      multi_family: { label: "Multifamiliar", sub: "Duplex, Triplex…" },
      adu: { label: "ADU", sub: "Unidade Acessória" }
    },
    svcSubs: {
      new_construction: "Projeto completo do zero", addition: "Novo quarto, anexo ou garagem", second_story: "Construir um novo andar superior",
      garage_only: "Projeto de garagem independente", garage_conversion: "Garagem → área habitável / ADU", basement_finishing: "Remodelar e finalizar um subsolo",
      deck_covered: "Deck com estrutura de telhado", deck_open: "Deck sem telhado", porch_covered: "Varanda com telhado", porch_open: "Varanda aberta",
      renovation: "Reforma geral", other_const: "Outros serviços de construção",
      kitchen_remodel: "Foco em áreas de cozinha", bath_remodel: "Foco em áreas de banheiro", open_concept: "Remover paredes, integrar espaços", other_int: "Outros serviços de interior"
    },
    pkgLabels: { as_built_permit: "Pacote de Levantamento e Prefeitura", floor_plans_only: "Apenas Plantas Baixas", pdf_to_cad: "PDF para CAD", "3d_rendering": "Renderização 3D" },
    unlockRush: "Por favor, faça o upload dos 3 arquivos obrigatórios acima para desbloquear prazos de entrega mais rápidos.",
    checklist: {
      survey: "Levantamento Topográfico / Site Plan",
      photos: "Fotos claras de todos os lados da propriedade",
      measure: "Medidas básicas (Croquis ou plantas existentes)",
      listing: "Anúncio imobiliário atual (Zillow, Redfin, etc.)",
      tour: "Matterport ou Tour Virtual 3D",
      reports: "Laudos de avaliação ou estruturais",
      recommended: "Recomendado",
      ifAvailable: "Se disponível"
    },
    unlockRushAlert: "Confirme os 3 documentos obrigatórios acima para desbloquear as opções Rush e Express.",
    pkgNotIncluded: "O QUE NÃO ESTÁ INCLUSO",
    speeds: {
      standard: {
        sub: "Incluído no preço base — sem custo adicional.",
        days: "Prazo padrão"
      },
      rush: {
        sub: "+40% no subtotal. O Studio entrará em contato para confirmar o cronograma.",
        days: "8–16 Dias Úteis (depende do tamanho do projeto)."
      },
      express: {
        sub: "+60% no subtotal. O Studio entrará em contato para confirmar o cronograma.",
        days: "5–10 Dias Úteis (depende do tamanho do projeto)."
      }
    },
    projectEstimate: "Estimativa do Projeto",
    uploadTitle: "Upload de Referências",
    uploadHelp: "Por favor, envie documentos relevantes como: Plantas Existentes, Levantamentos, croquis ou fotos da propriedade. Documentação clara nos ajuda a fornecer um serviço de design mais preciso e rápido.",
    dropHere: "Arraste ou ",
    browse: "clique para carregar",
    projectIntent: "Intuito do Projeto",
    detected: "Detectado",
    dimInstructions: "Formatos aceitos: 10.5 ou 10,5. Use ponto ou vírgula para decimais.",
    rushFeesTitle: "Taxas de Urgência & Entrega",
    rushFeesSub: "Confirme seus documentos para desbloquear opções de entrega mais rápidas.",
    docChecklist: "CHECKLIST DE DOCUMENTOS",
    requiredRemaining: "obrigatórios restantes",
    required: "Obrigatório",
    uploaded: "Enviado",
    uploadAction: "+ Enviar",
    goals: {
      permit: "Apenas Aprovação Legal",
      construction: "Documentação de Construção",
      investment: "Investimento / Flip",
      personal: "Residência Pessoal"
    },
    svcDescs: {
      new_construction: "Construção de uma casa nova do zero em um lote vazio ou após demolição total.",
      addition: "Expansão horizontal da residência, adicionando novos cômodos para fora.",
      second_story: "Expansão vertical removendo o telhado e adicionando um novo pavimento completo.",
      garage_only: "Construção de uma garagem nova, isolada ou anexa.",
      garage_conversion: "Transformação de uma garagem existente em área habitável (escritório, lazer ou ADU).",
      basement_finishing: "Transformação de um subsolo inacabado em área de estar isolada e utilizável.",
      deck_covered: "Plataforma externa de madeira ou composto com estrutura de telhado permanente.",
      deck_open: "Plataforma externa clássica sem telhado.",
      porch_covered: "Varanda com piso sólido e telhado permanente.",
      porch_open: "Varanda totalmente fechada com telas contra insetos.",
      renovation: "Atualização geral do interior ou exterior da casa sem adicionar nova metragem.",
      other_const: "Outros serviços de construção não listados.",
      kitchen_remodel: "Atualização completa da cozinha, incluindo armários, ilhas e eletrodomésticos.",
      bath_remodel: "Atualização completa de banheiro, incluindo boxes e novos revestimentos.",
      open_concept: "Remoção de paredes estruturais ou não para integrar cozinha, jantar e estar.",
      other_int: "Outros serviços de interior não listados."
    },
    program: {
      living: "Social e Estar",
      bed: "Quartos e Dormitórios",
      kitchen: "Cozinha e Jantar",
      bath: "Banheiros e Lavanderia",
      work: "Trabalho e Armazenamento",
      leisure: "Lazer e Externo",
      tech: "Utilidades e Técnica"
    },
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
    },
    projectDimensions: "Dimensões do Projeto",
    addLevelsFloors: "Adicionar Níveis / Andares",
    propertyTypeLabel: "Tipo de Propriedade",
    lotSizeLabel: "Tamanho do Lote",
    grandTotalArea: "Área Total Geral",
    pkgTitles: {
      as_built_permit: "Desenhos As-Built e Pacotes de Prefeitura",
      floor_plans_only: "Apenas Plantas Baixas",
      pdf_to_cad: "Conversão de PDF para CAD",
      "3d_rendering": "Renderização 3D Realista"
    },
    pkgSubs: {
      as_built_permit: "Pacote completo incluindo todos os níveis, extras de design e visualização 3D.",
      floor_plans_only: "Desenhos arquitetônicos 2D detalhados do seu espaço existente.",
      pdf_to_cad: "Conversão de alta precisão de seus planos PDF em formato CAD profissional.",
      "3d_rendering": "Visualizações fotorrealistas impressionantes do seu projeto arquitetônico."
    },
    pkgDetails: {
      as_built_permit: {
        summary: "Pacote arquitetônico abrangente adaptado às suas necessidades. Da documentação municipal essencial ao design executivo completo.",
        whatYouReceive: [
          { title: "Conjunto Básico de Permissão", desc: "Plano essencial incluindo plantas Existente/Demolição/Proposto, cortes, fachadas e telhado." },
          { title: "Design e Planejamento de Espaço (Opcional)", desc: "Desenvolvimento estético e análise de fluxo otimizada." },
          { title: "Conjunto Técnico de Construção (Opcional)", desc: "Planos de estrutura e detalhes para o construtor." },
          { title: "Visualização 3D (Opcional)", desc: "Renderização externa de alta fidelidade." },
          { title: "Histórico / Existente", desc: "Documentação digital do estado atual e registros históricos da propriedade." }
        ],
        notIncluded: ["Compra de Materiais", "Paisagismo", "Desenhos de Marcenaria"],
        idealFor: ["Proprietários que precisam de aprovação", "Projetos Complexos", "Aprovação Profissional"]
      },
      floor_plans_only: {
        tag: "BAIXA COMPLEXIDADE",
        summary: "Um serviço simplificado que entrega layouts espaciais fundamentais e plantas baixas dimensionadas.",
        whatYouReceive: [
          { title: "Layouts Espaciais Fundamentais", desc: "Paredes internas básicas, portas e identificação de cômodos." },
          { title: "Plantas Baixas Dimensionadas", desc: "Medições precisas de todos os espaços internos e elementos estruturais." }
        ],
        notIncluded: ["Design Exterior", "Renderizações 3D", "Aprovação de Prefeitura", "Engenharia Estrutural"],
        idealFor: ["Planejamento Inicial", "Reformas Estéticas", "Apenas Conceito"]
      },
      pdf_to_cad: {
        tag: "PRECISÃO",
        summary: "Conversão profissional de desenhos PDF existentes para o formato CAD (DWG) editável.",
        whatYouReceive: [
          { title: "Arquivos CAD Totalmente Editáveis", desc: "Formato DWG padrão compatível com os principais softwares CAD." },
          { title: "Escalonamento Preciso", desc: "Verificação e ajuste para garantir precisão no mundo real." },
          { title: "Organização de Camadas", desc: "Camadas estruturadas para paredes, dimensões e anotações." }
        ],
        notIncluded: ["Design Arquitetônico", "Revisão de Código", "Medições de Campo", "Modelagem 3D"],
        idealFor: ["Arquivamento Digital", "Base para Reforma", "Empreiteiros"]
      },
      "3d_rendering": {
        tag: "VISUALIZAÇÃO",
        summary: "A \"foto\" do futuro. Este serviço fornece imagens de alta qualidade que dão vida ao seu projeto com texturas, iluminação e cores realistas.",
        whatYouReceive: [
          { title: "Imagens Fotorrealistas", desc: "Renders 3D de alta resolução com materiais e ambientes realistas." },
          { title: "Visualização de Materiais", desc: "Veja suas escolhas de revestimento, telhado e janelas em contexto." },
          { title: "Iluminação Atmosférica", desc: "Simulação de iluminação natural e artificial para um toque realista." }
        ],
        notIncluded: ["Plantas Técnicas", "Engenharia Estrutural", "Especificação de Design de Interiores", "Revisões no Design Principal"],
        idealFor: ["Visualizar o Resultado Final", "Venda do Imóvel", "Decisão de Acabamentos"]
      }
    },
    pkgExtras: {
      groups: {
        design: "EXTRAS DE DESIGN",
        technical: "TÉCNICO E CONSTRUÇÃO",
        visualization: "VISUALIZAÇÃO 3D E CÔMODOS ESPECÍFICOS",
        modules_3d: "MÓDULOS DE VISUALIZAÇÃO 3D"
      },
      items: {
        ex_arch_design: { label: "Detalhamento de Design Arquitetônico", desc: "Foca no desenvolvimento conceitual e estético do seu projeto. Inclui fachadas externas, estilo estrutural e aparência geral." },
        ex_space_plan: { label: "Planejamento de Espaço", desc: "Design em nível macro com foco no arranjo ideal de paredes, portas e fluxos entre cômodos. Analisamos a melhor maneira de utilizar a metragem quadrada para funcionalidade e movimentação." },
        ex_interior_lay: { label: "Layout de Interiores", desc: "Design em nível micro detalhando o posicionamento de móveis, marcenaria sob medida (como armários de cozinha ou banheiro), eletrodomésticos e luminárias específicas dentro dos espaços definidos." },
        ex_const_detail: { label: "Detalhamento de Construção e Estrutura", desc: "Plantas técnicas de estrutura (pré-dimensionamento), detalhes construtivos essenciais e tabelas (portas/janelas). Este módulo fornece as informações necessárias para o seu construtor executar o projeto com precisão, reduzindo desperdício de materiais e tempo de obra." },
        ex_code_comp: { label: "Conformidade Técnica e Notas", desc: "Citações detalhadas de códigos municipais, notas de segurança e anotações profissionais necessárias para agilizar o processo de aprovação de alvarás e garantir a conformidade legal." },
        ex_3d_ext: { label: "Renderização 3D Exterior", desc: "Visualização 3D de alta fidelidade da arquitetura externa." },
        ex_3d_kitchen: { label: "Design 3D de Cozinha", desc: "Visualização fotorrealista da sua cozinha com materiais e iluminação." },
        ex_3d_bath: { label: "Design 3D de Banheiro", desc: "Renderização 3D detalhada do seu banheiro principal." },
        ex_3d_laundry: { label: "Design 3D de Lavanderia", desc: "Visualização funcional e estética da área de serviço." }
      }
    },
    whatYouReceiveTitle: "O QUE VOCÊ RECEBE",
    notIncludedTitle: "NÃO INCLUSO",
    idealForTitle: "IDEAL PARA",
    serviceCustomization: "CUSTOMIZAÇÃO DE SERVIÇOS",
    summaryTitle: "RESUMO",
    review: {
      client: "Cliente",
      location: "Localização",
      project: "Projeto",
      summary: "Resumo Final",
      documentation: "Documentação",
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
      role: "Papel",
      address: "Endereço",
      region: "Região",
      regionUS: "Estados Unidos",
      regionBR: "Brasil",
      propType: "Tipo de Propriedade",
      levels: "Níveis",
      services: "Serviços",
      dimensions: "DIMENSÕES",
      totalArea: "Área Total",
      selectedSvcs: "SERVIÇOS SELECIONADOS",
      timeline: "Cronograma Estimado",
      docsVerified: "Documentos verificados com sucesso.",
      noDocs: "Nenhum documento anexado",
      edit: "Editar",
      builderDiscount: "Construtor Profissional? Registre sua empresa abaixo para desbloquear um desconto de volume de 10% em todos os futuros conjuntos de licenças em MA.",
      title: "Revise seu resumo.",
      sub: "Verifique todos os detalhes antes de enviar. Clique em qualquer seção para editar.",
      groundFloor: "Térreo",
      multipleFloors: "Múltiplos Andares",
      days510: "5–10 Dias Úteis",
      days816: "8–16 Dias Úteis",
      timelineStandard: "Padrão (Contate o Studio)",
      errorOccurred: "Ocorreu um erro. Tente novamente.",
      whatNext: "PRÓXIMOS PASSOS",
      nextSteps: [
        { title: "Revisão da Estimativa", desc: "Nossa equipe revisa seu resumo em até 24 horas." },
        { title: "Cotação Formal", desc: "Você recebe uma proposta detalhada e sem surpresas." }
      ],
      legalTitle: "AVISO LEGAL IMPORTANTE",
      legalBody: "Esta estimativa é estritamente para serviços iniciais de design e desenho. NÃO INCLUI selos de engenharia profissional (carimbos PE/SE) ou carimbos arquitetônicos necessários para a submissão de licenças de construção. O cliente é o único responsável por contratar e pagar um Engenheiro ou Arquiteto de Registro licenciado.",
      agreementBody: "O valor acima é uma estimativa baseada nas informações fornecidas. A taxa final será confirmada após nossa equipe revisar seu resumo. Ao prosseguir, você concorda em receber uma proposta formal.",
      processing: "⌛ Processando...",
      payRetainer: "Confirmar e Iniciar Meu Projeto",
      secureNotice: "Pagamento seguro via Stripe ou Transferência Bancária",
      saveLater: "Salvar para Depois — Envie-me esta estimativa",
      saveLaterPDF: "Você receberá um PDF com seu brief completo e taxas estimadas — sem compromisso.",
      emailEstimate: "Apenas me envie esta estimativa por e-mail por enquanto",
      redirectNotice: "Você será redirecionado para nosso portal de cliente seguro para finalizar seu pedido.",
      resetButton: "↻ Recomeçar",
      resetConfirm: "Recomeçar do zero? Todos os dados serão perdidos."
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


const ROLES = [
  { id: "homeowner", icon: "🏠" },
  { id: "builder", icon: "🔨" },
  { id: "architect", icon: "📐" },
  { id: "investor", icon: "💼" },
  { id: "realtor", icon: "🤝" },
  { id: "other", icon: "✨" },
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

function calcEst(d, lang = "EN", step) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const BRL = 9.5;
  const sym = isUS ? "$" : "R$";
  const fmt = (n) => sym + Math.round(n).toLocaleString(isUS ? "en-US" : "pt-BR");
  const fmtEx = (n) => sym + n.toLocaleString(isUS ? "en-US" : "pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtR = (v) => `${fmt(v)} – ${fmt(v * 1.10)}`;

  const SVC_LABELS = T.svcLabels || {};

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
  const totalArea = areaBlocks.reduce((sum, blk) => {
    const lvls = (d.svcLevels && blk.svcId && d.svcLevels[blk.svcId]) ? d.svcLevels[blk.svcId] : d.levels || {};
    const count = blk.noMult ? 1 : Object.values(lvls).filter(Boolean).length;
    return sum + (blk.area * (count || 1));
  }, 0);

  const pkg = d.deliveryPkg || "";
  const pkgExtras = d.pkgExtras || {};

  // Confidence logic (Step-based 12.5% per step for 8 steps)
  // Step 4 = 50%
  const currentStepNum = step ?? 3;
  const conf = Math.min(((currentStepNum + 1) / 8) * 100, 100);

  if (!pkg || totalBaseArea <= 0) {
    const bd0 = [];
    if (totalArea > 0) bd0.push({ l: T.totalArea, v: Math.round(totalArea).toLocaleString() + " " + (isUS ? "sqft" : "m²") });
    const PROP_SHORT0 = lang === "EN" ? { single_family: "Single Family", multi_family: "Multi-Family", adu: "ADU" } : { single_family: "Residencial", multi_family: "Multifamiliar", adu: "ADU" };
    const primarySvc0 = selectedSvcs.map(k => SVC_LABELS[k])[0] || "";
    const propShort0 = PROP_SHORT0[d.propertyType] || d.propertyType || "";
    const projectTitle0 = primarySvc0 && propShort0 ? `${primarySvc0} — ${propShort0}` : primarySvc0 || propShort0 || "";
    return { 
      lo: "--", hi: "--", conf, bd: bd0, 
      totalArea: 0, baseArea: 0, noPkg: true, 
      areaBlocks, projectTitle: projectTitle0,
      pkgName: "", selectedSvcNames: [], lvNames: [] 
    };
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
    Object.keys(EXTRA_RATES || {}).forEach(key => {
      if (pkgExtras[key]) currentExtraPerSqft += (EXTRA_RATES[key] || 0);
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
        l: lang === "EN" ? "Floor Plans" : "Plantas Baixas",
        v: fmtR(totalBaseArea * rate),
        block: "arch"
      });
      bd.push({
        l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima",
        v: fmtR(flatFee),
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
            l: `${blk.label}: ${lvlName}`,
            v: fmtR(lvlCost),
            block: "arch"
          });
        });
      });

      // Per-sqft Extras
      Object.keys(EXTRA_RATES || {}).forEach(key => {
        if (pkgExtras[key]) {
          const extraCost = totalBaseArea * (EXTRA_RATES[key] || 0) * currencyMult;
          cost += extraCost;
          const labels = {
            ex_arch_design: lang === "EN" ? "Architectural Design Detail" : "Design Arquitetônico",
            ex_space_plan: lang === "EN" ? "Space Planning" : "Planejamento de Espaço",
            ex_interior_lay: lang === "EN" ? "Interior Layout" : "Layout de Interiores",
            ex_const_detail: lang === "EN" ? "Construction Detailing" : "Detalhamento Executivo",
            ex_code_comp: lang === "EN" ? "Code Compliance" : "Conformidade Técnica",
            ex_3d_ext: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior"
          };
          bd.push({ l: labels[key] || key, v: fmtR(extraCost), block: "extra" });
        }
      });
      // Fixed Fee Extras (Interiors)
      Object.keys(FIXED_FEES || {}).forEach(key => {
        if (pkgExtras[key]) {
          const fee = (FIXED_FEES[key] || 0) * currencyMult;
          cost += fee;
          const labels = {
            ex_3d_kitchen: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha",
            ex_3d_bath: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro",
            ex_3d_laundry: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia"
          };
          bd.push({ l: labels[key] || key, v: fmtR(fee), block: "extra" });
        }
      });
    }
  } else if (pkg === "pdf_to_cad") {
    const currencyMult = isUS ? 1 : BRL;
    const rate = 0.30 * currencyMult;
    const flatFee = 100 * currencyMult;
    cost = (totalBaseArea * rate) + flatFee;

    bd.push({
      l: lang === "EN" ? "PDF to CAD Conversion" : "Conversão de PDF para CAD",
      v: fmtR(totalBaseArea * rate),
      block: "arch"
    });
    bd.push({
      l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima",
      v: fmtR(flatFee),
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
        bd.push({ l: labels[key] || key, v: fmtR(fee), block: "extra" });
      }
    });
  }

  let multiplier = 1.0;
  if (d.rush === "rush") multiplier = 1.4;
  if (d.rush === "express") multiplier = 1.6;

  const lo = Math.round(cost * multiplier), hi = Math.round((cost * multiplier) * 1.10);

  if (multiplier > 1) {
    const feeLabel = d.rush === "rush" ? T.rushDelivery : T.expressDelivery;
    const feeAmount = Math.round(cost * (multiplier - 1));
    bd.push({ l: feeLabel, v: fmtR(feeAmount), block: "extra" });
  }

  const selectedSvcNames = selectedSvcs.map(k => SVC_LABELS[k]);
  const lvNames = [];
  const allLvls = new Set();
  if (d.svcLevels) {
    Object.values(d.svcLevels).forEach(lvls => {
      if (lvls) Object.keys(lvls).forEach(k => { if (lvls[k]) allLvls.add(k); });
    });
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

  return { lo: fmt(lo), hi: fmt(hi), conf, bd, totalArea: totalArea, baseArea: totalBaseArea, noPkg: false, pkgName, areaBlocks, selectedSvcNames, lvNames, projectTitle };
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
      <h2 className="wz-title-premium" style={{ marginBottom: 8 }}>{label}</h2>
      {sub && <p style={{ fontSize: 15, color: "var(--mu)", lineHeight: 1.6, fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}

/* ═══ MAIN WIZARD ═══ */
export default function EstimateWizard() {
  const navigate = useNavigate();
  const { 
    lang, theme, 
    wizardStep: contextStep, setWizardStep: setStep,
    wizardData: data, setWizardData: setData,
    resetWizard
  } = useAppContext();

  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    // Strip actual File objects from uploads before saving to localStorage
    const cleanData = { ...data };
    if (cleanData.uploads) {
      const cleanUploads = {};
      Object.keys(cleanData.uploads).forEach(catId => {
        cleanUploads[catId] = cleanData.uploads[catId].map(f => ({
          name: f.name,
          size: f.size,
          type: f.type
        }));
      });
      cleanData.uploads = cleanUploads;
    }
    localStorage.setItem("dara-wizard-data", JSON.stringify(cleanData));
  }, [data]);

  useEffect(() => {
    resetWizard();
    setIsInitialized(true);
  }, []);

  const step = isInitialized ? contextStep : 0;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState(null); // 'save' or 'accept'

  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const STEPS = lang === "EN" ? STEPS_EN : STEPS_PT;
  
  const topRef = useRef(null);

  const up = useCallback((key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
  }, [setData]);

  const est = calcEst(data, lang, step);

  // Validation
  const canGo = () => {
    if (step === 0) return !!(data.region && data.street && data.city && data.state && data.zip && data.mapConfirmed);
    if (step === 1) {
      // Basic info is enough to proceed, company info is optional for the wizard flow
      return !!(data.name && data.email && data.phone && data.role);
    }
    if (step === 2) {
      const isUS = data.region !== "BR";
      const selectedSvcs = Object.keys(data.services || {}).filter(k => data.services[k]);
      if (selectedSvcs.length === 0) return false;

      const NO_FLOOR_MULT = ["deck_covered", "deck_open", "porch_covered", "porch_open"];
      const allDimsFilled = selectedSvcs.every(id => {
        const w = data.dims?.[id]?.w;
        const l = data.dims?.[id]?.l;
        if (!w || !l) return false;

        if (!NO_FLOOR_MULT.includes(id)) {
          const hasLevel = data.svcLevels?.[id] && Object.values(data.svcLevels[id]).some(Boolean);
          if (!hasLevel) return false;
        }

        const wi = parseDim(w, isUS);
        const li = parseDim(l, isUS);
        return wi > 0 && li > 0;
      });
      if (!allDimsFilled) return false;

      return !!data.propertyType;
    }
    if (step === 4) {
      return true;
    }
    return true; // Steps 6, 7 are optional
  };

  const handleNext = () => {
    if (step < STEPS.length - 1 && canGo()) {
      setStep(s => s + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prev = () => {
    if (step === 7) {
      // If on final step (Review), ensure we explicitly go back to Step 7 (Rush)
      setStep(6);
    } else if (step > 0) {
      setStep(s => s - 1);
    }
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`wz-root ${theme}`} style={{ minHeight: "100dvh", background: "var(--bg0)", color: "var(--tx)" }}>
      {/* ── Top Bar ── */}
      <div ref={topRef} style={{ borderBottom: "1px solid var(--border)", padding: "16px 0", background: "var(--bg1)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--mu)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: "6px" }} onMouseEnter={e => e.target.style.color = "var(--tx)"} onMouseLeave={e => e.target.style.color = "var(--mu)"}>
                {T.backToSite}
              </button>
              <div style={{ height: 20, width: 1, background: "var(--border)" }} />
              {step > 0 && (
                <button 
                  className="wz-btn-ghost" 
                  onClick={() => window.confirm(T.review.resetConfirm) && resetWizard()}
                  style={{ padding: "4px 8px", fontSize: 11, color: "var(--mu)" }}
                >
                  {T.review.resetButton}
                </button>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "#fff", fontStyle: "italic" }}>D</span>
                </div>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontStyle: "italic" }}>DARA Studio</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Theme & Lang Toggles */}
              <GlobalControls />

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, color: "var(--dm)", display: "block" }}>{(T && T.step) || "Step"} {step + 1} {(T && T.of) || "of"} {(STEPS && STEPS.length) || 0}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--a)" }}>— {(STEPS && STEPS[step]) || ""}</span>
              </div>
            </div>
          </div>
          <Stepper cur={step} steps={STEPS} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px 100px" }}>
        <div className={`wz-main-layout ${step >= 2 ? "has-sidebar" : ""}`}>
          <div className="wz-animate" key={submitted ? "success" : step}>
            {submitted ? (
              <SuccessScreen
                type={submissionType}
                lang={lang}
                onBack={() => setSubmitted(false)}
                navigate={navigate}
                T={T}
              />
            ) : (
              <>
                {step === 0 && <S1 d={data} up={up} lang={lang} />}
                {step === 1 && <S2 d={data} up={up} lang={lang} />}
                {step === 2 && <S3 d={data} up={up} est={est} lang={lang} />}
                {step === 3 && <S4 d={data} up={up} est={est} lang={lang} />}
                {step === 4 && <S6 d={data} up={up} lang={lang} />}
                {step === 5 && <S7 d={data} up={up} lang={lang} />}
                {step === 6 && <S8 d={data} up={up} lang={lang} />}
                {step === 7 && <S9 d={data} est={est} setStep={setStep} lang={lang} setSubmitted={setSubmitted} setSubmissionType={setSubmissionType} />}
              </>
            )}

            {!submitted && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
                <button className="wz-btn-ghost" onClick={prev} style={{ visibility: step === 0 ? "hidden" : "visible" }}>{T.back}</button>
                {step < STEPS.length - 1 && (
                  <button className="wz-btn-primary" onClick={handleNext} disabled={!canGo()}>{T.continue}</button>
                )}
              </div>
            )}
          </div>

          {step >= 2 && (
            <div className={`wz-sidebar-mobile ${drawerOpen ? "open" : ""}`}>
              <div className="wz-drawer-handle" onClick={() => setDrawerOpen(!drawerOpen)} />
              <div className="wz-drawer-header" onClick={() => setDrawerOpen(!drawerOpen)}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tx)" }}>{T.projectEstimate}</span>
                <span style={{ fontSize: 18, color: "var(--a)" }}>{drawerOpen ? "↓" : "↑"}</span>
              </div>
              <Sidebar est={est} lang={lang} data={data} step={step} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */
function Stepper({ cur, steps }) {
  return (
    <div className="wz-stepper">
      {steps && steps.map((lbl, i) => {
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

function Sidebar({ est, lang, data, step: currentStep }) {
  const { 
    lo = "--", hi = "--", conf = 0, bd = [], 
    projectTitle = "", pkgName = "", 
    lvNames = [], selectedSvcNames = [] 
  } = est || {};
  
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
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;

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
            <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", color: "var(--mu)" }}>{T.summaryTitle}</span>
          </div>
          <div style={{ padding: "8px 12px" }}>
            {bd.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "3px 0" }}>
                <span style={{ color: "var(--mu)" }}>{it.l}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--tx)" }}>{it.v}</span>
              </div>
            ))}
            {data?.goal && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", color: "var(--dm)" }}>{T.projectIntent}</span>
                <span style={{ fontSize: 10, color: "var(--tx)", fontWeight: "600" }}>
                  {T.goals[data.goal] || data.goal}
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
        <div className="wz-conf-track"><div className="wz-conf-fill" style={{ width: `${conf}%`, background: currentStep === 4 ? "#CCFF00" : col }} /></div>
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

  const market = MARKET_DATA[d.region] || MARKET_DATA.US;
  const mapsUrl = () => {
    const addr = encodeURIComponent(`${d.street || ""}, ${d.city || ""}, ${d.state || ""} ${d.zip || ""}, ${market.country}`);
    return `https://maps.google.com/maps?q=${addr}&output=embed&z=15`;
  };

  return (
    <div className="wz-animate">
      <Title label={T.whereProject} sub={T.locationSub} />

      <div className="wz-grid-adaptive" style={{ marginBottom: d.region ? 24 : 0 }}>
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
              {market.addressLabel[lang]}
            </span>
            <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
          </div>

          <div className="wz-f">
            <label className="wz-label">{T.streetAddress} <span style={{ color: "var(--rd)" }}>*</span></label>
            <input className={`wz-inp ${ferr("street", d.street) ? "inp-err" : ""}`} placeholder={isUS ? "123 Main Street" : "Rua das Flores, 123"}
              value={d.street || ""} onChange={e => { up("street", e.target.value); up("mapConfirmed", false); }} onBlur={() => touch("street")} />
          </div>

          <div className="wz-grid-adaptive">
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
            <InputMask mask={market.zipMask} className={`wz-inp ${ferr("zip", d.zip) ? "inp-err" : ""}`} placeholder={market.zipPlaceholder} style={{ maxWidth: 200 }}
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
          <InputMask mask={MARKET_DATA[d.region]?.phoneMask || MARKET_DATA.US.phoneMask} maskChar={null} className={`wz-inp ${ferr("phone", d.phone) ? "inp-err" : ""}`} placeholder={MARKET_DATA[d.region]?.phonePlaceholder}
            value={d.phone || ""} onChange={e => up("phone", e.target.value)} onBlur={() => touch("phone")} />
        </div>
      </div>

      <p className="wz-label" style={{ marginBottom: 12 }}>{T.whoAreYou} <span style={{ color: "var(--rd)" }}>*</span></p>
      <div className="wz-grid-adaptive" style={{ marginBottom: 24 }}>
        {ROLES.map(r => (
          <div key={r.id} className={`wz-card ${d.role === r.id ? "active" : ""}`} onClick={() => { up("role", r.id); touch("role"); }} style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{T.roles[r.id]}</div>
          </div>
        ))}
      </div>

      {d.role && T[d.role + "Msg"] && (
        <div className="wz-animate" style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(100, 108, 255, 0.08)", border: "1px solid var(--a)", borderRadius: "8px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>{ROLES.find(r => r.id === d.role)?.icon || "✨"}</span>
          <p style={{ fontSize: 13, color: "var(--tx)", fontWeight: 600, lineHeight: 1.4 }}>
            {T[d.role + "Msg"]}
          </p>
        </div>
      )}
      {showCo && (
        <div className="wz-animate" style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 16 }}>{T.companyInfo}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="wz-grid-adaptive">
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
            <div className="wz-grid-adaptive">
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
            <div className="wz-grid-adaptive">
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

function S3({ d, up, est, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const unit = isUS ? "ft" : "m";
  const au = isUS ? "sqft" : "m²";
  const [hoverId, setHoverId] = useState(null);

  const CONST_SVC = [
    { id: "new_construction", pricingGroup: "multi-level", icon: "🏗️", label: T.svcLabels.new_construction, sub: T.svcSubs.new_construction, desc: T.svcDescs.new_construction },
    { id: "addition", pricingGroup: "multi-level", icon: "➕", label: T.svcLabels.addition, sub: T.svcSubs.addition, desc: T.svcDescs.addition },
    { id: "second_story", pricingGroup: "single-level", icon: "🏢", label: T.svcLabels.second_story, sub: T.svcSubs.second_story, desc: T.svcDescs.second_story },
    { id: "garage_only", pricingGroup: "multi-level", icon: "🚗", label: T.svcLabels.garage_only, sub: T.svcSubs.garage_only, desc: T.svcDescs.garage_only },
    { id: "garage_conversion", pricingGroup: "multi-level", icon: "🔑", label: T.svcLabels.garage_conversion, sub: T.svcSubs.garage_conversion, desc: T.svcDescs.garage_conversion },
    { id: "basement_finishing", pricingGroup: "single-level", icon: "⛏️", label: T.svcLabels.basement_finishing, sub: T.svcSubs.basement_finishing, desc: T.svcDescs.basement_finishing },
    { id: "deck_covered", pricingGroup: "single-level", icon: "🏕️", label: T.svcLabels.deck_covered, sub: T.svcSubs.deck_covered, desc: T.svcDescs.deck_covered },
    { id: "deck_open", pricingGroup: "single-level", icon: "☀️", label: T.svcLabels.deck_open, sub: T.svcSubs.deck_open, desc: T.svcDescs.deck_open },
    { id: "porch_covered", pricingGroup: "single-level", icon: "🏡", label: T.svcLabels.porch_covered, sub: T.svcSubs.porch_covered, desc: T.svcDescs.porch_covered },
    { id: "porch_open", pricingGroup: "single-level", icon: "🌿", label: T.svcLabels.porch_open, sub: T.svcSubs.porch_open, desc: T.svcDescs.porch_open },
    { id: "renovation", pricingGroup: "multi-level", icon: "🔨", label: T.svcLabels.renovation, sub: T.svcSubs.renovation, desc: T.svcDescs.renovation },
    { id: "other_const", pricingGroup: "single-level", icon: "✏️", label: T.svcLabels.other_const, sub: T.svcSubs.other_const, desc: T.svcDescs.other_const },
  ];

  const INT_SVC = [
    { id: "kitchen_remodel", pricingGroup: "multi-level", icon: "🍳", label: T.svcLabels.kitchen_remodel, sub: T.svcSubs.kitchen_remodel, desc: T.svcDescs.kitchen_remodel },
    { id: "bath_remodel", pricingGroup: "multi-level", icon: "🛁", label: T.svcLabels.bath_remodel, sub: T.svcSubs.bath_remodel, desc: T.svcDescs.bath_remodel },
    { id: "open_concept", pricingGroup: "multi-level", icon: "🗂️", label: T.svcLabels.open_concept, sub: T.svcSubs.open_concept, desc: T.svcDescs.open_concept },
    { id: "other_int", pricingGroup: "single-level", icon: "✏️", label: T.svcLabels.other_int, sub: T.svcSubs.other_int, desc: T.svcDescs.other_int },
  ];

  const services = d.services || {};
  const dims = d.dims || {};
  const svcLevels = d.svcLevels || {};

  const setSvc = (k) => {
    const newState = !services[k];
    up("services", { ...services, [k]: newState });
    if (newState && !svcLevels[k]) {
      up("svcLevels", { ...svcLevels, [k]: { main: true } });
    }
  };
  const setDim = (k, field, val) => up("dims", { ...dims, [k]: { ...(dims[k] || {}), [field]: val } });
  const toggleSvcLevel = (k, lvl) => {
    const current = svcLevels[k] || {};
    up("svcLevels", { ...svcLevels, [k]: { ...current, [lvl]: !current[lvl] } });
  };

  const selectedSvcs = Object.keys(services).filter(k => services[k]);
  const onDimKeyDown = (e) => {
    // No modo US, bloquear ponto/vírgula (usa formato 10'6")
    // No modo BR, permitir vírgula e ponto para decimais
    if (isUS && (e.key === "." || e.key === ",")) e.preventDefault();
  };

  const levelLabels = {
    main: T.groundFloor,
    second: T.secondFloor,
    attic: T.attic,
    basement: T.basement
  };

  const NO_FLOOR_MULT = ["deck_covered", "deck_open", "porch_covered", "porch_open"];

  const getSvcArea = (svcId) => {
    const wVal = dims[svcId]?.w || "";
    const lVal = dims[svcId]?.l || "";
    const wi = parseDim(wVal, isUS);
    const li = parseDim(lVal, isUS);
    const baseArea = isUS ? (wi * li / 144) : (wi * li);

    if (NO_FLOOR_MULT.includes(svcId)) return baseArea;
    const lvls = svcLevels[svcId] || {};
    const count = Object.values(lvls).filter(Boolean).length;
    return baseArea * (count === 0 ? 1 : count); // Default to 1x if 0 selected for rendering intermediate, but validation requires >0
  };

  const grandTotalArea = selectedSvcs.reduce((sum, svcId) => sum + getSvcArea(svcId), 0);

  return (
    <div className="wz-animate">
      <Title label={T.tellAboutProject} sub={T.projectSub} />

      <p className="wz-label" style={{ marginBottom: 12 }}>{T.propertyTypeLabel || "PROPERTY TYPE"}</p>
      <div className="wz-grid-adaptive" style={{ marginBottom: 20 }}>
        {[
          { id: "single_family", icon: "🏠", label: T.propertyTypes.single_family.label, sub: T.propertyTypes.single_family.sub },
          { id: "multi_family", icon: "🏘️", label: T.propertyTypes.multi_family.label, sub: T.propertyTypes.multi_family.sub },
          { id: "adu", icon: "🛖", label: T.propertyTypes.adu.label, sub: T.propertyTypes.adu.sub },
        ].map(pt => (
          <div key={pt.id} className={`wz-card ${d.propertyType === pt.id ? "active" : ""}`} onClick={() => up("propertyType", pt.id)} style={{ textAlign: "center", padding: "18px 10px" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{pt.icon}</div>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{pt.label}</p>
            <p style={{ fontSize: 10, color: "var(--mu)" }}>{pt.sub}</p>
          </div>
        ))}
      </div>

      <p className="wz-label" style={{ marginBottom: 16 }}>{T.typeOfService}</p>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--dm)", letterSpacing: ".08em", marginBottom: 12 }}>{T.constructionStructure}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {CONST_SVC.map(svc => (
            <div key={svc.id} className={`wz-card ${services[svc.id] ? "active" : ""}`} onClick={() => setSvc(svc.id)} style={{ padding: "16px 12px", textAlign: "center", position: "relative" }}>
              <div
                onMouseEnter={() => setHoverId(svc.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{ position: "absolute", top: 8, right: 8, color: "var(--mu)", cursor: "help", zIndex: 10 }}
              >
                <InfoIcon />
                {hoverId === svc.id && (
                  <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8, background: "var(--bg1)", border: "1px solid var(--border)", color: "var(--tx)", padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, width: "max-content", maxWidth: 200, textAlign: "left", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
                    {svc.desc}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{svc.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{svc.label}</p>
              <p style={{ fontSize: 10, color: "var(--dm)", lineHeight: 1.3 }}>{svc.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <p style={{ fontSize: 11, color: "var(--tx)", fontWeight: 500, lineHeight: 1.4, opacity: 0.9 }}>
            {T.ircIbcStandardsMsg}
          </p>
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--dm)", letterSpacing: ".08em", marginBottom: 12 }}>{T.interiors}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {INT_SVC.map(svc => (
            <div key={svc.id} className={`wz-card ${services[svc.id] ? "active" : ""}`} onClick={() => setSvc(svc.id)} style={{ padding: "16px 12px", textAlign: "center", position: "relative" }}>
              <div
                onMouseEnter={() => setHoverId(svc.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{ position: "absolute", top: 8, right: 8, color: "var(--mu)", cursor: "help", zIndex: 10 }}
              >
                <InfoIcon />
                {hoverId === svc.id && (
                  <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8, background: "var(--bg1)", border: "1px solid var(--border)", color: "var(--tx)", padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, width: "max-content", maxWidth: 200, textAlign: "left", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
                    {svc.desc}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{svc.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{svc.label}</p>
              <p style={{ fontSize: 10, color: "var(--dm)", lineHeight: 1.3 }}>{svc.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedSvcs.length > 0 && (
        <div className="wz-animate" style={{ marginBottom: 28 }}>
          <p className="wz-label" style={{ marginBottom: 12 }}>{T.projectDimensions}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {selectedSvcs.map(svcId => {
              const svcLabel = [...CONST_SVC, ...INT_SVC].find(s => s.id === svcId)?.label || svcId;
              const wVal = dims[svcId]?.w || "";
              const lVal = dims[svcId]?.l || "";
              const wi = parseDim(wVal, isUS);
              const li = parseDim(lVal, isUS);

              return (
                <div key={svcId} style={{ background: "var(--bg3)", padding: 20, borderRadius: "var(--r)", border: "1.5px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--a)", textTransform: "uppercase" }}>{svcLabel}</p>
                    {getSvcArea(svcId) > 0 && <div style={{ background: "rgba(100, 108, 255, 0.15)", color: "var(--a)", padding: "4px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{Math.round(getSvcArea(svcId))} {au}</div>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "start", marginBottom: 20 }}>
                    <div className="wz-f">
                      <label className="wz-label">{T.width} ({unit})</label>
                      <input className="wz-inp" placeholder={MARKET_DATA[d.region]?.dimW} value={wVal} onChange={e => setDim(svcId, "w", e.target.value)} onKeyDown={onDimKeyDown} />
                      {wVal && <p style={{ fontSize: 10, color: "var(--a)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{T.detected}: {isUS ? fmtInches(wi) : wi + " m"}</p>}
                      <p style={{ fontSize: 10, color: "var(--mu)", marginTop: 4, lineHeight: 1.3 }}>{T.dimInstructions}</p>
                    </div>
                    <div style={{ fontSize: 20, color: "var(--dm)", marginTop: 28 }}>×</div>
                    <div className="wz-f">
                      <label className="wz-label">{T.length} ({unit})</label>
                      <input className="wz-inp" placeholder={MARKET_DATA[d.region]?.dimL} value={lVal} onChange={e => setDim(svcId, "l", e.target.value)} onKeyDown={onDimKeyDown} />
                      {lVal && <p style={{ fontSize: 10, color: "var(--a)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{T.detected}: {isUS ? fmtInches(li) : li + " m"}</p>}
                      <p style={{ fontSize: 10, color: "var(--mu)", marginTop: 4, lineHeight: 1.3 }}>{T.dimInstructions}</p>
                    </div>
                  </div>

                  {!NO_FLOOR_MULT.includes(svcId) && (
                    <div style={{ background: "var(--bg1)", padding: 16, borderRadius: "var(--r)", border: "1px solid var(--border)" }}>
                      <p className="wz-label" style={{ marginBottom: 12 }}>{T.addLevelsFloors}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {Object.entries(levelLabels).map(([lvlKey, lvlLbl]) => {
                          const isActive = !!(svcLevels[svcId] && svcLevels[svcId][lvlKey]);
                          return (
                            <div
                              key={lvlKey}
                              onClick={() => toggleSvcLevel(svcId, lvlKey)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 20,
                                border: isActive ? "1px solid var(--a)" : "1px solid var(--border)",
                                background: isActive ? "rgba(100, 108, 255, 0.1)" : "transparent",
                                color: isActive ? "var(--a)" : "var(--tx)",
                                fontSize: 12,
                                fontWeight: isActive ? 600 : 500,
                                cursor: "pointer",
                                userSelect: "none"
                              }}
                            >
                              {lvlLbl} {(lvlKey === "attic" || lvlKey === "basement") && <span style={{ opacity: 0.6 }}> (+ {isUS ? "$0.80/sqft" : "R$7.60/m²"})</span>}
                            </div>
                          );
                        })}
                      </div>
                      {svcLevels[svcId] && Object.values(svcLevels[svcId]).some(Boolean) && (
                        <p style={{ fontSize: 11, color: "var(--a)", marginTop: 12, fontWeight: 600 }}>
                          Levels: {Object.keys(svcLevels[svcId]).filter(k => svcLevels[svcId][k]).map(k => levelLabels[k]).join(" + ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedSvcs.length > 0 && (
        <div className="wz-card active" style={{ padding: 20, marginTop: 24, background: "rgba(100, 108, 255, 0.05)", borderColor: "var(--a)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--a)", textTransform: "uppercase", marginBottom: 4 }}>{T.grandTotalArea}</p>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--tx)" }}>{Math.round(grandTotalArea)} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--mu)" }}>{au}</span></h3>
            </div>
            <div style={{ fontSize: 32 }}>📏</div>
          </div>
        </div>
      )}

      <div className="wz-f" style={{ marginBottom: 28 }}>
        <label className="wz-label">{T.lotSizeLabel} (OPTIONAL, {au.toUpperCase()})</label>
        <input className="wz-inp" placeholder="e.g. 5000" style={{ maxWidth: 240 }} value={d.lotSize || ""} onChange={e => up("lotSize", e.target.value)} />
      </div>
    </div>
  );
}

function S4({ d, up, est, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const [openDet, setOpenDet] = useState({});
  const [openEx, setOpenEx] = useState({});

  const toggleDet = (id, e) => {
    e.stopPropagation();
    setOpenDet(p => ({ [id]: !p[id] }));
  };

  const toggleEx = (id, e) => {
    e.stopPropagation();
    setOpenEx(p => ({ ...p, [id]: !p[id] }));
  };

  const setPkg = (id) => {
    up("deliveryPkg", id);
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
      title: T.pkgTitles.as_built_permit,
      subtitle: T.pkgSubs.as_built_permit,
      tag: "HIGH COMPLEXITY",
      tagColor: "rgba(245, 158, 11, 0.15)",
      tagTextCol: "#F59E0B",
      desc: T.pkgSubs.as_built_permit,
      details: T.pkgDetails.as_built_permit,
      extras: [
        {
          group: T.pkgExtras.groups.design, items: [
            { id: "ex_arch_design", label: T.pkgExtras.items.ex_arch_design.label, price: isUS ? "+ $0.15 / sqft" : "+ R$1.40 / m²", desc: T.pkgExtras.items.ex_arch_design.desc },
            { id: "ex_space_plan", label: T.pkgExtras.items.ex_space_plan.label, price: isUS ? "+ $0.15 / sqft" : "+ R$1.40 / m²", desc: T.pkgExtras.items.ex_space_plan.desc },
            { id: "ex_interior_lay", label: T.pkgExtras.items.ex_interior_lay.label, price: isUS ? "+ $0.10 / sqft" : "+ R$0.95 / m²", desc: T.pkgExtras.items.ex_interior_lay.desc }
          ]
        },
        {
          group: T.pkgExtras.groups.technical, items: [
            { id: "ex_const_detail", label: T.pkgExtras.items.ex_const_detail.label, price: isUS ? "+ $0.20 / sqft" : "+ R$1.90 / m²", desc: T.pkgExtras.items.ex_const_detail.desc },
            { id: "ex_code_comp", label: T.pkgExtras.items.ex_code_comp.label, price: isUS ? "+ $0.05 / sqft" : "+ R$0.45 / m²", desc: T.pkgExtras.items.ex_code_comp.desc }
          ]
        },
        {
          group: T.pkgExtras.groups.visualization, items: [
            { id: "ex_3d_ext", label: T.pkgExtras.items.ex_3d_ext.label, price: isUS ? "+ $0.10 / sqft" : "+ R$0.95 / m²", desc: T.pkgExtras.items.ex_3d_ext.desc },
            { id: "ex_3d_kitchen", label: T.pkgExtras.items.ex_3d_kitchen.label, price: isUS ? "+ $180.00" : "+ R$1700", desc: T.pkgExtras.items.ex_3d_kitchen.desc },
            { id: "ex_3d_bath", label: T.pkgExtras.items.ex_3d_bath.label, price: isUS ? "+ $180.00" : "+ R$1700", desc: T.pkgExtras.items.ex_3d_bath.desc },
            { id: "ex_3d_laundry", label: T.pkgExtras.items.ex_3d_laundry.label, price: isUS ? "+ $180.00" : "+ R$1700", desc: T.pkgExtras.items.ex_3d_laundry.desc }
          ]
        }
      ]
    },
    {
      id: "floor_plans_only",
      icon: "📐",
      title: T.pkgTitles.floor_plans_only,
      tag: T.pkgDetails.floor_plans_only.tag,
      tagColor: "rgba(59, 130, 246, 0.15)",
      tagTextCol: "#60A5FA",
      desc: T.pkgSubs.floor_plans_only,
      details: T.pkgDetails.floor_plans_only
    },
    {
      id: "3d_rendering",
      icon: "🎨",
      title: T.pkgTitles["3d_rendering"],
      tag: T.pkgDetails["3d_rendering"].tag,
      tagColor: "rgba(139, 92, 246, 0.15)",
      tagTextCol: "#A78BFA",
      desc: T.pkgDetails["3d_rendering"].summary,
      details: T.pkgDetails["3d_rendering"],
      extras: [
        {
          group: T.pkgExtras.groups.modules_3d, items: [
            { id: "ex_3d_ext", label: T.pkgExtras.items.ex_3d_ext.label, price: T.price3DExt, desc: T.pkgExtras.items.ex_3d_ext.desc },
            { id: "ex_3d_kitchen", label: T.pkgExtras.items.ex_3d_kitchen.label, price: T.price3DInt, desc: T.pkgExtras.items.ex_3d_kitchen.desc },
            { id: "ex_3d_bath", label: T.pkgExtras.items.ex_3d_bath.label, price: T.price3DInt, desc: T.pkgExtras.items.ex_3d_bath.desc },
            { id: "ex_3d_laundry", label: T.pkgExtras.items.ex_3d_laundry.label, price: T.price3DInt, desc: T.pkgExtras.items.ex_3d_laundry.desc }
          ]
        }
      ]
    },
    {
      id: "pdf_to_cad",
      icon: "💻",
      title: T.pkgTitles.pdf_to_cad,
      tag: T.pkgDetails.pdf_to_cad.tag,
      tagColor: "rgba(245, 158, 11, 0.15)",
      tagTextCol: "#F59E0B",
      desc: T.pkgSubs.pdf_to_cad,
      details: T.pkgDetails.pdf_to_cad
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
                    {T.moreDetails} <span style={{ transform: isDetOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 10, display: "inline-block" }}>▼</span>
                  </div>

                  {isDetOpen && pkg.details && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: "var(--r)", marginBottom: 16 }}>
                        {pkg.details.summary && (
                          <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--dm)", marginBottom: 8, textTransform: "uppercase" }}>{T.summaryTitle}</p>
                            <p style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.5 }}>{pkg.details.summary}</p>
                          </div>
                        )}

                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--dm)", marginBottom: 12, textTransform: "uppercase" }}>{T.whatYouReceiveTitle}</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                          {pkg.details.whatYouReceive.map((item, idx) => (
                            <div key={idx} style={{ background: "rgba(0,0,0,0.15)", padding: 12, borderRadius: "6px", borderLeft: "3px solid var(--a)" }}>
                              <p style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.5 }}>
                                <span style={{ fontWeight: 700, color: "var(--a)" }}>{item.title}: </span>
                                <span style={{ color: "var(--mu)" }}>{item.desc}</span>
                              </p>
                            </div>
                          ))}
                        </div>

                        {pkg.details.notIncluded && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--rd)", marginBottom: 10, textTransform: "uppercase" }}>{T.pkgNotIncluded}</p>
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
                          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: "var(--gn)", marginBottom: 10, textTransform: "uppercase" }}>{T.idealForTitle}</p>
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

                  {(isActive || isDetOpen) && pkg.extras && (
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "var(--dm)", marginBottom: 16, textTransform: "uppercase" }}>{T.serviceCustomization}</p>
                      {pkg.extras.map(group => (
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
                                        {T.moreDetails} <span style={{ transform: isExOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 9, display: "inline-block" }}>▼</span>
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
  const SVC_LABELS = T.svcLabels;

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


function S5_Specs({ d, up, lang }) {
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
          <div className="wz-animate" style={{ marginTop: "16px", padding: "16px", background: "var(--cb)", borderRadius: "8px", border: "1px solid var(--border)" }}>
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
        <div className="wz-grid-adaptive">
          {constraints.map(c => (
            <div key={c.id} className={`wz-card ${d[c.id] ? "active" : ""}`} onClick={() => up(c.id, !d[c.id])} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", cursor: "pointer", minHeight: 44 }}>
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
            <div className="wz-grid-adaptive" style={{ gap: 0 }}>
              {g.items.map((item, idx) => {
                const val = rooms[item.id] || 0;
                return (
                  <div key={item.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border)",
                    borderRight: "1px solid var(--border)",
                    minHeight: 56
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
  const fileRefs = useRef({});
  const [dragging, setDragging] = useState(null);

  const cats = [
    {
      id: "inspiration",
      label: lang === "EN" ? "Inspiration Images" : "Imagens de Inspiração",
      icon: "🖼️",
      types: "JPG · PNG · GIF · WEBP · max 100MB",
      accept: ".jpg,.jpeg,.png,.gif,.webp",
      color: "#6366f1"
    },
    {
      id: "videos",
      label: lang === "EN" ? "Videos" : "Vídeos",
      icon: "🎥",
      types: "MP4 · MOV · WEBM · max 100MB",
      accept: ".mp4,.mov,.webm",
      color: "#d946ef"
    },
    {
      id: "documents",
      label: lang === "EN" ? "Technical Documents" : "Documentos Técnicos",
      icon: "📋",
      types: "PDF · DOC · DWG · DXF · max 100MB",
      accept: ".pdf,.doc,.docx,.dwg,.dxf",
      color: "#f59e0b"
    },
    {
      id: "other",
      label: lang === "EN" ? "Other Files" : "Outros Arquivos",
      icon: "📎",
      types: "Any file type · max 100MB",
      accept: "*",
      color: "#10b981"
    },
  ];

  const uploads = d.uploads || {};

  const handleFiles = (catId, files) => {
    if (!files || files.length === 0) return;
    const current = uploads[catId] || [];
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified
    }));
    up("uploads", { ...uploads, [catId]: [...current, ...newFiles] });
  };

  return (
    <div className="wz-animate">
      <Title label={T.uploadTitle} sub={T.uploadSub} />

      {/* Info Alert */}
      <div style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "12px", padding: "20px", display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div style={{ color: "#818cf8", fontSize: "20px" }}>ⓘ</div>
        <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--mu)" }}>
          {T.uploadHelp}
        </p>
      </div>

      <div className="wz-grid-adaptive" style={{ gap: "24px" }}>
        {cats.map(cat => (
          <div key={cat.id} style={{ 
            background: "var(--bg1)", 
            border: "1.5px solid var(--border)", 
            borderRadius: "20px", 
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all .3s ease"
          }} className="wz-card-premium">
            <div style={{ padding: "24px", background: "var(--cb)", borderBottom: "1.5px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "14px", 
                  background: cat.color + "15", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--tx)", letterSpacing: "-0.01em" }}>{cat.label}</h3>
                  <p style={{ fontSize: "10px", color: "var(--dm)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: "4px" }}>{cat.types}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div 
                className={`wz-drop ${dragging === cat.id ? "dragging" : ""}`} 
                style={{ 
                  flex: 1,
                  padding: "40px 20px", 
                  background: dragging === cat.id ? "var(--a-dim)" : "var(--cb)",
                  border: "2px dashed var(--border)",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s ease"
                }}
                onDragOver={e => { e.preventDefault(); setDragging(cat.id); }}
                onDragLeave={() => setDragging(null)}
                onDrop={e => { e.preventDefault(); setDragging(null); handleFiles(cat.id, e.dataTransfer.files); }}
                onClick={() => fileRefs.current[cat.id]?.click()}
              >
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  background: "var(--bg2)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginBottom: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <p style={{ fontSize: "14px", color: "var(--mu)", fontWeight: "500", maxWidth: "160px", lineHeight: "1.4" }}>
                  {T.dropHere} <span style={{ color: "var(--a)", fontWeight: "700" }}>{T.browse}</span>
                </p>
                <input 
                  type="file" 
                  multiple 
                  accept={cat.accept} 
                  ref={el => fileRefs.current[cat.id] = el}
                  style={{ display: "none" }} 
                  onChange={e => handleFiles(cat.id, e.target.files)}
                />
              </div>

              {uploads[cat.id] && uploads[cat.id].length > 0 && (
                <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--dm)", textTransform: "uppercase", letterSpacing: ".1em" }}>{T.uploadedFiles || "Uploaded Files"}</p>
                  {uploads[cat.id].map((f, i) => (
                    <div key={i} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "10px 14px", 
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                        <div style={{ color: "var(--gn)", fontSize: "14px" }}>✓</div>
                        <span style={{ fontSize: "12px", color: "var(--tx)", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--dm)", fontFamily: "var(--font-mono)" }}>{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function S8({ d, up, lang }) {
  const T = TRANSLATIONS[lang];
  const isUS = d.region !== "BR";
  const [feedback, setFeedback] = useState("");
  const fileRefs = useRef({});

  const checklist = [
    { id: "chk_survey", label: T.checklist.survey, required: true },
    { id: "chk_photos", label: T.checklist.photos, required: true },
    { id: "chk_measure", label: T.checklist.measure, required: true },
    { id: "chk_listing", label: T.checklist.listing, sub: T.checklist.recommended },
    { id: "chk_matter", label: T.checklist.tour, sub: T.checklist.ifAvailable },
    { id: "chk_reports", label: T.checklist.reports, sub: T.checklist.ifAvailable },
  ];

  const requiredCount = 3; // First 3 are mandatory
  const completedRequired = checklist.slice(0, 3).filter(c => d[c.id]).length;
  const remaining = requiredCount - completedRequired;
  const isUnlocked = remaining === 0;

  const handleFileChange = (id, e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      up(id, true);
      const currentRushFiles = d.rushFiles || {};
      up("rushFiles", { ...currentRushFiles, [id]: file.name });
      setFeedback("");
    }
  };

  const handleLockedClick = () => {
    setFeedback(T.unlockRush);
    setTimeout(() => setFeedback(""), 4000);
  };

  const options = [
    {
      id: "standard",
      label: T.standardDelivery,
      sub: T.speeds.standard.sub,
      days: T.speeds.standard.days,
      icon: "📦",
      fee: "FREE",
      locked: false
    },
    {
      id: "rush",
      label: T.rushDelivery,
      tag: "+40%",
      sub: T.speeds.rush.sub,
      days: T.speeds.rush.days,
      icon: "🔒",
      fee: "+40%",
      locked: !isUnlocked
    },
    {
      id: "express",
      label: T.expressDelivery,
      tag: "+60%",
      sub: T.speeds.express.sub,
      days: T.speeds.express.days,
      icon: "🔒",
      fee: "+60%",
      locked: !isUnlocked
    },
  ];

  return (
    <div className="wz-animate">
      <Title label={T.rushFeesTitle || T.deliverySpeed} sub={T.rushFeesSub || T.speedSub} />

      {/* Checklist Box */}
      <div style={{ background: "var(--cb)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".1em", color: "var(--mu)", textTransform: "uppercase" }}>{T.docChecklist}</h3>
          <span style={{ fontSize: "11px", color: "var(--dm)" }}>{remaining} {T.requiredRemaining}</span>
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
                  {idx < 3 && !isDone && <span style={{ fontSize: "11px", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>{T.required}</span>}
                  <button
                    className="wz-btn-ghost"
                    onClick={() => fileRefs.current[item.id]?.click()}
                    style={{ padding: "6px 12px", fontSize: "11px", height: "auto", borderColor: isDone ? "var(--gn)" : "var(--border2)", color: isDone ? "var(--gn)" : "var(--mu)" }}
                  >
                    {isDone ? T.uploaded : T.uploadAction}
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
            {T.unlockRushAlert}
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

function S9({ d, est, setStep, lang, setSubmitted, setSubmissionType }) {
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const isUS = d.region !== "BR";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (type) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = type === "accept" ? "/api/accept" : "/api/leads";
      const payload = {
        name: d.name,
        email: d.email,
        phone: d.phone,
        project: est.projectTitle,
        estimate: `${est.lo} – ${est.hi}`,
        pkg: est.pkgName,
        delivery: d.rush || "standard",
        lang,
        region: d.region
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");

      setSubmissionType(type);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(T.review.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const ReviewRow = ({ label, value, highlight }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: "12px", color: "var(--dm)", textTransform: "capitalize" }}>{label}</span>
      <span style={{ fontSize: highlight ? "18px" : "13px", fontWeight: highlight ? "700" : "600", color: highlight ? "#c8c0ff" : "var(--tx)", textAlign: "right" }}>{value || "—"}</span>
    </div>
  );

  const Section = ({ icon, title, step, children }) => (
    <div style={{ background: "var(--cb)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px" }}>{icon}</span>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--tx)" }}>{title}</h3>
        </div>
        <button onClick={() => setStep(step)} style={{ background: "none", border: "none", color: "#6366f1", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          {T.review.edit} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div className="wz-animate">
      {error && (
        <div style={{ padding: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid var(--rd)", color: "var(--rd)", fontSize: 13, borderRadius: "6px", marginBottom: 24 }}>
          {error}
        </div>
      )}

      {d.role === "builder" && (
        <div style={{ background: "rgba(0, 128, 128, 0.1)", border: "2px solid #008080", padding: "20px 24px", borderRadius: "12px", marginBottom: "32px", boxShadow: "0 8px 32px rgba(0, 128, 128, 0.15)" }}>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#008080", lineHeight: "1.4" }}>
            {T.review.builderDiscount}
          </p>
        </div>
      )}

      <Title label={T.review.title} sub={T.review.sub} />


      <div className="wz-grid-adaptive" style={{ marginBottom: 40, gap: 20 }}>
        <Section icon="👤" title={T.review.client} step={1}>
          <ReviewRow label={T.review.name} value={d.name} />
          <ReviewRow label={T.review.email} value={d.email} />
          <ReviewRow label={T.review.phone} value={d.phone} />
          <ReviewRow label={T.review.role} value={T.roles[d.role] || d.role} />
        </Section>

        <Section icon="📍" title={T.review.location} step={0}>
          <ReviewRow label={T.review.address} value={d.street} />
          <ReviewRow label={T.review.region} value={d.region === "BR" ? T.review.regionBR : T.review.regionUS} />
        </Section>
      </div>

      <Section icon="🏗️" title={T.review.project} step={2}>
        <ReviewRow label={T.review.propType} value={T.propertyTypes[d.propertyType]?.label || d.propertyType} />
        <ReviewRow label={T.review.levels} value={(est?.lvNames || []).join(" + ") || "—"} />
        <ReviewRow label={T.review.services} value={(est?.selectedSvcNames || []).join(", ") || "—"} />
        <div style={{ marginTop: "16px" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--dm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>{T.review.dimensions}</p>
          <ReviewRow label={T.review.totalArea} value={`${Math.round(est?.totalArea || 0).toLocaleString()} ${isUS ? "sqft" : "m²"}`} highlight />
        </div>
      </Section>

      <Section icon="📋" title={T.review.summary} step={3}>
        <ReviewRow label={T.review.totalArea} value={`${Math.round(est?.totalArea || 0).toLocaleString()} ${isUS ? "sqft" : "m²"}`} highlight />
        <div style={{ marginTop: "12px", padding: "12px", background: "var(--cb)", borderRadius: "8px" }}>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--dm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>{T.review.selectedSvcs}</p>
          {(est?.bd || []).map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
              <span style={{ color: "var(--mu)" }}>{it.l}</span>
              <span style={{ fontWeight: "600", color: "var(--tx)" }}>{it.v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px" }}>
          <ReviewRow
            label={T.review.timeline}
            value={d.rush === "express" ? T.review.days510 :
              d.rush === "rush" ? T.review.days816 :
                T.review.timelineStandard}
          />
        </div>
      </Section>

      <Section icon="📂" title={T.review.documentation} step={5}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Reference Files from S7 */}
          {d.uploads && Object.keys(d.uploads).some(k => d.uploads[k]?.length > 0) ? (
            Object.keys(d.uploads).map(catId => {
              const files = d.uploads[catId];
              if (!files || files.length === 0) return null;
              const catLabels = {
                inspiration: lang === "EN" ? "Inspiration Images" : "Imagens de Inspiração",
                videos: lang === "EN" ? "Videos" : "Vídeos",
                documents: lang === "EN" ? "Technical Documents" : "Documentos Técnicos",
                other: lang === "EN" ? "Other Files" : "Outros Arquivos"
              };
              return (
                <div key={catId}>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--a)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>📁 {catLabels[catId] || catId}</p>
                  <div style={{ paddingLeft: "12px", borderLeft: "1.5px solid var(--border2)" }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ fontSize: "12px", color: "var(--tx)", padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--gn)" }}>📄</span>
                        <span>{f.name}</span>
                        <span style={{ fontSize: "10px", color: "var(--dm)" }}>({(f.size / 1024 / 1024).toFixed(1)}MB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : null}

          {/* Rush Files from S8 */}
          {d.rushFiles && Object.keys(d.rushFiles).length > 0 ? (
            <div>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--a)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>📁 {lang === "EN" ? "Technical Requirements" : "Requisitos Técnicos"}</p>
              <div style={{ paddingLeft: "12px", borderLeft: "1.5px solid var(--border2)" }}>
                {checklist.map(item => {
                  const fileName = d.rushFiles[item.id];
                  if (!fileName) return null;
                  return (
                    <div key={item.id} style={{ fontSize: "12px", color: "var(--tx)", padding: "4px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--gn)" }}>📄</span>
                        <span style={{ fontWeight: "600" }}>{item.label}:</span>
                        <span>{fileName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!Object.keys(d.uploads || {}).some(k => d.uploads[k]?.length > 0) && !Object.keys(d.rushFiles || {}).length > 0 && (
            <p style={{ fontSize: "13px", color: "var(--dm)", fontStyle: "italic" }}>
              {T.review.noDocs}
            </p>
          )}
        </div>
      </Section>

      <div style={{ marginTop: "48px", marginBottom: "48px" }}>
        <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".15em", color: "var(--mu)", textTransform: "uppercase", marginBottom: "24px" }}>{T.review.whatNext}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {(T.review.nextSteps || []).map((s, idx) => (
            <div key={idx} style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mu)", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>0{idx + 1}</div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--tx)" }}>{s.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--dm)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div style={{ background: "rgba(245, 158, 11, 0.03)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: "12px", padding: "20px 24px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ color: "#f59e0b", fontSize: "14px" }}>⚠️</span>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".08em" }}>{T.review.legalTitle}</h4>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(245, 158, 11, 0.7)", lineHeight: "1.7" }}>
          {T.review.legalBody}
        </p>
      </div>

      {/* Agreement Box */}
      <div style={{ background: "rgba(245, 158, 11, 0.03)", border: "1px solid rgba(245, 158, 11, 0.12)", borderRadius: "12px", padding: "16px 20px", marginBottom: "40px", display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ color: "#f59e0b", fontSize: "14px" }}>⚠️</span>
        <p style={{ fontSize: "13px", color: "rgba(245, 158, 11, 0.8)", lineHeight: "1.5" }}>
          {T.review.agreementBody}
        </p>
      </div>

      {/* Final Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <button className="wz-btn-primary" onClick={() => handleAction('accept')} disabled={loading} style={{ width: "100%", height: "60px", fontSize: "17px", fontWeight: "700", opacity: loading ? 0.7 : 1, background: "#6366f1", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            {loading ? T.review.processing : <><span style={{ fontSize: "18px" }}>🔓</span> {T.review.payRetainer}</>}
          </button>
          <p style={{ fontSize: "12px", color: "var(--dm)", marginTop: "14px" }}>{T.review.secureNotice}</p>
        </div>

        <div style={{ width: "100%", textAlign: "center" }}>
          <button className="wz-btn-ghost" onClick={() => handleAction('save')} disabled={loading} style={{ width: "100%", height: "60px", fontSize: "15px", borderRadius: "12px", border: "1px solid var(--border2)", background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <span style={{ fontSize: "16px" }}>🔖</span> {T.review.saveLater}
          </button>
          <p style={{ fontSize: "12px", color: "var(--dm)", marginTop: "16px", maxWidth: "500px", margin: "16px auto 0", lineHeight: "1.5" }}>
            {T.review.saveLaterPDF}
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ type, lang, onBack, navigate, T }) {
  const isUS = lang === "EN";
  const isSave = type === "save";

  return (
    <div className="wz-animate" style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", padding: "40px 0" }}>
      <div style={{ marginBottom: 32, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}>
        <img src="/admin-portal/studio-interior.png" alt="Studio Interior" style={{ width: "100%", height: 300, objectFit: "cover" }} />
      </div>

      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontStyle: "italic", marginBottom: 16, color: "var(--tx)" }}>
        {isSave 
          ? (isUS ? "Your project is safe with us" : "Seu projeto está seguro conosco")
          : (isUS ? "The first step toward your new space has been taken" : "O primeiro passo para o seu novo espaço foi dado")}
      </h2>

      {isSave ? (
        <p style={{ color: "var(--mu)", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
          {isUS 
            ? "We've saved your estimate details. You can come back at any time to complete your project brief." 
            : "Salvamos os detalhes da sua estimativa. Você pode voltar a qualquer momento para completar o seu resumo do projeto."}
        </p>
      ) : (
        <div style={{ textAlign: "left", background: "var(--bg1)", padding: 32, borderRadius: 16, border: "1px solid var(--border)", marginBottom: 40 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--a)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 24 }}>{T.review.whatNext}</h3>
          <div style={{ display: "grid", gap: 24 }}>
            {(T.review.nextSteps || []).map((s, idx) => (
              <div key={idx} style={{ display: "flex", gap: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--a)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--a)", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>0{idx + 1}</div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--tx)", marginBottom: 4 }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: "var(--mu)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {isSave ? (
          <button className="wz-btn-primary" onClick={onBack} style={{ width: "100%", height: 56 }}>
            {isUS ? "Back to Review" : "Voltar para Revisão"}
          </button>
        ) : (
          <button className="wz-btn-primary" onClick={() => navigate("/portal")} style={{ width: "100%", height: 56 }}>
            {isUS ? "Go to Client Portal" : "Ir para o Portal do Cliente"}
          </button>
        )}
      </div>
    </div>
  );
}
