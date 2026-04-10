import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Linkedin, GraduationCap, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import './ToolkitDashboard.css';

const ToolkitDashboard = () => {
  return (
    <div className="toolkit-dashboard-page">
      <div className="container">
        <div className="dashboard-header text-center">
          <h1 className="dashboard-title">AI Career Copilot</h1>
          <p className="dashboard-subtitle">Select a tool below to accelerate your job search in the GCC market.</p>
        </div>

        <div className="tools-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/toolkit/cv-optimizer" className="tool-link">
              <Card hoverEffect className="tool-card">
                <div className="card-icon blue bg-blue-100">
                  <FileText size={28} />
                </div>
                <h3 className="card-title">CV Optimizer</h3>
                <p className="card-desc">Rewrite your CV to pass regional ATS systems and impress top recruiters.</p>
                <div className="tool-action blue">
                  Use Tool <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/toolkit/linkedin-optimizer" className="tool-link">
              <Card hoverEffect className="tool-card">
                <div className="card-icon brand-li bg-li-100">
                  <Linkedin size={28} />
                </div>
                <h3 className="card-title">LinkedIn Optimizer</h3>
                <p className="card-desc">Enhance your headline and profile to attract inbound headhunter messages.</p>
                <div className="tool-action brand-li">
                  Use Tool <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link to="/toolkit/skill-gap" className="tool-link">
              <Card hoverEffect className="tool-card">
                <div className="card-icon green bg-green-100">
                  <GraduationCap size={28} />
                </div>
                <h3 className="card-title">Skill Gap Analyzer</h3>
                <p className="card-desc">Compare your skills against your dream job and get a 3-month action plan.</p>
                <div className="tool-action green">
                  Use Tool <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ToolkitDashboard;
