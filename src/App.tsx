import { useState, useEffect } from 'react';
import './App.css';

interface WebsiteCount {
  signup: number;
  contact: number;
}

type LeadsData = Record<string, WebsiteCount>;

interface WebsiteInfo {
  name: string;
  folder: string;
  month: 'July 2026' | 'June 2026';
}

const WEBSITES: WebsiteInfo[] = [
  // July 2026 batch
  { name: 'The Ledger Capital', folder: 'JULY Autodigx/stellar-wallet', month: 'July 2026' },
  { name: 'VortexCrypto', folder: 'JULY Autodigx/chronicle-consult', month: 'July 2026' },
  { name: 'The Asset Office', folder: 'JULY Autodigx/global-wealth-architects', month: 'July 2026' },
  { name: 'Soltera Finance', folder: 'JULY Autodigx/Soltera Finance', month: 'July 2026' },
  { name: 'Revelle Partners', folder: 'JULY Autodigx/soltera-vision', month: 'July 2026' },
  { name: 'The Report Desk', folder: 'JULY Autodigx/The Report Desk', month: 'July 2026' },
  { name: 'Zyvora Finance', folder: 'JULY Autodigx/Zyvera Capital', month: 'July 2026' },
  
  // June 2026 batch
  { name: 'Aetheris', folder: 'Aetheris Crypto/aetheris-react', month: 'June 2026' },
  { name: 'AtlasLedger', folder: 'Atlas Ledger (17)', month: 'June 2026' },
  { name: 'Aurore Capital', folder: 'Aurore Capital/quantnova-ai-insights-main', month: 'June 2026' },
  { name: 'Bulletin Financier', folder: 'Bulletin Finance', month: 'June 2026' },
  { name: 'Lumen', folder: 'Cipher Capital (18)', month: 'June 2026' },
  { name: 'Ciphera Intelligence', folder: 'Ciphera Intelligence/kinetic-canvas-main', month: 'June 2026' },
  { name: 'CipherWire', folder: 'crypto-chronicle-pro', month: 'June 2026' },
  { name: 'Elite Chain', folder: 'Elite Chain AI/apex-capital-main', month: 'June 2026' },
  { name: 'Capital Chronicle', folder: 'european-insight', month: 'June 2026' },
  { name: 'Finastra Daily', folder: 'Finastra Daily', month: 'June 2026' },
  { name: 'Futuria Network', folder: 'Futuria Network/Futuria-Ventures-main', month: 'June 2026' },
  { name: 'Nova Ledger', folder: 'Golden Black (20)', month: 'June 2026' },
  { name: 'Cryptora', folder: 'intelligent-finance-hub', month: 'June 2026' },
  { name: 'Le Capital Moderne', folder: 'Le moderne capitale (16)', month: 'June 2026' },
  { name: 'Le Temps Moderne', folder: 'Le Temps Moderne/the-digital-ledger-main', month: 'June 2026' },
  { name: 'Maison Bloc', folder: 'Maison Bloc/stellar-wealth-main', month: 'June 2026' },
  { name: 'Monde Quotidien', folder: 'Monde Quotidien/crypto-chronicle-main', month: 'June 2026' },
  { name: 'Lumière Chain', folder: 'novaire-capital-intelligence-elevated', month: 'June 2026' },
  { name: 'Évolis Journal', folder: 'Novalis Journele (17)', month: 'June 2026' },
  { name: 'OrbitX Finance', folder: 'Orbit X (19)', month: 'June 2026' }
];

