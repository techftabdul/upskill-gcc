import { useState } from 'react';
import {
  Cpu,
  BarChart2,
  Briefcase,
  MessageCircle,
  CheckCircle2,
  Loader2,
  AlertCircle,
  GraduationCap,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { saveCourseFeedback } from '../../firebase/firestore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import './Bootcamps.css';

// ─── Bootcamp data ─────────────────────────────────────────────
const BOOTCAMPS = [
  {
    id: 'ai-tools',
    icon: <Cpu size={28} />,
    iconColor: '#7c3aed',
    iconBg: 'rgba(124, 58, 237, 0.1)',
    title: 'AI Tools Fundamentals',
    description:
      'Master ChatGPT, Copilot, and emerging AI tools to automate tasks, boost productivity, and stand out in any GCC role.',
  },
  {
    id: 'digital-marketing',
    icon: <BarChart2 size={28} />,
    iconColor: '#0284c7',
    iconBg: 'rgba(2, 132, 199, 0.1)',
    title: 'Digital Marketing for GCC Businesses',
    description:
      'Learn Meta Ads, Google Analytics, and localised content strategies built for the Saudi and UAE markets.',
  },
  {
    id: 'freelancing',
    icon: <Briefcase size={28} />,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    title: 'Freelancing & Client Acquisition',
    description:
      'Build a profitable freelance business — from pricing your services to landing high-value Gulf clients remotely.',
  },
  {
    id: 'arabic',
    icon: <MessageCircle size={28} />,
    iconColor: '#16a34a',
    iconBg: 'rgba(22, 163, 74, 0.1)',
    title: 'Workplace Arabic for Professionals',
    description:
      'Practical, context-aware Arabic phrases and etiquette to communicate confidently in GCC offices and meetings.',
  },
];

// ─── Animation variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

// ─── Sub-components ─────────────────────────────────────────────
const BootcampCard = ({ bootcamp, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeUp}
  >
    <Card hoverEffect className="bootcamp-card">
      <div
        className="bootcamp-card__icon"
        style={{ background: bootcamp.iconBg, color: bootcamp.iconColor }}
      >
        {bootcamp.icon}
      </div>
      <div className="bootcamp-card__body">
        <span className="coming-soon-badge">Coming Soon</span>
        <h3 className="bootcamp-card__title">{bootcamp.title}</h3>
        <p className="bootcamp-card__desc">{bootcamp.description}</p>
      </div>
    </Card>
  </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────
const Bootcamps = () => {
  const { currentUser } = useAuth();

  const [suggestedCourse, setSuggestedCourse] = useState('');
  const [feedbackReason, setFeedbackReason] = useState('');
  const [otherFeedback, setOtherFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!suggestedCourse.trim()) {
      setError('Please enter a course suggestion before submitting.');
      return;
    }
    if (!feedbackReason.trim()) {
      setError('Please tell us why this course would help your career.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveCourseFeedback({
        userId: currentUser?.uid || null,
        suggestedCourse: suggestedCourse.trim(),
        feedbackReason: feedbackReason.trim(),
      });

      if (!result.success) throw new Error(result.error);

      setSuccessMsg('Thank you! Your feedback helps shape future Upskill bootcamps.');
      setSuggestedCourse('');
      setFeedbackReason('');
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to submit feedback. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bootcamps-page">
      <div className="container">

        {/* ─── HERO ─────────────────────────────────── */}
        <motion.section
          className="bootcamps-hero"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="bootcamps-hero__eyebrow">
            <GraduationCap size={16} />
            Digital Bootcamps
          </div>
          <h1 className="bootcamps-hero__title">
            Digital Bootcamps
            <span className="bootcamps-hero__title--accent"> Coming Soon</span>
          </h1>
          <p className="bootcamps-hero__subtitle">
            We're building practical, job-ready bootcamps tailored to help ambitious professionals
            and expats succeed in the GCC market.
          </p>
          <div className="bootcamps-hero__pill-row">
            <span className="bootcamps-pill">🎯 GCC-Focused Curriculum</span>
            <span className="bootcamps-pill">⚡ Project-Based Learning</span>
            <span className="bootcamps-pill">📜 Career Certificates</span>
          </div>
        </motion.section>

        {/* ─── BOOTCAMP CARDS ──────────────────────── */}
        <section className="bootcamps-section">
          <motion.div
            className="bootcamps-section__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2>Planned Courses</h2>
            <p>A first look at what we're cooking — shaped by professionals just like you.</p>
          </motion.div>

          <div className="bootcamps-grid">
            {BOOTCAMPS.map((bootcamp, index) => (
              <BootcampCard key={bootcamp.id} bootcamp={bootcamp} index={index} />
            ))}
          </div>
        </section>

        {/* ─── FEEDBACK FORM ───────────────────────── */}
        <motion.section
          className="bootcamps-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <div className="bootcamps-section__header">
            <h2>Shape the Roadmap</h2>
            <p>
              Tell us what you need. Every submission directly influences which bootcamps we build
              next.
            </p>
          </div>

          <div className="bootcamps-form-wrapper">
            <Card className="bootcamps-form-card">
              {/* Success state */}
              <AnimatePresence mode="wait">
                {successMsg ? (
                  <motion.div
                    key="success"
                    className="bootcamps-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bootcamps-success__icon">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <h3>Feedback Received!</h3>
                    <p>{successMsg}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSuccessMsg('')}
                      style={{ marginTop: '1.25rem' }}
                    >
                      Submit Another Idea
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    variants={fadeIn}
                  >
                    <div className="bootcamps-form__heading">
                      <Send size={20} />
                      <h3>Suggest a Feedback</h3>
                    </div>

                    <div className="form-group">
                      <label htmlFor="suggestedCourse">
                        What course would you like to see?
                      </label>
                      <input
                        id="suggestedCourse"
                        type="text"
                        className="ui-input"
                        placeholder="e.g. Data Analysis with Excel for non-techies"
                        value={suggestedCourse}
                        onChange={(e) => setSuggestedCourse(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="feedbackReason">
                        Why would this help your career?
                      </label>
                      <textarea
                        id="feedbackReason"
                        className="ui-textarea"
                        placeholder="e.g. I need to analyse marketing data for my role but don't have a technical background..."
                        value={feedbackReason}
                        onChange={(e) => setFeedbackReason(e.target.value)}
                        disabled={isSubmitting}
                        style={{ minHeight: '120px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="feedbackReason">
                        How can we improve this platform?
                      </label>
                      <textarea
                        id="otherFeedback"
                        className="ui-textarea"
                        placeholder="Tell us a feature you'd like to see or any other feedback."
                        value={otherFeedback}
                        onChange={(e) => setOtherFeedback(e.target.value)}
                        disabled={isSubmitting}
                        style={{ minHeight: '120px' }}
                      />
                    </div>

                    {!currentUser && (
                      <p className="bootcamps-anon-note">
                        💡 You're submitting anonymously.
                        <a href="/signup"> Sign up</a> to be notified when your course launches.
                      </p>
                    )}

                    {error && (
                      <div className="error-message" style={{ marginBottom: '1rem' }}>
                        <AlertCircle size={16} /> {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Submitting <Loader2 size={16} className="ml-2 spinner" /></>
                      ) : (
                        <>Submit Feedback <Send size={16} className="ml-2" /></>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default Bootcamps;
