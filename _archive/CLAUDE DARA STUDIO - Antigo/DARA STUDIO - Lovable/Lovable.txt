
-- 1. Services collection
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

INSERT INTO public.services (name, slug) VALUES
  ('Single-Family Homes', 'single_family'),
  ('Multi-Family Residences', 'multi_family'),
  ('ADU (Accessory Dwelling Units)', 'adu'),
  ('Additions & Extensions', 'additions'),
  ('Remodeling & Renovations', 'remodeling'),
  ('Barndominium Design', 'barndominium'),
  ('Commercial Projects', 'commercial'),
  ('3D Visualization', '3d_visualization'),
  ('Drafting Plan (PDF-CAD)', 'drafting_plan');

-- 2. Project-Services junction (many-to-many)
CREATE TABLE public.project_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  UNIQUE(project_id, service_id)
);
ALTER TABLE public.project_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage project_services" ON public.project_services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. Packages collection
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can view packages" ON public.packages FOR SELECT USING (true);

INSERT INTO public.packages (name, slug, description) VALUES
  ('Basic Plan', 'basic', 'Starter Package'),
  ('Pro Plan', 'pro', 'Full Set'),
  ('3D Visualization', '3d_viz', 'Bring It To Life');

-- 4. Update projects table with new columns
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS package_id uuid REFERENCES public.packages(id),
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS payment_effective_date date,
  ADD COLUMN IF NOT EXISTS preview_delivery_date date,
  ADD COLUMN IF NOT EXISTS preview_sent_date date,
  ADD COLUMN IF NOT EXISTS revision_return_date date,
  ADD COLUMN IF NOT EXISTS final_delivery_date date,
  ADD COLUMN IF NOT EXISTS revision_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS entry_payment_percent numeric NOT NULL DEFAULT 50;

-- Make service_type have a default so new inserts don't require it
ALTER TABLE public.projects ALTER COLUMN service_type SET DEFAULT 'technical_drafting';
