-- Create jobs table for managing server jobs
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL,
  job_rank TEXT NOT NULL,
  salary INTEGER NOT NULL,
  description TEXT,
  job_type TEXT DEFAULT 'civilian',
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
CREATE POLICY "Anyone can view jobs" 
ON public.jobs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public inserts to jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public updates to jobs" 
ON public.jobs 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public deletes to jobs" 
ON public.jobs 
FOR DELETE 
USING (true);

-- Create service role policies
CREATE POLICY "Service role can manage jobs" 
ON public.jobs 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some example data
INSERT INTO public.jobs (job_name, job_rank, salary, description, job_type, order_index) VALUES
('Politie', 'Agent', 2500, 'Basis politieagent verantwoordelijk voor handhaving van de wet', 'government', 1),
('Politie', 'Brigadier', 3000, 'Ervaren agent met leidinggevende taken', 'government', 2),
('Politie', 'Inspecteur', 3500, 'Leidinggevende rol met tactische verantwoordelijkheden', 'government', 3),
('Politie', 'Hoofdinspecteur', 4200, 'Senior leidinggevende met strategische verantwoordelijkheden', 'government', 4),
('Ambulance', 'Ambulanceverpleegkundige', 2400, 'Medische zorg verlenen in noodsituaties', 'government', 5),
('Ambulance', 'Paramedic', 2800, 'Geavanceerde medische zorg en trauma behandeling', 'government', 6),
('Ambulance', 'Chef Ambulancedienst', 3400, 'Leidinggevende rol binnen de ambulancedienst', 'government', 7),
('Brandweer', 'Brandweerman', 2600, 'Brandbestrijding en reddingsoperaties', 'government', 8),
('Brandweer', 'Bevelvoerder', 3200, 'Leidinggevende tijdens brandweeracties', 'government', 9),
('Taxi', 'Taxichauffeur', 1800, 'Personen vervoeren door de stad', 'civilian', 10),
('Monteur', 'Automonteur', 2200, 'Voertuigen repareren en onderhouden', 'civilian', 11),
('Winkelier', 'Verkoper', 1600, 'Klanten helpen in winkels', 'civilian', 12),
('Winkelier', 'Winkelmanager', 2400, 'Leiding geven aan winkelactiviteiten', 'civilian', 13);