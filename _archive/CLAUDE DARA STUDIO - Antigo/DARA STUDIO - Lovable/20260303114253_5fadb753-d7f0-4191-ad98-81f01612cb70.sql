
-- Companies: add new structured fields
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS owner_name text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS street_name text,
  ADD COLUMN IF NOT EXISTS street_number text,
  ADD COLUMN IF NOT EXISTS unit text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip_code text;

-- Companies: drop notes column
ALTER TABLE public.companies DROP COLUMN IF EXISTS notes;

-- Projects: add structured address fields
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS street_name text,
  ADD COLUMN IF NOT EXISTS street_number text,
  ADD COLUMN IF NOT EXISTS unit text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip_code text;

-- Projects: make name nullable (no longer required)
ALTER TABLE public.projects ALTER COLUMN name DROP NOT NULL;

-- Projects: add generated display_address column
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS display_address text GENERATED ALWAYS AS (
    NULLIF(TRIM(COALESCE(street_number, '') || ' ' || COALESCE(street_name, '') || ', ' || COALESCE(city, '') || ', ' || COALESCE(state, '')), ', , ')
  ) STORED;
