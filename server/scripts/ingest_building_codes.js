import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openAiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openAiKey) {
  console.error('Missing environment variables. Make sure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and OPENAI_API_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Example real building codes for the MVP
const documents = [
  {
    title: '780 CMR 10th Edition - Stairway Width',
    content: '1011.2 Width and capacity. The required capacity of stairways shall be determined as specified in Section 1005.1, but the minimum width shall be not less than 44 inches (1118 mm). Exceptions: Stairways serving an occupant load of less than 50 shall have a width of not less than 36 inches (914 mm).',
    content_pt: 'A largura mínima de escadas não deve ser inferior a 44 polegadas (1118 mm). Exceção: Escadas que atendem a uma ocupação de menos de 50 pessoas podem ter largura não inferior a 36 polegadas (914 mm).',
    metadata: { source: '780 CMR', section: '1011.2', category: 'Egress' }
  },
  {
    title: '248 CMR - Plumbing Vent Terminals',
    content: '10.16(2)(a) Extension above roofs. Extension of vent pipes through a roof shall be terminated not less than 18 inches to 24 inches above the roof.',
    content_pt: 'A extensão de tubos de ventilação através do telhado deve terminar não menos que 18 a 24 polegadas acima do telhado.',
    metadata: { source: '248 CMR', section: '10.16', category: 'Plumbing' }
  },
  {
    title: 'NEC 2023 - Receptacle Outlet Spacing',
    content: '210.52(A)(1) Spacing. Receptacles shall be installed such that no point measured horizontally along the floor line of any wall space is more than 1.8 m (6 ft) from a receptacle outlet.',
    content_pt: 'Tomadas devem ser instaladas de forma que nenhum ponto medido horizontalmente ao longo do rodapé de qualquer espaço de parede esteja a mais de 6 pés (1.8m) de uma tomada.',
    metadata: { source: 'NEC 2023', section: '210.52', category: 'Electrical' }
  },
  {
    title: '780 CMR 10th Edition - Guardrail Height',
    content: '1015.3 Height. Required guards shall be not less than 42 inches (1067 mm) high, measured vertically as follows: 1. From the adjacent walking surfaces. 2. On stairways and stepped aisles, from the line connecting the leading edges of the tread nosings. 3. On ramps and ramped aisles, from the ramp surface at the guard.',
    content_pt: 'Guarda-corpos exigidos não devem ter menos de 42 polegadas (1067 mm) de altura, medidos verticalmente a partir das superfícies de passagem adjacentes.',
    metadata: { source: '780 CMR', section: '1015.3', category: 'Egress' }
  }
];

async function generateEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small'
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.data[0].embedding;
}

async function ingest() {
  console.log(`Starting ingestion of ${documents.length} documents...`);

  for (const doc of documents) {
    try {
      console.log(`Generating embedding for: ${doc.title}...`);
      const embedding = await generateEmbedding(doc.content);

      console.log(`Inserting into Supabase...`);
      const { error } = await supabase.from('building_codes_docs').insert({
        title: doc.title,
        content: doc.content,
        content_pt: doc.content_pt,
        metadata: doc.metadata,
        embedding: embedding
      });

      if (error) {
        console.error(`Failed to insert ${doc.title}:`, error.message);
      } else {
        console.log(`Successfully ingested: ${doc.title}`);
      }
    } catch (e) {
      console.error(`Error processing ${doc.title}:`, e.message);
    }
  }

  console.log('Ingestion complete!');
}

ingest();
