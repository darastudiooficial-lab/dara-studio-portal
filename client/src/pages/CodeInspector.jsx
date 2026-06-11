import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import { useBuilders } from "../context/BuildersContext";
import PageTransition from '../components/PageTransition';

// Category Data
const PROJECTS = [
  { id: "new_con", label: `New Construction`, labelPt: `Nova Construção`, icon: "🏠" },
  { id: "addition", label: `Addition / Expansion`, labelPt: `Adição / Expansão`, icon: "➕" },
  { id: "remodel", label: `Interior Remodel`, labelPt: "Reforma de Interiores", icon: "🔨" },
  { id: "interiors", label: `Interior Design`, labelPt: "Design de Interiores", icon: "🎨" },
  { id: "deck_roof", label: `Deck (With Roof)`, labelPt: "Deck (Com Teto)", icon: "🏗" },
  { id: "deck_open", label: `Deck (Open)`, labelPt: "Deck (Aberto)", icon: "🪵" },
  { id: "porch_enc", label: `Porch (Enclosed)`, labelPt: "Varanda (Fechada)", icon: "🏛" },
  { id: "porch_open", label: `Porch (Open)`, labelPt: "Varanda (Aberta)", icon: "🌿" },
  { id: "adu", label: `ADU / In-Law Suite`, labelPt: `ADU / Casa de Hóspedes`, icon: "🏘" },
  { id: "basement", label: `Finished Basement`, labelPt: `Porão Acabado`, icon: "🔲" },
  { id: "dormer", label: `Dormer / Attic`, labelPt: `Sótão / Mansarda`, icon: "🏚" },
  { id: "garage", label: `Garage (Det/Att)`, labelPt: "Garagem", icon: "🚗" },
];

const SYSTEMS = [
  { id: "roof_types", label: `Roof Types & Styles`, labelPt: "Tipos de Telhado" },
  { id: "roof_conn", label: `Roof Connections`, labelPt: `Conexões de Telhado` },
  { id: "foundation", label: `Foundation / Footings`, labelPt: `Fundação / Sapatas` },
  { id: "framing", label: `Framing & Structure`, labelPt: "Estrutura (Framing)" },
  { id: "thermal", label: `Thermal / Insulation`, labelPt: `Isolamento Térmico` },
  { id: "envelope", label: `Wall Assembly`, labelPt: "Sistema de Paredes" },
  { id: "mep", label: `MEP Systems`, labelPt: "Sistemas MEP" },
  { id: "fire", label: `Life Safety / Fire`, labelPt: `Segurança / Incêndio` },
];

