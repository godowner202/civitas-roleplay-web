-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  paypal_order_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donations
CREATE POLICY "Anyone can view completed donations" 
ON public.donations 
FOR SELECT 
USING (status = 'completed');

CREATE POLICY "Service role can manage all donations" 
ON public.donations 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();