
-- Create enum for member status
CREATE TYPE public.member_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  age INTEGER,
  district TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Perú',
  bias TEXT NOT NULL,
  bias_wrecker TEXT,
  favorite_album TEXT NOT NULL,
  favorite_song TEXT NOT NULL,
  army_since TEXT NOT NULL,
  arrival_mode TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  early_queue_interest BOOLEAN NOT NULL DEFAULT false,
  confirms_october_7 BOOLEAN NOT NULL DEFAULT false,
  confirms_zona_campo_c BOOLEAN NOT NULL DEFAULT false,
  has_confirmed_ticket BOOLEAN NOT NULL DEFAULT false,
  accepted_safety_rules BOOLEAN NOT NULL DEFAULT false,
  instagram TEXT,
  message TEXT,
  avatar_url TEXT,
  proof_image_url TEXT,
  status member_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Public can insert new registrations (status is forced to 'pending' by default column value)
CREATE POLICY "Anyone can register"
  ON public.members
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Public can only read approved members
CREATE POLICY "Public can view approved members"
  ON public.members
  FOR SELECT
  USING (status = 'approved');

-- No public update or delete (only edge functions with service role can modify)
