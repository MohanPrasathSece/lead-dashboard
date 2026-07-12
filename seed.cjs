const { put } = require('@vercel/blob');
require('dotenv').config();
const data = {
  'soltera-vision': { signup: 0, contact: 1 },
  'Zyvera Capital': { signup: 1, contact: 0 },
  'Atlas Ledger (17)': { signup: 0, contact: 1 },
  'Bulletin Finance': { signup: 2, contact: 1 },
  'Cipher Capital (18)': { signup: 0, contact: 1 },
  'crypto-chronicle-pro': { signup: 0, contact: 1 },
  'european-insight': { signup: 1, contact: 1 },
  'Finastra Daily': { signup: 0, contact: 1 },
  'Golden Black (20)': { signup: 0, contact: 1 },
  'intelligent-finance-hub': { signup: 0, contact: 1 },
  'Le moderne capitale (16)': { signup: 0, contact: 1 },
  'novaire-capital-intelligence-elevated': { signup: 0, contact: 1 },
  'Novalis Journele (17)': { signup: 1, contact: 1 },
  'Orbit X (19)': { signup: 0, contact: 1 }
};
put('leads.json', JSON.stringify(data), { access: 'public', addRandomSuffix: false, allowOverwrite: true, token: process.env.BLOB_READ_WRITE_TOKEN })
  .then(res => console.log('Seeded:', res.url))
  .catch(err => console.error(err));

