
-- Allow authenticated users to upload to portfolio bucket
CREATE POLICY "Authenticated users can upload to portfolio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to update/upsert in portfolio bucket
CREATE POLICY "Authenticated users can update portfolio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio');

-- Allow public read access to portfolio bucket
CREATE POLICY "Public can view portfolio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');
