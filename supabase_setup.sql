-- SQL script to create the recent_leads table in Supabase
-- Run this in your Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.recent_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('signup', 'contact')),
    name TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for fast time-based sorting and project filtering
CREATE INDEX IF NOT EXISTS idx_recent_leads_created_at ON public.recent_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recent_leads_website ON public.recent_leads (website);

-- Enable Row Level Security (RLS)
ALTER TABLE public.recent_leads ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated & anonymous users
CREATE POLICY "Allow public read on recent_leads" 
ON public.recent_leads FOR SELECT USING (true);

-- Allow insert access for service role and public
CREATE POLICY "Allow insert on recent_leads" 
ON public.recent_leads FOR INSERT WITH CHECK (true);
