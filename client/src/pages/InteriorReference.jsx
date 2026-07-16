import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { useBuilders } from '../context/BuildersContext';
import PageTransition from '../components/PageTransition';
import InteriorMeasurements from '../components/InteriorMeasurements';

// Interior Catalog Data
export const CATALOG_CATEGORIES = [
  { id: 'cabinetry', label: `Cabinetry & Joinery`, labelPt: 'Marcenaria & Gabinetes', icon: '🪵' },
  { id: 'moldings', label: `Moldings & Trim`, labelPt: 'Molduras & Acabamentos', icon: '📐' },
  { id: 'countertops', label: `Surfaces & Countertops`, labelPt: 'Bancadas & Revestimentos', icon: '💎' },
  { id: 'doors', label: `Doors & Entryways`, labelPt: `Portas & Vãos`, icon: '🚪' },
  { id: 'lighting', label: `Lighting & Clearance`, labelPt: `Iluminação & Alturas`, icon: '💡' }
];

export const CATALOG_ITEMS = [
  // Cabinetry & Joinery
  {
    id: 'cab_base',
    category: 'cabinetry',
    title: `Standard Kitchen Base Cabinet`,
    titlePt: `Gabinete Base de Cozinha Padrão`,
    desc: `Standard architectural base cabinet guidelines for residential kitchens. Ensures ergonomic alignment, appliance integration, and comfortable working reach.`,
    descPt: `Diretrizes padrão de gabinete base arquitetônico para cozinhas residenciais. Garante ergonomia, integração de eletrodomésticos e alcance de trabalho confortável.`,
    specs: [
      { name: 'Finished Height', val: '36" (91.4 cm)', desc: 'Including finished 1.5" countertop' },
      { name: 'Cabinet Only Height', val: '34.5" (87.6 cm)', desc: 'Standard box height before countertop slab' },
      { name: 'Standard Depth', val: '24" (61.0 cm)', desc: 'Allows full extension drawer glides' },
      { name: 'Toe Kick Height', val: '4" (10.2 cm)', desc: 'Provides foot clearance for ergonomic standing' },
      { name: 'Toe Kick Depth', val: '3" (7.6 cm)', desc: 'Standard recess setback from cabinet face' }
    ],
    specsPt: [
      { name: 'Altura Acabada', val: '36" (91,4 cm)', desc: `Incluindo bancada acabada de 1,5"` },
      { name: 'Altura Apenas da Caixa', val: '34,5" (87,6 cm)', desc: `Altura padrão antes da prancha da bancada` },
      { name: `Profundidade Padrão`, val: '24" (61,0 cm)', desc: `Permite corrediças de gaveta de extensão total` },
      { name: `Altura do Rodapé`, val: '4" (10,2 cm)', desc: `Garante ergonomia ao ficar em pé junto ao gabinete` },
      { name: `Recuo do Rodapé`, val: '3" (7,6 cm)', desc: `Recuo padrão da face do gabinete` }
    ],
    cadNote: 'KITCHEN BASE CABINETS TO BE WOOD CONSTR. WITH BLUM MOTION SLIDES. FINISHED HT SHALL BE 36" AFF. PROVIDE 4"x3" CONTINUOUS TOE KICK.',
    cadNotePt: `GABINETES BASE DE COZINHA EM ESTRUTURA DE MADEIRA COM CORREDIÇAS BLUM MOTION. ALTURA ACABADA DEVE SER 36" AFF. INCLUIR RODAPÉ CONTÍNUO DE 4"x3".`,
    tip: 'Inspector Tip: Always verify plumbing and electrical rough-in heights BEFORE base cabinet installation. Sink drains must exit low enough to accommodate disposal units.',
    tipPt: `Dica do Inspetor: Verifique as alturas da hidráulica e elétrica ANTES de instalar o gabinete. O ralo da pia deve sair baixo o suficiente para trituradores de pia.`
  },
  {
    id: 'cab_wall',
    category: 'cabinetry',
    title: `Wall-Hung Upper Cabinets`,
    titlePt: `Armários Superiores Suspensos`,
    desc: 'Standard wall cabinetry parameters. Sized to maintain an unobstructed view of the countertop work surface while providing accessible overhead storage.',
    descPt: `Parâmetros padrão para armários aéreos. Dimensionados para manter a visão livre da bancada de trabalho, oferecendo armazenamento acessível.`,
    specs: [
      { name: 'Standard Depth', val: '12" - 13" (30.5 cm)', desc: 'Prevents head collision while working at countertop' },
      { name: 'Oven/Microwave Depth', val: '15" - 18" (45.7 cm)', desc: 'Extended depth to house appliances safely' },
      { name: 'Backsplash Clearance', val: '18" (45.7 cm) min', desc: 'Vertical gap between countertop and bottom of upper cabinet' },
      { name: 'ADA Reach Limit', val: '48" (121.9 cm) max', desc: 'Maximum height for the lowest shelf in accessible units' }
    ],
    specsPt: [
      { name: `Profundidade Padrão`, val: '12" - 13" (30,5 cm)', desc: `Evita colisões com a cabeça ao utilizar a bancada` },
      { name: 'Profundidade Microondas', val: '15" - 18" (45,7 cm)', desc: `Profundidade estendida para embutir eletrodomésticos` },
      { name: `Vão da Bancada`, val: `18" (45,7 cm) mín`, desc: `Distância vertical entre a bancada e a base do armário aéreo` },
      { name: 'Limite ADA de Alcance', val: `48" (121,9 cm) máx`, desc: `Altura máxima para a prateleira mais baixa em unidades acessíveis` }
    ],
    cadNote: 'UPPER CABINET ASSEMBLY: 12" SHIELD DEPTH WITH 18" MIN. CLEAR BACKSPLASH SPACING ABOVE FINISHED COUNTERTOP.',
    cadNotePt: `ARMÁRIOS AÉREOS: PROFUNDIDADE DE 12" COM VÃO MÍNIMO DE 18" ACIMA DA BANCADA ACABADA.`,
    tip: 'Design Tip: Incorporate a 1" light valance underneath upper cabinets to fully conceal LED tape driver channels for premium under-cabinet ambient lighting.',
    tipPt: `Dica de Design: Incorpore uma moldura inferior de 1" sob os aéreos para ocultar perfis de fitas LED de iluminação decorativa.`
  },

  // Moldings & Trim
  {
    id: 'mld_base',
    category: 'moldings',
    title: `Baseboard & Crown Proportioning`,
    titlePt: `Proporções de Rodapés & Rodateto`,
    desc: 'Classical architectural proportion guidelines linking wall trims and ceiling heights. Ensures scale-appropriate molding heights without overwhelming spaces.',
    descPt: `Diretrizes clássicas de proporção arquitetônica que vinculam acabamentos e alturas de pé-direito. Garante escala adequada sem sobrecarregar os ambientes.`,
    specs: [
      { name: '8ft Ceiling Crown', val: '3" - 5" (7.6 cm)', desc: 'Proportional spring height to prevent compressing the room' },
      { name: '9ft Ceiling Crown', val: '5" - 7" (12.7 cm)', desc: `Elegant profile, single crown transition piece` },
      { name: '10ft Ceiling Crown', val: '7" - 9"+ (22.8 cm)', desc: 'Built-up multi-member crown assembly recommended' },
      { name: 'Standard Baseboard Ht', val: '3.5" - 5.5" (8.9 cm)', desc: 'Classical 1/20th proportion of finished wall height' }
    ],
    specsPt: [
      { name: `Rodateto (Pé-direito 2.4m)`, val: '3" - 5" (7,6 cm)', desc: `Altura proporcional para evitar sensação de teto rebaixado` },
      { name: `Rodateto (Pé-direito 2.7m)`, val: '5" - 7" (12,7 cm)', desc: `Perfil elegante de transição única` },
      { name: `Rodateto (Pé-direito 3.0m)`, val: '7" - 9"+ (22,8 cm)', desc: `Composição de molduras compostas de múltiplas partes recomendada` },
      { name: `Rodapé Padrão`, val: '3.5" - 5.5" (8,9 cm)', desc: `Proporção clássica de 1/20 avos da altura da parede` }
    ],
    cadNote: 'PROVIDE SELECT SOLID POPLAR MOULDINGS AND CASINGS THROUGHOUT. BASEBOARD HEIGHT TO MATCH CALCULATED ARCHITECTURAL RATIO.',
    cadNotePt: `FORNECER MOLDURAS E GUARNIÇÕES EM ÁLAMO MACIÇO SELECIONADO. ALTURA DO RODAPÉ SEGUINDO A PROPORÇÃO ARQUITETÔNICA CALCULADA.`,
    tip: `Craftsman Secret: Always run baseboard flush down to the subfloor before installing hardwood flooring, or use a "shoe molding" profile to span irregular expansion gaps.`,
    tipPt: `Segredo de Carpintaria: Instale o rodapé diretamente no contrapiso antes do piso de madeira ou utilize um cordão (shoe molding) para cobrir juntas de dilatação irregulares.`
  },

  // Surfaces & Countertops
  {
    id: 'cnt_quartz',
    category: 'countertops',
    title: `Premium Edge & Slab Transitions`,
    titlePt: 'Acabamentos e Detalhes de Bancadas',
    desc: `Specification standards for high-performance natural quartzite, marble, and engineered composite quartz surface slabs in kitchens and bathrooms.`,
    descPt: `Normas de especificação para bancadas de alto desempenho em quartzito natural, mármore e quartzo composto de engenharia em cozinhas e banheiros.`,
    specs: [
      { name: 'Standard Thickness', val: '3cm (1-1/4")', desc: 'Premium residential slab depth. High structural integrity' },
      { name: 'Mitered Joint Angle', val: '45-Degrees Exact', desc: 'Allows continuous pattern flow across vertical waterfall panels' },
      { name: 'Eased Edge Radius', val: '1/8" (3.2 mm) min', desc: 'Standard bevel to prevent structural edge chipping' },
      { name: 'Overhang Support', val: '12" (30.5 cm) max', desc: 'Maximum cantilever width without secondary metal bracket supports' }
    ],
    specsPt: [
      { name: `Espessura Padrão`, val: '3cm (1-1/4")', desc: 'Espessura residencial premium de alta integridade estrutural' },
      { name: 'Corte de Meia-Esquadria', val: 'Exatos 45 Graus', desc: `Permite fluxo contínuo dos veios da rocha em bancadas do tipo cascata` },
      { name: 'Canto Boleado/Suave', val: `R1/8" (3,2 mm) mín`, desc: 'Suave arredondamento para evitar quebras estruturais no topo' },
      { name: `Apoio de Balanço`, val: `12" (30,5 cm) máx`, desc: `Limite máximo de balanço sem suportes metálicos auxiliares` }
    ],
    cadNote: 'STONEMASON PRECISE SHOP DRAWINGS REQUIRED. WATERFALL SIDES SHALL MEET MAIN SLAB WITH FLUSH 45-DEGREE MITERED CORNERS.',
    cadNotePt: `PROJETO DE DETALHAMENTO DE MARMORARIA REQUERIDO. COMPOSIÇÕES LATERAIS EM CASCATA COM ENCONTRO EM MEIA-ESQUADRIA 45 GRAUS PERFEITO.`,
    tip: 'Fabricator Code: For stone cantilevers exceeding 12", screw flat steel supports (1/4" thickness) directly into the cabinet top frames prior to slab setting.',
    tipPt: `Alerta Técnico: Para balanços de pedra superiores a 12", aparafuse suportes chatos de aço (espessura de 1/4") na caixa do gabinete antes do assentamento.`
  },

  // Doors & Entryways
  {
    id: 'dor_interior',
    category: 'doors',
    title: `Solid Core Shaker Doors & Clearances`,
    titlePt: `Portas Shaker Maciças e Vãos`,
    desc: `Standardized interior passage door openings and accessibility compliance. Prioritizes acoustic isolation, framing rigidity, and clearance parameters.`,
    descPt: `Aberturas de portas de passagem internas padronizadas e conformidade de acessibilidade. Prioriza isolamento acústico, rigidez estrutural e parâmetros de vão livre.`,
    specs: [
      { name: 'Standard Height', val: `80" (6'-8")`, desc: 'Standard residential door frame size' },
      { name: 'Premium Height', val: `96" (8'-0")`, desc: 'Elevated profile for modern ceilings' },
      { name: 'Standard Width', val: '30" - 36" (91.4 cm)', desc: 'Standard residential hallway passage widths' },
      { name: 'ADA Accessible Width', val: '32" (81.3 cm) min', desc: 'Minimum clear width measured with door open 90 degrees' }
    ],
    specsPt: [
      { name: `Altura Padrão`, val: `80" (6'-8")`, desc: `Medida padrão residencial para batentes de porta` },
      { name: 'Altura Elevada/Premium', val: `96" (8'-0")`, desc: `Perfil estendido para tetos altos contemporâneos` },
      { name: `Largura Padrão`, val: '30" - 36" (91,4 cm)', desc: `Largura padrão de portas internas e de circulação` },
      { name: 'Acessibilidade ADA', val: `32" (81,3 cm) mín`, desc: `Vão livre útil mínimo medido com a folha aberta a 90 graus` }
    ],
    cadNote: 'ALL INTERIOR PASSAGE DOORS TO BE SOLID-CORE WOOD CONSTRUCTION. ACCESSIBLE ROUTES TO MAINTAIN MINIMUM 32" CLEAR WIDTH.',
    cadNotePt: `TODAS AS PORTAS INTERNAS DE PASSAGEM EM MADEIRA DE NÚCLEO MACIÇO. ROTAS ACESSÍVEIS COM VÃO MÍNIMO DE 32".`,
    tip: 'Architect Note: Solid core doors are mandatory for bedrooms and bathrooms to achieve acceptable STC (Sound Transmission Class) ratings. Avoid hollow core doors.',
    tipPt: `Nota do Arquiteto: Portas de núcleo maciço são indispensáveis em dormitórios e banheiros para isolamento acústico (STC). Evite portas ocas.`
  },

  // Lighting & Clearance
  {
    id: 'lit_island',
    category: 'lighting',
    title: `Island Pendant Height & Light Spreads`,
    titlePt: `Pendentes da Ilha e Distribuição`,
    desc: 'Spacing rules and mounting heights for decorative island pendants. Promotes shadowless task lighting without blocking conversational sightlines.',
    descPt: `Regras de espaçamento e alturas de instalação para luminárias pendentes em ilhas de cozinha. Promove luz funcional e sem sombras na bancada.`,
    specs: [
      { name: 'Mounting Height', val: '30" - 36" (76 - 91 cm)', desc: 'Vertical gap between countertop surface and bottom of pendant glass' },
      { name: 'Island Edge Setback', val: '12" - 15" (38 cm) min', desc: 'Distance from outer edges of the island to first light fixture' },
      { name: 'Inter-Fixture Spacing', val: '24" - 30" (76 cm) o.c.', desc: 'Optimal spacing between multiple pendant centers to distribute light' },
      { name: 'Standard Recessed Spacing', val: 'Ceiling Ht / 2', desc: 'Rule of thumb: divide ceiling height by two (e.g., 8ft ceiling = 4ft spacing)' }
    ],
    specsPt: [
      { name: `Altura de Fixação`, val: '30" - 36" (76 - 91 cm)', desc: `Distância entre a bancada e a parte inferior da cúpula do pendente` },
      { name: 'Recuo da Borda', val: `12" - 15" (38 cm) mín`, desc: 'Recuo da borda da ilha ao centro do primeiro pendente' },
      { name: `Espaçamento Entre Lustres`, val: '24" - 30" (76 cm) o.c.', desc: `Espaçamento ideal entre centros de múltiplos pendentes` },
      { name: `Espaçamento Embutidos`, val: `Pé-direito / 2`, desc: `Regra geral: dividir a altura do pé-direito por dois (ex: 3m teto = 1.5m distância)` }
    ],
    cadNote: 'DECORATIVE ISLAND PENDANTS SHALL BE MOUNTED AT 32" CLEAR AFF ABOVE FINISHED COUNTERTOP. SPACING TO MATCH ARCHITECTURAL LIGHTING PLAN.',
    cadNotePt: `PENDENTES DE ILHA DECORATIVOS MONTADOS A 32" ACIMA DA BANCADA ACABADA. ESPAÇAMENTO SEGUINDO PROJETO LUMINOTÉCNICO.`,
    tip: 'Lighting Secret: Always place recessed can fixtures 12" to 15" out from wall surfaces. Placing them too close creates unwanted "wall washing" glare that highlights minor drywall imperfections.',
    tipPt: `Segredo de Iluminação: Posicione spots embutidos a 30-40cm de distância da parede. Colocá-los muito próximos cria reflexos e revela ondulações no gesso.`
  }
];

