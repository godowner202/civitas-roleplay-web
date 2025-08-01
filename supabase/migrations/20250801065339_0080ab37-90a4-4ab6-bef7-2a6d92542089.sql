-- Create player_vehicles table
CREATE TABLE public.player_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_data JSONB,
  garage_location TEXT DEFAULT 'city',
  stored BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.player_vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for player_vehicles
CREATE POLICY "Users can view their own vehicles" 
ON public.player_vehicles 
FOR SELECT 
USING (license IN (
  SELECT player_accounts.fivem_license
  FROM player_accounts
  WHERE player_accounts.user_id = auth.uid() AND player_accounts.verified = true
));

CREATE POLICY "Service role can manage all vehicles" 
ON public.player_vehicles 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_player_vehicles_updated_at
BEFORE UPDATE ON public.player_vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();