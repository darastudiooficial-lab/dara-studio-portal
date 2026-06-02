-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store building code documents and their embeddings
create table if not exists building_codes_docs (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  content_pt text,
  metadata jsonb,
  embedding vector(1536) -- OpenAI text-embedding-3-small generates 1536 dimensions
);

-- Enable RLS on the table
alter table building_codes_docs enable row level security;

-- Create an open read policy for public users
create policy "Building codes are publicly accessible."
  on building_codes_docs for select
  to public
  using (true);

-- Only service role (from edge functions) can insert/update/delete
create policy "Only service role can modify building codes."
  on building_codes_docs for all
  to service_role
  using (true)
  with check (true);

-- Create a function to search for documents
create or replace function match_building_codes(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  content text,
  content_pt text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    building_codes_docs.id,
    building_codes_docs.title,
    building_codes_docs.content,
    building_codes_docs.content_pt,
    building_codes_docs.metadata,
    1 - (building_codes_docs.embedding <=> query_embedding) as similarity
  from building_codes_docs
  where 1 - (building_codes_docs.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
