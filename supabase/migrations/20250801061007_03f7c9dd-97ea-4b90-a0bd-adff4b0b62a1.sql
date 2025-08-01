-- Ensure fivem_license is unique across all player_accounts
-- This prevents the same character being linked to multiple accounts

-- First, let's check if there's already a unique constraint
-- If there are duplicates, we need to handle them first

-- Add unique constraint on fivem_license if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'player_accounts_fivem_license_key'
    ) THEN
        ALTER TABLE public.player_accounts 
        ADD CONSTRAINT player_accounts_fivem_license_key UNIQUE (fivem_license);
    END IF;
END $$;

-- Add RLS policy to allow users to delete their own player accounts
CREATE POLICY "Users can delete their own player accounts" 
ON public.player_accounts 
FOR DELETE 
USING (auth.uid() = user_id);