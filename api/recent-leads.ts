import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Directly fetch from Supabase recent_leads table in PostgreSQL
    const { data, error } = await supabase
      .from('recent_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);

    if (error) {
      console.error('[recent-leads API] Supabase error:', error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(data || []);
  } catch (err: any) {
    console.error('[recent-leads API] Internal error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
