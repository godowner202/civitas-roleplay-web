-- Create player_accounts table to link web accounts to FiveM characters
CREATE TABLE public.player_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fivem_license TEXT NOT NULL UNIQUE,
  character_name TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.player_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own account links
CREATE POLICY "Users can view their own player accounts" 
ON public.player_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own account links
CREATE POLICY "Users can create their own player accounts" 
ON public.player_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own account links
CREATE POLICY "Users can update their own player accounts" 
ON public.player_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can manage all player accounts
CREATE POLICY "Admins can manage all player accounts" 
ON public.player_accounts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add trigger for updated_at
CREATE TRIGGER update_player_accounts_updated_at
BEFORE UPDATE ON public.player_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();