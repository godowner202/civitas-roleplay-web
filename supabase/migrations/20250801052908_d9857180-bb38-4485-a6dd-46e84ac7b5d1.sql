-- Create fivem_players table to store synced data from FiveM database
CREATE TABLE public.fivem_players (
  id SERIAL PRIMARY KEY,
  fivem_id INTEGER,
  userid INTEGER,
  citizenid TEXT,
  cid INTEGER,
  license TEXT UNIQUE NOT NULL,
  name TEXT,
  money JSONB,
  charinfo JSONB,
  job JSONB,
  cash INTEGER GENERATED ALWAYS AS (COALESCE((money->>'cash')::integer, 0)) STORED,
  bank INTEGER GENERATED ALWAYS AS (COALESCE((money->>'bank')::integer, 0)) STORED,
  firstname TEXT GENERATED ALWAYS AS (charinfo->>'firstname') STORED,
  lastname TEXT GENERATED ALWAYS AS (charinfo->>'lastname') STORED,
  job_name TEXT GENERATED ALWAYS AS (job->>'name') STORED,
  job_grade_name TEXT GENERATED ALWAYS AS (job->'grade'->>'name') STORED,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_fivem_players_license ON public.fivem_players(license);
CREATE INDEX idx_fivem_players_citizenid ON public.fivem_players(citizenid);
CREATE INDEX idx_fivem_players_synced_at ON public.fivem_players(synced_at);

-- Enable RLS
ALTER TABLE public.fivem_players ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own character data
CREATE POLICY "Users can view their own character data" 
ON public.fivem_players 
FOR SELECT 
USING (
  license IN (
    SELECT fivem_license 
    FROM player_accounts 
    WHERE user_id = auth.uid() AND verified = true
  )
);

-- Policy: Admins can see all character data
CREATE POLICY "Admins can view all character data" 
ON public.fivem_players 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Policy: Service role can manage all data (for sync function)
CREATE POLICY "Service role can manage all fivem_players data" 
ON public.fivem_players 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_fivem_players_updated_at
BEFORE UPDATE ON public.fivem_players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();