-- Create storage bucket for gallery media
INSERT INTO storage.buckets (id, name, public) VALUES 
('gallery-media', 'gallery-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for gallery media
CREATE POLICY "Anyone can view gallery media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-media');

CREATE POLICY "Only admins can upload gallery media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-media' AND EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can update gallery media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-media' AND EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can delete gallery media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-media' AND EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));