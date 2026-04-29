
-- Drop overly permissive policies
DROP POLICY "Authenticated users can upload to portfolio" ON storage.objects;
DROP POLICY "Authenticated users can update portfolio" ON storage.objects;

-- Recreate with admin-only restriction
CREATE POLICY "Admins can upload to portfolio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update portfolio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));
