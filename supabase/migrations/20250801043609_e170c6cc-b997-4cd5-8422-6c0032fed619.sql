-- Create storage policies for gallery-media bucket to allow uploads

-- Policy to allow anyone to upload to gallery-media bucket
CREATE POLICY "Allow public uploads to gallery-media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-media');

-- Policy to allow anyone to view gallery-media files
CREATE POLICY "Allow public access to gallery-media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-media');

-- Policy to allow service role to manage all gallery-media files
CREATE POLICY "Service role can manage gallery-media" 
ON storage.objects 
FOR ALL 
TO service_role 
USING (bucket_id = 'gallery-media') 
WITH CHECK (bucket_id = 'gallery-media');