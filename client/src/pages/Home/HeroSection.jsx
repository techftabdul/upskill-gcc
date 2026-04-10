import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import WaitlistModal from '../../components/shared/WaitlistModal';
import { saveWaitlistEmail } from '../../firebase/firestore';
import './HeroSection.css';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { success, error } = await saveWaitlistEmail(email);
      if (!success) throw new Error(error);
      setIsModalOpen(true);
      setEmail('');
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.');
      console.error('Waitlist save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
      </div>
      
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Sparkles size={16} className="badge-icon" />
            <span>The #1 platform for MEA professionals</span>
          </motion.div>
          
          <h1 className="hero-title">
            Get Job-Ready for the <span className="text-gradient">Gulf</span>
          </h1>
          
          <p className="hero-subtitle">
            Master workplace Arabic, optimize your CV for GCC employers, and build high-demand digital skills. Join the fastest growing community of expats advancing their careers.
          </p>
          
          <div className="hero-cta-wrapper">
            <form onSubmit={handleSubmit} className="hero-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="hero-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="hero-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'} <ArrowRight size={18} />
              </Button>
            </form>
            {submitError && (
              <p className="hero-error" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {submitError}
              </p>
            )}
            <p className="hero-guarantee">Over 5,000 professionals already on the waitlist.</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="hero-mockup-card">
            <div className="mockup-header">
              <div className="dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-line title"></div>
              <div className="mockup-line"></div>
              <div className="mockup-line"></div>
              <div className="mockup-line short"></div>
              <br/>
              <div className="mockup-box"></div>
              <div className="mockup-box"></div>
            </div>
          </div>
        </motion.div>
      </div>

      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default HeroSection;
