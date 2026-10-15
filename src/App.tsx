import { useState, useEffect, useMemo } from 'react';
import './App.css';

export interface WebsiteCount {
  signup: number;
  contact: number;
}

export type LeadsData = Record<string, WebsiteCount>;

export interface WebsiteInfo {
  name: string;
  folder: string;
  month: 'July 2026' | 'June 2026';
}

export interface RecentLead {
  id: string;
  website: string;
  type: 'signup' | 'contact';
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  message?: string;
  created_at: string;
}

const WEBSITES: WebsiteInfo[] = [
  // July 2026 batch (alphabetical)
  { name: 'Alpha Chain Vault', folder: 'JULY AUTODIGIX/italian 1', month: 'July 2026' },
  { name: 'Asset Circle', folder: 'JULY AUTODIGIX/The Asset Circle', month: 'July 2026' },
  { name: 'Avenza Finance', folder: 'JULY AUTODIGIX/Avenza Finance', month: 'July 2026' },
  { name: 'Emerald Gold Capital', folder: 'JULY AUTODIGIX/emerald-gold-capital', month: 'July 2026' },
  { name: 'Everstone Finance', folder: 'JULY AUTODIGIX/italian 3', month: 'July 2026' },
  { name: 'Lumera Markets', folder: 'JULY AUTODIGIX/Lumera Markets', month: 'July 2026' },
  { name: 'Meridian Capital', folder: 'JULY AUTODIGIX/italian 4', month: 'July 2026' },
  { name: 'Meridian Capital Review', folder: 'JULY AUTODIGIX/The Report Desk', month: 'July 2026' },
  { name: 'Revelle Partners', folder: 'JULY AUTODIGIX/Revelle Partners', month: 'July 2026' },
  { name: 'Silver Stone Capital', folder: 'JULY AUTODIGIX/italian 2', month: 'July 2026' },
  { name: 'Solara Assets', folder: 'JULY AUTODIGIX/Solara Assets', month: 'July 2026' },
  { name: 'The Asset Office', folder: 'JULY AUTODIGIX/The Asset Office', month: 'July 2026' },
  { name: 'The Capital Space', folder: 'JULY AUTODIGIX/The Capital Space', month: 'July 2026' },
  { name: 'The Finance View', folder: 'JULY AUTODIGIX/The Finance View', month: 'July 2026' },
  { name: 'The Investor Office', folder: 'JULY AUTODIGIX/The Investor Office', month: 'July 2026' },
  { name: 'The Ledger Capital', folder: 'JULY AUTODIGIX/The Ledger Capital', month: 'July 2026' },
  { name: 'The Market Office', folder: 'JULY AUTODIGIX/The Market Office', month: 'July 2026' },
  { name: 'The Market Vault', folder: 'JULY AUTODIGIX/The Market Vault', month: 'July 2026' },
  { name: 'Velora Assets', folder: 'JULY AUTODIGIX/Velora Assets', month: 'July 2026' },
  { name: 'VortexCrypto', folder: 'JULY AUTODIGIX/NEWS PROJECT', month: 'July 2026' },
  { name: 'Zyvora Finance', folder: 'JULY AUTODIGIX/Zyvera Capital', month: 'July 2026' },

  // June 2026 batch (alphabetical)
  { name: 'Aetheris', folder: 'Aetheris Crypto/aetheris-react', month: 'June 2026' },
  { name: 'AtlasLedger', folder: 'Atlas Ledger (17)', month: 'June 2026' },
  { name: 'Aurore Capital', folder: 'Aurore Capital/quantnova-ai-insights-main', month: 'June 2026' },
  { name: 'Bulletin Financier', folder: 'Bulletin Finance', month: 'June 2026' },
  { name: 'Capital Chronicle', folder: 'european-insight', month: 'June 2026' },
  { name: 'Ciphera Intelligence', folder: 'Ciphera Intelligence/kinetic-canvas-main', month: 'June 2026' },
  { name: 'Cryptora', folder: 'intelligent-finance-hub', month: 'June 2026' },
  { name: 'Elite Chain', folder: 'Elite Chain AI/apex-capital-main', month: 'June 2026' },
  { name: 'Évolis Journal', folder: 'Novalis Journele (17)', month: 'June 2026' },
  { name: 'Finastra Daily', folder: 'Finastra Daily', month: 'June 2026' },
  { name: 'Futuria Network', folder: 'Futuria Network/Futuria-Ventures-main', month: 'June 2026' },
  { name: 'Le Capital Moderne', folder: 'Le moderne capitale (16)', month: 'June 2026' },
  { name: 'Le Grand Rapport', folder: 'crypto-chronicle-pro', month: 'June 2026' },
  { name: 'Le Temps Moderne', folder: 'Le Temps Moderne/the-digital-ledger-main', month: 'June 2026' },
  { name: 'Lumen', folder: 'Cipher Capital (18)', month: 'June 2026' },
  { name: 'Lumière Chain', folder: 'novaire-capital-intelligence-elevated', month: 'June 2026' },
  { name: 'Maison Bloc', folder: 'Maison Bloc/stellar-wealth-main', month: 'June 2026' },
  { name: 'Monde Quotidien', folder: 'Monde Quotidien/crypto-chronicle-main', month: 'June 2026' },
  { name: 'Nova Ledger', folder: 'Golden Black (20)', month: 'June 2026' },
  { name: 'OrbitX Finance', folder: 'Orbit X (19)', month: 'June 2026' },
  { name: 'VertexIQ', folder: 'VertexIQ Integration', month: 'June 2026' },
];

