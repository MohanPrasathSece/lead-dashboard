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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { website, type, name, email } = req.body;
  if (!website || !['signup', 'contact'].includes(type)) {
    return res.status(400).json({ error: 'Invalid payload parameters' });
  }

  // Ignore test leads with John Doe name or email
  const isTestName = name && name.toLowerCase().includes('john doe');
  const isTestEmail = email && email.toLowerCase().includes('john.doe');
  
  if (isTestName || isTestEmail) {
    console.log(`[Dashboard API] Ignored test lead for ${website} (Name: ${name}, Email: ${email})`);
    return res.status(200).json({ success: true, ignored: true, message: 'Ignored test lead' });
  }

  try {
    // 1. Find leads.json URL in the blob store
    const { blobs } = await list();
    const leadsBlob = blobs.find(b => b.pathname === 'leads.json');

    let leadsData: Record<string, { signup: number; contact: number }> = {};

    if (leadsBlob) {
      const fileRes = await fetch(leadsBlob.url);
      if (fileRes.ok) {
        leadsData = await fileRes.json();
      }
    }

    // 2. Initialize or update the counts
    if (!leadsData[website]) {
      leadsData[website] = { signup: 0, contact: 0 };
    }
    leadsData[website][type as 'signup' | 'contact'] += 1;

    // 3. Write back to blob store
    const updatedBlob = await put('leads.json', JSON.stringify(leadsData), {
      access: 'public',
      addRandomSuffix: false
    });

    return res.status(200).json({ success: true, data: leadsData, url: updatedBlob.url });
  } catch (err: any) {
    console.error('Error updating leads:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
