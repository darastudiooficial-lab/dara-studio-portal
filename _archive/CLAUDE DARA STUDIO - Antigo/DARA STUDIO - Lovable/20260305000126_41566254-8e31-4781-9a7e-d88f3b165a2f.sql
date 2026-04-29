
-- Add square_feet to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS square_feet numeric NULL;

-- Add new columns to admin_payments
ALTER TABLE public.admin_payments ADD COLUMN IF NOT EXISTS value_brl numeric NULL;
ALTER TABLE public.admin_payments ADD COLUMN IF NOT EXISTS price_table text NULL;
ALTER TABLE public.admin_payments ADD COLUMN IF NOT EXISTS third_party_costs numeric NULL DEFAULT 0;
ALTER TABLE public.admin_payments ADD COLUMN IF NOT EXISTS payment_notes text NULL;

-- Add new service_type enum values
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'remodeling';
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS '3d_kitchen';
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'architecture';
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'pdf_cad';