/* Professional SVG Icons */
const Icons = {
  Projects: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Recent: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Analytics: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Search: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Refresh: ({ spinning }: { spinning?: boolean }) => (
    <svg className={`svg-icon ${spinning ? 'spinning' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
    </svg>
  ),
  Calendar: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l2.5 2.5M12 22a10 10 0 100-20 10 10 0 000 20z" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Copy: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Check: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Layers: () => (
    <svg className="svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
};

// Date category formatting helper
function getDayCategory(isoString: string): { key: string; label: string; fullDate: string } {
  try {
    const leadDate = new Date(isoString);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfLead = new Date(leadDate.getFullYear(), leadDate.getMonth(), leadDate.getDate()).getTime();

    const fullDate = leadDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (startOfLead === startOfToday) {
      return { key: 'today', label: 'Today', fullDate };
    }
    if (startOfLead === startOfYesterday) {
      return { key: 'yesterday', label: 'Yesterday', fullDate };
    }
    return {
      key: leadDate.toISOString().split('T')[0],
      label: leadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      fullDate,
    };
  } catch {
    return { key: 'unknown', label: 'Recent', fullDate: '' };
  }
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  } catch {
    return 'Recent';
  }
}

function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

type NavigationPage = 'projects' | 'recent-leads' | 'analytics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('projects');
  const [data, setData] = useState<LeadsData>({});
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Projects View Filters
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState<'All' | 'July 2026' | 'June 2026'>('All');

  // Recent Leads View Filters
  const [recentSearch, setRecentSearch] = useState('');
  const [recentTypeFilter, setRecentTypeFilter] = useState<'All' | 'signup' | 'contact'>('All');
  const [recentProjectFilter, setRecentProjectFilter] = useState<string>('All');
  const [recentDateFilter, setRecentDateFilter] = useState<'All' | 'today' | 'yesterday' | 'past7'>('All');

  // Analytics View Sorting
  const [analyticsSortBy, setAnalyticsSortBy] = useState<'leads' | 'signups' | 'contacts' | 'name'>('leads');
  const [analyticsBatchFilter, setAnalyticsBatchFilter] = useState<'All' | 'July 2026' | 'June 2026'>('All');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error(`Failed to load leads: ${res.statusText}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLeads = async () => {
    try {
      setRecentLoading(true);
      const res = await fetch('/api/recent-leads');
      if (!res.ok) throw new Error('Failed to load recent leads');
      const json = await res.json();
      if (Array.isArray(json)) {
        setRecentLeads(json);
      }
    } catch (err: any) {
      console.warn('Recent leads fetch warning:', err);
    } finally {
      setRecentLoading(false);
    }
  };

  const refreshAll = () => {
    fetchLeads();
    fetchRecentLeads();
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 25000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Overall Portfolio Totals
  let totalSignups = 0;
  let totalContacts = 0;
  let activeProjectsCount = 0;

  WEBSITES.forEach(site => {
    const counts = data[site.name] || { signup: 0, contact: 0 };
    totalSignups += counts.signup || 0;
    totalContacts += counts.contact || 0;
    if ((counts.signup || 0) + (counts.contact || 0) > 0) {
      activeProjectsCount += 1;
    }
  });

  const totalLeads = totalSignups + totalContacts;

  // Projects View filtered websites
  const filteredWebsites = useMemo(() => {
    return WEBSITES.filter(site => {
      const matchesSearch =
        site.name.toLowerCase().includes(search.toLowerCase()) ||
        site.folder.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterMonth === 'All' || site.month === filterMonth;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterMonth]);

  const julySites = filteredWebsites.filter(s => s.month === 'July 2026');
  const juneSites = filteredWebsites.filter(s => s.month === 'June 2026');

  // Filtered Recent Leads
  const filteredRecentLeads = useMemo(() => {
    const now = Date.now();
    return recentLeads.filter(lead => {
      const matchesSearch =
        lead.website.toLowerCase().includes(recentSearch.toLowerCase()) ||
        (lead.name && lead.name.toLowerCase().includes(recentSearch.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(recentSearch.toLowerCase())) ||
        (lead.phone && lead.phone.toLowerCase().includes(recentSearch.toLowerCase())) ||
        (lead.country && lead.country.toLowerCase().includes(recentSearch.toLowerCase()));

      const matchesType = recentTypeFilter === 'All' || lead.type === recentTypeFilter;
      const matchesProject = recentProjectFilter === 'All' || lead.website === recentProjectFilter;

      let matchesDate = true;
      if (recentDateFilter !== 'All') {
        const leadCat = getDayCategory(lead.created_at);
        if (recentDateFilter === 'today') {
          matchesDate = leadCat.key === 'today';
        } else if (recentDateFilter === 'yesterday') {
          matchesDate = leadCat.key === 'yesterday';
        } else if (recentDateFilter === 'past7') {
          const leadTime = new Date(lead.created_at).getTime();
          matchesDate = now - leadTime <= 7 * 86400000;
        }
      }

      return matchesSearch && matchesType && matchesProject && matchesDate;
    });
  }, [recentLeads, recentSearch, recentTypeFilter, recentProjectFilter, recentDateFilter]);

  // Group Recent Leads by Day
  const groupedRecentLeads = useMemo(() => {
    const groups: { [key: string]: { label: string; fullDate: string; leads: RecentLead[] } } = {};

    filteredRecentLeads.forEach(lead => {
      const { key, label, fullDate } = getDayCategory(lead.created_at);
      if (!groups[key]) {
        groups[key] = { label, fullDate, leads: [] };
      }
      groups[key].leads.push(lead);
    });

    // Return ordered array of groups
    return Object.keys(groups).map(key => ({
      key,
      ...groups[key],
    }));
  }, [filteredRecentLeads]);

  // Daily statistics for Recent Leads
  const todayLeadsCount = useMemo(() => {
    return recentLeads.filter(l => getDayCategory(l.created_at).key === 'today').length;
  }, [recentLeads]);

  const yesterdayLeadsCount = useMemo(() => {
    return recentLeads.filter(l => getDayCategory(l.created_at).key === 'yesterday').length;
  }, [recentLeads]);

  // Analytics Metrics
  const analyticsData = useMemo(() => {
    // Project performance ranking
    const projectList = WEBSITES.map(w => {
      const counts = data[w.name] || { signup: 0, contact: 0 };
      const total = (counts.signup || 0) + (counts.contact || 0);
      const recentCount = recentLeads.filter(r => r.website === w.name).length;
      return {
        name: w.name,
        month: w.month,
        folder: w.folder,
        signups: counts.signup || 0,
        contacts: counts.contact || 0,
        total,
        recentCount,
        share: totalLeads > 0 ? (total / totalLeads) * 100 : 0,
      };
    });

    // Filter by Batch if requested
    const filteredProjects = projectList.filter(
      p => analyticsBatchFilter === 'All' || p.month === analyticsBatchFilter
    );

    // Sort
    filteredProjects.sort((a, b) => {
      if (analyticsSortBy === 'leads') return b.total - a.total;
      if (analyticsSortBy === 'signups') return b.signups - a.signups;
      if (analyticsSortBy === 'contacts') return b.contacts - a.contacts;
      return a.name.localeCompare(b.name);
    });

    // Batch Breakdown
    const julyProjects = projectList.filter(p => p.month === 'July 2026');
    const juneProjects = projectList.filter(p => p.month === 'June 2026');

    const julyTotal = julyProjects.reduce((sum, p) => sum + p.total, 0);
    const juneTotal = juneProjects.reduce((sum, p) => sum + p.total, 0);

    const julySignups = julyProjects.reduce((sum, p) => sum + p.signups, 0);
    const julyContacts = julyProjects.reduce((sum, p) => sum + p.contacts, 0);
    const juneSignups = juneProjects.reduce((sum, p) => sum + p.signups, 0);
    const juneContacts = juneProjects.reduce((sum, p) => sum + p.contacts, 0);

    // Daily Timeline from recent leads
    const dailyMap: Record<string, { label: string; signups: number; contacts: number; total: number }> = {};
    recentLeads.forEach(lead => {
      const { key, label } = getDayCategory(lead.created_at);
      if (!dailyMap[key]) {
        dailyMap[key] = { label, signups: 0, contacts: 0, total: 0 };
      }
      if (lead.type === 'signup') dailyMap[key].signups += 1;
      else dailyMap[key].contacts += 1;
      dailyMap[key].total += 1;
    });

    const dailyTimeline = Object.entries(dailyMap).map(([key, val]) => ({
      key,
      ...val,
    }));

    return {
      projects: filteredProjects,
      july: { total: julyTotal, signups: julySignups, contacts: julyContacts, count: julyProjects.length },
      june: { total: juneTotal, signups: juneSignups, contacts: juneContacts, count: juneProjects.length },
      dailyTimeline,
    };
  }, [data, recentLeads, totalLeads, analyticsSortBy, analyticsBatchFilter]);

  const jumpToProject = (projectName: string) => {
    setSearch(projectName);
    setCurrentPage('projects');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Icons.Layers />
          </div>
          <div>
            <h2 className="brand-title">Enterprise Leads</h2>
            <div className="sidebar-status">
              <span className="pulse-dot"></span>
              <span className="monitoring-badge">Operational</span>
            </div>
          </div>
        </div>

        {/* Primary Page Navigation */}
        <div className="nav-heading">Platform Navigation</div>
        <div className="page-nav-group">
          <button
            onClick={() => setCurrentPage('projects')}
            className={`page-nav-btn ${currentPage === 'projects' ? 'page-nav-active' : ''}`}
          >
            <div className="page-nav-title">
              <Icons.Projects />
              <span>Projects Dashboard</span>
            </div>
            <span className="page-badge font-mono">{WEBSITES.length}</span>
          </button>

          <button
            onClick={() => setCurrentPage('recent-leads')}
            className={`page-nav-btn ${currentPage === 'recent-leads' ? 'page-nav-active' : ''}`}
          >
            <div className="page-nav-title">
              <Icons.Recent />
              <span>Recent Leads Feed</span>
            </div>
            <span className="live-pill font-mono">
              <span className="tiny-pulse"></span>
              {recentLeads.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentPage('analytics')}
            className={`page-nav-btn ${currentPage === 'analytics' ? 'page-nav-active' : ''}`}
          >
            <div className="page-nav-title">
              <Icons.Analytics />
              <span>Analytics & Reports</span>
            </div>
            <span className="page-badge font-mono">KPI</span>
          </button>
        </div>

        {/* Page Context Nav */}
        {currentPage === 'projects' && (
          <nav className="sidebar-nav">
            <div className="nav-heading">Batch Selector</div>
            {(['All', 'July 2026', 'June 2026'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterMonth(tab)}
                className={`nav-item ${filterMonth === tab ? 'active-nav' : ''}`}
              >
                {tab === 'All' ? 'All Batches' : tab}
              </button>
            ))}
          </nav>
        )}

        {currentPage === 'recent-leads' && (
          <nav className="sidebar-nav">
            <div className="nav-heading">Date Timeline</div>
            <button
              onClick={() => setRecentDateFilter('All')}
              className={`nav-item ${recentDateFilter === 'All' ? 'active-nav' : ''}`}
            >
              All Recorded Dates
            </button>
            <button
              onClick={() => setRecentDateFilter('today')}
              className={`nav-item ${recentDateFilter === 'today' ? 'active-nav' : ''}`}
            >
              Today Only ({todayLeadsCount})
            </button>
            <button
              onClick={() => setRecentDateFilter('yesterday')}
              className={`nav-item ${recentDateFilter === 'yesterday' ? 'active-nav' : ''}`}
            >
              Yesterday ({yesterdayLeadsCount})
            </button>
            <button
              onClick={() => setRecentDateFilter('past7')}
              className={`nav-item ${recentDateFilter === 'past7' ? 'active-nav' : ''}`}
            >
              Past 7 Days
            </button>
          </nav>
        )}

        {currentPage === 'analytics' && (
          <nav className="sidebar-nav">
            <div className="nav-heading">Report Filter</div>
            {(['All', 'July 2026', 'June 2026'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setAnalyticsBatchFilter(tab)}
                className={`nav-item ${analyticsBatchFilter === tab ? 'active-nav' : ''}`}
              >
                {tab === 'All' ? 'All Portfolio' : tab}
              </button>
            ))}
          </nav>
        )}

        {/* Sidebar Summary Stats */}
        <div className="sidebar-stats-section">
          <div className="nav-heading">Portfolio Aggregate</div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label">Total Leads</span>
            <span className="sidebar-stat-val font-mono">{totalLeads}</span>
          </div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label text-emerald">Signups</span>
            <span className="sidebar-stat-val font-mono text-emerald">{totalSignups}</span>
          </div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label text-indigo">Contacts</span>
            <span className="sidebar-stat-val font-mono text-indigo">{totalContacts}</span>
          </div>
          <div className="sidebar-stat-row">
            <span className="sidebar-stat-label">Active Projects</span>
            <span className="sidebar-stat-val font-mono">
              {activeProjectsCount} / {WEBSITES.length}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* ========================================================= */}
        {/* PAGE 1: PROJECTS DASHBOARD                                */}
        {/* ========================================================= */}
        {currentPage === 'projects' && (
          <>
            <header className="page-header-row">
              <div className="header-titles">
                <h1 className="main-page-title">Projects Dashboard</h1>
                <p className="main-page-subtitle">
                  Overview of all 42 tracked client platforms and individual lead metrics.
                </p>
              </div>

              <div className="header-actions">
                <button
                  onClick={() => setCurrentPage('recent-leads')}
                  className="btn-outline"
                >
                  <Icons.Recent />
                  <span>Recent Leads Feed</span>
                </button>
                <button
                  onClick={refreshAll}
                  disabled={loading}
                  className="btn-refresh"
                >
                  <Icons.Refresh spinning={loading} />
                  <span>Refresh</span>
                </button>
              </div>
            </header>

            {/* Quick KPI Strip */}
            <div className="kpi-strip">
              <div className="kpi-card">
                <div className="kpi-label">Total Lead Volume</div>
                <div className="kpi-number font-mono">{totalLeads}</div>
                <div className="kpi-subtext">Across all platforms</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Signups Completed</div>
                <div className="kpi-number font-mono text-emerald">{totalSignups}</div>
                <div className="kpi-subtext">
                  {totalLeads > 0 ? ((totalSignups / totalLeads) * 100).toFixed(1) : 0}% of total
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Inquiries & Contacts</div>
                <div className="kpi-number font-mono text-indigo">{totalContacts}</div>
                <div className="kpi-subtext">
                  {totalLeads > 0 ? ((totalContacts / totalLeads) * 100).toFixed(1) : 0}% of total
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Active Platforms</div>
                <div className="kpi-number font-mono">{activeProjectsCount}</div>
                <div className="kpi-subtext">With recorded conversions</div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="controls-bar">
              <div className="search-box">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Filter websites or folders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-field"
                />
              </div>

              <div className="controls-pills">
                {(['All', 'July 2026', 'June 2026'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterMonth(tab)}
                    className={`pill-btn ${filterMonth === tab ? 'pill-active' : ''}`}
                  >
                    {tab === 'All' ? 'All Batches' : tab}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-banner">
                <span>{error}</span>
              </div>
            )}

            {loading && Object.keys(data).length === 0 ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <div className="loading-message">Fetching platform counts...</div>
              </div>
            ) : (
              <div className="projects-section-container">
                {/* July 2026 Batch */}
                {julySites.length > 0 && (
                  <div className="batch-block">
                    <div className="batch-header-bar">
                      <span className="batch-tag-label tag-july">July 2026 Platform Batch</span>
                      <span className="batch-metric-count font-mono">{julySites.length} Platforms</span>
                    </div>
                    <div className="website-grid">
                      {julySites.map(site => (
                        <WebsiteCard key={site.name} site={site} counts={data[site.name]} />
                      ))}
                    </div>
                  </div>
                )}

                {/* June 2026 Batch */}
                {juneSites.length > 0 && (
                  <div className="batch-block">
                    <div className="batch-header-bar">
                      <span className="batch-tag-label tag-june">June 2026 Platform Batch</span>
                      <span className="batch-metric-count font-mono">{juneSites.length} Platforms</span>
                    </div>
                    <div className="website-grid">
                      {juneSites.map(site => (
                        <WebsiteCard key={site.name} site={site} counts={data[site.name]} />
                      ))}
                    </div>
                  </div>
                )}

                {filteredWebsites.length === 0 && (
                  <div className="empty-state-box">
                    <p>No platforms match the search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* PAGE 2: RECENT LEADS ACTIVITY (CATEGORIZED BY DAYS)       */}
        {/* ========================================================= */}
        {currentPage === 'recent-leads' && (
          <div className="recent-leads-page">
            <header className="page-header-row">
              <div className="header-titles">
                <div className="status-indicator-badge">
                  <span className="pulse-dot"></span>
                  <span>LIVE RECENT INCOMING FEED</span>
                </div>
                <h1 className="main-page-title">Recent Leads Activity</h1>
                <p className="main-page-subtitle">
                  Categorized daily stream showing which projects received leads today, yesterday, and earlier dates.
                </p>
              </div>

              <div className="header-actions">
                <button
                  onClick={() => setCurrentPage('analytics')}
                  className="btn-outline"
                >
                  <Icons.Analytics />
                  <span>View Analytics</span>
                </button>
                <button
                  onClick={refreshAll}
                  disabled={recentLoading}
                  className="btn-refresh"
                >
                  <Icons.Refresh spinning={recentLoading} />
                  <span>Refresh Stream</span>
                </button>
              </div>
            </header>

            {/* Daily Summary Cards */}
            <div className="kpi-strip">
              <div className="kpi-card highlight-card">
                <div className="kpi-label">Today's Leads</div>
                <div className="kpi-number font-mono text-emerald">{todayLeadsCount}</div>
                <div className="kpi-subtext">Recorded today</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Yesterday's Leads</div>
                <div className="kpi-number font-mono text-indigo">{yesterdayLeadsCount}</div>
                <div className="kpi-subtext">Recorded yesterday</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total In Live Stream</div>
                <div className="kpi-number font-mono">{recentLeads.length}</div>
                <div className="kpi-subtext">Historical submissions</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Conversion Split</div>
                <div className="kpi-number font-mono">
                  {recentLeads.filter(r => r.type === 'signup').length} / {recentLeads.filter(r => r.type === 'contact').length}
                </div>
                <div className="kpi-subtext">Signups vs Contacts</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="controls-bar">
              <div className="search-box">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Filter by project, submitter name, or email..."
                  value={recentSearch}
                  onChange={(e) => setRecentSearch(e.target.value)}
                  className="search-field"
                />
              </div>

              {/* Project Dropdown */}
              <select
                value={recentProjectFilter}
                onChange={(e) => setRecentProjectFilter(e.target.value)}
                className="select-field"
              >
                <option value="All">All Projects ({WEBSITES.length})</option>
                {WEBSITES.map(w => (
                  <option key={w.name} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>

              {/* Date Filter Pills */}
              <div className="controls-pills">
                <button
                  onClick={() => setRecentDateFilter('All')}
                  className={`pill-btn ${recentDateFilter === 'All' ? 'pill-active' : ''}`}
                >
                  All Dates
                </button>
                <button
                  onClick={() => setRecentDateFilter('today')}
                  className={`pill-btn ${recentDateFilter === 'today' ? 'pill-active' : ''}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setRecentDateFilter('yesterday')}
                  className={`pill-btn ${recentDateFilter === 'yesterday' ? 'pill-active' : ''}`}
                >
                  Yesterday
                </button>
              </div>

              {/* Type Filter Pills */}
              <div className="controls-pills">
                <button
                  onClick={() => setRecentTypeFilter('All')}
                  className={`pill-btn ${recentTypeFilter === 'All' ? 'pill-active' : ''}`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setRecentTypeFilter('signup')}
                  className={`pill-btn ${recentTypeFilter === 'signup' ? 'pill-active' : ''}`}
                >
                  Signups
                </button>
                <button
                  onClick={() => setRecentTypeFilter('contact')}
                  className={`pill-btn ${recentTypeFilter === 'contact' ? 'pill-active' : ''}`}
                >
                  Contacts
                </button>
              </div>
            </div>

            {/* Grouped By Days Feed */}
            {groupedRecentLeads.length === 0 ? (
              <div className="empty-state-box">
                <p>No recent lead submissions found for the selected criteria.</p>
              </div>
            ) : (
              <div className="day-groups-container">
                {groupedRecentLeads.map((group) => {
                  const signupsInGroup = group.leads.filter(l => l.type === 'signup').length;
                  const contactsInGroup = group.leads.filter(l => l.type === 'contact').length;

                  return (
                    <div key={group.key} className="day-group-section">
                      {/* Day Header Bar */}
                      <div className="day-header-bar">
                        <div className="day-header-left">
                          <Icons.Calendar />
                          <h3 className="day-title">{group.label}</h3>
                          {group.fullDate && group.label !== group.fullDate && (
                            <span className="day-subdate font-mono">({group.fullDate})</span>
                          )}
                        </div>

                        <div className="day-header-stats">
                          <span className="day-stat-chip chip-total font-mono">
                            {group.leads.length} lead{group.leads.length !== 1 ? 's' : ''}
                          </span>
                          {signupsInGroup > 0 && (
                            <span className="day-stat-chip chip-signup font-mono">
                              {signupsInGroup} Signup{signupsInGroup !== 1 ? 's' : ''}
                            </span>
                          )}
                          {contactsInGroup > 0 && (
                            <span className="day-stat-chip chip-contact font-mono">
                              {contactsInGroup} Contact{contactsInGroup !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Day Table */}
                      <div className="table-wrapper">
                        <table className="enterprise-table">
                          <thead>
                            <tr>
                              <th style={{ width: '130px' }}>Time</th>
                              <th>Target Platform / Project</th>
                              <th style={{ width: '120px' }}>Type</th>
                              <th>Submitter Details</th>
                              <th style={{ width: '140px' }} className="text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.leads.map(lead => {
                              const siteMeta = WEBSITES.find(w => w.name === lead.website);
                              const isSignup = lead.type === 'signup';

                              return (
                                <tr key={lead.id} className="data-row">
                                  {/* Time Column */}
                                  <td>
                                    <div className="time-display">
                                      <span className="time-primary font-mono">
                                        {formatTimeOnly(lead.created_at)}
                                      </span>
                                      <span className="time-relative font-mono">
                                        {formatRelativeTime(lead.created_at)}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Project Column */}
                                  <td>
                                    <div className="project-display">
                                      <div className="project-badge-avatar font-mono">
                                        {lead.website.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="project-name-text">{lead.website}</div>
                                        {siteMeta && (
                                          <div className="project-subtext-batch">{siteMeta.month}</div>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Type Column */}
                                  <td>
                                    <span className={`status-pill ${isSignup ? 'pill-signup' : 'pill-contact'}`}>
                                      {isSignup ? 'SIGNUP' : 'CONTACT'}
                                    </span>
                                  </td>

                                  {/* Submitter Column */}
                                  <td>
                                    <div className="submitter-display">
                                      <span className="submitter-name-text">
                                        {lead.name || 'Anonymous Contact'}
                                      </span>
                                      {lead.email && (
                                        <div className="submitter-email-row">
                                          <span className="submitter-email-text font-mono">
                                            {lead.email}
                                          </span>
                                          <button
                                            onClick={() => copyToClipboard(lead.email!, lead.id)}
                                            className="copy-icon-btn"
                                            title="Copy email to clipboard"
                                          >
                                            {copiedId === lead.id ? <Icons.Check /> : <Icons.Copy />}
                                          </button>
                                        </div>
                                      )}
                                      {lead.phone && (
                                        <div className="submitter-email-row">
                                          <span className="submitter-email-text font-mono">
                                            {lead.phone}
                                          </span>
                                          <button
                                            onClick={() => copyToClipboard(lead.phone!, `${lead.id}-phone`)}
                                            className="copy-icon-btn"
                                            title="Copy phone to clipboard"
                                          >
                                            {copiedId === `${lead.id}-phone` ? <Icons.Check /> : <Icons.Copy />}
                                          </button>
                                        </div>
                                      )}
                                      {lead.country && (
                                        <div className="submitter-email-row">
                                          <span className="submitter-email-text font-mono" style={{ color: 'var(--text-muted)' }}>
                                            {lead.country}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  {/* Action Column */}
                                  <td className="text-right">
                                    <button
                                      onClick={() => jumpToProject(lead.website)}
                                      className="btn-action-view"
                                      title="Open in Projects Dashboard"
                                    >
                                      <span>View</span>
                                      <Icons.ChevronRight />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 3: FULL ANALYTICS & PERFORMANCE                      */}
        {/* ========================================================= */}
        {currentPage === 'analytics' && (
          <div className="analytics-page">
            <header className="page-header-row">
              <div className="header-titles">
                <h1 className="main-page-title">Analytics & Intelligence</h1>
                <p className="main-page-subtitle">
                  Comprehensive performance reporting, daily lead velocities, and portfolio rankings.
                </p>
              </div>

              <div className="header-actions">
                <button
                  onClick={() => setCurrentPage('projects')}
                  className="btn-outline"
                >
                  <Icons.Projects />
                  <span>Projects Dashboard</span>
                </button>
                <button
                  onClick={refreshAll}
                  disabled={loading}
                  className="btn-refresh"
                >
                  <Icons.Refresh spinning={loading} />
                  <span>Refresh Data</span>
                </button>
              </div>
            </header>

            {/* High-level KPIs */}
            <div className="kpi-strip">
              <div className="kpi-card">
                <div className="kpi-label">Portfolio Conversion Total</div>
                <div className="kpi-number font-mono">{totalLeads}</div>
                <div className="kpi-subtext">Cumulative submissions</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Signup Share</div>
                <div className="kpi-number font-mono text-emerald">
                  {totalLeads > 0 ? ((totalSignups / totalLeads) * 100).toFixed(1) : 0}%
                </div>
                <div className="kpi-subtext">{totalSignups} verified signups</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Inquiry Share</div>
                <div className="kpi-number font-mono text-indigo">
                  {totalLeads > 0 ? ((totalContacts / totalLeads) * 100).toFixed(1) : 0}%
                </div>
                <div className="kpi-subtext">{totalContacts} verified contacts</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Portfolio Active Rate</div>
                <div className="kpi-number font-mono">
                  {((activeProjectsCount / WEBSITES.length) * 100).toFixed(0)}%
                </div>
                <div className="kpi-subtext">
                  {activeProjectsCount} of {WEBSITES.length} generating leads
                </div>
              </div>
            </div>

            {/* Batch Comparison Section */}
            <div className="analytics-dual-grid">
              <div className="analytics-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Batch Comparison Matrix</h3>
                  <span className="panel-badge font-mono">2 Batches</span>
                </div>

                <div className="batch-comparison-cards">
                  {/* July Batch Card */}
                  <div className="batch-compare-card border-july">
                    <div className="compare-card-top">
                      <span className="batch-tag-label tag-july">July 2026 Batch</span>
                      <span className="compare-total font-mono">{analyticsData.july.total} Leads</span>
                    </div>
                    <div className="compare-card-metrics">
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Platforms</span>
                        <span className="compare-metric-val font-mono">{analyticsData.july.count}</span>
                      </div>
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Signups</span>
                        <span className="compare-metric-val font-mono text-emerald">{analyticsData.july.signups}</span>
                      </div>
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Contacts</span>
                        <span className="compare-metric-val font-mono text-indigo">{analyticsData.july.contacts}</span>
                      </div>
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Avg / Site</span>
                        <span className="compare-metric-val font-mono">
                          {(analyticsData.july.total / (analyticsData.july.count || 1)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* June Batch Card */}
                  <div className="batch-compare-card border-june">
                    <div className="compare-card-top">
                      <span className="batch-tag-label tag-june">June 2026 Batch</span>
                      <span className="compare-total font-mono">{analyticsData.june.total} Leads</span>
                    </div>
                    <div className="compare-card-metrics">
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Platforms</span>
                        <span className="compare-metric-val font-mono">{analyticsData.june.count}</span>
                      </div>
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Signups</span>
                        <span className="compare-metric-val font-mono text-emerald">{analyticsData.june.signups}</span>
                      </div>
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Contacts</span>
                        <span className="compare-metric-val font-mono text-indigo">{analyticsData.june.contacts}</span>
                      </div>
                      <div className="compare-metric-item">
                        <span className="compare-metric-label">Avg / Site</span>
                        <span className="compare-metric-val font-mono">
                          {(analyticsData.june.total / (analyticsData.june.count || 1)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Velocity Breakdown */}
              <div className="analytics-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Daily Submission Velocity</h3>
                  <span className="panel-badge font-mono">Recent Days</span>
                </div>

                <div className="daily-velocity-list">
                  {analyticsData.dailyTimeline.map((item) => {
                    const maxDaily = Math.max(...analyticsData.dailyTimeline.map(d => d.total), 1);
                    const pct = (item.total / maxDaily) * 100;

                    return (
                      <div key={item.key} className="velocity-row">
                        <div className="velocity-row-info">
                          <span className="velocity-day font-mono">{item.label}</span>
                          <span className="velocity-counts font-mono">
                            <span className="text-emerald">{item.signups}s</span> /{' '}
                            <span className="text-indigo">{item.contacts}c</span> ({item.total} total)
                          </span>
                        </div>
                        <div className="velocity-bar-track">
                          <div
                            className="velocity-bar-fill"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Platform Leaderboard & Performance Table */}
            <div className="analytics-panel full-width-panel">
              <div className="panel-header flex-between">
                <div>
                  <h3 className="panel-title">Platform Performance Matrix</h3>
                  <p className="panel-subtitle">Ranked analysis of lead generation by individual client site.</p>
                </div>

                <div className="panel-controls">
                  <span className="control-label">Sort by:</span>
                  <div className="controls-pills">
                    <button
                      onClick={() => setAnalyticsSortBy('leads')}
                      className={`pill-btn ${analyticsSortBy === 'leads' ? 'pill-active' : ''}`}
                    >
                      Total Leads
                    </button>
                    <button
                      onClick={() => setAnalyticsSortBy('signups')}
                      className={`pill-btn ${analyticsSortBy === 'signups' ? 'pill-active' : ''}`}
                    >
                      Signups
                    </button>
                    <button
                      onClick={() => setAnalyticsSortBy('contacts')}
                      className={`pill-btn ${analyticsSortBy === 'contacts' ? 'pill-active' : ''}`}
                    >
                      Contacts
                    </button>
                    <button
                      onClick={() => setAnalyticsSortBy('name')}
                      className={`pill-btn ${analyticsSortBy === 'name' ? 'pill-active' : ''}`}
                    >
                      Name
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Rank</th>
                      <th>Platform Name</th>
                      <th>Batch</th>
                      <th className="text-right">Signups</th>
                      <th className="text-right">Contacts</th>
                      <th className="text-right">Total Leads</th>
                      <th style={{ width: '180px' }}>Volume Share</th>
                      <th style={{ width: '100px' }} className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.projects.map((p, index) => (
                      <tr key={p.name} className="data-row">
                        <td className="font-mono text-muted">
                          #{index + 1}
                        </td>
                        <td>
                          <div className="platform-cell">
                            <span className="platform-name font-bold">{p.name}</span>
                            <span className="platform-folder font-mono text-muted">{p.folder}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`batch-tag-label ${p.month === 'July 2026' ? 'tag-july' : 'tag-june'}`}>
                            {p.month}
                          </span>
                        </td>
                        <td className="text-right font-mono text-emerald">
                          {p.signups}
                        </td>
                        <td className="text-right font-mono text-indigo">
                          {p.contacts}
                        </td>
                        <td className="text-right font-mono font-bold">
                          {p.total}
                        </td>
                        <td>
                          <div className="share-cell">
                            <div className="share-track">
                              <div
                                className="share-fill"
                                style={{ width: `${Math.min(p.share, 100)}%` }}
                              ></div>
                            </div>
                            <span className="share-text font-mono">{p.share.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => jumpToProject(p.name)}
                            className="btn-action-view"
                          >
                            <span>View</span>
                            <Icons.ChevronRight />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
    <div className={`website-card ${total > 0 ? 'card-has-leads' : ''}`}>
      <div className="card-header">
        <div className="card-title-group">
          <h3 className="card-name">{site.name}</h3>
          <span className="card-folder font-mono">{site.folder}</span>
        </div>
        {total > 0 && <span className="active-dot-status" title="Active Leads Recorded"></span>}
      </div>

      <div className="card-counters">
        <div className="counter-box">
          <div className="counter-label">Signups</div>
          <div className="counter-value font-mono text-emerald">{sCount}</div>
        </div>
        <div className="counter-box">
          <div className="counter-label">Contacts</div>
          <div className="counter-value font-mono text-indigo">{cCount}</div>
        </div>
      </div>

      <div className="card-footer">
        <span className="aggregate-label">Aggregate Leads</span>
        <span className="aggregate-value font-mono">{total}</span>
      </div>
    </div>
  );
}