// Interactive Technical Diagrams
function InteriorTechnicalDiagram({ id, lang }) {
  if (id === 'cab_base') {
    return (
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', background: '#0a0a0f' }}>
        <g stroke="#9c7c3a" strokeWidth="2" fill="none">
          {/* Wall Backing */}
          <line x1="40" y1="20" x2="40" y2="280" stroke="#1e1b4b" strokeWidth="4" />
          {/* Floor line */}
          <line x1="20" y1="260" x2="380" y2="260" stroke="#1e1b4b" strokeWidth="3" />
          
          {/* Base Cabinet Box */}
          <rect x="70" y="70" width="160" height="150" stroke="#9c7c3a" strokeWidth="2.5" />
          {/* Toe Kick Recess */}
          <path d={`M70,220 L110,220 L110,260 L70,260 Z`} stroke="#9c7c3a" strokeWidth="2" fill="rgba(156, 124, 58,0.05)" />
          
          {/* Countertop Slab */}
          <rect x="65" y="60" width="170" height="10" fill="#9c7c3a" stroke="#9c7c3a" strokeWidth="1.5" />
        </g>
        
        {/* Height Dimension lines */}
        <g stroke="#f59e0b" strokeWidth="1">
          <line x1="260" y1="60" x2="260" y2="260" />
          <line x1="255" y1="60" x2="265" y2="60" />
          <line x1="255" y1="260" x2="265" y2="260" />
          
          <line x1="295" y1="70" x2="295" y2="260" strokeDasharray="3" />
          <line x1="290" y1="70" x2="300" y2="70" />
          <line x1="290" y1="260" x2="300" y2="260" />
        </g>
        
        {/* Toe kick labels */}
        <text x="125" y="245" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#9c7c3a">{lang === 'EN' ? 'Toe Kick: 4"H x 3"D' : 'Rodapé: 4"A x 3"P'}</text>
        <circle cx="110" cy="240" r="3" fill="#9c7c3a" />
        
        {/* Dimension text */}
        <text x="325" y="165" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">{lang === 'EN' ? '36" Finished Ht' : 'Alt. Acabada: 36"'}</text>
        <text x="325" y="180" fontFamily="sans-serif" fontSize="8" fill="#94a3b8" textAnchor="middle">{lang === 'EN' ? '(Including Counter)' : '(Incluindo Bancada)'}</text>
        
        <text x="150" y="45" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#9c7c3a" textAnchor="middle">{lang === 'EN' ? '1.5" Slab Overhang' : 'Balanço da Pedra: 1.5"'}</text>
        <text x="150" y="140" fontFamily="sans-serif" fontSize="11" fill="#94a3b8" textAnchor="middle">{lang === 'EN' ? '24" Standard Depth' : 'Profundidade Padrão: 24"'}</text>
        
        <text x="200" y="290" fontFamily="sans-serif" fontSize="9" fill="#64748b" textAnchor="middle">{lang === 'EN' ? 'Precision Ergonomic Kitchen Layout' : 'Layout Ergonômico de Cozinha'}</text>
      </svg>
    );
  }
  
  if (id === 'cab_wall') {
    return (
      <svg viewBox={`0 0 400 300`} style={{ width: '100%', height: '100%', background: '#0a0a0f' }}>
        <g stroke="#9c7c3a" strokeWidth="2" fill="none">
          {/* Wall line */}
          <line x1="40" y1="10" x2="40" y2="280" stroke="#1e1b4b" strokeWidth="4" />
          
          {/* Finished countertop plane */}
          <line x1="20" y1="240" x2="380" y2="240" stroke="#9c7c3a" strokeWidth="3" />
          
          {/* Upper Cabinet */}
          <rect x="40" y="30" width="80" height="120" stroke="#9c7c3a" strokeWidth="2.5" />
        </g>
        
        {/* Backsplash clearance line */}
        <g stroke="#f59e0b" strokeWidth="1">
          <line x1="160" y1="150" x2="160" y2="240" />
          <line x1="155" y1="150" x2="165" y2="150" />
          <line x1="155" y1="240" x2="165" y2="240" />
        </g>
        
        <circle cx="160" cy="195" r="4" fill="#f59e0b" />
        <text x="180" y="200" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#f59e0b">{lang === 'EN' ? '18" Backsplash Clearance' : 'Vão da Bancada: 18"'}</text>
        
        <text x="80" y="90" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#9c7c3a" textAnchor="middle">{lang === 'EN' ? '12" Depth' : 'Profundidade: 12"'}</text>
        <text x="80" y="105" fontFamily="sans-serif" fontSize="8" fill="#94a3b8" textAnchor="middle">{lang === 'EN' ? '(Prevents Collision)' : '(Evita Colisões)'}</text>
        
        <text x="210" y="255" fontFamily="monospace" fontSize="9.5" fill="#9c7c3a" textAnchor="middle">{lang === 'EN' ? 'Finished Countertop Surface' : 'Bancada Acabada'}</text>
        
        {/* Under-cabinet LED light path */}
        <path d="M42,148 L118,148" stroke="#9c7c3a" strokeWidth="2" strokeDasharray="3" />
        <text x="80" y="165" fontFamily="monospace" fontSize="8.5" fontWeight="bold" fill="#9c7c3a" textAnchor="middle">{lang === 'EN' ? 'LED Valance Zone' : 'Zona do Perfil LED'}</text>
      </svg>
    );
  }
  
  if (id === 'mld_base') {
    return (
      <svg viewBox={`0 0 400 300`} style={{ width: '100%', height: '100%', background: '#0a0a0f' }}>
        <g stroke="#9c7c3a" strokeWidth="2" fill="none">
          {/* Ceiling Line */}
          <line x1="30" y1="40" x2="370" y2="40" stroke="#1e1b4b" strokeWidth="4" />
          {/* Floor Line */}
          <line x1="30" y1="260" x2="370" y2="260" stroke="#1e1b4b" strokeWidth="4" />
          {/* Wall Plane */}
          <line x1="200" y1="40" x2="200" y2="260" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
          
          {/* Baseboard Shape (Left Wall base) */}
          <path d="M30,260 L30,225 L35,225 L35,260 Z" fill="#9c7c3a" stroke="#9c7c3a" strokeWidth="1.5" />
          {/* Crown Molding Shape (Left Wall Ceiling) */}
          <path d="M30,40 L45,40 L30,55 Z" fill="#9c7c3a" stroke="#9c7c3a" strokeWidth="1.5" />
        </g>
        
        {/* Dimensions */}
        <g stroke="#f59e0b" strokeWidth="1">
          <line x1="60" y1="40" x2="60" y2="55" />
          <line x1="55" y1="55" x2="65" y2="55" />
          
          <line x1="50" y1="225" x2="50" y2="260" />
          <line x1="45" y1="225" x2="55" y2="225" />
        </g>
        
        <text x="75" y="55" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#9c7c3a">{lang === 'EN' ? 'Crown Height (3" - 7")' : 'Altura do Rodateto (3" - 7")'}</text>
        <text x="65" y="245" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#9c7c3a">{lang === 'EN' ? 'Baseboard (3.5" - 5.5")' : 'Rodapé (3.5" - 5.5")'}</text>
        
        <text x="200" y="140" fontFamily="sans-serif" fontSize="12" fill="#94a3b8" textAnchor="middle">{lang === 'EN' ? 'Architectural Proportions' : 'Proporções Arquitetônicas'}</text>
        <text x="200" y="160" fontFamily="monospace" fontSize="10.5" fontWeight="bold" fill="#f59e0b" textAnchor="middle">{lang === 'EN' ? 'Trim Height = Ceiling Ht * 1/20 ratio' : 'Alt. Acabamento = Pé-Direito * 1/20'}</text>
      </svg>
    );
  }
  
  if (id === 'cnt_quartz') {
    return (
      <svg viewBox={`0 0 400 300`} style={{ width: '100%', height: '100%', background: '#0a0a0f' }}>
        <g stroke="#9c7c3a" strokeWidth="2.5" fill="none">
          {/* Mitered Edge Detail profile */}
          <path d="M80,60 L240,60 L240,110 L190,110 L190,75 L80,75 Z" fill="rgba(156, 124, 58,0.05)" />
          
          {/* 45-Degree Miter Joint Line */}
          <line x1="240" y1="60" x2="190" y2="110" stroke="#9c7c3a" strokeWidth="2.5" strokeDasharray="3" />
        </g>
        
        {/* Annotations */}
        <text x="160" y="50" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#9c7c3a" textAnchor="middle">{lang === 'EN' ? '3cm (1-1/4") Slab' : 'Chapa de 3cm (1-1/4")'}</text>
        
        <circle cx="215" cy="85" r="4" fill="#9c7c3a" />
        <text x="260" y="90" fontFamily="monospace" fontSize="10.5" fontWeight="bold" fill="#9c7c3a">{lang === 'EN' ? '45° Miter Joint' : 'Meia-Esquadria 45°'}</text>
        
        <text x="140" y="140" fontFamily="sans-serif" fontSize="10" fill="#94a3b8" textAnchor="middle">{lang === 'EN' ? 'Waterfall Edge Detail' : 'Detalhe de Borda Cascata'}</text>
        <text x="140" y="155" fontFamily="sans-serif" fontSize="8.5" fill="#64748b" textAnchor="middle">{lang === 'EN' ? 'Seamless structural grain continuation' : 'Continuidade dos veios'}</text>
      </svg>
    );
  }

  // Fallback diagram (Default)
  return (
    <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', background: '#0a0a0f' }}>
      <rect x="40" y="40" width="320" height="220" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" rx="8" />
      <circle cx="200" cy="130" r="30" fill="none" stroke="#9c7c3a" strokeWidth="2" strokeDasharray="5" />
      <text x="200" y="185" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#9c7c3a" textAnchor="middle">{lang === 'EN' ? 'CAD Technical Blueprint' : 'Desenho Técnico CAD'}</text>
      <text x="200" y="205" fontFamily="sans-serif" fontSize="9" fill="#64748b" textAnchor="middle">{lang === 'EN' ? 'Precision architectural vector details' : 'Detalhes vetoriais precisos'}</text>
    </svg>
  );
}

