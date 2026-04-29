
-- Extend companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS company_type text DEFAULT 'client';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS country text DEFAULT 'USA';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS notes text;

-- Extend projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS stage text DEFAULT 'briefing';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS delivery_date date;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS total_value numeric DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS internal_notes text;

-- Create admin payments table
CREATE TABLE public.admin_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  installment_type text NOT NULL DEFAULT '100%',
  amount_total numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  stripe_fee_percent numeric DEFAULT 0,
  net_received numeric GENERATED ALWAYS AS (amount_paid - (amount_paid * stripe_fee_percent / 100)) STORED,
  payment_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on admin_payments"
  ON public.admin_payments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create milestones table
CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  sent_date date,
  approved_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on milestones"
  ON public.milestones FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create activity log table
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  log_type text NOT NULL DEFAULT 'internal_note',
  description text NOT NULL,
  log_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on activity_log"
  ON public.activity_log FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin full access policies for existing tables
CREATE POLICY "Admins can do everything on companies"
  ON public.companies FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can do everything on projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for admin_payments updated_at
CREATE TRIGGER update_admin_payments_updated_at
  BEFORE UPDATE ON public.admin_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
