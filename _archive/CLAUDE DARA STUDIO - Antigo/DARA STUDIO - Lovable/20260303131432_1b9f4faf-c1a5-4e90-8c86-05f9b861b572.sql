
-- Add payment_stage to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS payment_stage text NOT NULL DEFAULT 'not_sent';

-- Add country to projects (was referenced but missing)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS country text DEFAULT 'USA';
