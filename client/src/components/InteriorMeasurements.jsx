import React, { useState } from 'react';

export const SUB_CATEGORIES = {
  'closets': { icon: '🗄️', label: 'Closets', labelPt: 'Closets' },
  'bath_social': { icon: '🚿', label: `Social Bathroom`, labelPt: 'Banheiro Social' },
  'bath_master': { icon: '🛁', label: `Master Bath`, labelPt: 'Banheiro Casal (Master Bath)' },
  'bath_half': { icon: '🚽', label: 'Half-Bath', labelPt: 'Half-Bath (Lavabo)' },
  'circ_checklist': { icon: '↔️', label: `Internal Circulation`, labelPt: `Circulação Interna — Checklist` }
};

export const MEASUREMENTS_CATEGORIES = [
  { id: 'all', label: 'All', labelPt: 'Todos' },
  { id: 'closets', label: 'Closets', labelPt: 'Closets', icon: '🗄️' },
  { id: 'stairs', label: 'Stairs & Halls', labelPt: 'Escadas & Halls' },
  { id: 'bathrooms', label: 'Bathrooms', labelPt: 'Banheiros', icon: '🚿' },
  { id: 'circulation', label: 'Circulation', labelPt: 'Circulação' },
  { id: 'bedrooms', label: 'Bedrooms', labelPt: 'Quartos' },
  { id: 'garage', label: 'Garage & Services', labelPt: 'Garagem & Serviços' },
  { id: 'social', label: 'Social Areas', labelPt: 'Áreas Sociais' },
  { id: 'adu', label: 'ADU — Sq Ft', labelPt: 'ADU — Sq Ft', isOutline: true, icon: '🏠' },
  { id: 'office', label: 'Office', labelPt: 'Escritório', isOutline: true },
  { id: 'gym', label: 'Gym', labelPt: 'Academia', isOutline: true }
];

