import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  Linkedin,
  GraduationCap,
  Eye,
  Trash2,
  Sparkles,
  History as HistoryIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserGenerations, deleteGeneration } from '../../services/historyService';
import ResultModal from '../../components/shared/ResultModal';
import Button from '../../components/ui/Button';
import './History.css';

// ─── Helpers ──────────────────────────────────────────────────
const TYPE_CONFIG = {
  cv: {
    label: 'CV Optimization',
    icon: <FileText size={20} />,
    badgeClass: 'history-card__badge--cv',
    accentColor: '#0284c7',
  },
  linkedin: {
    label: 'LinkedIn Optimization',
    icon: <Linkedin size={20} />,
    badgeClass: 'history-card__badge--linkedin',
    accentColor: '#0a66c2',
  },
  'skill-gap': {
    label: 'Skill Gap Analysis',
    icon: <GraduationCap size={20} />,
    badgeClass: 'history-card__badge--skill-gap',
    accentColor: '#16a34a',
  },
};

const formatDate = (isoString) => {
  if (!isoString) return 'Just now';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getPreview = (output) => {
  if (!output) return '';
  // Strip markdown characters for a cleaner preview
  const cleaned = output.replace(/[#*_`>\-]/g, '').replace(/\n+/g, ' ').trim();
  return cleaned.length > 120 ? cleaned.slice(0, 120) + '…' : cleaned;
};

// ═══════════════════════════════════════════════════════════════
// HISTORY PAGE
// ═══════════════════════════════════════════════════════════════
const History = () => {
  const { currentUser } = useAuth();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'cv' | 'linkedin' | 'skill-gap'

  // Modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Deletion state
  const [deletingId, setDeletingId] = useState(null);

  // ─── Fetch data ─────────────────────────────────────────────
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) return;
      try {
        const data = await getUserGenerations(100);
        setGenerations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [currentUser]);

  // ─── Filtered + searched list ───────────────────────────────
  const filtered = useMemo(() => {
    let list = generations;
    if (filter !== 'all') {
      list = list.filter((g) => g.type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.output?.toLowerCase().includes(q) ||
          g.type?.toLowerCase().includes(q) ||
          JSON.stringify(g.input || {}).toLowerCase().includes(q)
      );
    }
    return list;
  }, [generations, filter, search]);

  // ─── Stats ──────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: generations.length,
    cv: generations.filter((g) => g.type === 'cv').length,
    linkedin: generations.filter((g) => g.type === 'linkedin').length,
    skillGap: generations.filter((g) => g.type === 'skill-gap').length,
  }), [generations]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this generation? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="history-loading">
        <div>
          <span className="spinner-dot" />
          <span className="spinner-dot" />
          <span className="spinner-dot" />
        </div>
        <p style={{ marginTop: '1rem' }}>Loading your AI history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="history-empty">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const typeConfig = selectedItem ? TYPE_CONFIG[selectedItem.type] || TYPE_CONFIG.cv : TYPE_CONFIG.cv;

  return (
    <div className="history-page">
      {/* ─── Header ────────────────────────────── */}
      <div className="history-header">
        <h1>AI History</h1>
        <p>Browse and manage all your AI-generated optimizations in one place.</p>
      </div>

      {/* ─── Stats Bar ─────────────────────────── */}
      {generations.length > 0 && (
        <div className="history-stats">
          <div className="history-stat">
            <span className="history-stat__number">{stats.total}</span>
            <span className="history-stat__label">Total Generations</span>
          </div>
          <div className="history-stat__divider" />
          <div className="history-stat">
            <FileText size={16} color="#0284c7" />
            <span className="history-stat__number">{stats.cv}</span>
            <span className="history-stat__label">CVs</span>
          </div>
          <div className="history-stat__divider" />
          <div className="history-stat">
            <Linkedin size={16} color="#0a66c2" />
            <span className="history-stat__number">{stats.linkedin}</span>
            <span className="history-stat__label">LinkedIn</span>
          </div>
          <div className="history-stat__divider" />
          <div className="history-stat">
            <GraduationCap size={16} color="#16a34a" />
            <span className="history-stat__number">{stats.skillGap}</span>
            <span className="history-stat__label">Skill Gap</span>
          </div>
        </div>
      )}

      {/* ─── Toolbar ───────────────────────────── */}
      <div className="history-toolbar">
        <div className="history-search-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="history-search"
            placeholder="Search your generations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['all', 'cv', 'linkedin', 'skill-gap'].map((f) => (
          <button
            key={f}
            className={`history-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : TYPE_CONFIG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* ─── Empty State ───────────────────────── */}
      {filtered.length === 0 && (
        <div className="history-empty">
          <div className="history-empty__icon">
            {search || filter !== 'all' ? <Search size={28} /> : <HistoryIcon size={28} />}
          </div>
          <h3>
            {search || filter !== 'all'
              ? 'No matching results'
              : 'No AI generations yet'}
          </h3>
          <p>
            {search || filter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Use our AI tools to optimize your CV, LinkedIn profile, or analyze skill gaps.'}
          </p>
          {!search && filter === 'all' && (
            <Link to="/toolkit" style={{ textDecoration: 'none' }}>
              <Button variant="accent">
                <Sparkles size={16} /> Open AI Toolkit
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* ─── Generation Cards ──────────────────── */}
      {filtered.length > 0 && (
        <div className="history-list">
          {filtered.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.cv;
            return (
              <div key={item.id} className="history-card">
                <div className={`history-card__badge ${config.badgeClass}`}>
                  {config.icon}
                </div>

                <div className="history-card__info">
                  <div className="history-card__type-row">
                    <span className="history-card__type">{config.label}</span>
                    <span className="history-card__date">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="history-card__preview">{getPreview(item.output)}</p>
                </div>

                <div className="history-card__actions">
                  <button
                    className="history-card__view-btn"
                    onClick={() => handleView(item)}
                  >
                    <Eye size={15} /> View
                  </button>
                  <button
                    className="history-card__delete-btn"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Result Viewer Modal ────────────────── */}
      <ResultModal
        isOpen={showModal && !!selectedItem}
        onClose={() => { setShowModal(false); setSelectedItem(null); }}
        onRegenerate={() => setShowModal(false)}
        result={selectedItem?.output || ''}
        title={typeConfig.label}
        icon={typeConfig.icon}
        accentColor={typeConfig.accentColor}
        tags={
          selectedItem?.input
            ? Object.values(selectedItem.input).filter(Boolean).slice(0, 3)
            : []
        }
        creditsRemaining={null}
        showDownload={true}
        downloadMeta={{
          targetRole: selectedItem?.input?.targetRole || '',
          targetCountry: selectedItem?.input?.targetCountry || '',
        }}
        showRegenerate={false}
      />
    </div>
  );
};

export default History;
