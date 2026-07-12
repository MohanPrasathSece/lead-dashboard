import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { data, error } = await supabase.from('website_leads').select('*');
    if (error) throw error;

    let leadsData: Record<string, any> = {};
    if (data) {
      data.forEach((row) => {
        leadsData[row.website] = {
          signup: row.signup || 0,
          contact: row.contact || 0
        };
      });
    }

    return res.status(200).json(leadsData);
  } catch (err: any) {
    const rawMsg = (err.message || err.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "You have already contacted us pls wait" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us pls wait" }));
        return;
      }
    }

    console.error('Error fetching leads:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
