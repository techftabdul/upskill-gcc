import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getUserCVOptimizations,
  getUserLinkedinOptimizations,
  getUserSkillAnalyses,
  getUserData
} from '../../firebase/firestore';
import Button from '../../components/ui/Button';
import { downloadAsPDF } from '../../utils/pdfExport';
import { Coins, FileText, Linkedin, GraduationCap } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ cvs: 0, linkedins: 0, skills: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [savedCVs, setSavedCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const userDataRes = await getUserData(currentUser.uid);
        if (userDataRes.data) {
          setUserData(userDataRes.data);
        }

        const [cvRes, lnRes, skRes] = await Promise.all([
          getUserCVOptimizations(currentUser.uid),
          getUserLinkedinOptimizations(currentUser.uid),
          getUserSkillAnalyses(currentUser.uid)
        ]);

        const cvs = cvRes.data || [];
        const linkedins = lnRes.data || [];
        const skills = skRes.data || [];

        setStats({
          cvs: cvs.length,
          linkedins: linkedins.length,
          skills: skills.length
        });

        setSavedCVs(cvs);

        // Combine and sort for recent activity
        const combined = [
          ...cvs.map(i => ({ ...i, type: 'CV Optimization', icon: 'cv' })),
          ...linkedins.map(i => ({ ...i, type: 'LinkedIn Optimization', icon: 'linkedin' })),
          ...skills.map(i => ({ ...i, type: 'Skill Analysis', icon: 'skill' }))
        ].sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
          return timeB - timeA;
        }).slice(0, 5);

        setRecentActivity(combined);
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

      <div className="dashboard-activity">
        <h2>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="no-activity">You haven't generated any AI results yet.</p>
        ) : (
          <ul className="activity-list">
            {recentActivity.map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-type">{activity.type}</div>
                <div className="activity-role">Target Role: {activity.targetRole || 'N/A'}</div>
                <div className="activity-date">
                  {activity.createdAt?.toMillis ? new Date(activity.createdAt.toMillis()).toLocaleDateString() : 'Just now'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {savedCVs.length > 0 && (
        <div className="saved-cvs-section">
          <h2>Saved CVs</h2>
          <div className="saved-cvs-list">
            {savedCVs.map((cv, index) => (
              <div key={index} className="saved-cv-card">
                <div className="saved-cv-info">
                  <p className="saved-cv-role">{cv.targetRole || 'General Professional'}</p>
                  <p className="saved-cv-meta">
                    {cv.targetCountry} &bull;&nbsp;
                    {cv.createdAt?.toMillis ? new Date(cv.createdAt.toMillis()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAsPDF(cv.optimizedCV || '', cv.targetRole, cv.targetCountry)}
                  className="saved-cv-download-btn"
                >
                  ⬇ Download PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
