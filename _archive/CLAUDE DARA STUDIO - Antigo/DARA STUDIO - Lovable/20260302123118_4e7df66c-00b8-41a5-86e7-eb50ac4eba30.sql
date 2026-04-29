
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'freelancer');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS for user_roles: users can see own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- 5. Freelancer project assignments
CREATE TABLE public.freelancer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  deadline timestamptz,
  notes text,
  UNIQUE (freelancer_id, project_id)
);
ALTER TABLE public.freelancer_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view own assignments"
  ON public.freelancer_assignments FOR SELECT
  USING (freelancer_id = auth.uid());

-- 6. Freelancer payments
CREATE TABLE public.freelancer_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  due_date date,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.freelancer_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view own payments"
  ON public.freelancer_payments FOR SELECT
  USING (freelancer_id = auth.uid());

CREATE TRIGGER update_freelancer_payments_updated_at
  BEFORE UPDATE ON public.freelancer_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Freelancer contracts
CREATE TABLE public.freelancer_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  file_url text,
  is_signed boolean NOT NULL DEFAULT false,
  signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.freelancer_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view own contracts"
  ON public.freelancer_contracts FOR SELECT
  USING (freelancer_id = auth.uid());

-- 8. Freelancer file deliveries
CREATE TABLE public.freelancer_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.freelancer_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view own deliveries"
  ON public.freelancer_deliveries FOR SELECT
  USING (freelancer_id = auth.uid());

CREATE POLICY "Freelancers can insert own deliveries"
  ON public.freelancer_deliveries FOR INSERT
  WITH CHECK (freelancer_id = auth.uid());

-- 9. Allow freelancers to view projects they're assigned to
CREATE POLICY "Freelancers can view assigned projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.freelancer_assignments fa
      WHERE fa.project_id = projects.id AND fa.freelancer_id = auth.uid()
    )
  );

-- 10. Allow freelancers to view files for assigned projects
CREATE POLICY "Freelancers can view assigned project files"
  ON public.project_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.freelancer_assignments fa
      WHERE fa.project_id = project_files.project_id AND fa.freelancer_id = auth.uid()
    )
  );
