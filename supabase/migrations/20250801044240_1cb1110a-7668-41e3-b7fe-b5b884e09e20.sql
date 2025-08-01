-- Fix RLS policies for server_updates, team_members, and events to allow admin panel access

-- Server Updates - Allow public access for admin panel
CREATE POLICY "Allow public inserts to server_updates" 
ON public.server_updates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public updates to server_updates" 
ON public.server_updates 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletes to server_updates" 
ON public.server_updates 
FOR DELETE 
USING (true);

-- Team Members - Allow public access for admin panel
CREATE POLICY "Allow public inserts to team_members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public updates to team_members" 
ON public.team_members 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletes to team_members" 
ON public.team_members 
FOR DELETE 
USING (true);

-- Events - Allow public access for admin panel
CREATE POLICY "Allow public inserts to events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public updates to events" 
ON public.events 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletes to events" 
ON public.events 
FOR DELETE 
USING (true);

-- Site Settings - Allow public access for admin panel
CREATE POLICY "Allow public inserts to site_settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public updates to site_settings" 
ON public.site_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletes to site_settings" 
ON public.site_settings 
FOR DELETE 
USING (true);