// Notes Database
export const NOTES = [
  {
    id: 1, project: "new_con", system: "roof_types", status: "code_compliant",
    tags: ["roof", "framing", "gable", "wind", "snow", "single-family"],
    title: `Gable Roof — Two-Slope Classic`, titlePt: `Telhado Gable — Clássico de Duas Águas`,
    pt: `Modelo mais popular nos EUA. Duas superfícies inclinadas que se encontram em uma cumeeira, formando um triângulo (gable) nas extremidades.`,
    cad: "GABLE ROOF SYSTEM PER ARCH. PLANS. VERIFY SNOW LOAD PER 780 CMR TABLE R301.2(1).",
    cadPt: "SISTEMA GABLE CONF. PROJETO. VERIFICAR CARGA DE NEVE (780 CMR TABELA R301.2(1)).",
    layout: "ROOF SYSTEM SHALL BE A GABLE DESIGN WITH SLOPES AS INDICATED. STRUCTURE TO RESIST SNOW AND WIND LOADS PER MASSACHUSETTS STATE BUILDING CODE 780 CMR 10TH EDITION AND ASCE 7.",
    layoutPt: `O TELHADO DEVE SER ESTILO GABLE. A ESTRUTURA DEVE RESISTIR A CARGAS DE VENTO E NEVE SEGUNDO 780 CMR 10ª EDIÇÃO E ASCE 7.`,
    why: "Inspector tip: Gable ends create a flat vertical surface exposed to wind uplift. Gable-end wall bracing per 780 CMR R602.10.6 is required.",
    whyPt: `Dica do Fiscal: O travamento da parede Gable per 780 CMR R602.10.6 é obrigatório e muito esquecido.`,
    imageTip: `Gable roof framing system showing ridge board, common rafters, collar ties, and gable end with hurricane tie connections.`
  },
  {
    id: 2, project: "new_con", system: "roof_types", status: "code_compliant",
    tags: ["roof", "framing", "hip", "wind", "single-family"],
    title: `Hip Roof — Four-Slope System`, titlePt: `Telhado Hip — Sistema de Quatro Águas`,
    pt: `Todas as quatro faces inclinadas, sem gable aberto. Mais resistente ao vento que o Gable.`,
    cad: `HIP ROOF SYSTEM: 4 SLOPED FACES, NO EXPOSED GABLE WALL. PER ARCH. PLANS AND ASCE 7.`,
    cadPt: `TELHADO HIP (4 ÁGUAS), SEM EMPENA EXPOSTA. CONFORME PROJETO E ASCE 7.`,
    layout: "ROOF SYSTEM SHALL BE A HIP DESIGN WITH FOUR SLOPED FACES. HIP ROOFS PROVIDE SUPERIOR UPLIFT RESISTANCE. ALL RAFTER-TO-PLATE CONNECTIONS SHALL HAVE APPROVED HURRICANE TIES PER 780 CMR R802.11.",
    layoutPt: `TELHADO COM DESIGN HIP DE 4 FACES INCLINADAS. OFERECE SUPERIOR RESISTÊNCIA A VENTOS. TODA CONEXÃO DE CAIBRO EXIGE FIXADOR METÁLICO SEGUNDO 780 CMR R802.11.`,
    why: "Inspector tip: Hip roofs are the most wind-resistant residential roof. Hurricane ties are required at every rafter and inspectors count them.",
    whyPt: `Dica do Fiscal: Telhados Hip são os mais resistentes ao vento. O fiscal contará fisicamente cada hurricane tie (clipe) em cada caibro.`,
    imageTip: `Exploded view of hip roof framing system. Label hip rafters, jack rafters, ridge board, and hip ridgeline showing wind pressure distribution.`
  },
  {
    id: 51, project: "new_con", system: "thermal", status: "code_compliant",
    tags: ["insulation", "attic", "thermal", "energy", "r-60", "single-family", "addition"],
    title: `Attic Insulation — Minimum R-60 (10th Ed)`, titlePt: `Isolação de Sótão — Mínimo R-60 (10ª Ed)`,
    pt: `Isolamento de sótão: MÍNIMO R-60. A 10ª Edição aumentou de R-49.`,
    cad: "ATTIC INSULATION: MIN. R-60 BLOWN-IN OR BATT. IECC 2021 TABLE R402.1.3.",
    cadPt: `ISOLAMENTO SÓTÃO: MÍN. R-60 (SOPRADO OU MANTA). IECC 2021.`,
    layout: "ROOF/CEILING ASSEMBLIES: MIN. R-60 PER IECC 2021 TABLE R402.1.3 FOR CLIMATE ZONE 5A. MA 10TH EDITION (EFF. OCT 2024) RAISED MINIMUM FROM R-49 TO R-60. CO WILL NOT ISSUE BELOW THIS VALUE.",
    layoutPt: `CONJUNTOS TETO/TELHADO: MÍNIMO R-60. A 10ª EDIÇÃO AUMENTOU DE R-49 PARA R-60 EM MA. O ALVARÁ FINAL (CO) SERÁ NEGADO SE INFERIOR.`,
    why: "Inspector tip: Any drawings showing R-49 were drafted under the 9th Edition. This single number will hold up a CO.",
    whyPt: `Dica do Fiscal: Plantas mostrando R-49 são da lei antiga. Isso barrará o seu Certificado de Ocupação.`,
    imageTip: "Attic ceiling joist insulated with R-60 blown-in cellulose layers (~20 inches deep)."
  },
  {
    id: 71, project: "basement", system: "fire", status: "code_compliant",
    tags: ["egress", "basement", "window", "life-safety", "remodel"],
    title: `Egress Window — Finished Basement`, titlePt: `Janela Egress — Porão com Quarto`,
    pt: `Quarto no subsolo: janela de escape obrigatória. Mínimo 5.0 sq ft ao nível do terreno. Peitoril máximo 44" do piso ACABADO.`,
    cad: "BASEMENT EGRESS: MIN. 5.0 SQ FT NET CLEAR (AT GRADE). 24\"H x 20\"W MIN. SILL MAX 44\" AFF.",
    cadPt: `EGRESS PORÃO: MÍN. 5.0 SQ FT. ALTURA 24", LARGURA 20". PEITORIL MÁX 44" PISO ACABADO.`,
    layout: `SLEEPING ROOMS IN FINISHED BASEMENTS SHALL HAVE EMERGENCY ESCAPE OPENINGS PER 780 CMR R310. NET CLEAR: MIN. 5.0 SQ FT AT GRADE, 5.7 SQ FT ABOVE GRADE. MIN. 24"H x 20"W. MAX SILL HEIGHT 44" AFF. WINDOW WELLS DEEPER THAN 44" REQUIRE LADDER.`,
    layoutPt: `QUARTOS EM PORÕES EXIGEM JANELA DE FUGA SEGUNDO 780 CMR R310. VÃO LIVRE DE 5.0 SQ FT (AO NÍVEL DA TERRA). PEITORIL NÃO MAIS QUE 44 POLEGADAS ACIMA DO PISO PRONTO. POÇOS (WELLS) FUNDOS EXIGEM ESCADA.`,
    why: `Inspector tip: Sill height is measured from FINISH floor, not subfloor. Net clear opening is measured after window is open — not rough opening.`,
    whyPt: `Dica do Fiscal: A altura do peitoril é pelo piso ACABADO. E a dimensão do vão é com a janela já instalada e aberta.`,
    imageTip: `Finished basement egress cross section showing max 44 inch sill height from finish flooring, clear open window and well ladder.`
  },
  {
    id: 80, project: "addition", system: "fire", status: "code_compliant",
    tags: ["multi-family", "fire-separation", "party-wall", "townhouse"],
    title: `Multi-Family Fire Separation — 2-Hour Wall`, titlePt: `Separação de Incêndio Multi-Family — Parede de 2 Horas`,
    pt: `Townhouses e projetos multi-family exigem separação corta-fogo de 2 horas entre as unidades residenciais.`,
    cad: "PARTY WALL: 2-HR FIRE-RESISTANCE RATED ASSEMBLY PER 780 CMR 10th ED. UL DESIGN U301.",
    cadPt: `PAREDE DIVISÓRIA: CONJUNTO CORTA-FOGO DE 2 HORAS (780 CMR 10ª ED). DESIGN UL U301.`,
    layout: "TOWNHOUSE / MULTI-FAMILY SEPARATION WALLS SHALL BE CONSTRUCTED AS CONTINUOUS 2-HOUR FIRE-RESISTANCE-RATED ASSEMBLIES FROM FOUNDATION TO ROOF DECK. PENETRATIONS MUST BE FIRESTOPPED WITH APPROVED INTUMESCENT CAULK.",
    layoutPt: `PAREDES DE SEPARAÇÃO MULTI-FAMILY DEVEM SER CONSTRUÍDAS COMO CONJUNTOS CONTÍNUOS DE RESISTÊNCIA A INCÊNDIO DE 2 HORAS, DA FUNDAÇÃO ATÉ O TELHADO. PENETRAÇÕES DEVEM SER SELADAS COM MASSA INTUMESCENTE APROVADA.`,
    why: `Inspector tip: Missing firestopping around pipes/wires in the party wall is the #1 reason multi-family framing fails inspection. Don't leave gaps.`,
    whyPt: `Dica do Fiscal: A falta de selante corta-fogo ao redor de tubos na parede divisória é a principal causa de reprovação em edifícios multifamiliares.`,
    imageTip: "Cross-section of a 2-hour fire-rated party wall (double stud, double gypsum) with firestopping caulk around pipe penetration."
  },
  {
    id: 81, project: "addition", system: "mep", status: "lessons_learned",
    tags: ["multi-family", "sound-transmission", "acoustics", "stc"],
    title: `Multi-Family Acoustics — STC 50 Requirement`, titlePt: `Acústica Multi-Family — Exigência STC 50`,
    pt: `O código 780 CMR exige classe de transmissão de som (STC) mínima de 50 para paredes e pisos que separam unidades residenciais.`,
    cad: "ACOUSTIC SEPARATION: MIN. STC 50 FOR WALLS/FLOORS BETWEEN DWELLING UNITS (STC 45 IF FIELD TESTED).",
    cadPt: `SEPARAÇÃO ACÚSTICA: MÍN. STC 50 PARA PAREDES/PISOS ENTRE UNIDADES HABITACIONAIS.`,
    layout: "WALL AND FLOOR-CEILING ASSEMBLIES SEPARATING DWELLING UNITS IN MULTI-FAMILY STRUCTURES SHALL PROVIDE AIRBORNE SOUND TRANSMISSION CLASS (STC) RATING OF NOT LESS THAN 50 PER 780 CMR 1206.2.",
    layoutPt: `CONJUNTOS DE PAREDE E PISO-TETO SEPARANDO UNIDADES EM MULTIFAMILIARES DEVEM PROVER ISOLAMENTO ACÚSTICO (STC) NÃO INFERIOR A 50 (780 CMR 1206.2).`,
    why: "Inspector tip: Using resilient channels (RC clips) incorrectly — like screwing drywall directly into the stud through the channel — completely voids the acoustic rating.",
    whyPt: `Dica do Fiscal: Parafusar o drywall diretamente no perfil metálico (passando pelo RC clip) destrói completamente o isolamento acústico.`,
    imageTip: `Sound transmission wall detail showing staggered studs, acoustic batt insulation, and resilient channels.`
  },
  {
    id: 82, project: "garage", system: "fire", status: "code_compliant",
    tags: ["garage", "fire-separation", "drywall", "single-family"],
    title: `Garage Fire Separation — 5/8" Type X`, titlePt: `Separação de Incêndio na Garagem — 5/8" Type X`,
    pt: `Garagens anexadas à casa exigem drywall 5/8" Type X no teto (se houver ambiente habitável acima) e 1/2" nas paredes contíguas.`,
    cad: "GARAGE SEPARATION: 5/8\" TYPE X GYPSUM AT CEILING BELOW HABITABLE SPACE. 1/2\" GYPSUM AT COMMON WALLS. 780 CMR R302.6.",
    cadPt: `SEPARAÇÃO GARAGEM: DRYWALL 5/8" TYPE X NO TETO ABAIXO DE ÁREA HABITÁVEL. 1/2" NAS PAREDES COMUNS.`,
    layout: "GARAGE SHALL BE SEPARATED FROM THE RESIDENCE AND ITS ATTIC AREA BY NOT LESS THAN 1/2-INCH GYPSUM BOARD APPLIED TO THE GARAGE SIDE. CEILINGS BENEATH HABITABLE ROOMS SHALL BE SEPARATED BY NOT LESS THAN 5/8-INCH TYPE X GYPSUM BOARD PER 780 CMR R302.6.",
    layoutPt: `A GARAGEM DEVE SER SEPARADA DA RESIDÊNCIA POR PLACAS DE GESSO DE NO MÍNIMO 1/2 POLEGADA. TETOS ABAIXO DE QUARTOS HABITÁVEIS EXIGEM GESSO 5/8 POLEGADA TIPO X.`,
    why: "Inspector tip: Mudding and taping the joints in the garage fire separation wall is required to maintain the fire rating. It cannot just be screwed up raw.",
    whyPt: `Dica do Fiscal: O acabamento com fita e massa (mud & tape) nas juntas do drywall da garagem é obrigatório para selar a passagem de fumaça.`,
    imageTip: `Cross section of attached garage. Highlights 5/8 Type X on ceiling below bedroom, and 1/2 inch on shared wall.`
  },
  {
    id: 83, project: "garage", system: "foundation", status: "code_compliant",
    tags: ["garage", "slab", "slope", "drainage"],
    title: `Garage Slab Sloping — Liquid Drainage`, titlePt: "Caimento de Laje de Garagem — Drenagem",
    pt: `O piso da garagem deve ter inclinação para a porta principal para escoamento de líquidos inflamáveis/água.`,
    cad: "GARAGE FLOOR: SLOPE TOWARD VEHICLE DOOR OR DRAIN. NON-COMBUSTIBLE MATERIAL. 780 CMR R309.1.",
    cadPt: `PISO DA GARAGEM: INCLINAÇÃO PARA A PORTA DO VEÍCULO. MATERIAL INCOMBUSTÍVEL.`,
    layout: "GARAGE FLOOR SURFACES SHALL BE OF APPROVED NONCOMBUSTIBLE MATERIAL. THE AREA OF FLOOR USED FOR PARKING OF AUTOMOBILES OR OTHER VEHICLES SHALL BE SLOPED TO FACILITATE THE MOVEMENT OF LIQUIDS TO A DRAIN OR TOWARD THE MAIN VEHICLE ENTRY DOOR PER 780 CMR R309.1.",
    layoutPt: `O PISO DA GARAGEM DEVE SER DE MATERIAL INCOMBUSTÍVEL. A ÁREA DE ESTACIONAMENTO DEVE TER CAIMENTO PARA FACILITAR O ESCOAMENTO DE LÍQUIDOS PARA A RUA OU RALO.`,
    why: "Inspector tip: A perfectly level garage slab will fail inspection because melting snow and oil will pool inside the structure.",
    whyPt: `Dica do Fiscal: Uma laje de garagem perfeitamente nivelada será reprovada. O caimento é obrigatório para evitar poças de óleo/neve derretida.`,
    imageTip: "Section of garage slab showing 1/8 inch per foot slope towards the main overhead door."
  },
  {
    id: 84, project: "dormer", system: "framing", status: "code_compliant",
    tags: ["dormer", "attic", "headroom", "1/2-story", "half-story"],
    title: `Habitable Attic Headroom — 7'0" Minimum`, titlePt: `Pé-Direito em Sótão Habitável — Mínimo de 7'0"`,
    pt: `Para um sótão (meio andar) ser habitável, pelo menos 50% da área do piso deve ter um pé-direito mínimo de 7 pés (2.13m).`,
    cad: `ATTIC HEADROOM: MIN. 7'-0" CEILING HEIGHT FOR AT LEAST 50% OF REQUIRED FLOOR AREA. 780 CMR R305.1.`,
    cadPt: `PÉ DIREITO SÓTÃO: MÍN. 7'-0" EM PELO MENOS 50% DA ÁREA DO PISO EXIGIDA. 780 CMR R305.1.`,
    layout: "HABITABLE ROOMS IN ATTICS OR HALF-STORIES SHALL HAVE A CEILING HEIGHT OF NOT LESS THAN 7 FEET FOR NOT LESS THAN 50 PERCENT OF THE REQUIRED FLOOR AREA. PORTIONS OF THE ROOM WITH CEILING HEIGHTS LESS THAN 5 FEET SHALL NOT BE INCLUDED IN THE FLOOR AREA CALCULATION.",
    layoutPt: `QUARTOS HABITÁVEIS EM SÓTÃOS (MEIO-ANDAR) DEVEM TER PÉ-DIREITO DE PELO MENOS 7 PÉS EM 50% DA ÁREA. ÁREAS COM MENOS DE 5 PÉS NÃO CONTAM NA ÁREA ÚTIL.`,
    why: `Inspector tip: This is the #1 reason attic conversions are rejected. If the 7-foot ceiling area is too small, it's not a legal bedroom.`,
    whyPt: `Dica do Fiscal: Esse é o principal motivo para a reprovação de conversões de sótão. Se a área com 7 pés não for metade do quarto, ele não é um quarto legal.`,
    imageTip: "Cross section of a dormer attic showing 7-foot height at the center and 5-foot height at the kneewalls."
  },
  {
    id: 85, project: "deck_open", system: "framing", status: "code_compliant",
    tags: ["deck", "guardrail", "stairs", "safety"],
    title: `Deck Guardrails — Minimum 36" Height`, titlePt: `Guarda-Corpos de Deck — Altura Mínima 36"`,
    pt: "Decks com mais de 30 polegadas do solo exigem guarda-corpo de pelo menos 36\" (residenciais) ou 42\" (comerciais).",
    cad: "DECK GUARDRAIL: MIN. 36\" HEIGHT. BALUSTER SPACING MAX 4\" CLEAR. 780 CMR R312.",
    cadPt: `GUARDA-CORPO DECK: ALTURA MÍN. 36". ESPAÇAMENTO BALAÚSTRE MÁX 4".`,
    layout: `PORCHES, BALCONIES OR RAISED FLOOR SURFACES LOCATED MORE THAN 30 INCHES ABOVE THE FLOOR OR GRADE BELOW SHALL HAVE GUARDS NOT LESS THAN 36 INCHES IN HEIGHT. REQUIRED GUARDS SHALL HAVE INTERMEDIATE RAILS OR BALUSTERS SUCH THAT A 4-INCH SPHERE CANNOT PASS THROUGH.`,
    layoutPt: `DECKS E VARANDAS A MAIS DE 30 POLEGADAS DO CHÃO EXIGEM GUARDA-CORPO COM NO MÍNIMO 36 POLEGADAS DE ALTURA. A DISTÂNCIA ENTRE AS BARRAS (BALAÚSTRES) NÃO PODE DEIXAR PASSAR UMA ESFERA DE 4 POLEGADAS.`,
    why: `Inspector tip: 36 inches is residential (IRC/780 CMR). Commercial/Multi-family (IBC) requires 42 inches. Don't mix them up.`,
    whyPt: `Dica do Fiscal: O limite do espaçamento (4 polegadas) é rigorosamente testado pelo inspetor usando uma bola física.`,
    imageTip: "Detailed elevation of deck guardrail. Shows 36 inch total height and 4 inch maximum gap between vertical balusters."
  },
  {
    id: 86, project: "remodel", system: "framing", status: "lessons_learned",
    tags: ["remodel", "framing", "notching", "boring"],
    title: `Notching & Boring — Load-Bearing Studs`, titlePt: "Furos e Entalhes — Vigas de Suporte",
    pt: `Em reformas, furos em studs de paredes estruturais não podem exceder 40% da profundidade. Entalhes não podem exceder 25%.`,
    cad: "STUD NOTCHING: MAX 25% DEPTH IN BEARING WALLS. BORING MAX 40%. 780 CMR R602.6.",
    cadPt: `CORTES EM STUDS: MÁX 25% EM PAREDES ESTRUTURAIS. FUROS MÁX 40%.`,
    layout: `IN BEARING WALLS, ANY WOOD STUD MAY BE CUT OR NOTCHED TO A DEPTH NOT EXCEEDING 25 PERCENT OF ITS WIDTH. HOLES BORED SHALL NOT EXCEED 40 PERCENT OF THE STUD WIDTH AND SHALL NOT BE CLOSER THAN 5/8 INCH TO THE EDGE.`,
    layoutPt: `EM PAREDES DE SUPORTE, NENHUMA VIGA PODE TER UM ENTALHE MAIOR QUE 25% DE SUA LARGURA. FUROS NÃO PODEM EXCEDER 40% DA LARGURA E DEVEM FICAR A PELO MENOS 5/8 DE POLEGADA DA BORDA.`,
    why: `Inspector tip: Plumbers and electricians frequently over-notch studs in remodels, requiring expensive structural repairs before insulation.`,
    whyPt: `Dica do Fiscal: Encanadores frequentemente furam mais do que 40% do stud para passar tubos de PVC grossos, arruinando a parede estrutural.`,
    imageTip: "Diagram of a 2x4 stud showing maximum allowed boring hole (1.4 inches) and notch (0.875 inches)."
  },
  {
    id: 87, project: "remodel", system: "fire", status: "code_compliant",
    tags: ["remodel", "smoke-detectors", "fire", "retrofitting"],
    title: `Smoke Detector Retrofit — Permit Trigger`, titlePt: `Atualização de Detectores — Gatilho de Alvará`,
    pt: `Reformas acima de um certo valor em MA exigem que toda a casa seja atualizada com detectores de fumaça interligados.`,
    cad: "SMOKE RETROFIT: ALL REMODELS TRIGGER HARDWIRED/INTERCONNECTED ALARMS PER 780 CMR.",
    cadPt: `ATUALIZAÇÃO DE FUMAÇA: REFORMAS EXIGEM ALARMES INTERLIGADOS/CABEADOS.`,
    layout: "WHEN ALTERATIONS, REPAIRS OR ADDITIONS REQUIRING A PERMIT OCCUR, THE INDIVIDUAL DWELLING UNIT SHALL BE EQUIPPED WITH SMOKE ALARMS LOCATED AS REQUIRED FOR NEW DWELLINGS (INTERCONNECTED AND HARDWIRED WHERE FEASIBLE).",
    layoutPt: `QUANDO OCORREM REFORMAS, REPAROS OU ADIÇÕES QUE EXIGEM ALVARÁ, A RESIDÊNCIA INTEIRA DEVE SER EQUIPADA COM ALARMES DE FUMAÇA CONFORME AS REGRAS PARA CASAS NOVAS.`,
    why: "Inspector tip: Doing a $50k kitchen remodel? The inspector will demand the bedrooms upstairs get hardwired smoke detectors too.",
    whyPt: `Dica do Fiscal: Se você reformar a cozinha, o fiscal vai exigir que os quartos do andar de cima recebam detectores de fumaça interligados. Inclua no orçamento.`,
    imageTip: "Floor plan showing existing rooms receiving new hardwired interconnected smoke alarms due to an addition."
  },
  {
    id: 88, project: "porch_enc", system: "thermal", status: "lessons_learned",
    tags: ["porch", "sunroom", "thermal", "heating"],
    title: `Enclosed Porches — Heating & Insulation`, titlePt: `Varandas Fechadas — Aquecimento e Isolação`,
    pt: `Se uma varanda for fechada (sunroom) e aquecida, ela passa a fazer parte do envelope térmico e exige isolamento completo.`,
    cad: `SUNROOM/ENCLOSED PORCH: IF CONDITIONED, FULL COMPLIANCE WITH IECC 2021 REQUIRED.`,
    cadPt: `VARANDA FECHADA: SE AQUECIDA, EXIGE CONFORMIDADE TOTAL COM IECC 2021.`,
    layout: "ENCLOSED PORCHES OR SUNROOMS THAT ARE THERMALLY ISOLATED FROM THE MAIN HOUSE (UNCONDITIONED) ARE EXEMPT FROM ENERGY CODE. IF CONDITIONED (HEATED/COOLED), THE STRUCTURE MUST COMPLY FULLY WITH INSULATION AND GLAZING REQUIREMENTS OF THE MA STRETCH CODE.",
    layoutPt: `VARANDAS FECHADAS QUE SÃO TERMICAMENTE ISOLADAS DA CASA (SEM AQUECIMENTO) SÃO ISENTAS. SE AQUECIDAS, DEVEM CUMPRIR INTEGRALMENTE AS REGRAS DE ISOLAMENTO (PAREDES R-20, SÓTÃO R-60).`,
    why: `Inspector tip: Don't put a mini-split in a 3-season porch unless you plan to rip the walls open and insulate them to R-20.`,
    whyPt: `Dica do Fiscal: Não instale ar condicionado/aquecimento em uma varanda fechada a menos que as paredes tenham isolamento R-20.`,
    imageTip: "Thermal envelope diagram. Red line bounds the main house; a green line includes the porch only if it is conditioned."
  },
  {
    id: 89, project: "new_con", system: "framing", status: "code_compliant",
    tags: ["stairs", "framing", "rise", "run", "single-family"],
    title: `Stair Geometry — 7-3/4" Rise, 10" Run`, titlePt: "Geometria de Escadas — Degrau 7-3/4\" x 10\"",
    pt: `As escadas residenciais devem ter espelho máximo de 7-3/4" e piso mínimo de 10". A variação entre o maior e menor não pode exceder 3/8".`,
    cad: `STAIRS: MAX RISE 7-3/4", MIN RUN 10". MAX TOLERANCE 3/8". 780 CMR R311.7.`,
    cadPt: `ESCADAS: ESPELHO MÁX 7-3/4", PISO MÍN 10". TOLERÂNCIA MÁX 3/8".`,
    layout: "STAIRWAYS SHALL HAVE A MAXIMUM RISER HEIGHT OF 7-3/4 INCHES AND A MINIMUM TREAD DEPTH OF 10 INCHES. THE GREATEST RISER HEIGHT WITHIN ANY FLIGHT OF STAIRS SHALL NOT EXCEED THE SMALLEST BY MORE THAN 3/8 INCH.",
    layoutPt: `AS ESCADAS TERÃO ALTURA MÁXIMA DO ESPELHO DE 7-3/4 POLEGADAS E PROFUNDIDADE MÍNIMA DO PISO DE 10 POLEGADAS. A VARIAÇÃO MÁXIMA DE ALTURA ENTRE QUALQUER DEGRAU DO LANCE É DE 3/8 DE POLEGADA.`,
    why: `Inspector tip: Stair variance is the strictest framing rule. If one step is 7" and another is 7-1/2", you must rebuild the entire stringer.`,
    whyPt: `Dica do Fiscal: Se a altura de um degrau der diferença maior que 3/8" para o outro, você terá que refazer toda a escada. O fiscal mede todos.`,
    imageTip: "Stair stringer detail showing 7 3/4 inch max riser and 10 inch min tread."
  }
];