export default function App() {
  const [data, setData] = useState<LeadsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState<'All' | 'July 2026' | 'June 2026'>('All');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      if (!res.ok) {
        throw new Error(`Failed to load data: ${res.statusText}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  let totalSignups = 0;
  let totalContacts = 0;
  WEBSITES.forEach(site => {
    const counts = data[site.name] || { signup: 0, contact: 0 };
    totalSignups += counts.signup || 0;
    totalContacts += counts.contact || 0;
  });

  const filteredWebsites = WEBSITES.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(search.toLowerCase()) || 
                          site.folder.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMonth === 'All' || site.month === filterMonth;
    return matchesSearch && matchesFilter;
  });

  const julySites = filteredWebsites.filter(s => s.month === 'July 2026');
  const juneSites = filteredWebsites.filter(s => s.month === 'June 2026');

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg className="brand-logo-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="brand-title">Crypto Center</h2>
        </div>

        <div className="sidebar-status">
          <span className="pulse-dot"></span>
          <span className="monitoring-badge">Active</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-heading">Filter Batches</div>
          {(['All', 'July 2026', 'June 2026'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterMonth(tab)}
              className={`nav-item ${filterMonth === tab ? 'active-nav' : ''}`}
            >
              {tab === 'All' ? 'All Websites' : tab}
            </button>
          ))}
        </nav>

        <div className="sidebar-stats-section">
          <div className="nav-heading">Summary Stats</div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label">Total Leads</span>
            <span className="sidebar-stat-val font-mono">{totalSignups + totalContacts}</span>
          </div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label text-green">Signups</span>
            <span className="sidebar-stat-val font-mono text-green">{totalSignups}</span>
          </div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label text-purple">Contacts</span>
            <span className="sidebar-stat-val font-mono text-purple">{totalContacts}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar-wrapper">
            <span className="search-icon">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search websites or folder paths..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <button 
            onClick={fetchLeads} 
            disabled={loading}
            className="refresh-btn"
          >
            <svg className={`refresh-icon ${loading ? 'spinning' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
            </svg>
            Refresh
          </button>
        </header>

        {error && (
          <div className="error-alert">
            ⚠️ {error}
          </div>
        )}

        {loading && Object.keys(data).length === 0 ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Connecting to storage...</div>
          </div>
        ) : (
          <div className="batch-container">
            
            {/* JULY 2026 BATCH */}
            {julySites.length > 0 && (
              <div className="batch-section">
                <h2 className="batch-title text-cyan">
                  July 2026 Batch
                  <span className="batch-count bg-cyan">
                    {julySites.length}
                  </span>
                </h2>
                <div className="website-grid">
                  {julySites.map(site => (
                    <WebsiteCard key={site.name} site={site} counts={data[site.name]} />
                  ))}
                </div>
              </div>
            )}

            {/* JUNE 2026 BATCH */}
            {juneSites.length > 0 && (
              <div className="batch-section">
                <h2 className="batch-title text-purple">
                  June 2026 Batch
                  <span className="batch-count bg-purple">
                    {juneSites.length}
                  </span>
                </h2>
                <div className="website-grid">
                  {juneSites.map(site => (
                    <WebsiteCard key={site.name} site={site} counts={data[site.name]} />
                  ))}
                </div>
              </div>
            )}

            {filteredWebsites.length === 0 && (
              <div className="empty-state">
                No websites matched your search criteria.
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

function WebsiteCard({ site, counts = { signup: 0, contact: 0 } }: { site: WebsiteInfo; counts?: WebsiteCount }) {
  const sCount = counts.signup || 0;
  const cCount = counts.contact || 0;
  const total = sCount + cCount;

  return (
    <div className="website-card">
      {total > 0 && <span className="active-glow-dot"></span>}

      <div className="card-header">
        <div className="card-title-group">
          <h3 className="card-name">{site.name}</h3>
          <p className="card-folder" title={site.folder}>
            {site.folder}
          </p>
        </div>
        <span className={`card-badge ${site.month === 'July 2026' ? 'badge-cyan' : 'badge-purple'}`}>
          {site.month.split(' ')[0]}
        </span>
      </div>

      <div className="card-counters">
        <div className="counter-box border-green-hover">
          <div className="counter-label">Signups</div>
          <div className="counter-value text-green">{sCount}</div>
        </div>
        <div className="counter-box border-purple-hover">
          <div className="counter-label">Contacts</div>
          <div className="counter-value text-purple">{cCount}</div>
        </div>
      </div>

      <div className="card-footer">
        <span className="aggregate-label">Aggregate Count</span>
        <span className="aggregate-value">{total}</span>
      </div>
    </div>
  );
}