export const MEASUREMENTS_ITEMS = [
  {
    id: 'closet_coat', category: 'closets', subcategoryId: 'closets',
    title: `Coat Closet`, titlePt: 'Closet / Coat',
    subtitle: 'Entryway — coats and bulky items', subtitlePt: 'Entrada da casa — casacos e volumes',
    min: `2'0" × 3'0"`, med: `2'6" × 4'0"`, large: `3'0" × 5'0"`,
    technicalNote: <>Minimum depth of <strong>24`</strong> for standard hangers. Sliding doors recommended to preserve entryway circulation space. Internal lighting is mandatory in ADA projects.</>,
    technicalNotePt: <>Profundidade mínima de <strong>24`</strong> para cabides. Porta de correr recomendada para preservar o espaço de circulação da entrada. Iluminação interna obrigatória em projetos ADA.</>
  },
  {
    id: 'walkin_casal', category: 'closets', subcategoryId: 'closets',
    title: `Primary Walk-in Closet`, titlePt: 'Walk-in Closet — Casal',
    subtitle: 'Internal circulation hallway', subtitlePt: `Corredor de circulação interno`,
    min: `7'0" × 7'0"`, med: `10'0" × 10'0"`, large: `12'0" × 14'0"`,
    technicalNote: <>Minimum internal aisle of <strong>36`</strong> for comfortable one-person circulation. Starting at <strong>10'×10'</strong>, a central island with drawers fits. Large model: natural lighting recommended.</>,
    technicalNotePt: <>Corredor interno mínimo de <strong>36`</strong> para circulação confortável de uma pessoa. A partir de <strong>10'×10'</strong>, cabe ilha central com gavetas. Modelo grande: iluminação natural recomendada.</>
  },
  {
    id: 'walkin_solteiro', category: 'closets', subcategoryId: 'closets',
    title: `Secondary Walk-in Closet`, titlePt: 'Walk-in Closet — Solteiro',
    subtitle: 'Internal circulation hallway', subtitlePt: `Corredor de circulação interno`,
    min: `5'0" × 5'0"`, med: `7'0" × 8'0"`, large: `9'0" × 10'0"`,
    technicalNote: <>Minimum internal aisle of <strong>30`</strong>. L or U layouts maximize space usage. Bi-fold doors are indicated.</>,
    technicalNotePt: <>Corredor interno mínimo de <strong>30`</strong>. Layout em L ou U maximiza o aproveitamento. Portas bipartidas (bi-fold) indicadas.</>
  },
  {
    id: 'embutido_casal', category: 'closets', subcategoryId: 'closets',
    title: `Primary Reach-in Closet`, titlePt: 'Closet Embutido — Casal',
    subtitle: 'Width × depth', subtitlePt: 'Largura × profundidade',
    min: `6'0" W × 2'0" D`, minPt: `6'0" L × 2'0" P`,
    med: `8'0" W × 2'0" D`, medPt: `8'0" L × 2'0" P`,
    large: `10'0" W × 2'0" D`, largePt: `10'0" L × 2'0" P`,
    technicalNote: <>Standard depth of <strong>24`</strong>. Sliding or bi-fold doors for full access. Upper shelves for out-of-season items.</>,
    technicalNotePt: <>Profundidade padrão de <strong>24`</strong>. Portas de correr ou bi-fold para acesso total. Prateleiras superiores para itens fora de temporada.</>
  },
  {
    id: 'embutido_solteiro', category: 'closets', subcategoryId: 'closets',
    title: `Secondary Reach-in Closet`, titlePt: 'Closet Embutido — Solteiro',
    subtitle: 'Width × depth', subtitlePt: 'Largura × profundidade',
    min: `3'0" W × 2'0" D`, minPt: `3'0" L × 2'0" P`,
    med: `5'0" W × 2'0" D`, medPt: `5'0" L × 2'0" P`,
    large: `6'0" W × 2'0" D`, largePt: `6'0" L × 2'0" P`,
    technicalNote: <>Standard depth of <strong>24"</strong>. Hanging height: 66"–72" for long garments; 40"–44` for double tier.</>,
    technicalNotePt: <>Profundidade padrão de <strong>24`</strong>. Altura de pendura: 66"–72" para roupas longas; 40"–44" para duplo nível.</>
  },
  {
    id: 'bath_social_total', category: 'bathrooms', subcategoryId: 'bath_social',
    title: `Social Bathroom`, titlePt: 'Banheiro Social',
    subtitle: 'Total room area', subtitlePt: `Área total do ambiente`,
    min: `5'0" × 7'0"`, med: `6'0" × 9'0"`, large: `8'0" × 12'0"`,
    technicalNote: `Includes toilet, vanity and, depending on the area, shower stall or bathtub.`,
    technicalNotePt: `Inclui vaso sanitário, pia (vanity) e, conforme a metragem, box para shower ou banheira.`
  },
  {
    id: 'bath_vanity', category: 'bathrooms', subcategoryId: 'bath_social',
    title: 'Vanity', titlePt: 'Vanity',
    subtitle: 'Social Bathroom — width', subtitlePt: 'Banheiro Social — largura',
    min: '18" (1 sink)', minPt: '18" (1 pia)',
    med: '30" (1 sink)', medPt: '30" (1 pia)',
    large: '42" (1 sink)', largePt: '42" (1 pia)',
    technicalNote: <>Standard depth: <strong>21"</strong>. Counter height: 32"–36". Minimum side clearance: 4" from sink edge to wall.</>,
    technicalNotePt: <>Profundidade padrão: <strong>21"</strong>. Altura da bancada: 32"–36". Espaço mínimo lateral: 4" da borda da pia até a parede.</>
  },
  {
    id: 'bath_toilet', category: 'bathrooms', subcategoryId: 'bath_social',
    title: `Toilet — Clearance`, titlePt: `Vaso Sanitário — Espaço`,
    subtitle: <><div style={{marginBottom: '4px'}}>IRC P2705 • IBC 1210 • ADA 604</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>IRC P2705 • IBC 1210 • ADA 604</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '30" W × 60" D', minPt: '30" L × 60" P',
    med: '36" W × 66" D', medPt: '36" L × 66" P',
    large: '42" W × 72" D', largePt: '42" L × 72" P',
    technicalNote: <><strong>IRC P2705.1:</strong> 15` from center to side wall, 21` clear in front. <strong>IBC 1210.3:</strong> 15` from center, 18` between fixtures, 24" in front. <strong>ADA 604:</strong> 18" center→grab bar wall, 60` total width, 56`–66` in front.</>,
    technicalNotePt: <><strong>IRC P2705.1:</strong> 15` do eixo até parede lateral, 21` livre à frente. <strong>IBC 1210.3:</strong> 15` eixo lateral, 18` entre fixtures, 24` à frente. <strong>ADA 604:</strong> 18` eixo→parede de barras, 60` largura total, 56"–66" à frente.</>
  },
  {
    id: 'bath_shower', category: 'bathrooms', subcategoryId: 'bath_social',
    title: `Shower — Clearance`, titlePt: `Shower (Box) — Espaço`,
    subtitle: <><div style={{marginBottom: '4px'}}>IRC P2708 • ADA 608</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>IRC P2708 • ADA 608</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '32" × 32"', med: '36" × 48"', large: '48" × 60"',
    technicalNote: <><strong>IRC P2708.1:</strong> minimum 30"×30". <strong>ADA 608.2:</strong> 36"×36" (roll-in) or 30"×60" (transfer). Real comfort starts at 36"×36". Doorless walk-in: 36` minimum opening.</>,
    technicalNotePt: <><strong>IRC P2708.1:</strong> mínimo 30`×30". <strong>ADA 608.2:</strong> 36"×36" (roll-in) ou 30"×60` (transfer). Conforto real começa em 36`×36". Walk-in sem porta: abertura mínima 36".</>
  },
  {
    id: 'bath_tub', category: 'bathrooms', subcategoryId: 'bath_social',
    title: `Tub — Clearance`, titlePt: `Tub (Banheira) — Espaço`,
    subtitle: 'Social Bathroom', subtitlePt: 'Banheiro Social',
    min: '55" × 27"', med: '60" × 30"', large: '66" × 32"',
    technicalNote: 'American standard. Minimum 6"–12" side clearance for cleaning. Rim height: ~14"–18".',
    technicalNotePt: `Padrão americano. Folga mínima de 6"–12" nas laterais para limpeza. Altura da borda: ~14"–18".`
  },
  {
    id: 'master_total', category: 'bathrooms', subcategoryId: 'bath_master',
    title: `Master Bath`, titlePt: 'Banheiro Casal',
    subtitle: 'Total room area', subtitlePt: `Área total do ambiente`,
    min: `8'0" × 10'0"`, med: `10'0" × 12'0"`, large: `12'0" × 18'0"`,
    technicalNote: 'Ideal space to accommodate separate tub and shower, plus double vanity. Master suite projects require acoustic planning (STC) on walls adjacent to the bedroom.',
    technicalNotePt: `Espaço ideal para abrigar banheira e chuveiro separados (separate tub and shower), além de pia dupla. Projetos master exigem planejamento acústico (STC) nas paredes adjacentes ao quarto.`
  },
  {
    id: 'master_vanity', category: 'bathrooms', subcategoryId: 'bath_master',
    title: 'Vanity', titlePt: 'Vanity',
    subtitle: 'Master Bath — width', subtitlePt: 'Banheiro Casal — largura',
    min: '48" (1 sink)', minPt: '48" (1 pia)',
    med: '60" (2 sinks)', medPt: '60" (2 pias)',
    large: '72"+ (2 sinks)', largePt: '72"+ (2 pias)',
    technicalNote: `60" models with 2 sinks offer limited usable counter space. If space is tight, prefer a 60" vanity with only 1 centered or offset sink.`,
    technicalNotePt: `Modelos de 60" com 2 pias oferecem pouco espaço de bancada útil. Se o espaço for restrito, prefira 60" com apenas 1 pia centralizada ou deslocada.`
  },
  {
    id: 'master_toilet', category: 'bathrooms', subcategoryId: 'bath_master',
    title: `Toilet — Clearance`, titlePt: `Vaso Sanitário — Espaço`,
    subtitle: <><div style={{marginBottom: '4px'}}>IRC P2705 • IBC 1210 • ADA 604</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>IRC P2705 • IBC 1210 • ADA 604</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '36" W × 66" D', minPt: '36" L × 66" P',
    med: '36" W × 72" D', medPt: '36" L × 72" P',
    large: '42" W × 78" D', largePt: '42" L × 78" P',
    technicalNote: 'Enclosed water closet recommended. The door must swing out or guarantee turning space without obstructing the toilet.',
    technicalNotePt: `Compartimento fechado (Water Closet) recomendado. A porta deve abrir para fora ou garantir o espaço de giro sem obstruir o vaso.`
  },
  {
    id: 'master_shower', category: 'bathrooms', subcategoryId: 'bath_master',
    title: `Shower — Clearance`, titlePt: `Shower (Box) — Espaço`,
    subtitle: <><div style={{marginBottom: '4px'}}>IRC P2708 • ADA 608</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>IRC P2708 • ADA 608</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '36" × 36"', med: '48" × 48"', large: '60" × 72"',
    technicalNote: 'A 60"x72" shower enclosure allows for dual shower heads and comfortable installation of a built-in bench.',
    technicalNotePt: `Um box de 60"x72" permite múltiplos chuveiros (dual shower heads) e instalação confortável de banco (bench) interno.`
  },
  {
    id: 'master_tub', category: 'bathrooms', subcategoryId: 'bath_master',
    title: `Tub — Clearance`, titlePt: `Tub (Banheira) — Espaço`,
    subtitle: 'Master Bath', subtitlePt: 'Banheiro Casal',
    min: '60" × 30"', med: '60" × 32"', large: '72" × 36"',
    technicalNote: 'Freestanding tubs require 10" to 15" of clearance around the entire perimeter for easy cleaning and visual impact.',
    technicalNotePt: `Banheiras freestanding (soltas) requerem de 10" a 15" de folga em todo o perímetro para facilidade de limpeza e impacto visual.`
  },
  {
    id: 'half_total', category: 'bathrooms', subcategoryId: 'bath_half',
    title: 'Half-Bath', titlePt: 'Half-Bath',
    subtitle: <><div style={{marginBottom: '4px'}}>Total room area</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>Área total do ambiente</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: `3'0" × 6'0"`, med: `4'0" × 6'0"`, large: `5'0" × 8'0"`,
    technicalNote: <>Minimum by code (IRC P2705 / IBC 1210): 30"×60" — toilet + small sink only. <strong>ADA: minimum 5'0"×8'0"</strong> with 60" turning radius. Outward swinging door recommended in smaller layouts.</>,
    technicalNotePt: <>Mínimo por código (IRC P2705 / IBC 1210): 30"×60" — apenas vaso + pia pequena. <strong>ADA: mínimo 5'0"×8'0"</strong> com turning radius de 60". Porta abrindo para fora recomendada nos modelos menores.</>
  },
  {
    id: 'half_vanity', category: 'bathrooms', subcategoryId: 'bath_half',
    title: `Vanity — Half-Bath`, titlePt: 'Vanity — Half-Bath',
    subtitle: 'Width', subtitlePt: 'Largura',
    min: '18" (pedestal)', med: '24"', large: '32"',
    technicalNote: 'Depth: 18"–21". Pedestal sink acceptable for minimum layouts. Height: 32"–34" standard / 34"–36" ADA comfort height.',
    technicalNotePt: `Profundidade: 18"–21". Pedestal sink válido para modelos mínimos. Altura: 32"–34" standard / 34"–36" ADA comfort height.`
  },
  {
    id: 'half_toilet', category: 'bathrooms', subcategoryId: 'bath_half',
    title: `Toilet — Clearance`, titlePt: 'Vaso — Clearance',
    subtitle: <><div style={{marginBottom: '4px'}}>IRC P2705 • IBC 1210 • ADA 604</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>IRC P2705 • IBC 1210 • ADA 604</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '15" center→wall • 21" front', minPt: '15" eixo→par. • 21" frente',
    med: '15" center→wall • 24" front', medPt: '15" eixo→par. • 24" frente',
    large: '18" center→wall • 30" front', largePt: '18" eixo→par. • 30" frente',
    technicalNote: <><strong>IRC P2705.1:</strong> 15` from center to side wall, 21` clear in front. <strong>IBC 1210.3:</strong> 24" in front. <strong>ADA 604.2:</strong> 18" center→grab bar wall, 60` total width, 56`–66` clear depth.</>,
    technicalNotePt: <><strong>IRC P2705.1:</strong> 15` do eixo até parede lateral, 21` livre à frente. <strong>IBC 1210.3:</strong> 24` à frente. <strong>ADA 604.2:</strong> 18` eixo→parede de barras, 60` largura total, 56"–66" de profundidade livre.</>
  },
  {
    id: 'circ_bed', category: 'circulation', subcategoryId: 'circ_checklist',
    title: `Bed — Surround Clearance`, titlePt: 'Cama — Clearance ao Redor',
    subtitle: <><div style={{marginBottom: '4px'}}>ADA 1002.5.2 • design best practices</div><div><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>ADA 1002.5.2 • boas práticas de design</div><div><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '18" sides • 24" foot', minPt: `18" lados • 24" ao pé`,
    med: '24" sides • 30" foot', medPt: `24" lados • 30" ao pé`,
    large: '36" sides • 36" foot', largePt: `36" lados • 36" ao pé`,
    technicalNote: <><strong>ADA 1002.5.2:</strong> 36" clear on at least one accessible side of the bed. Good practice: <strong>24" on both sides</strong> for comfortable daily use. Foot of bed: 30" for drawer/chest opening. IRC R304 defines minimum room area (70 sq ft) without specifying side clearances.</>,
    technicalNotePt: <><strong>ADA 1002.5.2:</strong> 36" livre em pelo menos um lado acessível da cama. Boa prática: <strong>24` nos dois lados</strong> para uso diário confortável. Ao pé da cama: 30` para abertura de gavetas/baú. IRC R304 define área mínima do quarto (70 sq ft) sem especificar folga lateral.</>
  },
  {
    id: 'circ_vanity', category: 'circulation', subcategoryId: 'circ_checklist',
    title: `Vanity → Wall / Shower / Toilet`, titlePt: 'Vanity → Parede / Shower / Toilet',
    subtitle: <><div style={{marginBottom: '4px'}}>Clear floor space • IRC P2705 • IBC 1210 • ADA 606</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    subtitlePt: <><div style={{marginBottom: '4px'}}>Clear floor space • IRC P2705 • IBC 1210 • ADA 606</div><div><span style={{ border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IRC</span><span style={{ border: '1px solid rgba(156, 124, 58,0.5)', background: 'rgba(156, 124, 58,0.1)', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', marginRight: '6px' }}>IBC</span><span style={{ border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span></div></>,
    min: '21" front (IRC)', minPt: `21" à frente (IRC)`,
    med: '24" front (IBC)', medPt: `24" à frente (IBC)`,
    large: '30"×48" centered (ADA)', largePt: '30"×48" centrado (ADA)',
    technicalNote: <><strong>IRC P2705.1:</strong> 21" clear floor space in front of vanity. <strong>IBC 1210.3:</strong> 24". <strong>ADA 606.2:</strong> 30"×48" clear floor space centered on sink. Vanity side to wall: IRC = 4" min edge. Between vanity and adjacent fixture (toilet/shower): <strong>minimum 18"</strong> between surfaces. ADA: 18` from sink center on accessible side.</>,
    technicalNotePt: <><strong>IRC P2705.1:</strong> 21` de espaço livre à frente do vanity. <strong>IBC 1210.3:</strong> 24". <strong>ADA 606.2:</strong> 30"×48` de clear floor space centralizado na pia. Lateral do vanity à parede: IRC = 4` edge mínimo. Entre vanity e aparelho adjacente (toilet/shower): <strong>mínimo 18`</strong> entre superfícies. ADA: 18` do eixo da pia no lado acessível.</>
  }
];

export default function InteriorMeasurements({ lang }) {
  const [activeCategory, setActiveCategory] = useState('closets');
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleNote = (id) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = MEASUREMENTS_ITEMS.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const groupedItems = Object.values(SUB_CATEGORIES).map(subCat => {
    const subCatId = Object.keys(SUB_CATEGORIES).find(key => SUB_CATEGORIES[key] === subCat);
    return {
      subcategoryId: subCatId,
      ...subCat,
      items: filteredItems.filter(item => item.subcategoryId === subCatId)
    };
  }).filter(group => group.items.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 24px', boxSizing: 'border-box', marginBottom: '80px' }} className="animate-float-up">
      
      {/* Legend & Count Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid var(--glass-border)', 
        padding: '12px 24px', 
        borderRadius: '16px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--mu)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#9c7c3a' }}></div>
            {lang === 'EN' ? 'Minimum (code)' : `Mínimo (código)`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--mu)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d97706' }}></div>
            {lang === 'EN' ? 'Medium / Comfortable' : `Médio / Confortável`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--mu)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></div>
            {lang === 'EN' ? 'Large / Generous' : 'Grande / Generoso'}
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 8px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--mu)' }}>
            <span style={{ border: '1px solid #f59e0b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>IRC</span> {lang === 'EN' ? 'Residential' : 'Residencial'}
            <span style={{ border: '1px solid #9c7c3a', color: '#9c7c3a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>IBC</span> {lang === 'EN' ? 'Commercial' : 'Comercial'}
            <span style={{ border: '1px solid #3b82f6', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADA</span> {lang === 'EN' ? 'Accessibility' : 'Acessibilidade'}
          </div>
        </div>
        <div style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--mu)', opacity: 0.7 }}>
          89 {lang === 'EN' ? 'environments' : 'ambientes'}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--mu)', letterSpacing: '0.1em', marginRight: '8px' }}>
          {lang === 'EN' ? 'FILTER:' : 'FILTRAR:'}
        </span>
        {MEASUREMENTS_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          if (cat.isOutline) {
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isActive ? 'rgba(156, 124, 58,0.1)' : 'transparent',
                  border: isActive ? '1px solid #9c7c3a' : '1px solid var(--glass-border)',
                  color: isActive ? '#9c7c3a' : 'var(--mu)',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {lang === 'EN' ? cat.label : cat.labelPt}
              </button>
            );
          }
          return (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: isActive ? '#1e293b' : 'transparent',
                border: '1px solid var(--glass-border)',
                color: isActive ? '#fff' : 'var(--mu)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {lang === 'EN' ? cat.label : cat.labelPt}
            </button>
          );
        })}
      </div>

      {/* Main Table Panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {groupedItems.map(group => (
          <div key={group.subcategoryId} className="glass-premium" style={{ borderRadius: '24px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', overflow: 'hidden' }}>
            
            {/* Table Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#1e293b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {group.icon}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '300', fontStyle: 'italic', margin: 0, fontFamily: 'serif' }}>
                  {lang === 'EN' ? group.label : group.labelPt}
                </h2>
              </div>
              <div style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--mu)', opacity: 0.7 }}>
                {group.items.length} {lang === 'EN' ? 'items' : 'itens'}
              </div>
            </div>

        {/* Table Data */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: 'var(--mu)', letterSpacing: '0.1em' }}>
                  {lang === 'EN' ? 'ENVIRONMENT / ELEMENT' : 'AMBIENTE / ELEMENTO'}
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: 'var(--mu)', letterSpacing: '0.1em' }}>{lang === 'EN' ? 'MINIMUM' : 'MÍNIMO'}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: 'var(--mu)', letterSpacing: '0.1em' }}>{lang === 'EN' ? 'MEDIUM' : 'MÉDIO'}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: 'var(--mu)', letterSpacing: '0.1em' }}>{lang === 'EN' ? 'LARGE' : 'GRANDE'}</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: idx === group.items.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{lang === 'EN' ? item.title : item.titlePt}</div>
                    <div style={{ fontSize: '13px', color: 'var(--mu)', marginBottom: '12px' }}>{lang === 'EN' ? item.subtitle : item.subtitlePt}</div>
                    {expandedNotes[item.id] ? (
                      <>
                        <button onClick={() => toggleNote(item.id)} style={{ 
                          background: 'transparent', 
                          border: '1px solid var(--glass-border)', 
                          color: 'var(--mu)', 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--mu)', fontSize: '8px', fontWeight: 'bold' }}>✕</span>
                          {lang === 'EN' ? 'Close' : 'Fechar'}
                        </button>
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '12px 16px', 
                          background: 'rgba(217, 119, 6, 0.08)', 
                          borderLeft: '3px solid #d97706',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '12.5px',
                          color: 'var(--mu)',
                          lineHeight: '1.6'
                        }}>
                          {lang === 'EN' ? item.technicalNote : item.technicalNotePt}
                        </div>
                      </>
                    ) : (
                      <button onClick={() => toggleNote(item.id)} style={{ 
                        background: 'transparent', 
                        border: '1px solid var(--glass-border)', 
                        color: 'var(--mu)', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--mu)', fontSize: '9px', fontWeight: 'bold' }}>i</span>
                        {lang === 'EN' ? 'View tech note' : `Ver nota técnica`}
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9c7c3a' }}></div>
                      {lang === 'EN' ? item.min : (item.minPt || item.min)}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }}></div>
                      {lang === 'EN' ? item.med : (item.medPt || item.med)}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                      {lang === 'EN' ? item.large : (item.largePt || item.large)}
                    </div>
                  </td>
                </tr>
              ))}
              {group.items.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--mu)' }}>
                    {lang === 'EN' ? 'Coming soon...' : 'Em breve...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      ))}
    </div>
  </div>
  );
}