// Vector SVG Technical Diagrams for each note
function TechnicalDiagram({ id }) {
  if (id === 1) { // Gable Roof
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <g stroke="#2d3748" strokeWidth="2" fill="none">
          <line x1="200" y1="40" x2="350" y2="180" />
          <line x1="200" y1="40" x2="50" y2="180" />
          <line x1="50" y1="180" x2="350" y2="180" />
          <line x1="120" y1="110" x2="280" y2="110" strokeDasharray="4" />
          <line x1="200" y1="40" x2="200" y2="180" stroke="#718096" strokeWidth="1" strokeDasharray="2" />
        </g>
        <circle cx="200" cy="40" r="4" fill="#3b82f6" />
        <circle cx="50" cy="180" r="5" fill="#3b82f6" />
        <circle cx="350" cy="180" r="5" fill="#3b82f6" />
        <text x="200" y="30" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#2d3748">Ridge Board</text>
        <text x="280" y="95" fontFamily="sans-serif" fontSize="9" fill="#718096">Collar Tie</text>
        <text x="320" y="150" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#3b82f6">Common Rafter</text>
        <text x="200" y="210" fontFamily="sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#3b82f6">HURRICANE TIES REQUIRED AT WALL PLATES</text>
        <text x="200" y="230" fontFamily="sans-serif" fontSize="9" textAnchor="middle" fill="#718096">Bracing per 780 CMR R602.10.6</text>
      </svg>
    );
  }
  if (id === 3) { // Saltbox Roof
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <g stroke="#2d3748" strokeWidth="2" fill="none">
          <line x1="150" y1="40" x2="50" y2="140" />
          <line x1="150" y1="40" x2="350" y2="200" />
          <line x1="50" y1="140" x2="50" y2="200" />
          <line x1="350" y1="200" x2="350" y2="220" />
          <line x1="50" y1="200" x2="350" y2="200" />
        </g>
        <path d={`M280,180 L345,180`} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3" />
        <text x="310" y="170" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#3b82f6" textAnchor="middle">R-60 Attic Cavity</text>
        <circle cx="350" cy="200" r="4" fill="#ef4444" />
        <text x="350" y="215" fontFamily="sans-serif" fontSize="9" fill="#ef4444" textAnchor="middle">Heel Height</text>
        <text x="90" y="80" fontFamily="sans-serif" fontSize="9" fill="#718096">Short Slope</text>
        <text x="250" y="110" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#3b82f6">Long Slope (Snow Drift Zone)</text>
        <text x="200" y="240" fontFamily="sans-serif" fontSize="9" textAnchor="middle" fill="#718096">New England Colonial Architecture</text>
      </svg>
    );
  }
  if (id === 6) { // Flat Roof
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <rect x="40" y="160" width="320" height="25" fill="#f7fafc" stroke="#2d3748" strokeWidth="2" />
        <line x1="40" y1="160" x2="360" y2="152" stroke="#3b82f6" strokeWidth="3" />
        <circle cx="340" cy="153" r="5" fill="#3b82f6" />
        <circle cx="300" cy="154" r="5" fill="#ef4444" />
        <text x="340" y="135" fontFamily="sans-serif" fontSize="9" fill="#3b82f6" textAnchor="middle">Primary Drain</text>
        <text x="300" y="120" fontFamily="sans-serif" fontSize="9" fill="#ef4444" textAnchor="middle">Overflow Scupper</text>
        <text x="200" y="90" fontFamily="sans-serif" fontSize="10" fill="#2d3748" textAnchor="middle">TPO or EPDM Membrane Layer</text>
        <text x="200" y="195" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#2d3748" textAnchor="middle">Structural Deck (Min. 1/4" : 12 Slope)</text>
        <text x="200" y="235" fontFamily="sans-serif" fontSize="9" textAnchor="middle" fill="#718096">IECC 2021 Table R402.1.3 Compliance</text>
      </svg>
    );
  }
  if (id === 31) { // Deck Footing
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <line x1="20" y1="90" x2="380" y2="90" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 4" />
        <text x="300" y="80" fontFamily="sans-serif" fontSize="9" fill="#22c55e">Finished Grade Line</text>
        <rect x="170" y="30" width="60" height="60" fill="#f7fafc" stroke="#2d3748" strokeWidth="2" />
        <rect x="180" y="90" width="40" height="120" fill="#e2e8f0" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="200" cy="210" r="15" fill="#a855f7" opacity="0.3" />
        <text x="200" y="60" fontFamily="sans-serif" fontSize="10" fill="#2d3748" textAnchor="middle">Wood Deck Post</text>
        <text x="200" y="150" fontFamily="sans-serif" fontSize="10" fill="#3b82f6" textAnchor="middle">Concrete Sonotube</text>
        <line x1="140" y1="90" x2="140" y2="210" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="135" y1="90" x2="145" y2="90" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="135" y1="210" x2="145" y2="210" stroke="#ef4444" strokeWidth="1.5" />
        <text x="125" y="155" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ef4444" textAnchor="middle" transform="rotate(-90 125 155)">48" Frost Depth</text>
        <text x="200" y="240" fontFamily="sans-serif" fontSize="9" textAnchor="middle" fill="#718096">MA 780 CMR Frost Protection Limit</text>
      </svg>
    );
  }
  if (id === 40) { // Ledger Connection
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <rect x="70" y="30" width="80" height="160" fill="#f7fafc" stroke="#2d3748" strokeWidth="2" />
        <rect x="150" y="50" width="30" height="120" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <rect x="180" y="70" width="150" height="30" fill="#f7fafc" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="110" y1="85" x2="210" y2="85" stroke="#ef4444" strokeWidth="3" />
        <circle cx="210" cy="85" r="4" fill="#ef4444" />
        <text x="110" y="210" fontFamily="sans-serif" fontSize="10" fill="#2d3748" textAnchor="middle">Rim Joist</text>
        <text x="150" y="190" fontFamily="sans-serif" fontSize="9" fill="#3b82f6">Ledger Board</text>
        <text x="260" y="60" fontFamily="sans-serif" fontSize="9" fill="#2d3748">Deck Joists</text>
        <text x="240" y="125" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ef4444">1/2" Lag Screw / Bolt</text>
        <text x="240" y="140" fontFamily="sans-serif" fontSize="9" fill="#ef4444">NAILS STRICTLY PROHIBITED</text>
        <text x="200" y="235" fontFamily="sans-serif" fontSize="9" textAnchor="middle" fill="#718096">Table R507.9.1.3(1) Compliance</text>
      </svg>
    );
  }
  if (id === 51) { // Attic Insulation R-60
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <rect x="40" y="170" width="320" height="15" fill="#e2e8f0" stroke="#2d3748" strokeWidth="1.5" />
        <rect x="60" y="120" width="40" height="50" fill="#f7fafc" stroke="#718096" strokeWidth="1.5" />
        <rect x="180" y="120" width="40" height="50" fill="#f7fafc" stroke="#718096" strokeWidth="1.5" />
        <rect x="300" y="120" width="40" height="50" fill="#f7fafc" stroke="#718096" strokeWidth="1.5" />
        <path d="M40,110 Q80,90 120,110 T200,105 T280,112 T360,108 L360,170 L40,170 Z" fill="#a855f7" opacity="0.15" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3" />
        <text x="200" y="145" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#a855f7" textAnchor="middle">R-60 Blown-in Insulation</text>
        <text x="200" y="70" fontFamily="sans-serif" fontSize="10" fill="#718096" textAnchor="middle">~20 inches continuous depth</text>
        <text x="200" y="210" fontFamily="sans-serif" fontSize="10" fill="#2d3748" textAnchor="middle">Gypsum Ceiling Board</text>
        <text x="200" y="240" fontFamily="sans-serif" fontSize="9" textAnchor="middle" fill="#ef4444">Fails CO if below R-60 (780 CMR 10th Ed)</text>
      </svg>
    );
  }
  if (id === 60) { // Plumbing Code Shield
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <path d="M200,40 L300,70 L300,140 C300,190 200,220 200,220 C200,220 100,190 100,140 L100,70 Z" fill="#eff6ff" stroke="#3b82f6" strokeWidth="3" />
        <text x="200" y="105" fontFamily="sans-serif" fontSize="24" fontWeight="800" fill="#1d4ed8" textAnchor="middle">248 CMR</text>
        <text x="200" y="130" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">MA Plumbing Code</text>
        <text x="200" y="150" fontFamily="sans-serif" fontSize="9" fill="#718096" textAnchor="middle">GOVERNS EXCLUSIVELY</text>
        <g opacity="0.8">
          <text x="200" y="180" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#ef4444" textAnchor="middle">IPC CITED = AUTOMATIC REJECTION</text>
        </g>
      </svg>
    );
  }
  if (id === 71) { // Egress Window
    return (
      <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
        <rect x="140" y="40" width="120" height="140" fill="#eff6ff" stroke="#2d3748" strokeWidth="2.5" />
        <line x1="20" y1="210" x2="380" y2="210" stroke="#718096" strokeWidth="3" />
        <line x1="140" y1="210" x2="140" y2="180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="260" y1="210" x2="260" y2="180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="140" y1="195" x2="260" y2="195" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="200" cy="195" r="3" fill="#3b82f6" />
        <text x="200" y="188" fontFamily="sans-serif" fontSize="9" fill="#3b82f6" textAnchor="middle">5.7 SQ FT Egress Net Clear</text>
        <line x1="110" y1="210" x2="110" y2="180" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="105" y1="210" x2="115" y2="210" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="105" y1="180" x2="115" y2="180" stroke="#ef4444" strokeWidth="1.5" />
        <text x="95" y="200" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#ef4444" textAnchor="middle">Max 44"</text>
        <text x="200" y="225" fontFamily="sans-serif" fontSize="9" fill="#718096" textAnchor="middle">Sill height measured from finished flooring</text>
        <text x="200" y="240" fontFamily="sans-serif" fontSize="8" fill="#718096" textAnchor="middle">Width min: 20`, Height min: 24`</text>
      </svg>
    );
  }
  // Default fallback diagram
  return (
    <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", background: "#ffffff" }}>
      <rect x="40" y="40" width="320" height="170" fill="#f7fafc" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
      <text x="200" y="110" fontFamily="sans-serif" fontSize="12" fill="#3b82f6" textAnchor="middle" fontWeight="bold">Technical Construction Diagram</text>
      <text x="200" y="135" fontFamily="sans-serif" fontSize="10" fill="#718096" textAnchor="middle">{id ? `Note Component Detail #${id}` : "Detail Reference"}</text>
      <text x="200" y="160" fontFamily="sans-serif" fontSize="9" fill="#a855f7" textAnchor="middle">Auto-Generated SVG Precision Vector</text>
    </svg>
  );
}

