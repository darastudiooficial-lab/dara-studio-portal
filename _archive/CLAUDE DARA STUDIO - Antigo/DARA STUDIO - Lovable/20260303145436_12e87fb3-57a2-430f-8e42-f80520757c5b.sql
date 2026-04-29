
-- Add avatar_url column to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create storage bucket for company avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('company-avatars', 'company-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload company avatars
CREATE POLICY "Authenticated users can upload company avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-avatars');

-- Allow public to view company avatars
CREATE POLICY "Public can view company avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-avatars');

-- Allow authenticated users to update/delete company avatars
CREATE POLICY "Authenticated users can update company avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'company-avatars');

CREATE POLICY "Authenticated users can delete company avatars"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'company-avatars');
