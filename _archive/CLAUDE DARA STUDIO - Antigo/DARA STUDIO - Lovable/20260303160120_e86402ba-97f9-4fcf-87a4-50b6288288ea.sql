
-- Add new columns to freelancer_payments
ALTER TABLE public.freelancer_payments 
  ADD COLUMN IF NOT EXISTS agreed_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_method text;

-- Copy existing amount data to agreed_amount for backwards compatibility
UPDATE public.freelancer_payments SET agreed_amount = amount WHERE agreed_amount = 0 AND amount > 0;

-- Add admin ALL policy for freelancer_payments management
CREATE POLICY "Admins can do everything on freelancer_payments"
ON public.freelancer_payments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
