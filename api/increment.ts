import { put, list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // 1. Find leads.json URL in the blob store
    const { blobs } = await list();
    const leadsBlob = blobs.find(b => b.pathname === 'leads.json');

    let leadsData: Record<string, { signup: number; contact: number }> = {};

    if (leadsBlob) {
      const fileRes = await fetch(leadsBlob.url);
      if (fileRes.ok) {
        leadsData = await fileRes.json();
      } else {
        console.warn(`[Dashboard API] Failed to fetch leads.json from blob url: ${leadsBlob.url}`);
      }
    } else {
      console.log(`[Dashboard API] leads.json not found in blob store. Initializing new file.`);
    }

    // Normalize website name here if needed
    let normalizedWebsite = website;
    if (normalizedWebsite === 'Novara') normalizedWebsite = 'Soltera Finance';
    if (normalizedWebsite === 'Meridian Capital Review') normalizedWebsite = 'The Report Desk';
    if (normalizedWebsite === 'Stellar Wealth') normalizedWebsite = 'The Ledger Capital';

    // 2. Initialize or update the counts
    if (!leadsData[normalizedWebsite]) {
      leadsData[normalizedWebsite] = { signup: 0, contact: 0 };
    }
    // Also merge old data if it existed under the old name
    if (normalizedWebsite === 'Soltera Finance' && leadsData['Novara']) {
       leadsData[normalizedWebsite].signup += leadsData['Novara'].signup || 0;
       leadsData[normalizedWebsite].contact += leadsData['Novara'].contact || 0;
       delete leadsData['Novara'];
    }
    if (normalizedWebsite === 'The Report Desk' && leadsData['Meridian Capital Review']) {
       leadsData[normalizedWebsite].signup += leadsData['Meridian Capital Review'].signup || 0;
       leadsData[normalizedWebsite].contact += leadsData['Meridian Capital Review'].contact || 0;
       delete leadsData['Meridian Capital Review'];
    }
    if (normalizedWebsite === 'The Ledger Capital' && leadsData['Stellar Wealth']) {
       leadsData[normalizedWebsite].signup += leadsData['Stellar Wealth'].signup || 0;
       leadsData[normalizedWebsite].contact += leadsData['Stellar Wealth'].contact || 0;
       delete leadsData['Stellar Wealth'];
    }

    leadsData[normalizedWebsite][type as 'signup' | 'contact'] += 1;

    // 3. Write back to blob store
    const updatedBlob = await put('leads.json', JSON.stringify(leadsData), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });

    console.log(`[Dashboard API] Successfully updated counts for ${normalizedWebsite}. New totals:`, leadsData[normalizedWebsite]);

    return res.status(200).json({ success: true, data: leadsData, url: updatedBlob.url });
  } catch (err: any) {
    console.error('[Dashboard API] Error updating leads:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
