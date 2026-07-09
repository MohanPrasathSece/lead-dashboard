import { list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { blobs } = await list();
    const leadsBlob = blobs.find(b => b.pathname === 'leads.json');

    let leadsData = {};
    if (leadsBlob) {
      const fileRes = await fetch(leadsBlob.url);
      if (fileRes.ok) {
        leadsData = await fileRes.json();
      }
    }
    return res.status(200).json(leadsData);
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
