-- Disable RLS temporarily for admin operations by creating a service role function
-- Create a function that bypasses RLS for admin operations

-- First, create policies that allow service role to bypass RLS
CREATE POLICY "Service role can manage gallery items" 
ON public.gallery_items 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Service role can manage server updates" 
ON public.server_updates 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Service role can manage team members" 
ON public.team_members 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Service role can manage events" 
ON public.events 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Service role can manage site settings" 
ON public.site_settings 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);