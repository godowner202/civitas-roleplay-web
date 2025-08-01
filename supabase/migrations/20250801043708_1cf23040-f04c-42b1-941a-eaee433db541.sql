-- Allow public inserts to gallery_items for admin panel
CREATE POLICY "Allow public inserts to gallery_items" 
ON public.gallery_items 
FOR INSERT 
WITH CHECK (true);

-- Allow public updates to gallery_items for admin panel  
CREATE POLICY "Allow public updates to gallery_items" 
ON public.gallery_items 
FOR UPDATE 
USING (true);

-- Allow public deletes to gallery_items for admin panel
CREATE POLICY "Allow public deletes to gallery_items" 
ON public.gallery_items 
FOR DELETE 
USING (true);