export default function CodeInspector() {
  const { lang } = useAppContext();
  const { getCollection, seedCollection } = useBuilders();
  const [aProj, setAProj] = useState("new_con");
  const [aSys, setASys] = useState("roof_types");
  const [aFilter, setAFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scanInput, setScanInput] = useState("");

  // Inject Custom Styles for Hover and Inspector Tip
  useEffect(() => {
    const styleId = 'code-inspector-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .copyable-box .copy-btn {
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
        }
        .copyable-box:hover .copy-btn {
          opacity: 1;
          pointer-events: auto;
        }
        .inspector-tip-box {
          background: rgba(45, 10, 10, 0.4) !important;
          border: 1px solid rgba(220, 38, 38, 0.3) !important;
          border-radius: 8px;
          padding: 12px 16px;
        }
        .inspector-tip-title {
          color: #ef4444 !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .inspector-tip-text {
          color: #fca5a5 !important;
          font-size: 13px !important;
          line-height: 1.5;
          margin: 6px 0 0;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);
  const [scanOutput, setScanOutput] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // Simulated AI Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNoteId] = useState(null);
  const [modalPrompt, setModalPrompt] = useState("");
  
  // Custom Diagrams collection state
  const [customDiagrams, setCustomDiagrams] = useState({});

  // Seed context with default data on first mount
  useEffect(() => {
    seedCollection('inspectorNotes', NOTES);
  }, [seedCollection]);

  // Read from context (live data from admin CRUD)
  const contextNotes = getCollection('inspectorNotes');
  const effectiveNotes = contextNotes.length > 0 ? contextNotes : NOTES;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  const copyToClipboard = (id, field, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(`${id}-${field}`);
      showToast(lang === "EN" ? "Copied strictly to clipboard!" : `Copiado estritamente para a área de transferência!`);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // Simple Regex-based compliance engine simulation (Reverted to Local per Request)
  useEffect(() => {
    if (!scanInput.trim()) {
      setScanOutput([]);
      return;
    }

    const runScan = () => {
      const results = [];
      const l = scanInput.toLowerCase();

      // Example checks
      if ((l.includes("r-49") || l.includes("r49")) && l.includes("attic")) {
        results.push({
          cls: "err",
          msg: lang === "EN"
            ? "ERROR — R-49 attic insulation is outdated. MA 10th Ed requires R-60 minimum in Climate Zone 5A."
            : `ERRO — O R-49 é obsoleto para sótão. A 10ª Edição de MA exige R-60 no mínimo na Zona de Clima 5A.`
        });
      }

      if ((l.includes("nail") || l.includes("toenail")) && l.includes("ledger")) {
        results.push({
          cls: "err",
          msg: lang === "EN"
            ? "ERROR — Ledger nailing: Nails are NOT permitted as primary ledger fasteners. Use lag screws per Table R507.9.1.3(1)."
            : `ERRO — Pregagem de ledger: Pregos NÃO são permitidos como fixadores primários. Use parafusos de lag conforme Tabela R507.9.1.3(1).`
        });
      }

      if (l.includes("multi-family") && !l.includes("stc")) {
        results.push({
          cls: "wrn",
          msg: lang === "EN"
            ? "WARNING — Multi-family mentioned but no acoustic STC 50 rating cited. Check 780 CMR 1206.2."
            : `AVISO — Multifamiliar mencionado, mas sem isolamento acústico STC 50. Verifique 780 CMR 1206.2.`
        });
      }

      if (l.includes("sill height") && l.includes("48")) {
        results.push({
          cls: "err",
          msg: lang === "EN"
            ? "ERROR — Basement egress sill height cannot exceed 44 inches. 48 inches is a violation."
            : `ERRO — A altura do peitoril para saída de emergência no porão não pode exceder 44 polegadas. 48 polegadas é uma violação.`
        });
      }

      if (results.length === 0) {
        results.push({
          cls: "ok",
          msg: lang === "EN"
            ? "✓ No compliance issues detected locally. Note appears consistent with MA 780 CMR 10th Ed."
            : "✓ Nenhum problema de conformidade detectado localmente. A nota parece consistente com o 780 CMR de MA 10ª Ed."
        });
      }

      setScanOutput(results);
    };
    
    const debounce = setTimeout(runScan, 300);
    return () => clearTimeout(debounce);
  }, [scanInput, lang]);

  const activeProject = PROJECTS.find(p => p.id === aProj);
  const activeSystem = SYSTEMS.find(s => s.id === aSys);

  const getFilteredNotes = () => {
    const q = searchQuery.toLowerCase();
    return effectiveNotes.filter(n => {
      const matchProj = n.project === aProj;
      const matchSys = n.system === aSys;
      const matchFilter = aFilter === "all" || n.status === aFilter;
      const matchSearch = !q || 
        n.title.toLowerCase().includes(q) || 
        (n.pt || '').toLowerCase().includes(q) || 
        (n.cad || '').toLowerCase().includes(q) || 
        (n.layout || '').toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)));
      
      // If user typed a query that matches tags, bypass project/system filter to show all tag matches
      if (q && (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))) {
        return matchFilter;
      }
      
      return matchProj && matchSys && matchFilter && matchSearch;
    });
  };

  const filteredNotes = getFilteredNotes();



  const handleGenerateDiagram = () => {
    if (!modalPrompt.trim()) return;
    // Simulate generation by setting true flag for that specific note to render the vector SVG diagram inline
    setCustomDiagrams(prev => ({
      ...prev,
      [modalNoteId]: true
    }));
    setIsModalOpen(false);
    showToast(lang === "EN" ? "Technical SVG Diagram generated!" : `Diagrama Técnico SVG gerado com sucesso!`);
  };

  const handleRemoveDiagram = (noteId) => {
    setCustomDiagrams(prev => {
      const next = { ...prev };
      delete next[noteId];
      return next;
    });
    showToast(lang === "EN" ? "Diagram removed." : "Diagrama removido.");
  };

  const handleExportTxt = () => {
    const text = filteredNotes.map(n => `TITLE: ${n.title}\nCODE: ${n.cad}\nTIP: ${n.why}\n---\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ma-code-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === "EN" ? "Notes exported!" : "Notas exportadas!");
  };

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
              {lang === "EN" ? "CODE INSPECTOR" : `INSPETOR DE CÓDIGO`}
            </span>
          </div>
          <h1 className="page-main-title">
            {lang === "EN" ? (
              <>
                <span className="title-white">MA Code</span> <span className="title-gradient-italic">Inspector v4.0</span>
              </>
            ) : (
              <>
                <span className="title-white">Inspetor de Código de</span> <span className="title-gradient-italic">MA v4.0</span>
              </>
            )}
          </h1>
          <p className="page-subtitle-standard">
            {lang === "EN" 
              ? "Bilingual compliance library, anti-error validation engine and structural details. Aligned strictly with Massachusetts 780 CMR 10th Edition (effective Oct 2024), 248 CMR, NEC 2023 and NFPA 72."
              : `Biblioteca bilíngue de conformidade, motor de validação anti-erro e detalhes estruturais. Alinhado estritamente com a 10ª Edição do 780 CMR (outubro de 2024), 248 CMR, NEC 2023 e NFPA 72.`}
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" }}>
            <div style={{ 
              background: "rgba(34,197,94,0.06)", 
              border: "1.5px solid rgba(34,197,94,0.2)", 
              color: "var(--gn)", 
              padding: "6px 14px", 
              borderRadius: "999px", 
              fontSize: "11px", 
              fontWeight: "700", 
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <span className="live-dot" style={{ width: 6, height: 6, background: "var(--gn)", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px var(--gn)" }}></span>
              {lang === "EN" ? "Live Database" : "Banco Ativo"}
            </div>
            
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                placeholder={lang === "EN" ? "Search guidelines..." : "Buscar diretrizes..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1.5px solid var(--glass-border)", 
                  borderRadius: "999px", 
                  padding: "8px 16px 8px 36px", 
                  fontSize: "13px", 
                  color: "inherit",
                  outline: "none",
                  width: "220px",
                  transition: "all 0.3s ease"
                }} 
              />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
          </div>
        </header>

        {/* Dashboard Layout */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap", maxWidth: "1400px", margin: "0 auto", width: "100%", padding: "0 24px", boxSizing: "border-box", marginBottom: "80px" }} className="animate-float-up">
          
          {/* Left Sidebars */}
          <div style={{ width: "260px", display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0 }}>
            {/* Project Types */}
            <div className="glass-premium" style={{ borderRadius: "16px", padding: "16px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
              <h3 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--mu)", margin: "0 0 12px" }}>
                {lang === "EN" ? "Project Type" : "Tipo de Projeto"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {PROJECTS.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setAProj(p.id)}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "10px", 
                      width: "100%", 
                      padding: "8px 16px", 
                      borderRadius: "999px", 
                      border: "none", 
                      background: aProj === p.id ? "linear-gradient(135deg, #7B1FA2, #E91E63)" : "transparent",
                      color: aProj === p.id ? "#fff" : "inherit", 
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: aProj === p.id ? "700" : "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "15px" }}>{p.icon}</span>
                    {lang === "EN" ? p.label : (p.labelPt || p.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Systems */}
            <div className="glass-premium" style={{ borderRadius: "16px", padding: "16px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
              <h3 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--mu)", margin: "0 0 12px" }}>
                {lang === "EN" ? "Technical Systems" : "Sistemas Construtivos"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {SYSTEMS.map(s => {
                  const count = NOTES.filter(n => n.project === aProj && n.system === s.id).length;
                  return (
                    <button 
                      key={s.id}
                      onClick={() => setASys(s.id)}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        width: "100%", 
                        padding: "8px 16px", 
                        borderRadius: "999px", 
                        border: "none", 
                        borderLeft: aSys === s.id ? "3px solid #7B1FA2" : "3px solid transparent",
                        background: aSys === s.id ? "rgba(123, 31, 162, 0.08)" : "transparent",
                        color: aSys === s.id ? "var(--color-neon-purple)" : "inherit", 
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: aSys === s.id ? "700" : "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>{lang === "EN" ? s.label : (s.labelPt || s.label)}</span>
                      {count > 0 && (
                        <span style={{ 
                          fontSize: "9px", 
                          background: aSys === s.id ? "#7B1FA2" : "rgba(255,255,255,0.06)", 
                          color: "#fff", 
                          padding: "2px 6px", 
                          borderRadius: "10px",
                          fontWeight: "700"
                        }}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Panel Content */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Toolbar Filters */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: "11px", color: "var(--mu)" }}>
                <span>{lang === "EN" ? activeProject?.label : (activeProject?.labelPt || activeProject?.label)}</span>
                <span style={{ margin: "0 6px" }}>›</span>
                <strong style={{ color: "var(--text-color)" }}>{lang === "EN" ? activeSystem?.label : (activeSystem?.labelPt || activeSystem?.label)}</strong>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "all", label: lang === "EN" ? "All Rules" : "Todas as Regras" },
                  { id: "code_compliant", label: lang === "EN" ? "✓ Compliant" : "✓ Conformidade" },
                  { id: "lessons_learned", label: lang === "EN" ? "⚡ Lessons" : "⚡ Dicas/Erros" }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setAFilter(f.id)}
                    style={{ 
                      padding: "6px 16px", 
                      fontSize: "11px", 
                      fontWeight: "700",
                      borderRadius: "999px", 
                      border: "1px solid var(--glass-border)", 
                      background: aFilter === f.id ? "rgba(255,255,255,0.06)" : "transparent",
                      color: aFilter === f.id ? "var(--text-color)" : "var(--mu)", 
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {f.label}
                  </button>
                ))}
                
                <button 
                  onClick={handleExportTxt}
                  style={{ 
                    padding: "6px 16px", 
                    fontSize: "11px", 
                    fontWeight: "700",
                    borderRadius: "999px", 
                    border: "1px solid var(--glass-border)", 
                    background: "rgba(255, 255, 255, 0.03)",
                    color: "var(--text-color)", 
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginLeft: "4px"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  {lang === "EN" ? "EXPORT FILTERED" : "EXPORTAR"}
                </button>
              </div>
            </div>

            {/* Notes Cards Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filteredNotes.length === 0 ? (
                <div className="glass-premium" style={{ borderRadius: "16px", padding: "48px 24px", textAlign: "center", border: "1px dashed var(--glass-border)" }}>
                  <p style={{ margin: 0, fontSize: "14px", opacity: 0.6 }}>
                    {lang === "EN" ? "No technical notes matching this criteria." : "Nenhuma diretriz correspondente encontrada."}
                  </p>
                </div>
              ) : (
                filteredNotes.map(n => {
                  const hasDiagram = !!customDiagrams[n.id];
                  return (
                    <div key={n.id} className="glass-premium" style={{ borderRadius: "20px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      
                      {/* Diagram Area */}
                      {hasDiagram && (
                        <div style={{ width: "100%", background: "#ffffff", padding: "12px", borderBottom: "1px solid var(--glass-border)", display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
                          <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TechnicalDiagram id={n.id} />
                          </div>
                          
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "8px 16px", borderRadius: "12px" }}>
                            <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748b", fontWeight: "700" }}>
                              PRECISION VECTOR SVG DIAGRAM
                            </span>
                            <button 
                              onClick={() => handleRemoveDiagram(n.id)}
                              style={{ 
                                background: "none", 
                                border: "none", 
                                color: "#ef4444", 
                                fontSize: "11px", 
                                fontWeight: "700", 
                                cursor: "pointer" 
                              }}
                            >
                              ✕ {lang === "EN" ? "Remove Diagram" : "Remover Diagrama"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Card Content Row */}
                      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                          <div>
                            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-color)" }}>
                              {lang === "EN" ? n.title : (n.titlePt || n.title)}
                            </h4>
                            {lang === "PT" && n.pt && (
                              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--mu)", margin: "6px 0 0", fontStyle: "italic" }}>
                                {n.pt}
                              </p>
                            )}
                          </div>
                          
                          <span style={{ 
                            fontSize: "10px", 
                            fontWeight: "800", 
                            padding: "5px 12px", 
                            borderRadius: "14px", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em",
                            background: n.status === "lessons_learned" ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)",
                            color: n.status === "lessons_learned" ? "var(--amber)" : "var(--gn)",
                            border: n.status === "lessons_learned" ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(34,197,94,0.2)",
                            whiteSpace: "nowrap"
                          }}>
                            {n.status === "lessons_learned" ? (lang === "EN" ? "⚡ Lessons Learned" : `⚡ Lições Aprendidas`) : (lang === "EN" ? "✓ Code Compliant" : "✓ Conformidade Verificada")}
                          </span>
                        </div>

                        {/* Inspector Tip */}
                        {(n.why || n.whyPt) && (
                          <div className="inspector-tip-box">
                            <span className="inspector-tip-title">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                              {lang === "EN" ? "Inspector Tip" : "Dica do Fiscal"}
                            </span>
                            <p className="inspector-tip-text">
                              {lang === "EN" ? n.why : (n.whyPt || n.why)}
                            </p>
                          </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          {/* Quick CAD note */}
                          <div>
                            <label style={{ fontSize: "10px", fontWeight: "800", color: "var(--mu)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                              {lang === "EN" ? "Quick CAD Note (Short)" : `Nota CAD Rápida (Curta)`}
                            </label>
                            <div className="copyable-box" style={{ 
                              position: "relative",
                              background: "rgba(0,0,0,0.2)", 
                              color: "#60a5fa", 
                              border: "1px solid rgba(96,165,250,0.15)", 
                              borderRadius: "10px", 
                              padding: "12px 60px 12px 14px", 
                              fontFamily: "monospace", 
                              fontSize: "11.5px", 
                              lineHeight: "1.6",
                              textTransform: "uppercase",
                              wordBreak: "break-all",
                              minHeight: "80px"
                            }}>
                              {lang === "EN" ? n.cad : (n.cadPt || n.cad)}
                              <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(n.id, "cad", lang === "EN" ? n.cad : (n.cadPt || n.cad))}
                                style={{ 
                                  position: "absolute", 
                                  right: 8, 
                                  top: "50%", 
                                  transform: "translateY(-50%)", 
                                  background: copiedId === `${n.id}-cad` ? "var(--gn)" : "#5B52E8", 
                                  color: "#fff",
                                  border: "none", 
                                  borderRadius: "6px", 
                                  padding: "6px 12px", 
                                  fontSize: "10px", 
                                  fontWeight: "800",
                                  cursor: "pointer"
                                }}
                              >
                                {copiedId === `${n.id}-cad` ? "✓" : "copy"}
                              </button>
                            </div>
                          </div>

                          {/* Full Layout Sheet Note */}
                          <div>
                            <label style={{ fontSize: "10px", fontWeight: "800", color: "var(--mu)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                              {lang === "EN" ? "Layout / Sheet Note (Full Code)" : "Nota de Prancha (Texto Completo)"}
                            </label>
                            <div className="copyable-box" style={{ 
                              position: "relative",
                              background: "rgba(255,255,255,0.02)", 
                              color: "var(--text-color)", 
                              border: "1px solid var(--glass-border)", 
                              borderRadius: "10px", 
                              padding: "12px 60px 12px 14px", 
                              fontFamily: "monospace", 
                              fontSize: "11.5px", 
                              lineHeight: "1.6",
                              textTransform: "uppercase",
                              wordBreak: "break-word",
                              minHeight: "80px"
                            }}>
                              {lang === "EN" ? n.layout : (n.layoutPt || n.layout)}
                              <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(n.id, "layout", lang === "EN" ? n.layout : (n.layoutPt || n.layout))}
                                style={{ 
                                  position: "absolute", 
                                  right: 8, 
                                  top: "50%", 
                                  transform: "translateY(-50%)", 
                                  background: copiedId === `${n.id}-layout` ? "var(--gn)" : "#5B52E8", 
                                  color: "#fff",
                                  border: "none", 
                                  borderRadius: "6px", 
                                  padding: "6px 12px", 
                                  fontSize: "10px", 
                                  fontWeight: "800",
                                  cursor: "pointer"
                                }}
                              >
                                {copiedId === `${n.id}-layout` ? "✓" : "copy"}
                              </button>
                            </div>
                          </div>

                          {/* Diagram Prompt Note */}
                          <div>
                            <label style={{ fontSize: "10px", fontWeight: "800", color: "var(--mu)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                              {lang === "EN" ? "Diagram Prompt (Copy to Claude/DALL-E)" : "Prompt de Diagrama (Copiar para IA)"}
                            </label>
                            <div className="copyable-box" style={{ 
                              position: "relative",
                              background: "rgba(255,255,255,0.02)", 
                              color: "var(--mu)", 
                              border: "1px solid var(--glass-border)", 
                              borderRadius: "10px", 
                              padding: "12px 60px 12px 14px", 
                              fontFamily: "monospace", 
                              fontSize: "11.5px", 
                              lineHeight: "1.6",
                              wordBreak: "break-word",
                              minHeight: "60px"
                            }}>
                              {lang === "EN" 
                                ? `Show an architectural technical detail drawing illustrating the following code requirement in blue prints style: ${n.layout}`
                                : `Gere um diagrama de detalhe arquitetônico técnico ilustrando a seguinte exigência de código no estilo blue prints: ${n.layoutPt || n.layout}`}
                              <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(n.id, "prompt", lang === "EN" ? `Show an architectural technical detail drawing illustrating the following code requirement in blue prints style: ${n.layout}` : `Gere um diagrama de detalhe arquitetônico técnico ilustrando a seguinte exigência de código no estilo blue prints: ${n.layoutPt || n.layout}`)}
                                style={{ 
                                  position: "absolute", 
                                  right: 8, 
                                  top: "50%", 
                                  transform: "translateY(-50%)", 
                                  background: copiedId === `${n.id}-prompt` ? "var(--gn)" : "#3b82f6", 
                                  color: "#fff",
                                  border: "none", 
                                  borderRadius: "6px", 
                                  padding: "6px 12px", 
                                  fontSize: "10px", 
                                  fontWeight: "800",
                                  cursor: "pointer"
                                }}
                              >
                                {copiedId === `${n.id}-prompt` ? "✓" : "copy"}
                              </button>
                            </div>
                          </div>
                        </div>
                        </div>

                      </div>
                    );
                })
              )}
            </div>

            {/* Compliance Validation Scanner */}
            <div className="glass-premium" style={{ borderRadius: "20px", padding: "24px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", marginTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>
                  {lang === "EN" ? "Inspector Validation Scanner" : `Validador Automático do Inspetor`}
                </h3>
              </div>
              <p style={{ fontSize: "11px", color: "var(--mu)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                {lang === "EN" ? "Anti-error scanner · 780 CMR 10th Ed · 248 CMR · NEC 2023 · NFPA 72" : "Verificador de erros · 780 CMR 10ª Ed · 248 CMR · NEC 2023 · NFPA 72"}
              </p>

              <textarea 
                placeholder={lang === "EN" 
                  ? `Paste any construction note or specification here to validate against Massachusetts building codes in real-time...\nExamples to try:\n- 'All plumbing per IPC Section 305'\n- 'Sill height at 48 inches above finish floor'\n- 'Attic insulation R-49 per 9th Edition'`
                  : `Cole qualquer especificação ou nota de projeto para verificar contra os códigos de Massachusetts em tempo real...\nExemplos para testar:\n- 'All plumbing per IPC Section 305'\n- 'Sill height at 48 inches above finish floor'\n- 'Attic insulation R-49 per 9th Edition'`}
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
                  height: "110px", 
                  resize: "vertical", 
                  lineHeight: "1.6" 
                }} 
              />

              {/* Validation Outputs */}
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
            </div>

          </div>

        </div>

      {/* AI Generate Technical Diagram Simulation Modal */}
      {isModalOpen && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.8)", 
          zIndex: 3000, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: "24px",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)"
        }}>
          <div className="glass-premium" style={{ 
            background: "var(--bg-primary)", 
            border: "1px solid var(--glass-border)", 
            borderRadius: "20px", 
            padding: "24px", 
            width: "100%", 
            maxWidth: "540px", 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>
                {lang === "EN" ? "Generate Technical Detail Diagram" : `Gerar Diagrama de Detalhe Técnico`}
              </h3>
            </div>
            
            <p style={{ fontSize: "12px", color: "var(--mu)", marginTop: "-8px", lineHeight: "1.6" }}>
              {lang === "EN"
                ? "Describe the specific architectural component or connection you want to render in structural axonometric drawing style."
                : `Descreva a conexão ou componente de desenho arquitetônico que deseja renderizar no estilo técnico axonométrico.`}
            </p>

            <div style={{ background: "rgba(123, 31, 162, 0.05)", border: "1px solid rgba(123, 31, 162, 0.15)", borderRadius: "8px", padding: "12px", fontSize: "11px", fontFamily: "monospace", lineHeight: "1.6" }}>
              <strong style={{ color: "var(--color-neon-purple)" }}>MASTER STYLESHEET APPLIED:</strong><br />
              Architectural technical diagram, clean vector section style. Isolated white background. Minimalist colors (gray, technical blue, and highlighted joints).
            </div>

            <textarea 
              value={modalPrompt}
              onChange={e => setModalPrompt(e.target.value)}
              placeholder={`Ex: Axonometric cross section of roof eaves, detailing rafter to double plate connection with steel hurricane ties, R-60 blown in insulation and soffit vent path...`}
              style={{ 
                width: "100%", 
                background: "rgba(0,0,0,0.2)", 
                border: "1px solid var(--glass-border)", 
                borderRadius: "8px", 
                padding: "10px", 
                fontSize: "12px", 
                fontFamily: "monospace", 
                color: "inherit",
                height: "100px",
                outline: "none",
                resize: "vertical" 
              }} 
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ 
                  padding: "8px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid var(--glass-border)", 
                  background: "transparent", 
                  color: "var(--mu)", 
                  fontSize: "12px", 
                  fontWeight: "700",
                  cursor: "pointer" 
                }}
              >
                {lang === "EN" ? "Cancel" : "Cancelar"}
              </button>
              <button 
                onClick={handleGenerateDiagram}
                style={{ 
                  padding: "8px 20px", 
                  borderRadius: "8px", 
                  border: "none", 
                  background: "linear-gradient(135deg, #7B1FA2, #E91E63)", 
                  color: "#fff", 
                  fontSize: "12px", 
                  fontWeight: "700",
                  cursor: "pointer" 
                }}
              >
                {lang === "EN" ? "Generate Diagram" : "Gerar Detalhe"}
              </button>
            </div>
          </div>
        </div>
      )}

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
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
}
