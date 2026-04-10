import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserData } from '../../firebase/firestore';
import { getRecentGenerations } from '../../services/historyService';
import Button from '../../components/ui/Button';
import ResultModal from '../../components/shared/ResultModal';
import { Coins, FileText, Linkedin, GraduationCap, ArrowRight, Eye } from 'lucide-react';
import './Dashboard.css';

// ─── Type config (shared with History) ────────────────────────
const TYPE_CONFIG = {
  cv: { label: 'CV Optimization', icon: <FileText size={18} />, color: '#0284c7' },
  linkedin: { label: 'LinkedIn Optimization', icon: <Linkedin size={18} />, color: '#0a66c2' },
  'skill-gap': { label: 'Skill Gap Analysis', icon: <GraduationCap size={18} />, color: '#16a34a' },
};

const formatDate = (iso) => {
  if (!iso) return 'Just now';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getPreview = (output) => {
  if (!output) return '';
  const cleaned = output.replace(/[#*_`>\-]/g, '').replace(/\n+/g, ' ').trim();
  return cleaned.length > 80 ? cleaned.slice(0, 80) + '…' : cleaned;
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Modal state for viewing a generation
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Fetch user profile data
        const userDataRes = await getUserData(currentUser.uid);
        if (userDataRes.data) {
          setUserData(userDataRes.data);
        }

        // Fetch recent AI generations from the unified collection
        const recent = await getRecentGenerations(5);
        setRecentActivity(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const credits = userData?.credits ?? 0;

  // Compute stats from recent activity (or show 0)
  const stats = {
    cvs: recentActivity.filter((g) => g.type === 'cv').length,
    linkedins: recentActivity.filter((g) => g.type === 'linkedin').length,
    skills: recentActivity.filter((g) => g.type === 'skill-gap').length,
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const typeConfig = selectedItem
    ? TYPE_CONFIG[selectedItem.type] || TYPE_CONFIG.cv
    : TYPE_CONFIG.cv;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {userData?.name || currentUser?.email || 'User'}!</h1>
        <p>Here is an overview of your AI-powered career tools and recent activity.</p>
        <Link to="/toolkit" style={{ textDecoration: 'none' }}>
          <Button variant="accent">Open AI Toolkit</Button>
        </Link>
      </div>

      {/* Credits + Stats */}
      <div className="dashboard-stats">
        <div className="stat-card stat-card--credits">
          <div className="stat-card__icon">
            <Coins size={22} />
          </div>
          <div>
            <h3>Credits Remaining</h3>
            <p className="stat-number stat-number--credits">{credits}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <FileText size={22} />
          </div>
          <div>
            <h3>CV Optimizations</h3>
            <p className="stat-number">{stats.cvs}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--indigo">
            <Linkedin size={22} />
          </div>
          <div>
            <h3>LinkedIn Optimizations</h3>
            <p className="stat-number">{stats.linkedins}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <GraduationCap size={22} />
          </div>
          <div>
            <h3>Skill Gap Analyses</h3>
            <p className="stat-number">{stats.skills}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-activity">
        <div className="dashboard-activity__header">
          <h2>Recent Activity</h2>
          {recentActivity.length > 0 && (
            <Link to="/history" className="dashboard-activity__link">
              View All <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <p className="no-activity">You haven't generated any AI results yet.</p>
        ) : (
          <div className="activity-cards">
            {recentActivity.map((item) => {
              const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.cv;
              return (
                <div key={item.id} className="activity-card">
                  <div
                    className="activity-card__icon"
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    {config.icon}
                  </div>
                  <div className="activity-card__info">
                    <span className="activity-card__type">{config.label}</span>
                    <span className="activity-card__preview">{getPreview(item.output)}</span>
                    <span className="activity-card__date">{formatDate(item.createdAt)}</span>
                  </div>
                  <button
                    className="activity-card__view-btn"
                    onClick={() => handleView(item)}
                    title="View full result"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Result Viewer Modal */}
      <ResultModal
        isOpen={showModal && !!selectedItem}
        onClose={() => { setShowModal(false); setSelectedItem(null); }}
        onRegenerate={() => setShowModal(false)}
        result={selectedItem?.output || ''}
        title={typeConfig.label}
        icon={typeConfig.icon}
        accentColor={typeConfig.color}
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

export default Dashboard;
