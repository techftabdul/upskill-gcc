import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Linkedin, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <BookOpen className="footer-logo-icon" size={24} />
            <span className="footer-logo-text">Upskill</span>
          </Link>
          <p className="footer-description">
            The leading edtech platform to get expats job-ready for the Gulf market.
          </p>
          <div className="footer-socials">
            <a href="https://x.com/techftabdul" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X / Twitter"><Twitter size={20} /></a>
            <a href="https://linkedin.com/in/techftabdul" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="https://github.com/techftabdul" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><Github size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <h4 className="footer-heading">Platform</h4>
            <a href="/#features" className="footer-link">Features</a>
            <a href="/#testimonials" className="footer-link">Testimonials</a>
            <Link to="/bootcamps" className="footer-link">Bootcamps</Link>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <Link to="/dashboard" className="footer-link">Dashboard Demo</Link>
            <Link to="/toolkit" className="footer-link">AI Toolkit</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Upskill. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