export default function InteriorReference() {
  const { lang } = useAppContext();
  const { getCollection, seedCollection } = useBuilders();
  const [activeCategory, setActiveCategory] = useState('cabinetry');
  const [copiedId, setCopiedId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [viewMode, setViewMode] = useState('technical'); // 'technical' or 'measurements'

  // Interactive molding sizing calculator state
  const [ceilingHeight, setCeilingHeight] = useState(9); // in feet

  // Seed context with default data on first mount
  useEffect(() => {
    seedCollection('interiorCategories', CATALOG_CATEGORIES);
    seedCollection('interiorItems', CATALOG_ITEMS);
  }, [seedCollection]);

  // Read from context (live data from admin CRUD)
  const categories = getCollection('interiorCategories');
  const allItems = getCollection('interiorItems');

  // Fallback to static if context is empty (first render before seed)
  const effectiveCategories = categories.length > 0 ? categories : CATALOG_CATEGORIES;
  const effectiveItems = allItems.length > 0 ? allItems : CATALOG_ITEMS;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      showToast(lang === 'EN' ? `Copied strictly to clipboard!` : `Copiado para a área de transferência!`);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // Dynamically calculate ideal trim dimensions
  const calculatedTrims = useMemo(() => {
    const rawBaseboard = ceilingHeight * 12 * 0.055;
    const baseboardHt = Math.round(rawBaseboard * 4) / 4;
    
    let crownRange = '3" - 5"';
    if (ceilingHeight > 8.5 && ceilingHeight <= 9.5) crownRange = '5" - 6.5"';
    else if (ceilingHeight > 9.5 && ceilingHeight <= 11) crownRange = '7" - 8.5"';
    else if (ceilingHeight > 11) crownRange = '9" - 12"+ (Built-up)';
    
    return {
      baseboard: `${baseboardHt}"`,
      crown: crownRange,
      ratio: '1/20 classical ratio'
    };
  }, [ceilingHeight]);

  const filteredItems = useMemo(() => {
    return effectiveItems.filter(item => item.category === activeCategory);
  }, [activeCategory, effectiveItems]);

  return (
    <PageTransition variant="default">
    <div className="lp-root">
      {/* Brilho radial verde suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>
      <Navbar />

      <main className="independent-page">
        <header className="page-header-premium animate-float-up">
          <div className="badge" style={{ marginBottom: '16px' }}>
            <span className="badge-icon">☆</span>
            <span className="badge-text">
              {lang === 'EN' ? 'PREMIUM ARCHITECTURAL REFERENCE' : `REFERÊNCIA ARQUITETÔNICA HIGH-END`}
            </span>
          </div>
          <h1 className="page-main-title">
            {lang === 'EN' ? (
              <>
                <span className="title-white">Interior</span> <span className="title-gradient-italic">Architectural Reference</span>
              </>
            ) : (
              <>
                <span className="title-white">Guia de</span> <span className="title-gradient-italic">Referência de Interiores</span>
              </>
            )}
          </h1>
          <p className="page-subtitle-standard">
            {lang === 'EN' 
              ? `Curated interior specification standards, standard cabinetry dimensions, material tolerances, and spatial clearances. Configured for high-end residential execution.`
              : `Padrões de especificação de interiores, dimensões padrão de marcenaria, tolerâncias de materiais e afastamentos espaciais. Desenvolvido para execução residencial de alto padrão.`}
          </p>
        </header>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }} className="animate-float-up">
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '999px', padding: '6px', border: '1px solid var(--glass-border)' }}>
            <button 
              onClick={() => setViewMode('technical')}
              style={{
                background: viewMode === 'technical' ? 'linear-gradient(135deg, #A1824A, #8F723E)' : 'transparent',
                color: viewMode === 'technical' ? '#fff' : 'var(--mu)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {lang === 'EN' ? 'Technical Guidelines' : `Diretrizes Técnicas`}
            </button>
            <button 
              onClick={() => setViewMode('measurements')}
              style={{
                background: viewMode === 'measurements' ? 'linear-gradient(135deg, #A1824A, #8F723E)' : 'transparent',
                color: viewMode === 'measurements' ? '#fff' : 'var(--mu)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {lang === 'EN' ? 'Measurements' : 'Medidas'}
            </button>
          </div>
        </div>

        {viewMode === 'measurements' ? (
          <InteriorMeasurements lang={lang} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "80px", maxWidth: "1400px", margin: "0 auto", width: "100%", padding: "0 24px", boxSizing: "border-box", marginBottom: "80px" }} className="animate-float-up">

          {/* Tab Selection Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          borderBottom: '1px solid var(--glass-border)', 
          paddingBottom: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {effectiveCategories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 24px', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  borderRadius: '999px', 
                  border: 'none', 
                  background: isActive ? 'linear-gradient(135deg, #A1824A, #8F723E)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--mu)', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{cat.icon}</span>
                {lang === 'EN' ? cat.label : cat.labelPt}
              </button>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left Column: Interactive Slabs and Blueprint Catalog Cards */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="glass-premium" 
                style={{ 
                  borderRadius: '24px', 
                  border: '1px solid var(--glass-border)', 
                  background: 'var(--glass-bg)', 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>
                    {lang === 'EN' ? item.title : item.titlePt}
                  </h3>
                  <span style={{ 
                    fontSize: '9.5px', 
                    fontWeight: '800', 
                    background: 'rgba(156, 124, 58, 0.08)', 
                    border: '1px solid rgba(156, 124, 58, 0.15)', 
                    color: '#9c7c3a', 
                    padding: '3px 8px', 
                    borderRadius: '8px', 
                    textTransform: 'uppercase' 
                  }}>
                    {lang === 'EN' 
                      ? (effectiveCategories.find(c => c.id === activeCategory)?.label || activeCategory)
                      : (effectiveCategories.find(c => c.id === activeCategory)?.labelPt || activeCategory)}
                  </span>
                </div>

                <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.6', margin: 0 }}>
                  {lang === 'EN' ? item.desc : item.descPt}
                </p>

                {/* Specs Table */}
                <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.12)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--mu)', fontWeight: '800' }}>
                          {lang === 'EN' ? 'Specification Parameter' : `Parâmetro de Especificação`}
                        </th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--mu)', fontWeight: '800' }}>
                          {lang === 'EN' ? 'Standard Value' : `Valor Padrão`}
                        </th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--mu)', fontWeight: '800' }}>
                          {lang === 'EN' ? 'Context / Purpose' : 'Finalidade / Contexto'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(lang === 'EN' ? item.specs : item.specsPt).map((spec, sidx) => (
                        <tr key={sidx} style={{ borderBottom: sidx === item.specs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700' }}>{spec.name}</td>
                          <td style={{ padding: '12px 16px', color: '#60a5fa', fontWeight: '800', fontFamily: 'monospace' }}>{spec.val}</td>
                          <td style={{ padding: '12px 16px', opacity: 0.7 }}>{spec.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Copyable CAD Note */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      📋 {lang === 'EN' ? 'Double-Click to Copy CAD Sheet Note' : 'Clique Duplo para Copiar Nota de Prancha CAD'}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(item.id, lang === 'EN' ? item.cadNote : item.cadNotePt)}
                      style={{ 
                        background: copiedId === item.id ? 'var(--accent)' : 'rgba(255,255,255,0.03)', 
                        border: '1px solid var(--glass-border)', 
                        color: copiedId === item.id ? '#fff' : 'inherit', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        fontSize: '10.5px', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {copiedId === item.id ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div 
                    onDoubleClick={() => copyToClipboard(item.id, lang === 'EN' ? item.cadNote : item.cadNotePt)}
                    style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '10.5px', 
                      color: '#9c7c3a', 
                      textTransform: 'uppercase', 
                      lineHeight: '1.5',
                      cursor: 'pointer',
                      userSelect: 'all'
                    }}
                  >
                    {lang === 'EN' ? item.cadNote : item.cadNotePt}
                  </div>
                </div>

                {/* Field Tip Warning */}
                <div style={{ 
                  background: 'rgba(245,158,11,0.03)', 
                  border: '1px solid rgba(245,158,11,0.12)', 
                  borderRadius: '12px', 
                  padding: '16px' 
                }}>
                  <div style={{ fontSize: '8.5px', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    ⚠️ {lang === 'EN' ? 'Execution Guideline' : `Diretriz de Execução`}
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#fcd34d', margin: 0, lineHeight: 1.6 }}>
                    {lang === 'EN' ? item.tip : item.tipPt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Technical Blueprint Details & Proportion Calculator */}
          <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '28px', flexShrink: 0 }}>
            
            {/* Technical Detail Diagram Showcase */}
            <div className="glass-premium" style={{ borderRadius: '24px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', padding: '20px', overflow: 'hidden' }}>
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>
                  {lang === 'EN' ? 'Technical Detail Diagram' : `Diagrama Técnico de Detalhamento`}
                </h4>
                <p style={{ fontSize: '11px', opacity: 0.6, margin: 0 }}>
                  {lang === 'EN' ? 'Dynamic blueprint view for the active category' : `Visualização dinâmica de planta para a categoria ativa`}
                </p>
              </div>

              <div style={{ 
                height: '280px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid var(--glass-border)',
                background: '#0a0a0f',
                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)'
              }}>
                <InteriorTechnicalDiagram id={filteredItems[0]?.id} lang={lang} />
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10.5px', fontFamily: 'monospace', color: 'var(--mu)', textTransform: 'uppercase' }}>
                ✦ {lang === 'EN' ? 'PRECISION VECTOR DRAWINGS' : `DESENHOS VETORIAIS DE ALTA PRECISÃO`}
              </div>
            </div>

            {/* Sizing & Classical Ratio Calculator */}
            <div className="glass-premium" style={{ borderRadius: '24px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800', margin: 0 }}>
                  {lang === 'EN' ? 'Classical Ratio & Trim Calculator' : `Calculadora de Transição e Proporções`}
                </h4>
                <p style={{ fontSize: '11px', opacity: 0.6, margin: 0 }}>
                  {lang === 'EN' ? 'Inputs ceiling height to compute ideal architectural molding proportions.' : `Insira o pé-direito para obter as proporções ideais de acabamentos.`}
                </p>
              </div>

              {/* Slider Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                  <span>{lang === 'EN' ? 'Ceiling Height:' : `Altura do Pé-Direito:`}</span>
                  <span style={{ color: '#9c7c3a', fontFamily: 'monospace' }}>{ceilingHeight} ft ({Math.round(ceilingHeight * 30.48) / 100} m)</span>
                </div>
                <input 
                  type="range" 
                  min="7" 
                  max="14" 
                  step="0.5"
                  value={ceilingHeight}
                  onChange={e => setCeilingHeight(parseFloat(e.target.value))}
                  style={{ 
                    width: '100%', 
                    accentColor: '#A1824A',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Results Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--mu)', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Recommended Crown' : 'Rodateto Recomendado'}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#9c7c3a', fontFamily: 'monospace', marginTop: '6px' }}>
                    {calculatedTrims.crown}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--mu)', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Recommended Baseboard' : `Rodapé Recomendado`}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#60a5fa', fontFamily: 'monospace', marginTop: '6px' }}>
                    {calculatedTrims.baseboard}
                  </div>
                </div>
              </div>

              {/* Graphical Scale Preview Mockup */}
              <div style={{ 
                height: '140px', 
                background: '#0a0a0f', 
                borderRadius: '14px', 
                border: '1px solid var(--glass-border)', 
                overflow: 'hidden', 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '8px 16px'
              }}>
                {/* Crown Representation */}
                <div style={{ 
                  height: `${Math.max(6, (ceilingHeight - 6) * 4)}px`, 
                  background: 'linear-gradient(to bottom, #9c7c3a, rgba(156, 124, 58,0.2))', 
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  fontSize: '8px',
                  color: '#fff',
                  fontFamily: 'monospace'
                }}>
                  {lang === 'EN' ? 'CROWN' : 'RODATETO'}
                </div>

                {/* Wall body representation */}
                <div style={{ fontSize: '10px', textAlign: 'center', opacity: 0.2, fontFamily: 'sans-serif' }}>
                  {ceilingHeight}FT {lang === 'EN' ? 'WALL MOCKUP (SCALE PREVIEW)' : `MOCKUP DE PAREDE (PRÉVIA EM ESCALA)`}
                </div>

                {/* Baseboard Representation */}
                <div style={{ 
                  height: `${Math.max(10, (ceilingHeight - 6) * 5)}px`, 
                  background: 'linear-gradient(to top, #3b82f6, rgba(59,130,246,0.2))', 
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  fontSize: '8px',
                  color: '#fff',
                  fontFamily: 'monospace'
                }}>
                  {lang === 'EN' ? 'BASEBOARD' : 'RODAPÉ'}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--mu)', lineHeight: 1.5, fontStyle: 'italic', textAlign: 'center' }}>
                *{lang === 'EN' 
                  ? 'Calculated using the classical 1/20 ratio for baseboard height and progressive spring ratios for crown molding projections.'
                  : `Calculado utilizando a proporção clássica de 1/20 para o rodapé e razões progressivas para as molduras de rodateto.`}
              </div>
            </div>

          </div>

        </div>
          </div>
        )}
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
          boxShadow: "0 10px 30px rgba(156, 124, 58, 0.2)"
        }}>
          {toastMsg}
        </div>
      )}

      <Footer />
    </div>
    </PageTransition>
  );
}
