const { list } = require('@vercel/blob');
require('dotenv').config();
list({ token: process.env.BLOB_READ_WRITE_TOKEN }).then(async ({ blobs }) => {
  const leadsBlob = blobs.find(b => b.pathname === 'leads.json');
  console.log('Blob found:', leadsBlob ? leadsBlob.url : 'No');
  if (leadsBlob) {
    const res = await fetch(leadsBlob.url + '?t=' + Date.now());
    const data = await res.json();
    console.log('Data:', data);
  }
}).catch(console.error);
