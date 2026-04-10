import { motion } from 'framer-motion';
import { Languages, FileText, Code } from 'lucide-react';
import Card from '../../components/ui/Card';
import './FeaturesSection.css';

const features = [
  {
    id: 1,
    title: 'Workplace Arabic',
    description: 'Master the essential vocabulary and etiquette to thrive in GCC corporate environments and build stronger relationships.',
    icon: <Languages size={32} className="feature-icon-svg text-blue" />,
    colorClass: 'icon-bg-blue'
  },
  {
    id: 2,
    title: 'GCC CV & LinkedIn',
    description: 'Optimize your professional profile for regional ATS systems and recruiters with our specialized templates and AI tools.',
    icon: <FileText size={32} className="feature-icon-svg text-orange" />,
    colorClass: 'icon-bg-orange'
  },
  {
    id: 3,
    title: 'Digital Skills Bootcamps',
    description: 'Learn in-demand skills tailored for the rapidly digitizing Middle East economy, from data analytics to digital marketing.',
    icon: <Code size={32} className="feature-icon-svg text-green" />,
    colorClass: 'icon-bg-green'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-subtitle">
            Expert-led programs designed specifically to bridge the gap between your current experience and the demands of the Gulf job market.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card hoverEffect className="feature-card">
                <div className={`feature-icon ${feature.colorClass}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
