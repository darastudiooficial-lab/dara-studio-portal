import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import InputMask from "react-input-mask";
import BackgroundOrbs from "../components/BackgroundOrbs";

/* ═══ CONSTANTS ═══ */
const STEPS_EN = ["About You", "Location", "Project", "Scope", "Program", "Files", "Rush", "Review"];
const STEPS_PT = [`Sobre Você`, `Localização`, "Projeto", "Escopo", "Programa", "Arquivos", `Urgência`, `Revisão`];


/* ═══ MARKET DATA ═══ */

const MARKET_DATA = {
  US: {
    zipMask: "99999",
    phoneMask: "+1 (999) 999-9999",
    country: "USA",
    zipPlaceholder: "02101",
    phonePlaceholder: "+1 (000) 000-0000",
    dimW: `e.g. 31'2" or 120`,
    dimL: `e.g. 45'0" or 540`,
    addressLabel: { EN: `Project address in the US`, PT: `Endereço do projeto nos EUA` }
  }
};

const TRANSLATIONS = {
  EN: {
    uploadError: "Upload failed. Please try again.",
    uploadSuccess: "File uploaded successfully.",
    rushUnlockReq: "Please upload your project survey and technical documents in Step 6 to unlock Rush delivery.",
    // ... existing
    backToSite: "← Back to Site",
    step: "Step",
    of: "of",
    back: "← Back",
    continue: "Continue →",
    submit: "Submit Request & Access Portal →",
    whereProject: "Where is your project located?",
    locationSub: `This helps us apply the right building codes, fees, and zoning parameters.`,
    streetAddress: "Street Address",
    city: "City",
    state: "State",
    zipCode: "ZIP Code",
    confirmLocation: "Confirm Location ✓",
    locationConfirmed: "✓ Location confirmed",
    verifyLocation: `Verify your project is correctly pinned, then confirm.`,
    tellAboutYou: "Tell us about you.",
    aboutYouSub: `Rest assured, your privacy is guaranteed. We'll use this information exclusively to personalize your estimate.`,
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    whoAreYou: "What is your profile?",
    homeownerMsg: `Planning your dream home? We're here to help.`,
    builderMsg: `We love working with builders! Let’s streamline the design process for your next project.`,
    architectMsg: `Let's collaborate on some great designs together.`,
    investorMsg: `Let's optimize your ROI with strategic design solutions.`,
    realtorMsg: `Helping your clients visualize potential? You're in the right place.`,
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
    projectSub: `Don't worry about exactness — a rough estimate works here.`,
    propType: "Property Type",
    dimensions: "Project Dimensions",
    width: "Width",
    length: "Length",
    levels: "Levels / Floors",
    selectServices: "Select Services",
    servicesSub: "Choose the specific services you need for your project.",
    deliveryPackage: "Choose the right package for you.",
    packageSub: `Every project is different. Before we build your Estimate, you need to understand what each service covers — so you know exactly what you're getting and what falls outside the scope.`,
    programReqs: "Program Requirements",
    programSub: "How many of each space do you need? Start at 0 and add as needed.",
    specialReqs: "Special Requirements (Optional)",
    specialReqsPlaceholder: `Describe any special requirements, accessibility needs, or notes for the design team…`,
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
      single_family: { label: `Single Family Home`, sub: "One family" },
      multi_family: { label: "Multi-Family", sub: `Duplex, Triplex…` },
      adu: { label: "ADU", sub: "Accessory Dwelling Unit" }
    },
    svcSubs: {
      new_construction: "Complete project from scratch", addition: `New bedroom, wing or garage`, second_story: "Build a new upper floor",
      garage_only: "Standalone garage project", garage_conversion: "Garage → livable area / ADU", basement_finishing: "Remodel and finish a basement",
      deck_covered: "Deck with roof structure", deck_open: "Deck without roof", porch_covered: "Porch with roof", porch_open: "Open or screened porch",
      renovation: "General remodel", other_const: "Other construction services",
      kitchen_remodel: "Focus on kitchen areas", bath_remodel: "Focus on bathroom areas", open_concept: `Remove walls, integrate spaces`, other_int: "Other interior services"
    },
    pkgLabels: { as_built_permit: "As-Built & Permit Package", floor_plans_only: "Floor Plans Only", pdf_to_cad: "PDF to CAD", "3d_rendering": "3D Rendering" },
    price3DExt: "+ $250 - $300",
    price3DInt: "+ $150 - $200",
    unlockRush: "Please upload the 3 mandatory files above to unlock faster delivery timelines.",
    checklist: {
      survey: "Property Survey / Site Plan",
      photos: "Clear Photos of all sides of the property",
      measure: "Rough measurements (Sketches or existing plans)",
      listing: "Current real estate listing (Zillow, Redfin, etc.)",
      tour: "Matterport or 3D Virtual Tour",
      reports: "Appraisal or structural reports",
      existing_plans: "Existing Floor Plans or Previous Projects",
      city_notes: "City Notes or Building Department Requirements",
      recommended: "Recommended",
      ifAvailable: "If available",
      ifApplicable: "If applicable"
    },
    stdDeliveryCard: {
      badge: "STANDARD DELIVERY — INCLUDED",
      previewTitle: "Design Preview",
      previewDays: "8–16 Business Days",
      previewSub: "Initial layout and visual direction delivered for review.",
      finalTitle: "Final Drawing Set",
      finalDays: "25–30 Business Days After Approval",
      finalSub: "Complete architectural drawing package in digital format.",
      footer: "Timeline starts from receipt of required project information including proposal approval and initial payment."
    },
    unlockFast: {
      title: `Unlock Faster Delivery`,
      desc: `To access Express and Rush delivery options and a more accurate cost estimate, please provide the required documentation listed above.`,
    },
    unlockRushAlert: "Confirm the 3 required documents above to unlock Rush and Express delivery options.",
    pkgNotIncluded: "WHAT IS NOT INCLUDED",
    speeds: {
      standard: {
        badge: "STANDARD DELIVERY — INCLUDED",
        previewTitle: "Design Preview",
        previewDays: "8–16 Business Days",
        previewSub: "Initial layout and visual direction delivered for review.",
        finalTitle: "Final Executive Project",
        finalDays: "25–30 Business Days After Approval",
        finalSub: "Complete architectural drawing package in digital format.",
        footer: "Timeline officially starts upon confirmation of initial payment and receipt of all mandatory documentation/briefing."
      },
      rush: {
        badge: "PRIORITY DELIVERY",
        previewTitle: "Design Preview",
        previewDays: "5–10 Business Days",
        previewSub: "Accelerated initial layout and visual direction.",
        finalTitle: "Final Executive Project",
        finalDays: "15–20 Business Days",
        finalSub: "Up to 30% reduction in total development time.",
        footer: "Exact timeline subject to project complexity and confirmed by Studio within 24h."
      },
      express: {
        badge: "EXPRESS DELIVERY",
        previewTitle: "Design Preview",
        previewDays: "3–5 Business Days",
        previewSub: "Accelerated initial layout.",
        finalTitle: "Final Executive Project",
        finalDays: "10–15 Business Days",
        finalSub: `Maximum priority in the Studio's production queue.`,
        footer: "Immediate availability subject to technical team validation."
      }
    },
    projectEstimate: "Project Estimate",
    uploadTitle: "Upload Reference Files",
    uploadHelp: `Please upload any relevant documents such as: Existing Floor Plans, Site Surveys, sketches, or photos of the property. Clear documentation helps us provide a more accurate and faster design service.`,
    dropHere: "Drop here or ",
    browse: "click to browse",
    projectIntent: "Project Intent",
    uploadLaterNote: `You can send your files later — we'll remind you by email.`,
    detected: "Detected",
    dimInstructions: `Accepted formats: 10'1", 5'-10", 6'3 1/4", 180. Please do not use periods (.) or commas (,).`,
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
      addition: `Expanding the home's footprint horizontally by adding new rooms outward.`,
      second_story: "Expanding vertically by removing the roof and adding a full new level.",
      garage_only: "Building a brand new detached or attached garage.",
      garage_conversion: "Transforming an existing garage into a livable space (office, game room, or ADU).",
      basement_finishing: `Turning an unfinished, concrete basement into a fully insulated and usable living area.`,
      deck_covered: "An outdoor wooden or composite platform featuring a permanent roof structure.",
      deck_open: "A classic outdoor platform without a roof.",
      porch_covered: "A porch with a solid floor and a permanent roof.",
      porch_open: "A porch fully enclosed with insect screens for comfortable summer use.",
      renovation: `General updating of the home's interior or exterior without adding new square footage.`,
      other_const: "Other construction services not listed.",
      kitchen_remodel: `Full kitchen update including new cabinets, islands, countertops, and appliances.`,
      bath_remodel: `Full bathroom update including walk-in showers, new vanities, and tiling.`,
      open_concept: `Removing structural or non-structural walls to integrate the kitchen, dining, and living areas.`,
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
      bedrooms: "Bedrooms", guestRoom: "Guest Room", bathrooms: "Bathrooms", halfBaths: "Half Baths",
      livingRooms: "Living Room", diningRoom: "Dining Room", familyRoom: "Family Room",
      kitchen: "Kitchen", kitchenIsland: "Kitchen Island", pantry: "Pantry", laundry: "Laundry",
      walkInCloset: "Walk-in Closet", linen: "Linen Closet", mudroom: "Mudroom", storage: "Storage / Deposit",
      office: "Home Office", gym: "Gym", studio: "Studio / Hobby Room", gameRoom: "Game Room",
      deckCovered: "Covered Deck", deckOpen: "Uncovered Deck", porchCovered: "Covered Porch", porchOpen: "Uncovered Porch",
      balcony: "Balcony", sunroom: "Sunroom", outdoorKit: "Outdoor Kitchen",
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
      as_built_permit: "As-Built Drawings & Permit Documentation",
      floor_plans_only: "Floor Plans Only",
      pdf_to_cad: "PDF to CAD Conversion",
      "3d_rendering": "3D Realistic Rendering"
    },
    pkgSubs: {
      as_built_permit: `The ultimate end-to-end solution for absolute precision, from survey to permit approval.`,
      floor_plans_only: "Detailed 2D architectural drawings of your existing space.",
      pdf_to_cad: "High-precision conversion of your existing PDF plans into professional CAD format.",
      "3d_rendering": "Breathtaking photorealistic visualizations of your architectural project."
    },
    pkgDetails: {
      as_built_permit: {
        summary: `Comprehensive architectural package tailored to your needs. From essential municipal documentation to full executive design, including 3D visualization and technical detailing.`,
        whyUs: `We don't just draw lines—we deliver approval-ready precision. Our deep understanding of IRC/IBC codes means faster municipal approvals, fewer revisions, and a design that is builder-ready from day one. You save time, money, and headaches.`,
        whatYouReceive: [
          { title: `Basic Permit Set (Fundamental)`, desc: `Essential set including Existing/Demolition/Proposed plans, 2 Sections, 4 Elevations, and Roof Plan.` },
          { title: `Design & Space Planning (Optional)`, desc: `Aesthetic development, optimal room flow analysis, and micro-level interior layout.` },
          { title: `Technical Construction Set (Optional)`, desc: "Framing plans (pre-dimensioning), construction details, and schedules for the builder." },
          { title: `3D Visualization (Optional)`, desc: "High-fidelity exterior rendering to see the final result before construction." },
          { title: `Existing Conditions / History`, desc: `Detailed digital documentation of the property's current state and historical records.` }
        ],
        notIncluded: ["Material Procurement", "Landscape Design", "Cabinetry Shop Drawings"],
        idealFor: ["Homeowners needing permits", "Complex Projects", "Professional Approval"]
      },
      floor_plans_only: {
        tag: "LOW COMPLEXITY",
        summary: `A streamlined service delivering fundamental interior spatial layouts and dimensioned floor plans.`,
        whyUs: `Whether you're an investor pitching a layout or a homeowner visualizing a space, our team delivers high-quality, architecturally accurate plans with a turnaround time and aesthetic polish that generic drafting services simply can't match.`,
        whatYouReceive: [
          { title: `Fundamental Spatial Layouts`, desc: `Basic interior walls, doors, and room identification.` },
          { title: `Dimensioned Floor Plans`, desc: "Precise measurements of all interior spaces and structural elements." }
        ],
        notIncluded: ["Exterior Design", "3D Renderings", "Building Permits", "Structural Engineering"],
        idealFor: ["Initial Planning", "Cosmetic Renovations", "Concept Only"]
      },
      pdf_to_cad: {
        tag: "PRECISION",
        summary: `Professional conversion of existing PDF drawings into editable CAD (DWG) format.`,
        whyUs: `Precision is everything. We guarantee millimeter-accurate digital conversions organized in standard architectural layers, ensuring your engineers and builders can hit the ground running without wasting hours fixing messy CAD files.`,
        whatYouReceive: [
          { title: `Fully Editable CAD Files`, desc: "Standard DWG format compatible with all major CAD software." },
          { title: `Accurate Scaling`, desc: "Verification and adjustment to ensure real-world precision." },
          { title: `Layer Organization`, desc: `Structured layers for walls, dimensions, and annotations.` }
        ],
        notIncluded: ["Architectural Design", "Code Review", "Field Measurements", "3D Modeling"],
        idealFor: ["Digital Archiving", "Renovation Base", "Contractors"]
      },
      "3d_rendering": {
        tag: "VISUALIZATION",
        summary: `The "photo" of the future. This service provides high-quality imagery that brings your project to life with realistic textures, lighting, and colors.`,
        whyUs: `We create emotion. Our 3D artists use cinematic lighting and ultra-realistic textures to craft images that don't just show a building, but sell a lifestyle. Perfect for pre-sales, investor pitches, or making confident finish selections.`,
        whatYouReceive: [
          { title: `Photorealistic Images`, desc: "High-resolution 3D renders with realistic materials and environments." },
          { title: `Material Visualization`, desc: `See your choices for siding, roofing, and windows in context.` },
          { title: `Atmospheric Lighting`, desc: "Natural and artificial lighting simulation for a realistic feel." }
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
        ex_arch_design: { label: `Architectural Design Detail`, desc: `Focuses on the conceptual and aesthetic development of your project. Includes exterior elevations, structural style, and overall look and feel.` },
        ex_space_plan: { label: `Space Planning`, desc: `Macro-level design focusing on the optimal arrangement of walls, doors, and room flows. We analyze the best way to utilize the square footage for functionality and movement.` },
        ex_interior_lay: { label: `Interior Layout`, desc: "Micro-level design detailing the placement of furniture, custom cabinetry (like kitchen or bathroom vanities), appliances, and specific fixtures within the defined spaces." },
        ex_const_detail: { label: `Construction Detailing & Framing`, desc: "Technical framing plans (pre-dimensioning), essential construction details, and schedules (doors/windows). This module provides the necessary information for your builder to execute the project accurately, reducing material waste and construction time." },
        ex_code_comp: { label: `Code Compliance & Technical Notes`, desc: `Detailed municipal code citations, safety notes, and professional annotations required to streamline the permit approval process and ensure legal compliance.` },
        ex_3d_ext: { label: `3D Exterior Rendering`, desc: "High-fidelity 3D visualization of the exterior architecture." },
        ex_3d_kitchen: { label: `3D Kitchen Design`, desc: "Photorealistic visualization of your kitchen with materials and lighting." },
        ex_3d_bath: { label: `3D Bathroom Design`, desc: "Detailed 3D rendering of your primary bathroom." },
        ex_3d_laundry: { label: `3D Laundry Design`, desc: "Functional and aesthetic visualization of the laundry space." }
      }
    },
    review: {
      client: "Client",
      location: "Location",
      project: "Project",
      summary: `Final Summary`,
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
      title: `Review your brief.`,
      sub: "Verify every detail before submitting. Click any section to edit.",
      groundFloor: "Ground Floor",
      multipleFloors: "Multiple Floors",
      days510: "5–10 Business Days",
      days816: "8–16 Business Days",
      timelineStandard: "Standard (Contact Studio)",
      errorOccurred: "An error occurred. Please try again.",
      whatNext: "WHAT HAPPENS NEXT",
      nextSteps: [
        { title: `Estimate Review`, desc: "Our team reviews your brief within 24 hours." },
        { title: `Formal Quote`, desc: `You receive a detailed, no-surprise proposal.` }
      ],
      legalTitle: "⚠ IMPORTANT LEGAL DISCLAIMER",
      legalBody: "This estimate is strictly for initial design and drafting services. It DOES NOT INCLUDE professional engineering seals (PE/SE stamps) or architectural stamps required for building permit submission. The client is solely responsible for retaining and paying a licensed Engineer or Architect of Record.",
      agreementBody: `⚠ The value above is an estimate. The final fee will be confirmed after our team reviews your brief. By proceeding, you agree to receive a formal proposal.`,
      processing: "⌛ Processing...",
      payRetainer: "🔒 Confirm & Start My Project",
      secureNotice: "Secure payment via Stripe or Bank Transfer",
      saveLater: "🔖 Save for Later — Send me this estimate",
      saveLaterNote: `You'll receive a PDF with your full brief and estimated fees — no commitment required.`,
      backButton: "← Back",
      emailEstimate: "Just email me this estimate for now",
      redirectNotice: "You will be redirected to our secure client portal to finalize your order."
    }
  },
  PT: {
    backToSite: "← Voltar ao Site",
    step: "Etapa",
    of: "de",
    back: "← Voltar",
    continue: "Continuar →",
    submit: `Enviar Solicitação e Acessar Portal →`,
    whereProject: `Onde seu projeto está localizado?`,
    locationSub: `Isso nos ajuda a aplicar os códigos de obras, taxas e parâmetros urbanísticos corretos.`,
    streetAddress: `Endereço`,
    city: "Cidade",
    state: "Estado",
    zipCode: "CEP",
    confirmLocation: `Confirmar Localização ✓`,
    locationConfirmed: `✓ Localização confirmada`,
    verifyLocation: `Verifique se o seu projeto está fixado corretamente e confirme.`,
    tellAboutYou: `Conte-nos sobre você.`,
    aboutYouSub: `Garantimos a privacidade dos seus dados. Usaremos estas informações exclusivamente para personalizar sua estimativa.`,
    fullName: "Nome Completo",
    email: "E-mail",
    phone: "Telefone",
    whoAreYou: `Qual é o seu perfil?`,
    homeownerMsg: "Planejando a casa dos seus sonhos? Estamos aqui para ajudar.",
    builderMsg: `Adoramos trabalhar com construtores! Vamos otimizar o processo de design para o seu próximo projeto.`,
    architectMsg: "Vamos colaborar em grandes projetos juntos.",
    investorMsg: `Vamos otimizar seu ROI com soluções de design estratégico.`,
    realtorMsg: `Ajudando seus clientes a visualizar o potencial? Você está no lugar certo.`,
    otherMsg: `Como podemos ajudá-lo a transformar seu espaço hoje?`,
    ircIbcStandardsMsg: `Todos os projetos são desenvolvidos de acordo com as normas IRC/IBC para garantir conformidade estrutural e segurança.`,
    companyInfo: `Informações da Empresa`,
    bizName: "Nome da Empresa",
    website: "Website",
    bizAddress: `Endereço Comercial`,
    bizCity: "Cidade",
    bizState: "Estado",
    bizZip: "CEP",
    bizEmail: "E-mail Comercial",
    bizPhone: "Telefone Comercial",
    tellAboutProject: "Simule o custo do seu projeto nos EUA.",
    projectSub: `Obtenha uma estimativa rápida para o desenvolvimento de blueprints e documentação técnica.`,
    propType: "Tipo de Propriedade",
    dimensions: `Dimensões do Projeto`,
    width: "Largura",
    length: "Comprimento",
    levels: `Níveis / Andares`,
    selectServices: `Selecionar Serviços`,
    servicesSub: `Escolha os serviços específicos que você precisa para o seu projeto.`,
    deliveryPackage: "Selecione o escopo ideal para a sua demanda.",
    packageSub: `Defina o nível de documentação técnica, modelagem ou conversão que o seu projeto nos EUA exige para avançar sem erros.`,
    programReqs: "Programa de Necessidades",
    programSub: `Quantos ambientes a sua obra vai ter? Defina a composição dos espaços abaixo e inicie o seu planejamento.`,
    specialReqs: "Requisitos Especiais (Opcional)",
    specialReqsPlaceholder: `Descreva quaisquer requisitos especiais, necessidades de acessibilidade ou notas para a equipe de design…`,
    uploadFiles: `Carregar Arquivos de Referência`,
    uploadSub: `Organize por categoria — máximo de 100MB por arquivo.`,
    dragDrop: "Arraste e solte ou clique para carregar",
    deliverySpeed: "Selecione a Velocidade de Entrega",
    speedSub: `Precisa mais rápido? Escolha uma opção de entrega abaixo.`,
    reviewEstimate: "Revise sua Estimativa",
    reviewSub: "Verifique todos os detalhes antes de enviar.",
    estimatedFee: "Investimento Estimado em Projeto",
    yourProject: "Seu Projeto",
    summary: "Resumo",
    confidence: `Confiança da Estimativa`,
    approxEstimate: `*Estimativa preliminar baseada no escopo inicial. Os valores finais serão consolidados após a validação do briefing e características do terreno/imóvel.`,
    enterDims: `Insira a área em sq ft (pés quadrados) e selecione o tipo de propriedade para ver sua estimativa.`,
    customArea: `Área Personalizada`,
    totalArea: `Área Total`,
    selectLevels: `Selecione os níveis abaixo`,
    groundFloor: `Térreo`,
    secondFloor: "Pavimento Superior",
    basement: "Subsolo",
    attic: `Sótão`,
    standardDelivery: `Entrega Padrão`,
    rushDelivery: `Entrega Prioritária`,
    expressDelivery: "Entrega Expressa",
    standardTimeline: `Tempo de resposta padrão`,
    rushTimeline: `Agendamento prioritário`,
    expressTimeline: `Resposta mais rápida possível`,
    includedFree: `Incluso — GRÁTIS`,
    idealFor: "Ideal para:",
    moreDetails: "Mais detalhes",
    whatYouReceive: `O que você recebe`,
    roles: { homeowner: `Proprietário`, builder: "Construtor", architect: "Arquiteto", investor: "Investidor", realtor: "Corretor", other: "Outro" },
    constructionStructure: `Construção e Estrutura`,
    interiors: "Interiores",
    typeOfService: `Tipo de Serviço`,
    svcLabels: {
      new_construction: `Nova Construção`, addition: `Ampliação / Extensão`, second_story: `Adição de Segundo Pavimento`,
      garage_only: "Apenas Garagem", garage_conversion: `Conversão de Garagem`, basement_finishing: "Acabamento de Subsolo",
      deck_covered: "Deck Coberto", deck_open: "Deck Aberto", porch_covered: "Varanda Coberta", porch_open: "Varanda Aberta",
      renovation: `Reformas e Remodelações`, other_const: `Outra Construção`,
      kitchen_remodel: "Reforma de Cozinha", bath_remodel: "Reforma de Banheiro", open_concept: `Conversão de Conceito Aberto`, other_int: "Outro Interior"
    },
    propertyTypes: {
      single_family: { label: `Residencial Unifamiliar (Single-Family Residential)`, sub: "Single-Family Homes. Projetos de casas customizadas e reformas do zero." },
      multi_family: { label: "Multifamiliar", sub: `Multi-Family. Duplex, townhouses e edifícios residenciais para investimento.` },
      adu: { label: "ADU", sub: `Accessory Dwelling Units. Edículas, guest houses e projetos para gerar renda extra de aluguel.` }
    },
    svcSubs: {
      new_construction: "New Construction. Blueprints completos para novas propriedades do zero.", addition: `Addition / Extension. Adicione novos quartos, suítes ou anexos à estrutura existente.`, second_story: `Second Story Addition. Projetos para construção de novo pavimento superior.`,
      garage_only: "Detached Garage. Projetos de garagens independentes ou oficinas.", garage_conversion: `Garage Conversion. Transforme a garagem existente em área habitável ou ADU legalizada.`, basement_finishing: `Basement Finishing. Legalização, divisórias e acabamento completo de subsolos.`,
      deck_covered: "Covered Deck. Projetos de decks de madeira ou composto com cobertura.", deck_open: "Uncovered Deck. Estruturas de decks abertos para lazer.", porch_covered: `Covered Porch / Patio. Extensão de áreas cobertas integradas à casa.`, porch_open: `Open Patio / Porch. Projetos de varandas abertas e pavimentação externa.`,
      renovation: `Remodeling & Renovation. Alterações de layout interno, elétrica e hidráulica.`, other_const: `Custom Project. Outros tipos de estruturas ou demandas técnicas específicas.`,
      kitchen_remodel: `Kitchen Remodel. Detalhamento de marcenaria, elétrica, hidráulica e novos layouts.`, bath_remodel: `Bathroom Remodel. Realocação de shafts, novos layouts e especificações técnicas.`, open_concept: `Open Concept Conversion. Remoção de paredes, integração de ambientes e análise estrutural básica.`, other_int: `Custom Interior. Projetos de lareiras, closets, home theater ou demandas sob medida.`
    },
    pkgLabels: { as_built_permit: `Desenvolvimento de Projeto e Documentação`, floor_plans_only: "Apenas Plantas Baixas", pdf_to_cad: "PDF para CAD", "3d_rendering": `Renderização 3D` },
    unlockRush: `Por favor, faça o upload dos 3 arquivos obrigatórios acima para desbloquear prazos de entrega mais rápidos.`,
    checklist: {
      survey: `Levantamento Topográfico / Site Plan`,
      photos: "Fotos gerais da propriedade (Fachadas e Entorno)",
      measure: "Levantamento Existente (As-Built ou croquis com medidas)",
      listing: `Anúncio imobiliário atual (Zillow, Redfin, etc.)`,
      tour: "Matterport ou Tour Virtual 3D",
      reports: `Laudos Estruturais ou de Avaliação (Appraisal/Structural Reviews)`,
      existing_plans: `Plantas Existentes ou Projetos Anteriores (Ex: Alvarás Antigos)`,
      city_notes: `Pareceres ou Exigências do Departamento de Obras`,
      recommended: "Recomendado",
      ifAvailable: `Se disponível`,
      ifApplicable: "Se houver"
    },
    stdDeliveryCard: {
      badge: `ENTREGA PADRÃO — INCLUSA`,
      previewTitle: "Estudo Preliminar (SD)",
      previewDays: `8–16 Dias Úteis`,
      previewSub: `Layout inicial e direção visual entregues para revisão.`,
      finalTitle: `Conjunto Técnico Completo (CD)`,
      finalDays: `25–30 Dias Úteis Após Aprovação`,
      finalSub: `Pacote completo de desenho arquitetônico em formato digital.`,
      footer: `O cronograma oficial inicia após a confirmação do pagamento e o recebimento de toda a documentação e briefing obrigatórios.`
    },
    unlockFast: {
      title: `Acelere seu Cronograma`,
      desc: `O envio dos documentos obrigatórios garante a precisão técnica da sua estimativa e libera nossas modalidades de entrega prioritária: Express e Rush.`,
    },
    unlockRushAlert: `Confirme os 3 documentos obrigatórios acima para desbloquear as opções Rush e Express.`,
    pkgNotIncluded: `O QUE NÃO ESTÁ INCLUSO`,
    speeds: {
      standard: {
        badge: `ENTREGA PADRÃO — INCLUSA`,
        previewTitle: "Estudo Preliminar (SD)",
        previewDays: `8–16 Dias Úteis`,
        previewSub: `Layout inicial e direção visual entregues para revisão.`,
        finalTitle: `Conjunto Técnico Completo (CD)`,
        finalDays: `25–30 Dias Úteis Após Aprovação`,
        finalSub: `Pacote completo de desenho arquitetônico em formato digital.`,
        footer: `O cronograma oficial inicia após a confirmação do pagamento e o recebimento de toda a documentação e briefing obrigatórios.`
      },
      rush: {
        badge: `ENTREGA PRIORITÁRIA`,
        previewTitle: "Estudo Preliminar (SD)",
        previewDays: `3–5 Dias Úteis`,
        previewSub: `Prioridade no desenvolvimento do layout inicial e direção visual.`,
        finalTitle: `Conjunto Técnico Completo (CD)`,
        finalDays: `15–20 Dias Úteis`,
        finalSub: `Redução de até 30% no prazo final de entrega técnica.`,
        footer: `Prazo exato condicionado à complexidade do projeto e confirmado pelo Studio em até 24h.`
      },
      express: {
        badge: `ENTREGA ULTRA-RÁPIDA (RUSH)`,
        previewTitle: "Estudo Preliminar (SD)",
        previewDays: `1–2 Dias Úteis`,
        previewSub: "Layout inicial com desenvolvimento acelerado e imediato.",
        finalTitle: `Conjunto Técnico Completo (CD)`,
        finalDays: `10–15 Dias Úteis`,
        finalSub: `Prioridade máxima e exclusiva na fila de produção do Studio.`,
        footer: `Disponibilidade imediata sujeita a validação da equipe técnica.`
      }
    },
    projectEstimate: "Estimativa do Projeto",
    uploadTitle: `Envio de Documentação e Referências`,
    uploadHelp: `Por favor, envie os documentos disponíveis do seu imóvel ou terreno, como: plantas existentes, levantamentos topográficos, croquis ou fotos. Uma documentação inicial completa acelera o desenvolvimento técnico e garante maior precisão à estimativa.`,
    dropHere: "Arraste ou ",
    browse: "clique para carregar",
    projectIntent: "Intuito do Projeto",
    detected: "Detectado",
    dimInstructions: `Formatos aceitos: 10.5 ou 10,5. Use ponto ou vírgula para decimais.`,
    rushFeesTitle: `Prazos e Opções de Entrega`,
    rushFeesSub: `Valide sua documentação para liberar cronogramas acelerados (Express e Rush).`,
    docChecklist: "CHECKLIST DE DOCUMENTOS",
    requiredRemaining: `obrigatórios restantes`,
    required: `Obrigatório`,
    uploaded: "Enviado",
    uploadAction: "+ Enviar",
    goals: {
      permit: `Apenas Aprovação Legal`,
      construction: `Documentação de Construção`,
      investment: "Investimento / Flip",
      personal: `Residência Pessoal`
    },
    svcDescs: {
      new_construction: `Construção de uma casa nova do zero em um lote vazio ou após demolição total.`,
      addition: `Expansão horizontal da residência, adicionando novos cômodos para fora.`,
      second_story: `Expansão vertical removendo o telhado e adicionando um novo pavimento completo.`,
      garage_only: `Construção de uma garagem nova, isolada ou anexa.`,
      garage_conversion: `Transformação de uma garagem existente em área habitável (escritório, lazer ou ADU).`,
      basement_finishing: `Transformação de um subsolo inacabado em área de estar isolada e utilizável.`,
      deck_covered: "Plataforma externa de madeira ou composto com estrutura de telhado permanente.",
      deck_open: `Plataforma externa clássica sem telhado.`,
      porch_covered: `Varanda com piso sólido e telhado permanente.`,
      porch_open: "Varanda totalmente fechada com telas contra insetos.",
      renovation: `Atualização geral do interior ou exterior da casa sem adicionar nova metragem.`,
      other_const: `Outros serviços de construção não listados.`,
      kitchen_remodel: `Atualização completa da cozinha, incluindo armários, ilhas e eletrodomésticos.`,
      bath_remodel: `Atualização completa de banheiro, incluindo boxes e novos revestimentos.`,
      open_concept: `Remoção de paredes estruturais ou não para integrar cozinha, jantar e estar.`,
      other_int: `Outros serviços de interior não listados.`
    },
    program: {
      living: "Social e Estar",
      bed: `Quartos e Dormitórios`,
      kitchen: "Cozinha e Jantar",
      bath: "Banheiros e Lavanderia",
      work: "Trabalho e Armazenamento",
      leisure: "Lazer e Externo",
      tech: `Utilidades e Técnica`
    },
    roomLabels: {
      bedrooms: "Quartos", guestRoom: `Quarto de Hóspedes`, bathrooms: "Banheiros", halfBaths: "Lavabos",
      livingRooms: "Sala de Estar", diningRoom: "Sala de Jantar", familyRoom: "Sala de TV",
      kitchen: "Cozinha", kitchenIsland: "Ilha na Cozinha", pantry: "Despensa", laundry: "Lavanderia",
      walkInCloset: "Walk-in Closet", linen: "Rouparia", mudroom: "Mudroom", storage: `Depósito / Estocagem`,
      office: `Escritório`, gym: "Academia", studio: `Ateliê / Hobby`, gameRoom: `Salão de Jogos`,
      deckCovered: "Deck Coberto", deckOpen: "Deck Descoberto", porchCovered: "Porch Coberto", porchOpen: "Porch Descoberto",
      balcony: "Sacada", sunroom: "Jardim de Inverno / Sunroom", outdoorKit: "Cozinha Externa",
      fireplace: "Lareira", wineCellar: "Adega", theater: "Home Theater",
      garageBays: "Vagas de Garagem", mechanical: `Sala de Máquinas`, elevator: "Elevador"
    },
    groupLabels: {
      core: `Cômodos Principais`,
      service: `Cozinha e Serviço`,
      work: "Trabalho e Bem-Estar",
      leisure: "Lazer e Externo",
      tech: `Utilidades e Técnica`
    },
    projectDimensions: `Dimensões do Projeto`,
    uploadLaterNote: `Você pode enviar seus arquivos depois — vamos te lembrar por e-mail.`,
    addLevelsFloors: `Adicionar Níveis / Andares`,
    propertyTypeLabel: "Tipo de Propriedade",
    lotSizeLabel: "LOT SIZE - TAMANHO DO LOTE",
    grandTotalArea: `Área Total Geral`,
    pkgTitles: {
      as_built_permit: `Desenhos As-Built e Documentação para Permit`,
      floor_plans_only: "Apenas Plantas Baixas",
      pdf_to_cad: `Conversão de PDF para CAD`,
      "3d_rendering": `Renderização 3D Realista`
    },
    pkgSubs: {
      as_built_permit: `Conjunto completo de blueprints para aprovação (Permit). Inclui o levantamento das condições existentes (As-Built), plantas de piso, elevações, cortes estruturais e tudo o que a prefeitura (City) exige.`,
      floor_plans_only: `Desenho técnico especializado focado no layout interno. Ideal para estudos preliminares de espaço, zoneamento interno e propostas iniciais de layout em 2D.`,
      pdf_to_cad: `Transformação de plantas antigas, arquivos em PDF ou desenhos escaneados em arquivos DWG/CAD totalmente editáveis, vetorizados e organizados em layers no padrão americano.`,
      "3d_rendering": `Modelagem tridimensional e renders fotorrealistas de alta resolução. Perfeito para construtores e investidores validarem materiais antes da obra ou usarem como material de marketing e vendas.`
    },
    pkgDetails: {
      as_built_permit: {
        summary: `Pacote arquitetônico abrangente adaptado às suas necessidades. Da documentação municipal essencial ao design executivo completo.`,
        whyUs: `Não desenhamos apenas linhas — entregamos precisão pronta para aprovação. Nosso profundo conhecimento das normas garante aprovações municipais mais rápidas, menos revisões e um projeto pronto para a obra desde o primeiro dia. Você economiza tempo, dinheiro e dores de cabeça.`,
        whatYouReceive: [
          { title: `Conjunto Básico de Permissão`, desc: `Plano essencial incluindo plantas Existente/Demolição/Proposto, cortes, fachadas e telhado.` },
          { title: `Design e Planejamento de Espaço (Opcional)`, desc: `Desenvolvimento estético e análise de fluxo otimizada.` },
          { title: `Conjunto Técnico de Construção (Opcional)`, desc: "Planos de estrutura e detalhes para o construtor." },
          { title: `Visualização 3D (Opcional)`, desc: `Renderização externa de alta fidelidade.` },
          { title: `Histórico / Existente`, desc: `Documentação digital do estado atual e registros históricos da propriedade.` }
        ],
        notIncluded: ["Compra de Materiais", "Paisagismo", "Desenhos de Marcenaria"],
        idealFor: [`Proprietários que precisam de aprovação`, "Projetos Complexos", `Aprovação Profissional`]
      },
      floor_plans_only: {
        tag: "SCHEMATIC DESIGN",
        summary: `Um serviço simplificado que entrega layouts espaciais fundamentais e plantas baixas dimensionadas.`,
        whyUs: `Seja você um investidor vendendo uma ideia ou um proprietário visualizando um espaço, nossa equipe entrega plantas arquitetônicas precisas e de alta qualidade, com um prazo e refinamento estético que serviços genéricos de desenho simplesmente não conseguem igualar.`,
        whatYouReceive: [
          { title: `Layouts Espaciais Fundamentais`, desc: `Paredes internas básicas, portas e identificação de cômodos.` },
          { title: `Plantas Baixas Dimensionadas`, desc: `Medições precisas de todos os espaços internos e elementos estruturais.` }
        ],
        notIncluded: ["Design Exterior", `Renderizações 3D`, `Aprovação de Prefeitura`, "Engenharia Estrutural"],
        idealFor: ["Planejamento Inicial", `Reformas Estéticas`, "Apenas Conceito"]
      },
      pdf_to_cad: {
        tag: "CAD CONVERSION",
        summary: `Conversão profissional de desenhos PDF existentes para o formato CAD (DWG) editável.`,
        whyUs: `A precisão é tudo. Garantimos conversões digitais milimetricamente exatas, organizadas em camadas arquitetônicas padrão, para que seus engenheiros e construtores possam começar a trabalhar imediatamente, sem perder horas arrumando arquivos bagunçados.`,
        whatYouReceive: [
          { title: `Arquivos CAD Totalmente Editáveis`, desc: `Formato DWG padrão compatível com os principais softwares CAD.` },
          { title: `Escalonamento Preciso`, desc: `Verificação e ajuste para garantir precisão no mundo real.` },
          { title: `Organização de Camadas`, desc: `Camadas estruturadas para paredes, dimensões e anotações.` }
        ],
        notIncluded: [`Design Arquitetônico`, `Revisão de Código`, `Medições de Campo`, "Modelagem 3D"],
        idealFor: ["Arquivamento Digital", "Base para Reforma", "Empreiteiros"]
      },
      "3d_rendering": {
        tag: "3D RENDERING",
        summary: `Modelagem tridimensional e renders fotorrealistas de alta resolução. Perfeito para construtores e investidores validarem materiais antes da obra ou usarem como material de marketing e vendas.`,
        whyUs: `Nós criamos emoção. Nossos artistas 3D usam iluminação cinematográfica e texturas ultra-realistas para criar imagens que não apenas mostram um edifício, mas vendem um estilo de vida. Perfeito para pré-vendas, apresentações a investidores ou escolhas seguras de acabamentos.`,
        whatYouReceive: [
          { title: `Imagens Fotorrealistas`, desc: `Renders 3D de alta resolução com materiais e ambientes realistas.` },
          { title: `Visualização de Materiais`, desc: `Veja suas escolhas de revestimento, telhado e janelas em contexto.` },
          { title: `Iluminação Atmosférica`, desc: `Simulação de iluminação natural e artificial para um toque realista.` }
        ],
        notIncluded: [`Plantas Técnicas`, "Engenharia Estrutural", `Especificação de Design de Interiores`, `Revisões no Design Principal`],
        idealFor: ["Visualizar o Resultado Final", `Venda do Imóvel`, `Decisão de Acabamentos`]
      }
    },
    pkgExtras: {
      groups: {
        design: "EXTRAS DE DESIGN",
        technical: `TÉCNICO E CONSTRUÇÃO`,
        visualization: `VISUALIZAÇÃO 3D E CÔMODOS ESPECÍFICOS`,
        modules_3d: `MÓDULOS DE VISUALIZAÇÃO 3D`
      },
      items: {
        ex_arch_design: { label: `Detalhamento Arquitetônico Avançado`, desc: `Foca no desenvolvimento conceitual e estético do seu projeto. Inclui fachadas externas, estilo estrutural e aparência geral.` },
        ex_space_plan: { label: `Planejamento de Espaço (Macro Design)`, desc: `Design em nível macro com foco no arranjo ideal de paredes, portas e fluxos entre cômodos. Analisamos a melhor maneira de utilizar a metragem quadrada para funcionalidade e movimentação.` },
        ex_interior_lay: { label: `Layout de Interiores (Space Planning)`, desc: `Design em nível micro detalhando o posicionamento de móveis, marcenaria sob medida (como armários de cozinha ou banheiro), eletrodomésticos e luminárias específicas dentro dos espaços definidos.` },
        ex_const_detail: { label: `Detalhamento Construtivo & Framing`, desc: `Plantas técnicas de estrutura (pré-dimensionamento), detalhes construtivos essenciais e tabelas (portas/janelas). Este módulo fornece as informações necessárias para o seu construtor executar o projeto com precisão, reduzindo desperdício de materiais e tempo de obra.` },
        ex_code_comp: { label: `Conformidade com Códigos Municipais (Code Compliance)`, desc: `Citações detalhadas de códigos municipais, notas de segurança e anotações profissionais necessárias para agilizar o processo de aprovação de alvarás e garantir a conformidade legal.` },
        ex_3d_ext: { label: `Renderização 3D Exterior`, desc: `Visualização 3D de alta fidelidade da arquitetura externa.` },
        ex_3d_kitchen: { label: `Design 3D de Cozinha`, desc: `Visualização fotorrealista da sua cozinha com materiais e iluminação.` },
        ex_3d_bath: { label: `Design 3D de Banheiro`, desc: `Renderização 3D detalhada do seu banheiro principal.` },
        ex_3d_laundry: { label: `Design 3D de Lavanderia`, desc: `Visualização funcional e estética da área de serviço.` }
      }
    },
    whatYouReceiveTitle: `O QUE VOCÊ RECEBE`,
    notIncludedTitle: `NÃO INCLUSO`,
    idealForTitle: "IDEAL PARA",
    serviceCustomization: `CUSTOMIZAÇÃO DE SERVIÇOS`,
    summaryTitle: "RESUMO",
    review: {
      client: "Cliente",
      location: `Localização`,
      project: "Projeto",
      summary: `Resumo Final`,
      documentation: `Documentação`,
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
      role: "Papel",
      address: `Endereço`,
      region: `Região`,
      regionUS: "Estados Unidos",
      regionBR: "Brasil",
      propType: "Tipo de Propriedade",
      levels: `Níveis`,
      services: `Serviços`,
      dimensions: `DIMENSÕES`,
      totalArea: `Área Total`,
      selectedSvcs: `SERVIÇOS SELECIONADOS`,
      timeline: "Cronograma Estimado",
      docsVerified: "Documentos verificados com sucesso.",
      noDocs: "Nenhum documento anexado",
      edit: "Editar",
      builderDiscount: `Construtor Profissional? Registre sua empresa abaixo para desbloquear um desconto de volume de 10% em todos os futuros conjuntos de licenças em MA.`,
      title: `Revise seu resumo.`,
      sub: `Verifique todos os detalhes antes de enviar. Clique em qualquer seção para editar.`,
      groundFloor: `Térreo`,
      multipleFloors: `Múltiplos Andares`,
      days510: `5–10 Dias Úteis`,
      days816: `8–16 Dias Úteis`,
      timelineStandard: `Padrão (Contate o Studio)`,
      errorOccurred: "Ocorreu um erro. Tente novamente.",
      whatNext: `PRÓXIMOS PASSOS`,
      nextSteps: [
        { title: `Revisão da Estimativa`, desc: `Nossa equipe revisa seu pedido em até 24 horas.` },
        { title: `Proposta Formal`, desc: `Você recebe uma proposta detalhada, sem surpresas.` }
      ],
      legalTitle: "⚠ AVISO LEGAL IMPORTANTE",
      legalBody: `Esta estimativa é estritamente para serviços iniciais de design e desenho. NÃO INCLUI selos de engenharia profissional (carimbos PE/SE) ou carimbos arquitetônicos necessários para submissão de alvará de construção. O cliente é o único responsável por contratar e pagar um Engenheiro ou Arquiteto de Registro licenciado.`,
      agreementBody: `⚠ O valor acima é uma estimativa. A taxa final será confirmada após nossa equipe revisar seu briefing. Ao prosseguir, você concorda em receber uma proposta formal.`,
      processing: "⌛ Processando...",
      payRetainer: "🔒 Confirmar e Iniciar Meu Projeto",
      secureNotice: `Pagamento seguro via Stripe ou Transferência Bancária`,
      saveLater: "🔖 Salvar para Depois — Enviar essa estimativa",
      saveLaterNote: `Você receberá um PDF com seu briefing completo e estimativas — sem compromisso.`,
      backButton: "← Voltar",
      emailEstimate: "Apenas me envie esta estimativa por e-mail por enquanto",
      redirectNotice: `Você será redirecionado para nosso portal de cliente seguro para finalizar seu pedido.`
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

const COMMON_CITIES = {
  US: ["Abington","Acton","Acushnet","Adams","Agawam","Alford","Amesbury","Amherst","Andover","Aquinnah","Arlington","Ashburnham","Ashby","Ashfield","Ashland","Athol","Attleboro","Auburn","Avon","Ayer","Barnstable","Barre","Becket","Belchertown","Bellingham","Belmont","Berkley","Berlin","Bernardston","Beverly","Billerica","Blackstone","Blandford","Bolton","Boston","Bourne","Boxborough","Boxford","Boylston","Braintree","Brewster","Bridgewater","Brimfield","Brockton","Brookfield","Brookline","Buckland","Burlington","Cambridge","Canton","Carlisle","Carver","Charlemont","Charlton","Chatham","Chelmsford","Chelsea","Cheshire","Chester","Chesterfield","Chicopee","Chilmark","Clarksburg","Clinton","Cohasset","Colrain","Concord","Conway","Cummington","Dalton","Danvers","Dartmouth","Dedham","Deerfield","Dennis","Dighton","Douglas","Dover","Dracut","Dudley","Dunstable","Duxbury","East Bridgewater","East Brookfield","East Longmeadow","Eastham","Easthampton","Easton","Edgartown","Egremont","Erving","Essex","Everett","Fairhaven","Fall River","Falmouth","Fitchburg","Florida","Foxborough","Framingham","Franklin","Freetown","Gardner","Georgetown","Gill","Gloucester","Goshen","Gosnold","Grafton","Granby","Granville","Great Barrington","Greenfield","Groton","Groveland","Hadley","Halifax","Hamilton","Hampden","Hancock","Hanover","Hanson","Hardwick","Harvard","Harwich","Hatfield","Haverhill","Hawley","Heath","Hingham","Hinsdale","Holbrook","Holden","Holland","Holliston","Holyoke","Hopedale","Hopkinton","Hubbardston","Hudson","Hull","Huntington","Ipswich","Kingston","Lakeville","Lancaster","Lanesborough","Lawrence","Lee","Leicester","Lenox","Leominster","Leverett","Lexington","Leyden","Lincoln","Littleton","Longmeadow","Lowell","Ludlow","Lunenburg","Lynn","Lynnfield","Malden","Manchester-by-the-Sea","Mansfield","Marblehead","Marion","Marlborough","Marshfield","Mashpee","Mattapoisett","Maynard","Medfield","Medford","Medway","Melrose","Mendon","Merrimac","Methuen","Middleborough","Middlefield","Middleton","Milford","Millbury","Millis","Millville","Milton","Monroe","Monson","Montague","Monterey","Montgomery","Mount Washington","Nahant","Nantucket","Natick","Needham","New Ashford","New Bedford","New Braintree","New Marlborough","New Salem","Newbury","Newburyport","Newton","Norfolk","North Adams","North Andover","North Attleborough","North Brookfield","North Reading","Northampton","Northborough","Northbridge","Northfield","Norton","Norwell","Norwood","Oak Bluffs","Oakham","Orange","Orleans","Otis","Oxford","Palmer","Paxton","Peabody","Pelham","Pembroke","Pepperell","Peru","Petersham","Phillipston","Pittsfield","Plainfield","Plainville","Plymouth","Plympton","Princeton","Provincetown","Quincy","Randolph","Raynham","Reading","Rehoboth","Revere","Richmond","Rochester","Rockland","Rockport","Rowe","Rowley","Royalston","Russell","Rutland","Salem","Salisbury","Sandisfield","Sandwich","Saugus","Savoy","Scituate","Seekonk","Sharon","Sheffield","Shelburne","Sherborn","Shirley","Shrewsbury","Shutesbury","Somerset","Somerville","South Hadley","Southampton","Southborough","Southbridge","Southwick","Spencer","Springfield","Sterling","Stockbridge","Stoneham","Stoughton","Stow","Sturbridge","Sudbury","Sunderland","Sutton","Swampscott","Swansea","Taunton","Templeton","Tewksbury","Tisbury","Tolland","Topsfield","Townsend","Truro","Tyngsborough","Tyringham","Upton","Uxbridge","Wakefield","Wales","Walpole","Waltham","Ware","Wareham","Warren","Warwick","Washington","Watertown","Wayland","Webster","Wellesley","Wellfleet","Wendall","Wenham","West Boylston","West Bridgewater","West Brookfield","West Newbury","West Springfield","West Tisbury","Westborough","Westfield","Westford","Westhampton","Westminster","Weston","Westport","Westwood","Weymouth","Whately","Whitman","Wilbraham","Williamsburg","Williamstown","Wilmington","Winchendon","Winchester","Windsor","Winthrop","Woburn","Worcester","Worthington","Wrentham","Yarmouth"]
};


const ROLES = [
  { id: "homeowner", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
  { id: "builder", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2a8 8 0 0 0-8 8v2"/><path d="M20 12v-2a8 8 0 0 0-8-8"/></svg> },
  { id: "architect", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 20L2 20 12 4 22 20z"></path><path d="M12 20L12 12"></path><path d="M8 20L9.5 16"></path><path d="M16 20L14.5 16"></path></svg> },
  { id: "investor", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><path d="M9 16l2-2 2 2 3-3"/><path d="M16 13h2v2"/></svg> },
  { id: "realtor", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg> },
];

const ROOM_GROUPS = [
  {
    label: `Core Rooms`, items: [
      { id: "bedrooms", label: "Bedrooms" },
      { id: "guestRoom", label: `Guest Room` },
      { id: "bathrooms", label: "Bathrooms" },
      { id: "halfBaths", label: `Half Baths` },
      { id: "livingRooms", label: `Living Room` },
      { id: "diningRoom", label: `Dining Room` },
      { id: "familyRoom", label: `Family Room` },
    ]
  },
  {
    label: `Kitchen & Service`, items: [
      { id: "kitchen", label: "Kitchen" },
      { id: "kitchenIsland", label: `Kitchen Island` },
      { id: "pantry", label: "Pantry" },
      { id: "laundry", label: "Laundry" },
      { id: "walkInCloset", label: `Walk-in Closet` },
      { id: "linen", label: `Linen Closet` },
      { id: "mudroom", label: "Mudroom" },
      { id: "storage", label: `Storage / Deposit` },
    ]
  },
  {
    label: `Work & Wellness`, items: [
      { id: "office", label: `Home Office` },
      { id: "gym", label: "Gym" },
      { id: "studio", label: `Studio / Hobby Room` },
      { id: "gameRoom", label: `Game Room` },
    ]
  },
  {
    label: `Entertainment & Outdoor`, items: [
      { id: "deckCovered", label: `Covered Deck` },
      { id: "deckOpen", label: `Uncovered Deck` },
      { id: "porchCovered", label: `Covered Porch` },
      { id: "porchOpen", label: `Uncovered Porch` },
      { id: "balcony", label: "Balcony" },
      { id: "sunroom", label: "Sunroom" },
      { id: "outdoorKit", label: `Outdoor Kitchen` },
      { id: "fireplace", label: "Fireplace" },
      { id: "wineCellar", label: `Wine Cellar` },
      { id: "theater", label: `Home Theater` },
    ]
  },
  {
    label: `Utilities & Tech`, items: [
      { id: "garageBays", label: `Garage Bays` },
      { id: "mechanical", label: `Mechanical Room` },
      { id: "elevator", label: "Elevator" },
    ]
  },
];

const ROOM_DEF = {
  bedrooms: 0, guestRoom: 0, bathrooms: 0, halfBaths: 0, livingRooms: 0, diningRoom: 0, familyRoom: 0,
  kitchen: 0, kitchenIsland: 0, pantry: 0, laundry: 0, walkInCloset: 0, linen: 0, mudroom: 0, storage: 0,
  office: 0, gym: 0, studio: 0, gameRoom: 0,
  deckCovered: 0, deckOpen: 0, porchCovered: 0, porchOpen: 0, balcony: 0, sunroom: 0,
  outdoorKit: 0, fireplace: 0, wineCellar: 0, theater: 0,
  garageBays: 0, mechanical: 0, elevator: 0
};

/* ═══ PRICING ENGINE ═══ */
function parseDim(val, isUS) {
  if (!val || typeof val !== "string" || !val.trim()) return 0;
  let s = val.trim();
  if (!isUS) {
    s = s.replace(',', '.');
  }

  // feet'inches" → e.g. 10'6" or 10'-6"
  const m1 = s.match(/^(\d+)['`’]\s*-?\s*(\d+(?:\.\d+)?)(?:\s*(\d+)\/(\d+))?["”]?$/);
  if (m1) {
    const ft = parseInt(m1[1], 10);
    let inch = parseFloat(m1[2] || 0);
    if (m1[3] && m1[4]) inch += parseInt(m1[3], 10) / parseInt(m1[4], 10);
    return ft * 12 + inch;
  }

  // e.g. 10'6 (no quote) or 10'
  const m2 = s.match(/^(\d+)['`’]\s*-?\s*(\d+(?:\.\d+)?)?["”]?$/);
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
  const fmtR = (lo, hi) => {
    if (lo === hi) return fmt(lo);
    return `${fmt(lo)} – ${fmt(hi)}`;
  };

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

  const currentStepNum = step ?? 3;
  const conf = Math.min(((currentStepNum + 1) / 8) * 100, 100);

  const effectivePkg = pkg || "as_built_permit";
  const isInitialEstimate = !pkg;

  if (totalBaseArea <= 0) {
    const PROP_SHORT0 = lang === "EN" ? { single_family: "Single Family", multi_family: "Multi-Family", adu: "ADU" } : { single_family: "Residencial", multi_family: "Multifamiliar", adu: "ADU" };
    const primarySvc0 = selectedSvcs.map(k => SVC_LABELS[k])[0] || "";
    const propShort0 = PROP_SHORT0[d.propertyType] || d.propertyType || "";
    const projectTitle0 = primarySvc0 && propShort0 ? `${primarySvc0} — ${propShort0}` : primarySvc0 || propShort0 || "";
    
    return { 
      lo: "--", hi: "--", conf, bd: [], 
      totalArea: 0, baseArea: 0, noPkg: true, 
      areaBlocks, projectTitle: projectTitle0,
      pkgName: "", selectedSvcNames: [], lvNames: [] 
    };
  }

  let loCost = 0;
  let hiCost = 0;
  const bd = [];
  
  const PKG_LABELS = lang === "EN" ? {
    as_built_permit: "As-Built & Permit Package",
    floor_plans_only: "Floor Plans Only",
    pdf_to_cad: "PDF to CAD Conversion",
    "3d_rendering": "3D Realistic Rendering"
  } : {
    as_built_permit: "Estudos Iniciais e Trâmites Legais",
    floor_plans_only: "Apenas Plantas Baixas",
    pdf_to_cad: "Conversão de PDF para CAD",
    "3d_rendering": "Renderização 3D Realista"
  };

  const pkgName = PKG_LABELS[effectivePkg] || effectivePkg;
  const currencyMult = isUS ? 1 : BRL;
  const minFee = 150 * currencyMult;

  if (effectivePkg === "floor_plans_only") {
    const rateLo = 0.50 * currencyMult;
    const rateHi = 0.70 * currencyMult;
    
    let calcLo = totalBaseArea * rateLo;
    let calcHi = totalBaseArea * rateHi;
    
    let adjLo = 0, adjHi = 0;
    if (calcLo > 0 && calcLo < minFee) { adjLo = minFee - calcLo; calcLo = minFee; }
    if (calcHi > 0 && calcHi < minFee) { adjHi = minFee - calcHi; calcHi = minFee; }
    
    loCost += calcLo;
    hiCost += calcHi;

    bd.push({
      l: lang === "EN" ? "Floor Plans" : "Plantas Baixas",
      v: fmtR(calcLo - adjLo, calcHi - adjHi),
      block: "arch"
    });
    
    if (adjLo > 0 || adjHi > 0) {
      bd.push({
        l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima",
        v: fmtR(adjLo, adjHi),
        block: "svc"
      });
    }
  } else if (effectivePkg === "pdf_to_cad") {
    const rateLo = 0.30 * currencyMult;
    const rateHi = 0.45 * currencyMult;
    
    let calcLo = totalBaseArea * rateLo;
    let calcHi = totalBaseArea * rateHi;
    
    let adjLo = 0, adjHi = 0;
    if (calcLo > 0 && calcLo < minFee) { adjLo = minFee - calcLo; calcLo = minFee; }
    if (calcHi > 0 && calcHi < minFee) { adjHi = minFee - calcHi; calcHi = minFee; }
    
    loCost += calcLo;
    hiCost += calcHi;

    bd.push({
      l: lang === "EN" ? "PDF to CAD Conversion" : "Conversão de PDF para CAD",
      v: fmtR(calcLo - adjLo, calcHi - adjHi),
      block: "arch"
    });
    
    if (adjLo > 0 || adjHi > 0) {
      bd.push({
        l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima",
        v: fmtR(adjLo, adjHi),
        block: "svc"
      });
    }
  } else if (effectivePkg === "as_built_permit") {
    const rateLo = 1.40 * currencyMult;
    const rateHi = 1.60 * currencyMult;
    const subRateLo = 0.30 * currencyMult;
    const subRateHi = 0.35 * currencyMult;
    
    let archLo = 0, archHi = 0;
    
    areaBlocks.forEach(blk => {
      const lvls = (d.svcLevels && blk.svcId && d.svcLevels[blk.svcId]) ? d.svcLevels[blk.svcId] : d.levels || {};
      const levelsToProcess = blk.noMult ? ["main"] : Object.keys(lvls).filter(k => lvls[k]);
      if (levelsToProcess.length === 0 && !blk.noMult) levelsToProcess.push("main");

      levelsToProcess.forEach(lvlKey => {
        const isSub = (lvlKey === "attic" || lvlKey === "basement");
        const rLo = isSub ? subRateLo : rateLo;
        const rHi = isSub ? subRateHi : rateHi;
        
        const lvlCostLo = blk.area * rLo;
        const lvlCostHi = blk.area * rHi;
        archLo += lvlCostLo;
        archHi += lvlCostHi;

        const lvlName = (lvlKey === "main" || lvlKey === "ground") ? T.groundFloor :
          (lvlKey === "second") ? T.secondFloor :
            (lvlKey === "basement") ? T.basement :
              (lvlKey === "attic") ? T.attic : lvlKey;

        bd.push({
          l: `${blk.label}: ${lvlName}`,
          v: fmtR(lvlCostLo, lvlCostHi),
          block: "arch"
        });
      });
    });

    let adjLo = 0, adjHi = 0;
    if (archLo > 0 && archLo < minFee) { adjLo = minFee - archLo; archLo = minFee; }
    if (archHi > 0 && archHi < minFee) { adjHi = minFee - archHi; archHi = minFee; }
    
    loCost += archLo;
    hiCost += archHi;
    
    if (adjLo > 0 || adjHi > 0) {
      bd.push({
        l: lang === "EN" ? "Minimum Fee Adjustment" : "Ajuste de Taxa Mínima",
        v: fmtR(adjLo, adjHi),
        block: "svc"
      });
    }

    const EXTRA_RATES_MAP = {
      ex_arch_design: { lo: 0.10, hi: 0.12 },
      ex_space_plan: { lo: 0.10, hi: 0.12 },
      ex_interior_lay: { lo: 0.10, hi: 0.12 },
      ex_const_detail: { lo: 0.10, hi: 0.12 },
      ex_code_comp: { lo: 0.05, hi: 0.06 },
      ex_3d_ext: { lo: 0.05, hi: 0.06 }
    };

    Object.keys(EXTRA_RATES_MAP).forEach(key => {
      if (pkgExtras[key]) {
        const extraRateLo = EXTRA_RATES_MAP[key].lo * currencyMult;
        const extraRateHi = EXTRA_RATES_MAP[key].hi * currencyMult;
        const extraCostLo = totalBaseArea * extraRateLo;
        const extraCostHi = totalBaseArea * extraRateHi;
        loCost += extraCostLo;
        hiCost += extraCostHi;
        const labels = {
          ex_arch_design: lang === "EN" ? "Architectural Design Detail" : "Detalhamento Arquitetônico Avançado",
          ex_space_plan: lang === "EN" ? "Space Planning" : "Planejamento de Espaço (Macro Design)",
          ex_interior_lay: lang === "EN" ? "Interior Layout" : "Layout de Interiores (Micro Design)",
          ex_const_detail: lang === "EN" ? "Construction Detailing" : "Detalhamento Construtivo & Framing",
          ex_code_comp: lang === "EN" ? "Code Compliance" : "Conformidade de Códigos e Notas Técnicas",
          ex_3d_ext: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior"
        };
        bd.push({ l: labels[key] || key, v: fmtR(extraCostLo, extraCostHi), block: "extra" });
      }
    });

    const FIXED_FEES_MAP = {
      ex_3d_kitchen: { lo: 150, hi: 200 },
      ex_3d_bath: { lo: 150, hi: 200 },
      ex_3d_laundry: { lo: 150, hi: 200 }
    };

    Object.keys(FIXED_FEES_MAP).forEach(key => {
      if (pkgExtras[key]) {
        const feeLo = FIXED_FEES_MAP[key].lo * currencyMult;
        const feeHi = FIXED_FEES_MAP[key].hi * currencyMult;
        loCost += feeLo;
        hiCost += feeHi;
        const labels = {
          ex_3d_kitchen: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha",
          ex_3d_bath: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro",
          ex_3d_laundry: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia"
        };
        bd.push({ l: labels[key] || key, v: fmtR(feeLo, feeHi), block: "extra" });
      }
    });

  } else if (effectivePkg === "3d_rendering") {
    const standalone3D = {
      ex_3d_ext: { lo: 250, hi: 300 },
      ex_3d_kitchen: { lo: 150, hi: 200 },
      ex_3d_bath: { lo: 150, hi: 200 },
      ex_3d_laundry: { lo: 150, hi: 200 }
    };
    Object.keys(standalone3D).forEach(key => {
      if (pkgExtras[key]) {
        const feeLo = standalone3D[key].lo * currencyMult;
        const feeHi = standalone3D[key].hi * currencyMult;
        loCost += feeLo;
        hiCost += feeHi;
        const labels = {
          ex_3d_ext: lang === "EN" ? "3D Exterior Rendering" : "Renderização 3D Exterior",
          ex_3d_kitchen: lang === "EN" ? "3D Kitchen Design" : "Design 3D de Cozinha",
          ex_3d_bath: lang === "EN" ? "3D Bathroom Design" : "Design 3D de Banheiro",
          ex_3d_laundry: lang === "EN" ? "3D Laundry Design" : "Design 3D de Lavanderia"
        };
        bd.push({ l: labels[key] || key, v: fmtR(feeLo, feeHi), block: "extra" });
      }
    });
  }

  let multiplier = 1.0;
  if (d.rush === "rush") multiplier = 1.4;
  if (d.rush === "express") multiplier = 1.6;

  const finalLo = Math.round(loCost * multiplier);
  const finalHi = Math.round(hiCost * multiplier);

  if (multiplier > 1) {
    const feeLabel = d.rush === "rush" ? T.rushDelivery : T.expressDelivery;
    const rushFeeLo = Math.round(loCost * (multiplier - 1));
    const rushFeeHi = Math.round(hiCost * (multiplier - 1));
    bd.push({ l: feeLabel, v: fmtR(rushFeeLo, rushFeeHi), block: "extra" });
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

  const PROP_SHORT = lang === "EN" ? { single_family: "Single Family`, multi_family: `Multi-Family", adu: "ADU" } : { single_family: "Residencial`, multi_family: `Multifamiliar", adu: "ADU" };
  const primarySvc = selectedSvcNames[0] || "";
  const propShort = PROP_SHORT[d.propertyType] || d.propertyType || "";
  const projectTitle = primarySvc && propShort ? `${primarySvc} — ${propShort}` : primarySvc || propShort || "";

  const prefix = isInitialEstimate ? (lang === "EN" ? "Starting from " : "A partir de ") : "";

  return { 
    lo: prefix + fmt(finalLo), 
    hi: prefix + fmt(finalHi), 
    conf, bd, 
    totalArea: totalArea, 
    baseArea: totalBaseArea, 
    noPkg: isInitialEstimate, 
    pkgName: isInitialEstimate ? (lang === "EN" ? "Estimated Base" : "Base Estimada") : pkgName, 
    areaBlocks, selectedSvcNames, lvNames, projectTitle 
  };
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
function Title({ label, sub, checked }) {
  const formatLabel = (txt) => {
    if (!txt) return null;
    const words = txt.split(" ");
    if (words.length <= 1) return txt;
    const splitIndex = Math.ceil(words.length / 2);
    const firstPart = words.slice(0, splitIndex).join(" ");
    const secondPart = words.slice(splitIndex).join(" ");
    return (
      <>
        {firstPart} <em className="title-gradient-italic">{secondPart}</em>
      </>
    );
  };

  return (
    <div className="page-header-premium" style={{ marginBottom: 32, marginTop: 0, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
        <h1 className="page-main-title" style={{ fontSize: '32px', margin: 0, textAlign: "center" }}>{formatLabel(label)}</h1>
        {checked && (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9c7c3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(156, 124, 58, 0.4))", marginTop: 4 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
      </div>
      {sub && <p className="page-subtitle-standard" style={{ fontSize: '15px', marginTop: '8px', textAlign: "center", maxWidth: "600px" }}>{sub}</p>}
    </div>
  );
}

/* ═══ MAIN WIZARD ═══ */
export default function EstimateWizard() {
  const navigate = useNavigate();
  const { 
    lang, setLang, theme, toggleTheme,
    wizardStep: contextStep, setWizardStep: setStep,
    wizardData: data, setWizardData: setData,
    resetWizard
  } = useAppContext();
  const { user, profile } = useAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    resetWizard();
    setIsInitialized(true);
  }, []);

  const step = isInitialized ? contextStep : 0;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState(null); // 'save' or 'accept'
  const [uploading, setUploading] = useState({}); // { [fileId]: progress }

  const T = (lang && TRANSLATIONS[lang]) || TRANSLATIONS.EN;
  const STEPS = lang === "PT" ? STEPS_PT : STEPS_EN;
  
  const topRef = useRef(null);

  const up = useCallback((key, val) => {
    if (setData) setData(prev => ({ ...prev, [key]: val }));
  }, [setData]);

  const est = calcEst(data || {}, lang || "EN", step || 0);

  // Validation
  const canGo = () => {
    if (!data) return false;
    if (step === 0) {
      // Basic info is enough to proceed, company info is optional for the wizard flow
      return !!(data.name && data.email && data.phone && data.role);
    }

    if (step === 1) return !!(data.region && data.street && data.city && data.state && data.zip);
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

      return !!data.propertyType && allDimsFilled;
    }
    if (step === 3) {
      if (!data.deliveryPkg) return false;
      if (data.deliveryPkg === "as_built_permit") {
        const hasDesignExtra = data.pkgExtras && (
          data.pkgExtras.ex_arch_design ||
          data.pkgExtras.ex_space_plan ||
          data.pkgExtras.ex_interior_lay
        );
        if (!hasDesignExtra) return false;
      }
      return true;
    }
    if (step === 4) {
      return true;
    }
    return true; // Steps 5, 6 are optional
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
      <header className="header-nav" style={{ position: 'sticky', top: 0, background: 'var(--bg-primary)', borderBottom: '1px solid var(--glass-border)', height: '80px', padding: '0 48px' }}>
          <Link to="/" className="header-logo">

            <span className="header-logo-text">
              <strong>DARA</strong><em>Studio</em>
            </span>
          </Link>

          <div className="header-actions">
            <div className="pill-button lang-toggle">
              <span className={lang === 'EN' ? 'active' : 'inactive'} onClick={() => setLang('EN')}>EN</span>
              <span className="divider">|</span>
              <span className={lang === 'PT' ? 'active' : 'inactive'} onClick={() => setLang('PT')}>PT</span>
            </div>

            <button className="pill-button theme-toggle" onClick={toggleTheme}>
              <div className="theme-icon-aura">
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="half-moon-sun"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="half-moon-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                )}
              </div>
            </button>

            {user ? (
              <>
                <Link to={profile?.role === 'admin' ? '/admin' : (profile?.role === 'collaborator' ? '/collaborator' : '/portal')} className="pill-button client-portal-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  {lang === 'EN' ? 'My Portal' : 'Meu Portal'}
                </Link>
                <Link to="/logout" className="pill-button logout-btn">
                  {lang === 'EN' ? 'Sign Out' : 'Sair'}
                </Link>
              </>
            ) : (
              <Link to="/login" className="pill-button client-portal-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {lang === 'EN' ? 'Client Portal' : 'Portal do Cliente'}
              </Link>
            )}
          </div>
      </header>

      <div id="layout" className={theme === 'dark' ? 'dark' : ''}>
        <BackgroundOrbs />
        <div className="independent-page" style={{ padding: "40px 20px 40px" }}>

          <div className={`wz-main-layout ${step >= 2 && step < 7 && !submitted ? "has-sidebar" : ""}`}>
            <div className="wz-animate" key={submitted ? "success" : step}>
              {submitted ? (
                <SuccessScreen
                  type={submissionType}
                  lang={lang}
                  onBack={() => setSubmitted(false)}
                  navigate={navigate}
                  T={T}
                  est={est}
                  d={data}
                  uploading={uploading}
                />
              ) : (
                <>
                  {step === 0 && <S2 d={data} up={up} lang={lang} />}
                  {step === 1 && <S1 d={data} up={up} lang={lang} />}
                  {step === 2 && <S3 d={data} up={up} est={est} lang={lang} />}
                  {step === 3 && <S4 d={data} up={up} est={est} lang={lang} />}
                  {step === 4 && <S6 d={data} up={up} lang={lang} />}
                  {step === 5 && <S7 d={data} up={up} lang={lang} setUploading={setUploading} uploading={uploading} />}
                  {step === 6 && <S8 d={data} up={up} lang={lang} setUploading={setUploading} uploading={uploading} />}
                  {step === 7 && <S9 d={data} est={est} setStep={setStep} lang={lang} setSubmitted={setSubmitted} setSubmissionType={setSubmissionType} setUploading={setUploading} />}
                </>
              )}

              {!submitted && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                  <button className="wz-btn-ghost" onClick={prev} style={{ visibility: step === 0 ? "hidden" : "visible" }}>{T.back}</button>
                  
                  {/* Stepper no meio */}
                  <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                    <Stepper cur={step} />
                  </div>

                  {step < STEPS.length - 1 ? (
                    <button className="wz-btn-primary" onClick={handleNext} disabled={!canGo()}>{T.continue}</button>
                  ) : (
                    <div style={{ width: 140 }}></div> /* Placeholder to keep stepper centered */
                  )}
                </div>
              )}
            </div>

            {step >= 2 && step < 7 && !submitted && (
              <div className={`wz-sidebar-mobile ${drawerOpen ? "open" : ""}`}>
                <div className="wz-drawer-handle" onClick={() => setDrawerOpen(!drawerOpen)} />
                <div className="wz-drawer-header" onClick={() => setDrawerOpen(!drawerOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", marginTop: "14px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)" }}>{T.projectEstimate}</span>
                  <span style={{ fontSize: 18, color: "var(--a)" }}>{drawerOpen ? "↓" : "↑"}</span>
                </div>
                <Sidebar est={est} lang={lang} data={data} step={step} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */
function Stepper({ cur }) {
  const currentStepNum = cur + 1;
  return (
    <div className="wz-stepper-pill" style={{ padding: '8px 24px', gap: '8px' }}>
      {[1,2,3,4,5,6,7,8].map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: 16,
            fontWeight: 800,
            display: 'inline-block',
            background: 'linear-gradient(to right, #A1824A, #8F723E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: currentStepNum >= n ? 1 : 0.3,
            transition: 'opacity 0.3s ease'
          }}>
            {n}
          </span>
          {i < 7 && (
            <span style={{ 
              color: 'var(--tx)', 
              opacity: 0.3, 
              fontSize: 16,
              fontWeight: 800 
            }}>·</span>
          )}
        </div>
      ))}
    </div>
  );
}


function Sidebar({ est, lang, data, step: currentStep }) {
  const { 
    lo = "--", hi = "--", conf = 0, bd = [], 
    projectTitle = "", pkgName = "" 
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
  const hasEstimate = lo && lo !== "--" && currentStep >= 3 && !!data?.deliveryPkg;
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  return (
    <div className="wz-sidebar">
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 12 }}>{T.estimatedFee}</p>

      {projectTitle && (
        <div style={{ marginBottom: 12, padding: "12px 16px", background: "var(--a-dim)", border: "1.5px solid var(--a-glow)", borderRadius: 16 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 4 }}>{T.yourProject}</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontStyle: "italic", color: "var(--a)", lineHeight: 1.3 }}>{projectTitle}</p>
        </div>
      )}

      <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
        {hasEstimate ? (
          <div>
            {pkgName && <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 4 }}>{pkgName}</p>}
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontStyle: "italic", color: "var(--tx)", marginBottom: 4 }}>{lo === hi ? lo : `${lo} – ${hi}`}</p>
            <p style={{ fontSize: 10, color: "#ffffff", lineHeight: 1.5 }}>{T.approxEstimate}</p>
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.6 }}>{T.enterDims}</p>
        )}
      </div>

      {hasEstimate && (
        <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
          {/* Detailed breakdown blocks would go here, simplified for space */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)" }}>{T.summaryTitle}</span>
          </div>
          <div style={{ padding: "8px 12px" }}>
            {bd.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "3px 0" }}>
                <span style={{ color: "var(--tx)" }}>{it.l}</span>
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
        <div className="wz-conf-track"><div className="wz-conf-fill" style={{ width: `${conf}%`, background: currentStep === 4 ? "#CCFF00" : col, backgroundSize: '200% auto', animation: 'spShimmer 3s linear infinite' }} /></div>
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

  const handleZipChange = async (val) => {
    up("zip", val);
    up("mapConfirmed", false);
    const cleanZip = val.replace(/\D/g, "");
    if (d.region === "BR" && cleanZip.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
        const json = await res.json();
        if (!json.erro) {
          if (json.logradouro) up("street", json.logradouro);
          if (json.localidade) up("city", json.localidade);
          if (json.uf) up("state", json.uf);
        }
      } catch (err) { console.error("CEP fetch error", err); }
    } else if (d.region === "US" && cleanZip.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${cleanZip}`);
        if (res.ok) {
          const json = await res.json();
          if (json.places && json.places.length > 0) {
            up("city", json.places[0]["place name"]);
            up("state", json.places[0]["state"]);
          }
        }
      } catch (err) { console.error("ZIP fetch error", err); }
    }
  };

  return (
    <div className="wz-animate">
      <Title label={T.whereProject} sub={T.locationSub} />
      {/* Region locked to US by default */}

      {d.region && (
        <div style={{ display: "flex`, flexDirection: `column", gap: 14 }}>


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
              options={COMMON_CITIES[d.region] || []}
              onChange={val => { up("city", val); up("mapConfirmed", false); }}
              error={ferr("city", d.city)}
              onBlur={() => touch("city")}
            />
            <Autocomplete
              label={T.state}
              placeholder={isUS ? "Massachusetts" : "SP"}
              value={d.state}
              options={d.region === "US" ? US_STATES : []}
              onChange={val => { up("state", val); up("mapConfirmed", false); }}
              error={ferr("state", d.state)}
              onBlur={() => touch("state")}
            />
          </div>

          <div className="wz-f">
            <label className="wz-label">{T.zipCode} <span style={{ color: "var(--rd)" }}>*</span></label>
            <InputMask mask={market.zipMask} className={`wz-inp ${ferr("zip", d.zip) ? "inp-err" : ""}`} placeholder={market.zipPlaceholder} style={{ maxWidth: 200 }}
              value={d.zip || ""} onChange={e => handleZipChange(e.target.value)} onBlur={() => touch("zip")} />
          </div>

          {allFilled && (
            <div className={`wz-map-container ${d.mapConfirmed ? 'confirmed' : ''}`} style={{ marginTop: 24, borderRadius: 24, overflow: "hidden", border: `1px solid ${d.mapConfirmed ? 'var(--brand-purple)' : 'var(--glass-border)'}`, boxShadow: d.mapConfirmed ? '0 0 32px rgba(156, 124, 58, 0.15)' : 'none', transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)' }}>
              <iframe key={d.street + d.city + d.state + d.zip} src={mapsUrl()} title="Project location" width="100%" height="320" style={{ border: "none", display: "block" }} allowFullScreen loading="lazy" />
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, borderTop: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: 14, color: "var(--text-color)", opacity: 0.85, flex: 1, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  {d.mapConfirmed
                    ? <span style={{ color: "var(--brand-purple)", fontWeight: 700 }}>{T.locationConfirmed}</span>
                    : T.verifyLocation}
                </p>
                {!d.mapConfirmed && (
                  <button className="wz-btn-primary" onClick={() => up("mapConfirmed", true)}>{T.confirmLocation}</button>
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
            <div style={{ position: "relative" }}>
              <input className={`wz-inp ${ferr("name", d.name) ? "inp-err" : ""} ${(d.name?.length > 2) ? "inp-valid" : ""}`} placeholder="Jane Smith"
                value={d.name || ""} onChange={e => up("name", e.target.value)} onBlur={() => touch("name")} style={{ borderColor: d.name?.length > 2 ? "var(--brand-purple)" : undefined }} />
              {(d.name?.length > 2) && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brand-purple)", pointerEvents: "none", display: "flex" }}><Chk /></div>}
            </div>
          </div>
          <div className="wz-f">
            <label className="wz-label">{T.email} <span style={{ color: "var(--rd)" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input className={`wz-inp ${ferr("email", d.email) ? "inp-err" : ""} ${(d.email?.includes('@') && d.email?.includes('.')) ? "inp-valid" : ""}`} type="email" placeholder="jane@example.com"
                value={d.email || ""} onChange={e => up("email", e.target.value)} onBlur={() => touch("email")} style={{ borderColor: (d.email?.includes('@') && d.email?.includes('.')) ? "var(--brand-purple)" : undefined }} />
              {(d.email?.includes('@') && d.email?.includes('.')) && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brand-purple)", pointerEvents: "none", display: "flex" }}><Chk /></div>}
            </div>
          </div>
        </div>
        <div className="wz-f" style={{ maxWidth: 320 }}>
          <label className="wz-label">{T.phone} <span style={{ color: "var(--rd)" }}>*</span></label>
          <div style={{ position: "relative" }}>
            <InputMask mask={MARKET_DATA[d.region]?.phoneMask || MARKET_DATA.US.phoneMask} maskChar={null} className={`wz-inp ${ferr("phone", d.phone) ? "inp-err" : ""} ${(d.phone?.replace(/\D/g, '').length >= 10) ? "inp-valid" : ""}`} placeholder={MARKET_DATA[d.region]?.phonePlaceholder}
              value={d.phone || ""} onChange={e => up("phone", e.target.value)} onBlur={() => touch("phone")} style={{ borderColor: (d.phone?.replace(/\D/g, '').length >= 10) ? "var(--brand-purple)" : undefined }} />
            {(d.phone?.replace(/\D/g, '').length >= 10) && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brand-purple)", pointerEvents: "none", display: "flex" }}><Chk /></div>}
          </div>
        </div>
      </div>

      <p className="wz-label" style={{ marginBottom: 16 }}>{T.whoAreYou} <span style={{ color: "var(--rd)" }}>*</span></p>
      <div className="wz-grid-adaptive" style={{ marginBottom: 32 }}>
        {ROLES.map(r => (
          <div key={r.id} className={`hww-feature-card ${d.role === r.id ? "active" : ""}`} onClick={() => { up("role", r.id); touch("role"); }} style={{ textAlign: "center", padding: "16px 12px", cursor: "pointer", borderColor: d.role === r.id ? "var(--color-neon-purple)" : "var(--glass-border)", background: d.role === r.id ? "linear-gradient(135deg, rgba(156, 124, 58,0.1), rgba(161, 130, 74,0.05))" : "var(--glass-bg)" }}>
            <div style={{ fontSize: 24, marginBottom: 8, filter: d.role === r.id ? "drop-shadow(0 0 12px rgba(156, 124, 58, 0.5))" : "none", transition: "all 0.3s ease", transform: d.role === r.id ? "scale(1.1)" : "scale(1)", color: d.role === r.id ? "var(--brand-purple)" : "var(--mu)" }}>{r.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em', color: "var(--text-color)" }}>{T.roles[r.id]}</div>
          </div>
        ))}
      </div>

      {d.role && T[d.role + "Msg"] && (
        <div className="wz-animate" style={{ marginBottom: 32, padding: "12px 20px", display: "flex", flexDirection: "row", alignItems: "center", gap: 12, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderLeft: "4px solid var(--brand-purple)", borderRadius: "12px" }}>
          <span style={{ fontSize: 20, filter: "drop-shadow(0 0 12px rgba(156, 124, 58, 0.4))" }}>{ROLES.find(r => r.id === d.role)?.icon || "✨"}</span>
          <p style={{ fontSize: 13, color: "var(--text-color)", fontWeight: 600, lineHeight: 1.4, margin: 0, opacity: 0.9 }}>
            {T[d.role + "Msg"]}
          </p>
        </div>
      )}
      {showCo && (
        <div className="wz-animate hww-bento-card" style={{ padding: 32, gap: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em`, textTransform: `uppercase", color: "var(--brand-purple)", margin: 0 }}>{T.companyInfo}</p>
          <div style={{ display: "flex`, flexDirection: `column", gap: 20 }}>
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

function S3({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const unit = isUS ? "ft" : "m";
  const au = isUS ? "sqft" : "m²";

  const CONST_SVC = [
    { id: "new_construction", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="14"/><path d="M2 10l10-8 10 8"/><path d="M12 2v6"/><path d="M8 5v3"/><path d="M16 5v3"/></svg>, label: T.svcLabels.new_construction, sub: T.svcSubs.new_construction, desc: T.svcDescs.new_construction },
    { id: "addition", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21v-9l7-5 7 5v9H3z"/><path d="M17 12l5 3v6h-5" strokeDasharray="2 2"/></svg>, label: T.svcLabels.addition, sub: T.svcSubs.addition, desc: T.svcDescs.addition },
    { id: "second_story", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V11l8-6 8 6v10H4z"/><path d="M4 11h16"/><path d="M12 11V3"/><path d="M9 6l3-3 3 3"/></svg>, label: T.svcLabels.second_story, sub: T.svcSubs.second_story, desc: T.svcDescs.second_story },
    { id: "garage_only", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12V6l-6-4-6 4v6"/><path d="M4 16c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v4H4v-4z"/><circle cx="7" cy="18" r="1"/><circle cx="17" cy="18" r="1"/></svg>, label: T.svcLabels.garage_only, sub: T.svcSubs.garage_only, desc: T.svcDescs.garage_only },
    { id: "garage_conversion", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V9l9-7 9 7v12H3z"/><rect x="6" y="12" width="5" height="9"/><rect x="14" y="12" width="4" height="4"/></svg>, label: T.svcLabels.garage_conversion, sub: T.svcSubs.garage_conversion, desc: T.svcDescs.garage_conversion },
    { id: "basement_finishing", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14V9l9-7 9 7v5"/><rect x="3" y="14" width="18" height="7"/><path d="M7 14v7"/><path d="M12 14v7"/><path d="M17 14v7"/></svg>, label: T.svcLabels.basement_finishing, sub: T.svcSubs.basement_finishing, desc: T.svcDescs.basement_finishing },
    { id: "deck_covered", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18h16"/><path d="M4 21h16"/><path d="M4 18v-8"/><path d="M20 18v-8"/><path d="M2 10l10-6 10 6H2z"/></svg>, label: T.svcLabels.deck_covered, sub: T.svcSubs.deck_covered, desc: T.svcDescs.deck_covered },
    { id: "deck_open", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15h18"/><path d="M3 18h18"/><path d="M3 21h18"/><path d="M6 15v6"/><path d="M12 15v6"/><path d="M18 15v6"/></svg>, label: T.svcLabels.deck_open, sub: T.svcSubs.deck_open, desc: T.svcDescs.deck_open },
    { id: "porch_covered", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10l10-6 10 6H2z"/><path d="M6 10v11"/><path d="M18 10v11"/><path d="M3 21h18"/></svg>, label: T.svcLabels.porch_covered, sub: T.svcSubs.porch_covered, desc: T.svcDescs.porch_covered },
    { id: "porch_open", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18h16"/><path d="M4 21h16"/><path d="M7 18v-5"/><path d="M17 18v-5"/><path d="M4 13h16"/></svg>, label: T.svcLabels.porch_open, sub: T.svcSubs.porch_open, desc: T.svcDescs.porch_open },
    { id: "renovation", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 9.5L5 19l-2 2 2-2 9.5-9.5"/><path d="M16 6l2-2 4 4-2 2-4-4z"/><path d="M22 22L12 12"/><path d="M15 15l1.5 1.5"/><path d="M17 17l1.5 1.5"/></svg>, label: T.svcLabels.renovation, sub: T.svcSubs.renovation, desc: T.svcDescs.renovation },
    { id: "other_const", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l4 18-4-3-4 3 4-18z"/><circle cx="12" cy="12" r="3"/></svg>, label: T.svcLabels.other_const, sub: T.svcSubs.other_const, desc: T.svcDescs.other_const },
  ];

  const INT_SVC = [
    { id: "kitchen_remodel", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16"/><path d="M12 12v8"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>, label: T.svcLabels.kitchen_remodel, sub: T.svcSubs.kitchen_remodel, desc: T.svcDescs.kitchen_remodel },
    { id: "bath_remodel", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4a4 4 0 0 0 4 4h4"/><circle cx="18" cy="10" r="2"/><path d="M16 14v1"/><path d="M18 15v1"/><path d="M20 14v1"/></svg>, label: T.svcLabels.bath_remodel, sub: T.svcSubs.bath_remodel, desc: T.svcDescs.bath_remodel },
    { id: "open_concept", pricingGroup: "multi-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16" strokeDasharray="2 2"/><path d="M8 12H3m0 0l3-3m-3 3l3 3"/><path d="M16 12h5m0 0l-3-3m3 3l-3 3"/></svg>, label: T.svcLabels.open_concept, sub: T.svcSubs.open_concept, desc: T.svcDescs.open_concept },
    { id: "other_int", pricingGroup: "single-level", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>, label: T.svcLabels.other_int, sub: T.svcSubs.other_int, desc: T.svcDescs.other_int },
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



  return (
    <div className="wz-animate">
      <Title label={T.tellAboutProject} sub={T.projectSub} />

      <p className="wz-label" style={{ marginBottom: 12 }}>{T.propertyTypeLabel || "PROPERTY TYPE"}</p>
      <div className="wz-grid-adaptive" style={{ marginBottom: 32 }}>
        {[
          { id: "single_family", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><path d="M9 21v-6h6v6"/></svg>, label: T.propertyTypes.single_family.label, sub: T.propertyTypes.single_family.sub },
          { id: "multi_family", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3"/><path d="M5 21V5l8-3 8 3v16"/><path d="M9 21v-5h6v5"/><path d="M9 9h2"/><path d="M13 9h2"/><path d="M9 13h2"/><path d="M13 13h2"/></svg>, label: T.propertyTypes.multi_family.label, sub: T.propertyTypes.multi_family.sub },
          { id: "adu", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M6 21V13l6-5 6 5v8"/><path d="M10 21v-4h4v4"/></svg>, label: T.propertyTypes.adu.label, sub: T.propertyTypes.adu.sub },
        ].map(pt => (
          <div key={pt.id} className={`hww-feature-card ${d.propertyType === pt.id ? "active" : ""}`} onClick={() => up("propertyType", pt.id)} style={{ textAlign: "center", padding: "16px 12px", cursor: "pointer", borderColor: d.propertyType === pt.id ? "var(--color-neon-purple)" : "var(--glass-border)", background: d.propertyType === pt.id ? "linear-gradient(135deg, rgba(156, 124, 58,0.1), rgba(161, 130, 74,0.05))" : "var(--glass-bg)" }}>
            <div style={{ fontSize: 24, marginBottom: 8, filter: d.propertyType === pt.id ? "drop-shadow(0 0 12px rgba(156, 124, 58, 0.5))" : "none", transition: "all 0.3s ease", transform: d.propertyType === pt.id ? "scale(1.1)" : "scale(1)" }}>{pt.icon}</div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-color)" }}>{pt.label}</p>
            <p style={{ fontSize: 11, color: "var(--text-color)", fontStyle: "italic", opacity: 0.6, margin: 0 }}>{pt.sub}</p>
          </div>
        ))}
      </div>

      <p className="wz-label" style={{ marginBottom: 16 }}>{T.typeOfService}</p>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 12 }}>{T.constructionStructure}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {CONST_SVC.map(svc => (
            <div key={svc.id} className={`hww-feature-card ${services[svc.id] ? "active" : ""}`} onClick={() => setSvc(svc.id)} style={{ padding: "16px 12px", textAlign: "center", position: "relative", cursor: "pointer", borderColor: services[svc.id] ? "var(--color-neon-purple)" : "var(--glass-border)", background: services[svc.id] ? "linear-gradient(135deg, rgba(156, 124, 58,0.1), rgba(161, 130, 74,0.05))" : "var(--glass-bg)", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ fontSize: 28, marginBottom: 12, filter: services[svc.id] ? "drop-shadow(0 0 10px rgba(156, 124, 58, 0.4))" : "none", transition: "all 0.3s ease", transform: services[svc.id] ? "scale(1.1)" : "scale(1)" }}>{svc.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, lineHeight: 1.2, color: "#FFFFFF" }}>{svc.label}</p>
              <p style={{ fontSize: 10, color: "#e2e8f0", lineHeight: 1.3, margin: "0 0 16px 0" }}>{svc.sub}</p>
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: 10, color: "var(--dm)", margin: 0, lineHeight: 1.4 }}>{svc.desc || svc.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(156, 124, 58, 0.05)", border: "1px solid rgba(156, 124, 58, 0.2)", borderRadius: "999px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9c7c3a", flexShrink: 0 }} />
          <p style={{ fontSize: 11, color: "var(--tx)", fontWeight: 500, lineHeight: 1.4, opacity: 0.9, margin: 0 }}>
            {T.ircIbcStandardsMsg}
          </p>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 12 }}>{T.interiors}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {INT_SVC.map(svc => (
            <div key={svc.id} className={`hww-feature-card ${services[svc.id] ? "active" : ""}`} onClick={() => setSvc(svc.id)} style={{ padding: "16px 12px", textAlign: "center", position: "relative", cursor: "pointer", borderColor: services[svc.id] ? "var(--color-neon-purple)" : "var(--glass-border)", background: services[svc.id] ? "linear-gradient(135deg, rgba(156, 124, 58,0.1), rgba(161, 130, 74,0.05))" : "var(--glass-bg)", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ fontSize: 28, marginBottom: 12, filter: services[svc.id] ? "drop-shadow(0 0 10px rgba(156, 124, 58, 0.4))" : "none", transition: "all 0.3s ease", transform: services[svc.id] ? "scale(1.1)" : "scale(1)" }}>{svc.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, lineHeight: 1.2, color: "#FFFFFF" }}>{svc.label}</p>
              <p style={{ fontSize: 10, color: "#e2e8f0", lineHeight: 1.3, margin: "0 0 16px 0" }}>{svc.sub}</p>
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: 10, color: "var(--dm)", margin: 0, lineHeight: 1.4 }}>{svc.desc || svc.sub}</p>
              </div>
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
                <div key={svcId} className="hww-bento-card" style={{ padding: 24, borderRadius: 20, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--a)", textTransform: "uppercase" }}>{svcLabel}</p>
                    {getSvcArea(svcId) > 0 && <div style={{ background: "rgba(156, 124, 58, 0.15)", color: "var(--a)", padding: "4px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{Math.round(getSvcArea(svcId))} {au}</div>}
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
                                background: isActive ? "rgba(156, 124, 58, 0.1)" : "transparent",
                                color: isActive ? "var(--a)" : "var(--tx)",
                                fontSize: 12,
                                fontWeight: isActive ? 600 : 500,
                                cursor: "pointer",
                                userSelect: "none"
                              }}
                            >
                              {lvlLbl}
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


      <div className="wz-f" style={{ marginTop: 32, marginBottom: 28 }}>
        <label className="wz-label">{T.lotSizeLabel} (OPTIONAL, {au.toUpperCase()})</label>
        <input className="wz-inp" placeholder="e.g. 5000" style={{ maxWidth: 240 }} value={d.lotSize || ""} onChange={e => up("lotSize", e.target.value)} />
      </div>
    </div>
  );
}

function S4({ d, up, lang }) {
  const isUS = d.region !== "BR";
  const T = TRANSLATIONS[lang];
  const [openDet, setOpenDet] = useState({});

  const toggleDet = (id, e) => {
    e.stopPropagation();
    setOpenDet(p => ({ [id]: !p[id] }));
  };

  const setPkg = (id) => {
    if (d.deliveryPkg === id) {
      up("deliveryPkg", "");
      setOpenDet({});
    } else {
      up("deliveryPkg", id);
      setOpenDet({ [id]: true });
    }
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
      tag: "PERMIT SET",
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
            { id: "ex_3d_kitchen", label: T.pkgExtras.items.ex_3d_kitchen.label, price: isUS ? "+ $150 - $200" : "+ R$1.500 - R$2.000", desc: T.pkgExtras.items.ex_3d_kitchen.desc },
            { id: "ex_3d_bath", label: T.pkgExtras.items.ex_3d_bath.label, price: isUS ? "+ $150 - $200" : "+ R$1.500 - R$2.000", desc: T.pkgExtras.items.ex_3d_bath.desc },
            { id: "ex_3d_laundry", label: T.pkgExtras.items.ex_3d_laundry.label, price: isUS ? "+ $150 - $200" : "+ R$1.500 - R$2.000", desc: T.pkgExtras.items.ex_3d_laundry.desc }
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
      tagTextCol: "#9c7c3a",
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

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 28 }}>
        {PKG.map((pkg, index) => {
          const isActive = d.deliveryPkg === pkg.id;
          return (
            <div
              key={pkg.id}
              className={`hww-bento-card ${isActive ? "active" : ""}`}
              onClick={() => setPkg(pkg.id)}
              style={{ padding: 0, borderColor: isActive ? "var(--brand-purple)" : "var(--glass-border)", background: isActive ? "linear-gradient(135deg, rgba(156, 124, 58,0.05), rgba(255,255,255,0.02))" : "var(--glass-bg)", transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", boxShadow: isActive ? "0 0 30px rgba(156, 124, 58, 0.15)" : "none" }}
            >
              <div style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, border: "2px solid", borderColor: isActive ? "var(--brand-purple)" : "var(--glass-border)", background: isActive ? "var(--brand-purple)" : "transparent", transition: "all 0.2s", marginTop: 4, flexShrink: 0 }}>
                    {isActive && <Chk />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-purple)", background: "rgba(156, 124, 58, 0.05)", border: "1px solid rgba(156, 124, 58, 0.2)", padding: "6px 16px", borderRadius: 100 }}>
                        <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
                          {lang === "EN" ? `PACKAGE 0${index + 1}` : `PACOTE 0${index + 1}`}
                        </span>
                        {" · "}{pkg.title}
                      </span>
                      {pkg.tag && (
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", color: pkg.tagTextCol, background: pkg.tagColor, padding: "4px 12px", borderRadius: 100, textTransform: "uppercase" }}>
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#ffffff", opacity: 0.9, lineHeight: 1.5, margin: "0 0 0 16px" }}>
                      {pkg.desc}

                    </p>
                  </div>
                </div>

                  <>
                    {/* WHY US / PITCH */}
                    {pkg.details?.whyUs && (
                      <div className="wz-animate" style={{ marginTop: 24, padding: "16px 20px", background: "rgba(156, 124, 58, 0.08)", borderLeft: "4px solid var(--brand-purple)", borderRadius: "0 12px 12px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 24, lineHeight: 1 }}>💡</span>
                        <p style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                          {pkg.details.whyUs}
                        </p>
                      </div>
                    )}

                    {/* EXTRAS */}
                    {pkg.extras && (
                      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 24 }}>
                        {pkg.extras.map(group => (
                          <div key={group.group}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--brand-purple)", marginBottom: 16, textTransform: "uppercase" }}>{group.group}</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                              {group.items.map(item => {
                                 const isChecked = item.isIncluded || d.pkgExtras?.[item.id];
                                 const cardBorder = isChecked ? (item.isIncluded ? "rgba(156, 124, 58, 0.4)" : "var(--brand-purple)") : "var(--glass-border)";
                                 const bgCol = isChecked ? "rgba(255,255,255,0.06)" : "var(--glass-bg)";
                                 
                                 return (
                                   <div
                                     key={item.id}
                                     style={{ border: "1px solid", borderColor: cardBorder, borderRadius: 12, padding: 16, background: bgCol, cursor: item.isIncluded ? "default" : "pointer", transition: "all 0.2s" }}
                                     onClick={(e) => { e.stopPropagation(); togglePkgExtra(item.id, item.isIncluded); }}
                                   >
                                     <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: 4, border: "1px solid", borderColor: isChecked ? "var(--brand-purple)" : "var(--glass-border)", background: isChecked ? "var(--brand-purple)" : "transparent", transition: "all 0.2s", flexShrink: 0 }}>
                                            {isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                          </div>
                                          <h4 style={{ fontSize: 13, fontWeight: 500, color: "#ffffff", margin: 0, lineHeight: 1.2 }}>
                                            {item.label} {item.isIncluded && <span style={{color: "#9c7c3a", fontSize: 11, fontWeight: 700}}>· Included</span>}
                                          </h4>
                                       </div>
                                     </div>
                                     {item.desc && (
                                       <p style={{ fontSize: 11, color: "#ffffff", fontStyle: "italic", opacity: 0.9, lineHeight: 1.3, margin: "6px 0 0 26px" }}>
                                         {item.desc}
                                       </p>
                                     )}
                                   </div>
                                 )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* INCLUSIONS */}
                    {pkg.details && pkg.details.whatYouReceive && (
                       <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
                          <div style={{ background: "rgba(156, 124, 58, 0.04)", border: "1px solid rgba(156, 124, 58, 0.15)", borderRadius: "12px", padding: 16 }}>
                             <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#9c7c3a", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? `WHAT'S INCLUDED` : `O QUE ESTÁ INCLUSO`}</p>
                             <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                               {pkg.details.whatYouReceive.map((item, idx) => (
                                 <li key={idx} style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                    <span style={{ color: "#9c7c3a", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                      {item.title && item.desc ? (
                                        <>
                                          <span style={{ fontSize: 13, fontWeight: 500, color: "#ffffff", lineHeight: 1.4 }}>{item.title}</span>
                                          <span style={{ fontSize: 13, color: "#ffffff", opacity: 0.9, lineHeight: 1.4 }}>{item.desc}</span>
                                        </>
                                      ) : (
                                        <span>{item.title || item.desc || item}</span>
                                      )}
                                    </div>
                                 </li>
                               ))}
                             </ul>
                          </div>

                          {pkg.details.notIncluded && (
                            <div style={{ background: "rgba(161, 130, 74, 0.04)", border: "1px solid rgba(161, 130, 74, 0.15)", borderRadius: "12px", padding: 16 }}>
                               <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#8F723E", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "NOT INCLUDED" : `NÃO INCLUSO`}</p>
                               <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                                 {pkg.details.notIncluded.map((it, idx) => (
                                   <li key={idx} style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                      <span style={{ color: "#8F723E", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                                      <span>{it}</span>
                                   </li>
                                 ))}
                               </ul>
                            </div>
                          )}
                       </div>
                    )}
                  </>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: "var(--bg1)", border: "1px solid rgba(255, 193, 7, 0.1)", borderLeft: "3px solid #FFC107", padding: "14px 18px", borderRadius: "2px 6px 6px 2px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={{ fontSize: 13, color: "#ffffff", fontStyle: "italic", opacity: 0.9, lineHeight: 1.5, margin: 0 }}>
          {lang === "EN" 
            ? `Explore the full scope of included services and available design extras.` 
            : `Explore todo o escopo de serviços inclusos e extras de design disponíveis.`}
        </p>
        <a href="/services" target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: 700, color: "var(--tx)", background: "#FFC107", padding: "6px 14px", borderRadius: 6, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".05em", transition: "all 0.2s" }}>
          {lang === "EN" ? "View Full Service Catalog" : `Ver Catálogo Completo de Serviços`}
        </a>
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
          <div key={g.label} className="hww-bento-card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--glass-border)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em", color: "var(--brand-purple)", textTransform: "uppercase", margin: 0 }}>{g.label}</h3>
            </div>
            <div className="wz-grid-adaptive" style={{ gap: 0 }}>
              {g.items.map((item) => {
                const val = rooms[item.id] || 0;
                const isActive = val > 0;
                return (
                  <div key={item.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--glass-border)",
                    borderRight: "1px solid var(--glass-border)",
                    minHeight: 56,
                    background: isActive ? "linear-gradient(135deg, rgba(156, 124, 58, 0.05), transparent)" : "transparent",
                    transition: "all 0.3s ease"
                  }}>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)" }}>
                      {T.roomLabels[item.id] || item.label}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button 
                        onClick={() => setR(item.id, Math.max(0, val - 1))}
                        style={{ width: 28, height: 28, borderRadius: "50%", background: isActive ? "var(--brand-purple)" : "rgba(255,255,255,0.05)", border: "none", color: isActive ? "#fff" : "var(--tx)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                      >−</button>
                      <div style={{ width: 20, textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--tx)" }}>{val}</div>
                      <button 
                        onClick={() => setR(item.id, Math.min(20, val + 1))}
                        style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "var(--tx)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", ":hover": { background: "rgba(255,255,255,0.1)" } }}
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--brand-purple)", marginBottom: 12 }}>{T.specialReqs}</p>
        <textarea
          placeholder={T.specialReqsPlaceholder}
          style={{ width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", minHeight: 140, borderRadius: "16px", padding: 20, color: "var(--tx)", fontSize: 14, lineHeight: 1.5, resize: "vertical", transition: "all 0.3s", outline: "none" }}
          value={d.specialReqs || ""}
          onChange={e => up("specialReqs", e.target.value)}
          onFocus={e => { e.target.style.borderColor = "var(--brand-purple)"; e.target.style.boxShadow = "0 0 15px rgba(156, 124, 58, 0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--glass-border)"; e.target.style.boxShadow = "none"; }}
        />
      </div>
    </div>
  );
}

function S7({ d, up, lang, setUploading }) {
  const T = TRANSLATIONS[lang];
  const fileRefs = useRef({});

  const cats = [
    {
      id: "inspiration",
      label: lang === "EN" ? "Inspiration Images" : `Imagens de Inspiração`,
      icon: "🖼️",
      types: "JPG · PNG · GIF · WEBP · max 100MB",
      accept: ".jpg,.jpeg,.png,.gif,.webp",
      color: "#9c7c3a"
    },
    {
      id: "videos",
      label: lang === "EN" ? "Videos" : `Vídeos`,
      icon: "🎥",
      types: "MP4 · MOV · WEBM · max 100MB",
      accept: ".mp4,.mov,.webm",
      color: "#d946ef"
    },
    {
      id: "documents",
      label: lang === "EN" ? "Technical Documents" : `Documentos Técnicos`,
      icon: "📋",
      types: "PDF · DOC · DWG · DXF · max 100MB",
      accept: ".pdf,.doc,.docx,.dwg,.dxf",
      color: "#f59e0b"
    },
    {
      id: "other",
      label: lang === "EN" ? "Other Files" : "Outros Arquivos",
      icon: "📎",
      types: lang === "EN" ? "Any file type · max 100MB" : "Qualquer formato · max 100MB",
      accept: "*",
      color: "#9c7c3a"
    },
  ];

  const uploads = d.uploads || {};

  const handleFiles = async (catId, files) => {
    if (!files || files.length === 0) return;
    
    // Ensure we have a persistent project ID for this session
    let projectId = d.projectId;
    if (!projectId) {
      projectId = crypto.randomUUID();
      up("projectId", projectId);
    }


    
    for (const f of Array.from(files)) {
      const fileId = Math.random().toString(36).substr(2, 9);
      // Map frontend catId to storage category
      const category = catId === 'videos' ? 'video' : (catId === 'documents' ? 'technical' : catId);
      const path = `${projectId}/${category}/${Date.now()}_${f.name}`;
      
      setUploading(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(path, f, {
            onUploadProgress: (progress) => {
              const pct = (progress.loaded / progress.total) * 100;
              setUploading(prev => ({ ...prev, [fileId]: Math.round(pct) }));
            }
          });

        if (uploadError) throw uploadError;

        const newFile = {
          id: fileId,
          name: f.name,
          size: f.size,
          category: category,
          url: uploadData.path, // path in bucket
          at: new Date().toISOString()
        };

        // Update local state (metadata is sent to server on final submit)
        const updatedUploads = { ...uploads, [catId]: [...(uploads[catId] || []), newFile] };
        up("uploads", updatedUploads);

      } catch (err) {
        console.error("Upload Error:", err);
        alert(lang === 'EN' 
          ? `Error: ${err.message || 'Upload failed'}` 
          : `Erro: ${err.message || 'Falha no upload'}`);
      } finally {
        setUploading(prev => {
          const n = { ...prev };
          delete n[fileId];
          return n;
        });
      }
    }
  };

  const removeFile = (catId, fileId) => {
    const current = uploads[catId] || [];
    up("uploads", { ...uploads, [catId]: current.filter(f => f.id !== fileId) });
  };

  return (
    <div className="wz-animate">
      <Title label={T.uploadTitle} sub={T.uploadSub} />

      <div style={{ background: "rgba(156, 124, 58, 0.05)", border: "1px solid rgba(156, 124, 58, 0.2)", borderRadius: "16px", padding: "16px 20px", display: "flex", gap: "16px", marginBottom: "32px", alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(156, 124, 58, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-purple)", flexShrink: 0 }}>
          <InfoIcon />
        </div>
        <div>
          <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--tx)", opacity: 0.9, marginBottom: "4px" }}>
            {T.uploadHelp}
          </p>
          <p style={{ fontSize: "12px", color: "var(--brand-purple)", fontWeight: "600" }}>
            ✨ {T.uploadLaterNote}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {cats.map((cat) => {
          const catFiles = uploads[cat.id] || [];
          const isDone = catFiles.length > 0;
          return (
            <div key={cat.id} className={`hww-bento-card ${isDone ? "active" : ""}`} style={{
              padding: 0,
              borderColor: isDone ? "var(--brand-purple)" : "var(--glass-border)",
              background: isDone ? "linear-gradient(135deg, rgba(156, 124, 58, 0.05), rgba(255,255,255,0.02))" : "var(--glass-bg)",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              boxShadow: isDone ? "0 0 30px rgba(156, 124, 58, 0.15)" : "none",
              display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: 16,
              borderRadius: isDone ? "24px" : "100px"
            }}>
              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-purple)", textTransform: "uppercase", letterSpacing: ".05em" }}>
                        {cat.label}
                      </span>
                      {isDone && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c7c3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(156, 124, 58, 0.4))" }}>
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: "var(--tx)", opacity: 0.7, fontStyle: "italic" }}>
                      {cat.types}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: 12 }}>
                    <button
                      onClick={() => fileRefs.current[cat.id]?.click()}
                      style={{ padding: "8px 20px", fontSize: "12px", fontWeight: 600, color: "var(--tx)", background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid var(--glass-border)", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "var(--tx)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                    >
                      {T.uploadAction}
                    </button>
                    <input 
                      type="file" 
                      multiple 
                      accept={cat.accept} 
                      ref={el => fileRefs.current[cat.id] = el}
                      style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", overflow: "hidden", pointerEvents: "none" }} 
                      onChange={e => handleFiles(cat.id, e.target.files)}
                    />
                  </div>
                </div>

                {isDone && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {catFiles.map((f, i) => {
                      const ext = f.name.includes('.') ? f.name.split('.').pop().toUpperCase() : 'FILE';
                      const sizeMB = f.size ? (f.size / (1024 * 1024)).toFixed(2) : "0.00";
                      return (
                        <div key={f.id || i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 4 }}>
                          <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                            <p style={{ fontSize: "13px", color: "var(--tx)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              <span style={{ fontWeight: 600 }}>{f.name}</span>
                              <span style={{ color: "var(--mu)", fontStyle: "italic", marginLeft: 8 }}>- {ext} - {sizeMB}MB</span>
                            </p>
                          </div>
                          <button 
                            style={{ background: "transparent", border: "none", color: "var(--brand-pink)", fontSize: "14px", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}
                            onClick={(e) => { e.stopPropagation(); removeFile(cat.id, f.id); }}
                            onMouseOver={e => { e.currentTarget.style.background = "rgba(161, 130, 74, 0.1)"; }}
                            onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                            title={lang === "EN" ? "Delete file" : "Excluir arquivo"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".05em", color: "var(--brand-purple)", marginBottom: 12, textTransform: "uppercase" }}>
          {lang === "EN" ? "REFERENCE LINKS (OPTIONAL)" : `LINKS DE REFERÊNCIA (OPCIONAL)`}
        </p>
        <textarea
          placeholder={lang === "EN" ? `Paste links to Pinterest boards, Zillow listings, or other references...` : `Cole links de painéis do Pinterest, anúncios no Zillow ou outras referências...`}
          value={d.referenceLinks || ""}
          onChange={e => up("referenceLinks", e.target.value)}
          style={{ width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "16px", color: "var(--tx)", fontSize: "13px", minHeight: "80px", resize: "vertical", outline: "none", transition: "all 0.3s" }}
          onFocus={e => { e.target.style.borderColor = "var(--brand-purple)"; e.target.style.boxShadow = "0 0 15px rgba(156, 124, 58, 0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--glass-border)"; e.target.style.boxShadow = "none"; }}
        />
      </div>
    </div>
  );
}

function S8({ d, up, lang, setUploading }) {
  const T = TRANSLATIONS[lang];
  const fileRefs = useRef({});
  const [feedback, setFeedback] = useState("");

  const checklist = [
    { id: "chk_survey", label: T.checklist.survey, required: true },
    { id: "chk_photos", label: T.checklist.photos, required: true },
    { id: "chk_measure", label: T.checklist.measure, required: true },
    { id: "chk_listing", label: T.checklist.listing, sub: T.checklist.recommended },
    { id: "chk_matter", label: T.checklist.tour, sub: T.checklist.ifAvailable },
    { id: "chk_reports", label: T.checklist.reports, sub: T.checklist.ifAvailable },
    { id: "chk_existing", label: T.checklist.existing_plans, sub: T.checklist.ifApplicable },
    { id: "chk_notes", label: T.checklist.city_notes, sub: T.checklist.ifApplicable },
  ];

  const hasFilesFromStep6 = Object.values(d.uploads || {}).some(arr => arr.length > 0);
  const requiredCount = 3; 
  const completedRequired = checklist.slice(0, 3).filter(c => {
    const data = d.rushFiles?.[c.id];
    return Array.isArray(data) ? data.length > 0 : !!data;
  }).length;
  const remaining = Math.max(0, requiredCount - completedRequired);
  
  const isUnlocked = hasFilesFromStep6 || (remaining === 0);

  const handleFileChange = async (id, e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    let projectId = d.projectId;
    if (!projectId) {
      projectId = crypto.randomUUID();
      up("projectId", projectId);
    }

    const currentArr = d.rushFiles?.[id] || [];
    const existing = Array.isArray(currentArr) ? currentArr : (currentArr.name ? [currentArr] : []);
    
    for (const f of Array.from(e.target.files)) {
      const fileId = `rush_${id}_${Math.random().toString(36).substr(2, 9)}`;
      const path = `${projectId}/rush/${Date.now()}_${f.name}`;
      
      setUploading(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(path, f, {
            onUploadProgress: (progress) => {
              const pct = (progress.loaded / progress.total) * 100;
              setUploading(prev => ({ ...prev, [fileId]: Math.round(pct) }));
            }
          });

        if (uploadError) throw uploadError;

        existing.push({
          id: fileId,
          name: f.name,
          size: f.size,
          url: uploadData.path,
          category: 'rush',
          at: new Date().toISOString()
        });
        
        up("rushFiles", { ...(d.rushFiles || {}), [id]: [...existing] });
        setFeedback("");
      } catch (err) {
        console.error(err);
        alert(lang === 'EN' ? `Upload failed: ${err.message}` : `Falha no upload: ${err.message}`);
      } finally {
        setUploading(prev => {
          const n = { ...prev };
          delete n[fileId];
          return n;
        });
      }
    }
  };

  const removeRushFile = (id, fileIdToRemove) => {
    const currentRushFiles = d.rushFiles || {};
    const existing = currentRushFiles[id];
    if (Array.isArray(existing)) {
      const nextArr = existing.filter(f => f.id !== fileIdToRemove);
      if (nextArr.length === 0) {
        const next = { ...currentRushFiles };
        delete next[id];
        up("rushFiles", next);
      } else {
        up("rushFiles", { ...currentRushFiles, [id]: nextArr });
      }
    } else {
       const next = { ...currentRushFiles };
       delete next[id];
       up("rushFiles", next);
    }
  };

  const handleLockedClick = () => {
    setFeedback(T.unlockRush);
    setTimeout(() => setFeedback(""), 4000);
  };

  const options = [
    {
      id: "standard",
      icon: "✔️",
      locked: false,
      data: T.speeds.standard
    },
    {
      id: "rush",
      tag: "+40%",
      icon: "🕒",
      locked: !isUnlocked,
      data: T.speeds.rush
    },
    {
      id: "express",
      tag: "+60%",
      icon: "⚡",
      locked: !isUnlocked,
      data: T.speeds.express
    },
  ];

  return (
    <div className="wz-animate">
      <Title label={T.rushFeesTitle || T.deliverySpeed} sub={T.rushFeesSub || T.speedSub} />

      {!isUnlocked && (
        <div style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
          marginBottom: "32px",
          boxShadow: "0 4px 20px rgba(156, 124, 58, 0.05)"
        }}>
          <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--brand-purple)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            {T.unlockFast?.title || (lang === "EN" ? "Unlock Faster Delivery" : `Desbloquear Entrega Mais Rápida`)}
          </h4>
          <p style={{ fontSize: "14px", color: "var(--tx)", margin: 0, lineHeight: "1.5", maxWidth: "600px", opacity: 0.9 }}>
            {lang === "EN" 
              ? `To access Express and Rush delivery options, and receive a more precise cost estimate, please attach the mandatory documentation listed below.` 
              : `Para ter acesso às modalidades de entrega Express e Rush, além de uma estimativa de custos mais precisa, por favor anexe a documentação obrigatória listada abaixo.`}
          </p>
        </div>
      )}

      <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {checklist.map((item, idx) => {
            const fileData = d.rushFiles?.[item.id];
            const fileList = Array.isArray(fileData) ? fileData : (fileData ? [fileData] : []);
            const isDone = fileList.length > 0;
            return (
              <div key={item.id} className={`hww-bento-card ${isDone ? "active" : ""}`} style={{
                padding: 0,
                borderColor: isDone ? "var(--brand-purple)" : "var(--glass-border)",
                background: isDone ? "linear-gradient(135deg, rgba(156, 124, 58, 0.05), rgba(255,255,255,0.02))" : "var(--glass-bg)",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                boxShadow: isDone ? "0 0 30px rgba(156, 124, 58, 0.15)" : "none",
                display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: 16,
                borderRadius: isDone ? "24px" : "100px"
              }}>
                <div style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-purple)", textTransform: "uppercase", letterSpacing: ".05em" }}>
                          {item.label}
                        </span>
                        {isDone && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c7c3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(156, 124, 58, 0.4))" }}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: 12 }}>
                      {!isDone && idx < 3 && <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--brand-pink)", textTransform: "uppercase", letterSpacing: ".05em", background: "rgba(161, 130, 74, 0.1)", padding: "4px 8px", borderRadius: 4 }}>{T.required}</span>}
                      {!isDone && item.sub && <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--tx)", opacity: 0.6, textTransform: "uppercase", letterSpacing: ".05em", background: "rgba(255, 255, 255, 0.05)", padding: "4px 8px", borderRadius: 4 }}>{item.sub}</span>}
                      
                      <button
                        onClick={() => fileRefs.current[item.id]?.click()}
                        style={{ padding: "8px 20px", fontSize: "12px", fontWeight: 600, color: "var(--tx)", background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid var(--glass-border)", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "var(--tx)"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                      >
                        {T.uploadAction}
                      </button>
                      <input type="file" multiple ref={el => fileRefs.current[item.id] = el} style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", overflow: "hidden", pointerEvents: "none" }} onChange={(e) => handleFileChange(item.id, e)} />
                    </div>
                  </div>
                  
                  {isDone && (
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: "12px" }}>
                      {fileList.map((f, i) => {
                        const ext = f.name.includes('.') ? f.name.split('.').pop().toUpperCase() : 'FILE';
                        const sizeMB = f.size ? (f.size / (1024 * 1024)).toFixed(2) : "0.00";
                        return (
                          <div key={f.id || i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 4 }}>
                            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                              <p style={{ fontSize: "13px", color: "var(--tx)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <span style={{ fontWeight: 600 }}>{f.name}</span>
                                <span style={{ color: "var(--mu)", fontStyle: "italic", marginLeft: 8 }}>
                                  - {ext} - {sizeMB}MB
                                </span>
                              </p>
                            </div>
                            <button 
                              style={{ background: "transparent", border: "none", color: "var(--brand-pink)", fontSize: "14px", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}
                              onClick={() => removeRushFile(item.id, f.id)}
                              onMouseOver={e => { e.currentTarget.style.background = "rgba(161, 130, 74, 0.1)"; }}
                              onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                              title={lang === "EN" ? "Delete file" : "Excluir arquivo"}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      {/* Moved !isUnlocked card to the top */}

      {feedback && (
        <div className="wz-animate" style={{ background: "rgba(161, 130, 74, 0.1)", border: "1px solid #8F723E", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#8F723E", fontSize: "13px", fontWeight: "500" }}>
          ⚠️ {feedback}
        </div>
      )}

      <h3 style={{ fontSize: "16px", fontWeight: "700", letterSpacing: ".05em", color: "var(--brand-purple)", margin: "0 0 16px 0" }}>{lang === "EN" ? "Select Delivery Timeline" : "Selecione o Prazo de Entrega"}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {options.map(opt => {
          const isSelected = d.rush === opt.id;
          return (
            <div
              key={opt.id}
              className="hww-bento-card"
              onClick={() => opt.locked ? handleLockedClick() : up("rush", opt.id)}
              style={{
                padding: "20px 24px",
                opacity: opt.locked ? 0.6 : 1,
                cursor: "pointer",
                position: "relative",
                transition: "all .3s ease",
                border: "1px solid",
                borderColor: isSelected ? "var(--brand-purple)" : "var(--glass-border)",
                background: isSelected ? "rgba(255, 255, 255, 0.03)" : "var(--glass-bg)",
                boxShadow: isSelected ? "0 4px 30px rgba(156, 124, 58, 0.15)" : "none"
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px", width: "100%", justifyContent: "space-between" }}>
                <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: "12px", minWidth: "220px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: isSelected ? "var(--brand-purple)" : "#FFFFFF", margin: 0, textTransform: "uppercase" }}>
                      {opt.data.badge}
                    </h4>
                    {opt.tag && <span style={{ background: isSelected ? "var(--brand-purple)" : "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "800", color: isSelected ? "#fff" : "var(--mu)", letterSpacing: ".05em" }}>{opt.tag}</span>}
                  </div>
                </div>

                <div style={{ flex: "1 1 120px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--brand-purple)", margin: "0 0 4px 0" }}>{opt.data.previewDays}</p>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#FFFFFF", margin: "0 0 2px 0" }}>{opt.data.previewTitle}</h4>
                  <p style={{ fontSize: "11px", color: "#A1A1AA", margin: 0, lineHeight: 1.3 }}>{opt.data.previewSub}</p>
                </div>

                <div style={{ flex: "1 1 120px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--brand-purple)", margin: "0 0 4px 0" }}>{opt.data.finalDays}</p>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#FFFFFF", margin: "0 0 2px 0" }}>{opt.data.finalTitle}</h4>
                  <p style={{ fontSize: "11px", color: "#A1A1AA", margin: 0, lineHeight: 1.3 }}>{opt.data.finalSub}</p>
                </div>

                <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", border: "2px solid", borderColor: isSelected ? "var(--brand-purple)" : "var(--glass-border)", background: isSelected ? "var(--brand-purple)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}
                </div>
              </div>
              
              {opt.data.footer && (
                <div style={{ width: "100%", marginTop: "16px" }}>
                  <p style={{ fontSize: "11px", fontStyle: "italic", color: "#A1A1AA", margin: 0, borderTop: "1px solid var(--glass-border)", paddingTop: "12px" }}>{opt.data.footer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function S9({ d, est, setStep, lang, setSubmitted, setSubmissionType }) {
  const { theme } = useAppContext();
  const isDark = theme === "dark";
  const T = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const [loadingType, setLoadingType] = useState(null);

  const checklist = [
    { id: "chk_survey", label: T.checklist.survey, required: true },
    { id: "chk_photos", label: T.checklist.photos, required: true },
    { id: "chk_measure", label: T.checklist.measure, required: true },
    { id: "chk_listing", label: T.checklist.listing, sub: T.checklist.recommended },
    { id: "chk_matter", label: T.checklist.tour, sub: T.checklist.ifAvailable },
    { id: "chk_reports", label: T.checklist.reports, sub: T.checklist.ifAvailable },
    { id: "chk_existing", label: T.checklist.existing_plans, sub: T.checklist.ifApplicable },
    { id: "chk_notes", label: T.checklist.city_notes, sub: T.checklist.ifApplicable },
  ];

  const EstimateGuarantee = () => {
    const guarantee = lang === "EN" 
      ? `Your estimate won't vary more than 15% upon final review.`
      : `Sua estimativa não variará mais do que 15% após a revisão final.`;
    
    return (
      <div style={{ 
        background: isDark ? "rgba(156, 124, 58, 0.04)" : "rgba(156, 124, 58, 0.08)", 
        border: "1.5px solid rgba(156, 124, 58, 0.2)", 
        borderRadius: "14px", 
        padding: "20px", 
        marginBottom: "24px" 
      }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(156, 124, 58, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9c7c3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: isDark ? "#34d399" : "#1d1c1a", margin: "0 0 8px", lineHeight: 1.4 }}>{guarantee}</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "6px", background: "rgba(156, 124, 58, 0.15)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${est.conf}%`, height: "100%", background: "#9c7c3a", borderRadius: "3px", boxShadow: "0 0 8px rgba(156, 124, 58, 0.4)", backgroundSize: '200% auto', animation: 'spShimmer 2s linear infinite' }} />
              </div>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#9c7c3a", letterSpacing: "0.05em" }}>{est.conf}% {lang === "EN" ? "CONFIDENCE" : `CONFIANÇA`}</span>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: "20px", padding: "16px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px" }}>
          <p style={{ fontSize: "10px", color: "#fca5a5", fontWeight: "800", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px", margin: 0 }}>
            [ {lang === "EN" ? "LEGAL DISCLAIMER" : "NOTA LEGAL"} ]
          </p>
          <p style={{ fontSize: "11px", color: "#f87171", lineHeight: "1.6", margin: "0", opacity: 0.9 }}>
            {T.review.legalBody}
          </p>
        </div>
      </div>
    );
  };

  const handleAction = async (type) => {
    setLoadingType(type);
    try {
      const endpoint = type === "accept" ? "/api/accept" : "/api/leads";
      const payload = {
        id: d.projectId, // Send the pre-generated ID
        name: d.name,
        email: d.email,
        phone: d.phone,
        project: est.projectTitle,
        estimate: `${est.lo} – ${est.hi}`,
        pkg: est.pkgName,
        delivery: d.rush || "standard",
        lang,
        region: d.region,
        propertyType: d.propertyType,
        floors: d.levels ? Object.keys(d.levels).filter(k => d.levels[k]).length : 1,
        totalSqft: est.baseArea || 1800,
        address: d.address || "TBD",
        ...d // Spread other data
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");

      // SAVE FILE METADATA TO DB
      if (json.projectId) {
        const allFiles = [];
        
        // Standard uploads
        Object.values(d.uploads || {}).forEach(catFiles => {
          catFiles.forEach(f => {
            allFiles.push({
              project_id: json.projectId,
              name: f.name,
              url: f.url,
              type: f.category.charAt(0).toUpperCase() + f.category.slice(1)
            });
          });
        });

        // Rush files
        Object.values(d.rushFiles || {}).forEach(f => {
          allFiles.push({
            project_id: json.projectId,
            name: f.name,
            url: f.url,
            type: 'Technical' // Map rush to Technical type in DB
          });
        });

        if (allFiles.length > 0) {
          await supabase.from('files').insert(allFiles);
        }
      }

      setSubmissionType(type);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(T.review.errorOccurred);
    } finally {
      setLoadingType(null);
    }
  };

  const ReviewRow = ({ label, value, highlight }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: "12px", color: "var(--dm)" }}>{label}</span>
      <span style={{ fontSize: highlight ? "14px" : "12px", fontWeight: highlight ? "600" : "400", color: highlight ? "#c8c0ff" : "var(--tx)", textAlign: "right" }}>{value || "—"}</span>
    </div>
  );

  const SectionCard = ({ icon, title, step, children }) => (
    <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(156, 124, 58, 0.2)", borderRadius: "12px", padding: "16px", marginBottom: "12px", boxShadow: "0 4px 20px rgba(156, 124, 58, 0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "15px" }}>{icon}</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--tx)" }}>{title}</span>
        </div>
        <button onClick={() => setStep(step)} style={{ background: "none", border: "none", color: "var(--a)", cursor: "pointer", fontSize: "12px", padding: 0 }}>{T.review.edit} ↗</button>
      </div>
      {children}
    </div>
  );

  return (
    <div className="wz-animate wz-main-layout has-sidebar">
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "25px", color: "var(--tx)", margin: "0 0 4px", fontWeight: "400", fontStyle: "italic" }}>{T.reviewEstimate}</h1>
        <p style={{ fontSize: "12px", color: "var(--mu)", margin: "0 0 16px" }}>{T.reviewSub}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <SectionCard icon="👤" title={T.review.client} step={1}>
            <ReviewRow label={T.review.name} value={d.name} />
            <ReviewRow label={T.review.email} value={d.email} />
            <ReviewRow label={T.review.phone} value={d.phone} />
            <ReviewRow label={T.review.role} value={T.roles[d.role] || d.role} />
          </SectionCard>

          <SectionCard icon="📍" title={T.review.location} step={0}>
            <ReviewRow label={T.review.address} value={d.address} />
            <ReviewRow label={lang === "EN" ? "Country / State or Jurisdiction" : `País / Estado ou Jurisdição`} value={d.region === "BR" ? T.review.regionBR : T.review.regionUS} />
          </SectionCard>
        </div>

        <SectionCard icon="🏛" title={T.yourProject} step={2}>
          <ReviewRow label={T.propType} value={d.propertyType ? T.propertyTypes[d.propertyType]?.label : ``} />
          <ReviewRow label={T.levels} value={(est?.lvNames || []).join(" + ")} />
          <ReviewRow label={T.typeOfService} value={(est?.selectedSvcNames || []).join(", ")} />
          <div style={{ padding: "7px 0 5px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.08em", color: "var(--dm)", textTransform: "uppercase" }}>{T.review.dimensions}</span>
          </div>
          <ReviewRow label={T.review.totalArea} value={est.totalArea} highlight />
        </SectionCard>

        <SectionCard icon="📋" title={T.review.summary} step={3}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--glass-border)", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--tx)", fontWeight: "500" }}>{T.review.totalArea}</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--tx)" }}>{est.totalArea}</span>
          </div>
          
          <div style={{ padding: "12px 0 8px" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.08em", color: "var(--dm)", textTransform: "uppercase" }}>{T.review.selectedSvcs}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {(est.bd || []).filter(i => i.block !== "extra").map((i, idx) => (
              <div key={idx} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                <span style={{ fontSize: "12px", color: "var(--tx)", fontWeight: "500" }}>{i.l}</span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--brand-pink)" }}>{i.v}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px 0 8px", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.08em", color: "var(--dm)", textTransform: "uppercase" }}>{T.review.timeline}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <span style={{ fontSize: "12px", color: "var(--tx)", fontWeight: "500" }}>{lang === "EN" ? "Estimated Timeline" : "Cronograma Estimado"}</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--brand-pink)" }}>
              {T.speeds[d.rush || "standard"] ? `${T.speeds[d.rush || "standard"].badge.split(" —")[0]} (${T.speeds[d.rush || "standard"].finalDays})` : T.review.timelineStandard}
            </span>
          </div>
        </SectionCard>

      <SectionCard icon="📂" title={T.review.documentation} step={5}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Reference Files from S7 */}
          {d.uploads && Object.keys(d.uploads).some(k => d.uploads[k]?.length > 0) ? (
            Object.keys(d.uploads).map(catId => {
              const files = d.uploads[catId];
              if (!files || files.length === 0) return null;
              const catLabels = {
                inspiration: lang === "EN" ? "Inspiration Images" : `Imagens de Inspiração`,
                videos: lang === "EN" ? "Videos" : `Vídeos`,
                documents: lang === "EN" ? "Technical Documents" : `Documentos Técnicos`,
                other: lang === "EN" ? "Other Files" : "Outros Arquivos"
              };
              return (
                <div key={catId}>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--a)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>📁 {catLabels[catId] || catId}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {files.map((f, i) => (
                      <div key={f.id || i} className="doc-row" style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderColor: "var(--border2)" }}>
                        <div className="doc-ico pdf" style={{ width: 24, height: 24, fontSize: 11 }}>
                           {catId === "inspiration" ? "🖼️" : catId === "videos" ? "🎥" : "📄"}
                        </div>
                        <div className="doc-meta">
                          <p className="doc-name" style={{ fontSize: 11 }}>{f.name}</p>
                        </div>
                        <span style={{ fontSize: "9px", color: "var(--dm)" }}>{(f.size / 1024 / 1024).toFixed(1)}MB</span>
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
              <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--a)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>📁 {lang === "EN" ? "Technical Requirements" : `Requisitos Técnicos`}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {checklist.map(item => {
                  const fileData = d.rushFiles[item.id];
                  if (!fileData) return null;
                  return (
                    <div key={item.id} className="doc-row" style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderColor: "var(--border2)" }}>
                      <div className="doc-ico pdf" style={{ width: 24, height: 24, fontSize: 11 }}>📄</div>
                      <div className="doc-meta">
                        <p className="doc-name" style={{ fontSize: 11 }}>
                          <span style={{ fontWeight: "700", color: "var(--mu)", marginRight: "6px" }}>{item.label}:</span>
                          {fileData.name}
                        </p>
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
      </SectionCard>

      <div style={{ marginTop: "40px", marginBottom: "40px", position: "relative" }}>
        <h3 style={{ fontSize: "10px", fontWeight: "700", letterSpacing: ".15em", color: "var(--mu)", textTransform: "uppercase", marginBottom: "24px" }}>{T.review.whatNext}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", position: "relative", marginLeft: "12px" }}>
          <div style={{ position: "absolute", left: "20px", top: "40px", bottom: "0px", width: "1px", borderLeft: "2px dashed rgba(156, 124, 58, 0.3)", zIndex: 0 }} />
          
          {(T.review.nextSteps || []).map((s, idx) => (
            <div key={idx} style={{ display: "flex", gap: "24px", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg1)", border: "2px solid var(--brand-purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, boxShadow: "0 0 15px rgba(156, 124, 58, 0.2)" }}>
                {idx === 0 ? "👁️" : "✍️"}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", marginBottom: "6px" }}>{s.title}</h4>
                <p style={{ fontSize: "12px", color: "#A1A1AA", lineHeight: "1.5", margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EstimateGuarantee />

      {/* Agreement Box */}
      <div style={{ 
        background: "rgba(251, 191, 36, 0.05)", 
        border: "1px solid rgba(251, 191, 36, 0.2)", 
        borderRadius: "8px", 
        padding: "16px", 
        marginBottom: "24px"
      }}>
        <p style={{ fontSize: "12px", color: "#fcd34d", lineHeight: "1.6", margin: 0, opacity: 0.9 }}>
          {T.review.agreementBody}
        </p>
      </div>

      {/* Final Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => handleAction("accept")} disabled={!!loadingType} style={{
          width: "100%",
          padding: "16px",
          background: "var(--brand-purple)",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 4,
          boxShadow: "0 4px 15px rgba(156, 124, 58, 0.3)",
          transition: "all 0.2s"
        }}>
          {loadingType === "accept" ? (lang === "EN" ? "Processing..." : "Processando...") : (lang === "EN" ? "🔒 Confirm Scope & Request Proposal" : "🔒 Confirmar Escopo e Solicitar Proposta")}
        </button>
        <p style={{ fontSize: 11, color: "var(--dm)", textAlign: "center", margin: "0 0 24px" }}>
          {T.review.secureNotice}
        </p>
        
        <button onClick={() => handleAction("save")} disabled={!!loadingType} style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          color: "#A1A1AA",
          fontWeight: "600",
          textDecoration: "underline",
          textUnderlineOffset: "4px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px"
        }}>
          {loadingType === "save" ? (lang === "EN" ? "Processing..." : "Processando...") : (lang === "EN" ? "💾 Save estimate as PDF and email it" : "💾 Salvar estimativa em PDF e enviar por e-mail")}
        </button>
        
        <button onClick={() => setStep(6)} style={{
          background: "none",
          border: "none",
          color: "var(--mu)",
          cursor: "pointer",
          fontSize: 12,
          padding: 0,
          textDecoration: "underline",
          textUnderlineOffset: "4px"
        }}>
          ← {T.review.backButton}
        </button>
      </div>
      </div>

      <div className="wz-review-sidebar">
        <Sidebar est={est} lang={lang} data={d} step={7} />
      </div>
    </div>
  );
}

function SuccessScreen({ type, lang, onBack, navigate, T, est, d, uploading = {} }) {
  const isUS = lang === "EN";
  const isSave = type === "save";
  const { resetWizard } = useAppContext();
  const [vis, setVis] = useState(false);
  const [waLoading, setWaLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(t);
  }, []);

  const f = (delay) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.55s ${delay}ms, transform 0.55s ${delay}ms`
  });

  const count = Math.floor(Math.random() * 500) + 120;

  const sidebarContent = (
    <div className="wz-review-sidebar" style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, alignSelf: "flex-start" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--a)", marginBottom: 13, textTransform: "uppercase" }}>{T.estimatedFee}</div>
      <div style={{ background: "var(--a-dim)", border: "1px solid var(--a-glow)", borderRadius: 16, padding: "10px 13px", marginBottom: 11 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.08em", color: "var(--a)", textTransform: "uppercase", marginBottom: 3 }}>{T.yourProject}</div>
        <div style={{ fontSize: 13, color: "var(--a)", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>{est.projectTitle}</div>
      </div>
      <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 16, padding: 13, marginBottom: 11 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.08em", color: "var(--dm)", textTransform: "uppercase", marginBottom: 6 }}>{est.pkgName}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--tx)", fontFamily: "var(--font-serif)" }}>{est.lo} – {est.hi}</div>
        <div style={{ fontSize: 10, color: "#ffffff", marginTop: 3 }}>{T.approxEstimate}</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 16, padding: 13, marginBottom: 13 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--a)", textTransform: "uppercase", marginBottom: 9 }}>{T.summaryTitle}</div>
        {(est.bd || []).map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--tx)" }}>{item.l}</span>
            <span style={{ fontSize: 11, color: "var(--tx)" }}>{item.v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--mu)" }}>{T.confidence}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{est.conf}%</span>
      </div>
      <div style={{ height: 4, background: "var(--border)", borderRadius: 4 }}>
        <div style={{ width: `${est.conf}%`, height: "100%", background: "var(--accent)", borderRadius: 4 }} />
      </div>
    </div>
  );

  if (isSave) {
    return (
      <div className="wz-main-layout has-sidebar" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Real progress bar per file */}
                  {Object.entries(uploading).map(([id, pct]) => (
                    <div key={id} style={{ width: '100%', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                        <span>Uploading...</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--a)', transition: 'width 0.2s' }}></div>
                      </div>
                    </div>
                  ))}
          {/* Project badge */}
          <div style={{ ...f(0), background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 12, padding: "13px 17px", marginBottom: 36, display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--a-dim)", border: "1px solid var(--a-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>🏛</div>
            <div>
              <div style={{ fontSize: 11, color: "var(--dm)", marginBottom: 2 }}>DARA Studio · Studio Interior</div>
              <div style={{ fontSize: 13, color: "var(--a)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{est.projectTitle} · {est.totalArea}</div>
            </div>
          </div>

          {/* Icon */}
          <div style={{ ...f(80), display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: "rgba(156, 124, 58,0.09)", border: "1.5px solid rgba(156, 124, 58,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M5 14L11 20L23 8" stroke="#9c7c3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Headline */}
          <div style={{ ...f(160), textAlign: "center", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--tx)", fontStyle: "italic", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.35 }}>
              {isUS ? "Your project is safe with us." : `Seu projeto está seguro conosco.`}
            </h2>
            <p style={{ fontSize: 14, color: "var(--mu)", maxWidth: 400, margin: "0 auto", lineHeight: 1.8 }}>
              {isUS ? "Every detail you shared is preserved and waiting." : `Cada detalhe que você compartilhou está preservado e à espera.`}{" "}
              <span style={{ color: "var(--a)" }}>{isUS ? `When the moment is right, we'll be here — brief in hand, ready to begin.` : `Quando o momento for certo, estaremos aqui — brief em mãos, prontos para começar.`}</span>
            </p>
          </div>

          {/* Quote */}
          <div style={{ ...f(240), borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "18px 0", marginBottom: 24, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontStyle: "italic", color: "var(--mu)", lineHeight: 1.8, margin: "0 auto", maxWidth: 400 }}>
              {isUS ? `"Great spaces don't happen overnight —` : `"Grandes espaços não acontecem da noite para o dia —`} {" "}
              <span style={{ color: "var(--a)" }}>{isUS ? 'they begin with a single decision to start."' : `eles começam com uma única decisão de iniciar."`}</span>
            </p>
            <p style={{ fontSize: 11, color: "var(--dm)", margin: "6px 0 0" }}>— DARA Studio</p>
          </div>

          {/* Inbox card */}
          <div style={{ ...f(320), background: "var(--a-dim)", border: "1px solid var(--a-glow)", borderRadius: 11, padding: "15px 18px", marginBottom: 22, display: "flex", gap: 11, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>📩</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--a)", marginBottom: 4 }}>{isUS ? "Check your inbox" : "Verifique seu e-mail"}</div>
              <div style={{ fontSize: 12, color: "var(--tx)", lineHeight: 1.65, opacity: 0.8 }}>
                {isUS ? `A detailed PDF with your full brief, selected services and estimated fees has been sent to` : `Um PDF detalhado com seu brief completo, serviços selecionados e taxas estimadas foi enviado para`}{" "}
                <span style={{ color: "var(--a)", fontWeight: 500 }}>{d.email}</span>
              </div>
            </div>
          </div>

          {/* Tranquility cards */}
          <div style={{ ...f(400), background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 11, padding: "15px 18px", marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "var(--dm)", textTransform: "uppercase", marginBottom: 13 }}>{isUS ? "While you think..." : `Enquanto você pensa...`}</div>
            {[
              { icon: "🔒", text: isUS ? "Your brief is safely stored — access anytime." : `Seu briefing está salvo com segurança — acesse a qualquer momento.` },
              { icon: "📅", text: isUS ? "Our schedule is flexible. You choose when to start." : `Nossa agenda é flexível. Você escolhe quando começar.` },
              { icon: "💬", text: isUS ? "Questions? Our team responds in less than 24h." : `Dúvidas? Nossa equipe responde em menos de 24h.` },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 2 ? 10 : 0 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={f(480)}>
            <button className="wz-btn-primary" onClick={onBack} style={{ width: "100%", height: 56, borderRadius: 9999, marginBottom: 10 }}>
              {isUS ? "← Back to Review" : "← Voltar para o Review"}
            </button>
            <button 
              className="wz-btn-ghost" 
              disabled={waLoading}
              onClick={() => {
                setWaLoading(true);
                window.location.href = "https://wa.me/5548996503350";
              }} 
              style={{ width: "100%", height: 56, borderRadius: 9999 }}
            >
              {waLoading ? T.review.processing : (isUS ? "Talk to the team →" : "Falar com a equipe →")}
            </button>
          </div>
        </div>
        {sidebarContent}
      </div>
    );
  }

  // Pay / Start Screen
  return (
    <div className="wz-main-layout has-sidebar" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Project badge */}
        <div style={{ ...f(0), background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: 12, padding: "13px 17px", marginBottom: 24, display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--a-dim)", border: "1px solid var(--a-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>🏛</div>
          <div>
            <div style={{ fontSize: 11, color: "var(--dm)", marginBottom: 2 }}>DARA Studio · Studio Interior</div>
            <div style={{ fontSize: 13, color: "var(--a)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{est.projectTitle} · {est.totalArea}</div>
          </div>
        </div>

        {/* Project Counter */}
        <div style={{ ...f(80), marginBottom: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 7, background: "var(--a-dim)", border: "1px solid var(--a-glow)", borderRadius: 9, padding: "8px 15px" }}>
            <span style={{ fontSize: 11, color: "var(--mu)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{isUS ? "Project" : "Projeto"}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--a)", fontFamily: "var(--font-serif)" }}>#{count.toString().padStart(3, "0")}</span>
            <span style={{ fontSize: 11, color: "var(--dm)" }}>{isUS ? "added to DARA portfolio" : `adicionado ao portfólio DARA`}</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ ...f(160), marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--tx)", fontStyle: "italic", fontWeight: 400, margin: "0 0 13px", lineHeight: 1.35 }}>
            {isUS ? "The first stroke of your new chapter has been drawn." : `O primeiro traço do seu novo capítulo foi desenhado.`}
          </h2>
          <p style={{ fontSize: 14, color: "var(--mu)", lineHeight: 1.8, margin: 0 }}>
            {isUS ? `Your brief is with our team. In the next steps, we will transform every detail you entrusted to us into` : `Seu briefing está com nossa equipe. Nos próximos passos, vamos transformar cada detalhe que você nos confiou em`}{" "}
            <span style={{ color: "var(--a)" }}>{isUS ? "plans that move and spaces that last." : `plantas que emocionam e espaços que duram.`}</span>
          </p>
        </div>

        {/* Anchor Quote */}
        <div style={{ ...f(240), borderLeft: "2px solid var(--a)", paddingLeft: 16, marginBottom: 26 }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontStyle: "italic", color: "var(--mu)", lineHeight: 1.8, margin: "0 0 5px" }}>
            {isUS ? '"You are not just building a house —' : `"Você não está apenas construindo uma casa —`} {" "}
            <span style={{ color: "var(--a)" }}>{isUS ? "you are creating the place where your story will happen.\"" : `você está criando o lugar onde a sua história vai acontecer."`}</span>
          </p>
          <span style={{ fontSize: 11, color: "var(--dm)" }}>— DARA Studio</span>
        </div>

        {/* Roadmap */}
        <div style={{ ...f(320), background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--a)", textTransform: "uppercase", marginBottom: 18 }}>{T.review.whatNext}</div>
          {(T.review.nextSteps || []).map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: i < 2 ? 16 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--a-glow)", color: "var(--a)", background: "var(--a-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>0{i+1}</div>
                {i < 2 && <div style={{ width: 1, height: 16, background: "var(--border)", marginTop: 3 }} />}
              </div>
              <div style={{ paddingTop: 5 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)", marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--mu)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ ...f(400), background: "rgba(156, 124, 58,0.04)", border: "1px solid rgba(156, 124, 58,0.11)", borderRadius: 11, padding: "14px 18px", marginBottom: 26, display: "flex", gap: 11, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⭐</span>
          <div>
            <p style={{ fontSize: 13, color: "var(--mu)", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 5px" }}>
              {isUS 
                ? '"DARA transformed my vision into a plan in less than a week. The precision and care for every detail surprised me from the first contact."' 
                : `"A DARA transformou minha visão em planta em menos de uma semana. A precisão e o cuidado com cada detalhe me surpreenderam desde o primeiro contato."`}
            </p>
            <span style={{ fontSize: 11, color: "var(--dm)" }}>— {isUS ? `Verified Client · Miami, FL · New Construction` : `Cliente verificado · Miami, FL · New Construction`}</span>
          </div>
        </div>

        {/* CTAs */}
        <div style={f(480)}>
          <button className="wz-btn-primary" onClick={() => { resetWizard(); navigate("/login"); }} style={{ width: "100%", height: 56, borderRadius: 9999, marginBottom: 8, animation: 'spLogoGlow 3s infinite' }}>
            {isUS ? "Access my Client Portal →" : "Acessar meu Portal do Cliente →"}
          </button>
          <p style={{ fontSize: 11, color: "var(--dm)", textAlign: "center", margin: "0 0 11px" }}>{isUS ? `Track your project's progress in real-time` : "Acompanhe o progresso do seu projeto em tempo real"}</p>
          <button className="wz-btn-ghost" onClick={onBack} style={{ width: "100%", height: 56, borderRadius: 9999 }}>
            {isUS ? "← Back to Review" : "← Voltar para o Review"}
          </button>
        </div>
      </div>
      {sidebarContent}
    </div>
  );
}
