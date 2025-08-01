-- Fix the foreign key constraint issue for server_updates table
-- Drop the foreign key constraint and make author_id optional with a default value

-- First, check and drop the foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'server_updates_author_id_fkey'
    ) THEN
        ALTER TABLE public.server_updates DROP CONSTRAINT server_updates_author_id_fkey;
    END IF;
END $$;

-- Make author_id nullable and add a default value for admin panel posts
ALTER TABLE public.server_updates 
ALTER COLUMN author_id DROP NOT NULL;

ALTER TABLE public.server_updates 
ALTER COLUMN author_id SET DEFAULT '00000000-0000-0000-0000-000000000000';