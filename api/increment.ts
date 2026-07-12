import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Increment API is ready. Use POST to submit data.' });
  }

  if (req.method !== 'POST') {
    console.warn(`[Dashboard API] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log(`[Dashboard API] Incoming payload:`, req.body);

  const { website, type, name, email } = req.body;
  if (!website || !['signup', 'contact'].includes(type)) {
    console.error(`[Dashboard API] Invalid payload parameters. website: ${website}, type: ${type}`);
    return res.status(400).json({ error: 'Invalid payload parameters' });
  }

  // Ignore test leads with John Doe name or email
  const isTestName = name && name.toLowerCase().includes('john doe');
  const isTestEmail = email && email.toLowerCase().includes('john.doe');
  
  if (isTestName || isTestEmail) {
    console.log(`[Dashboard API] Ignored test lead for ${website} (Name: ${name}, Email: ${email})`);
    return res.status(200).json({ success: true, ignored: true, message: 'Ignored test lead' });
  }

  console.log(`[Dashboard API] Processing valid lead for ${website} (Type: ${type}, Name: ${name}, Email: ${email})`);

  try {
    // Normalize website name here if needed
    let normalizedWebsite = website;
    if (normalizedWebsite === 'Novara') normalizedWebsite = 'Soltera Finance';
    if (normalizedWebsite === 'Meridian Capital Review') normalizedWebsite = 'The Report Desk';
    if (normalizedWebsite === 'Stellar Wealth') normalizedWebsite = 'The Ledger Capital';

    // Fetch existing data
    const { data: existingData, error: fetchError } = await supabase
      .from('website_leads')
      .select('*')
      .eq('website', normalizedWebsite)
      .single();

    // PGRST116 means no rows returned, which is fine for a new website
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let signupCount = existingData?.signup || 0;
    let contactCount = existingData?.contact || 0;

    if (type === 'signup') {
      signupCount += 1;
    } else if (type === 'contact') {
      contactCount += 1;
    }

    const { error: upsertError } = await supabase
      .from('website_leads')
      .upsert({
        website: normalizedWebsite,
        signup: signupCount,
        contact: contactCount
      });

    if (upsertError) throw upsertError;

    console.log(`[Dashboard API] Successfully updated counts for ${normalizedWebsite}. New totals: signup=${signupCount}, contact=${contactCount}`);

    // Return the specific website update format
    return res.status(200).json({ 
      success: true, 
      data: {
        [normalizedWebsite]: { signup: signupCount, contact: contactCount }
      }
    });
  } catch (err: any) {
    console.error('[Dashboard API] Error updating leads:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
