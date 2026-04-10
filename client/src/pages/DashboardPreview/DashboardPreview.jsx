import { motion } from 'framer-motion';
import { Award, Target, BookOpen } from 'lucide-react';
import Card from '../../components/ui/Card';
import CourseList from '../../components/shared/CourseList';
import './DashboardPreview.css';

const DashboardPreview = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header-bg"></div>
      
      <div className="container dashboard-container">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="user-info">
            <h1 className="dashboard-title">Welcome back, Sarah!</h1>
            <p className="dashboard-subtitle">You match with 85% of standard GCC Marketing Manager roles.</p>
          </div>
        </motion.div>
        
        <div className="dashboard-metrics">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="metric-card bg-blue-light">
              <div className="metric-icon-wrapper text-blue">
                <Target size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Profile Strength</p>
                <h3 className="metric-value">85%</h3>
              </div>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="metric-card bg-green-light">
              <div className="metric-icon-wrapper text-green">
                <Award size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Skills Learned</p>
                <h3 className="metric-value">12</h3>
              </div>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="metric-card bg-orange-light">
              <div className="metric-icon-wrapper text-orange">
                <BookOpen size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Active Courses</p>
                <h3 className="metric-value">2</h3>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-header">
            <h2 className="section-title">Recommended for your Next Step</h2>
            <p className="section-subtitle">Based on your goal: Senior Marketing Manager in Dubai</p>
          </div>
          
          <CourseList />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPreview;
