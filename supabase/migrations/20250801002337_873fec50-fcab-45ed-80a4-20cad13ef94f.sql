-- Delete all existing updates
DELETE FROM server_updates;

-- Add columns for images and tags to server_updates
ALTER TABLE server_updates 
ADD COLUMN image_url TEXT,
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Create storage bucket for update images
INSERT INTO storage.buckets (id, name, public) VALUES ('update-images', 'update-images', true);

-- Create storage policies for update images
CREATE POLICY "Anyone can view update images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'update-images');

CREATE POLICY "Only admins can upload update images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'update-images');

CREATE POLICY "Only admins can update update images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'update-images');

CREATE POLICY "Only admins can delete update images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'update-images');