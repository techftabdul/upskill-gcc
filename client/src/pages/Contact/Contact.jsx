import { useState } from 'react';
import {
  Twitter,
  Linkedin,
  Github,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './Contact.css';

// ─── Social platforms ────────────────────────────────────────────
const SOCIALS = [
  {
    id: 'twitter',
    name: 'X / Twitter',
    icon: <Twitter size={24} />,
    url: 'https://x.com/techftabdul',
    color: '#0f1419',
    bg: 'rgba(15, 20, 25, 0.08)',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin size={24} />,
    url: 'https://linkedin.com/in/techftabdul',
    color: '#0a66c2',
    bg: 'rgba(10, 102, 194, 0.08)',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <Github size={24} />,
    url: 'https://github.com/techftabdul',
    color: '#24292f',
    bg: 'rgba(36, 41, 47, 0.08)',
  },
];

// ─── Animation variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
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

// ─── Formspree submission ────────────────────────────────────────
const FORMSPREE_URL = 'https://formspree.io/f/mwvapoar';

const submitToFormspree = async ({ name, email, message }) => {
  const res = await fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Failed to send message.');
  }

  return res.json();
};

// ═════════════════════════════════════════════════════════════════
// CONTACT PAGE
// ═════════════════════════════════════════════════════════════════
const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) return setError('Please enter your name.');
    if (!email.trim()) return setError('Please enter your email address.');
    if (!message.trim()) return setError('Please enter a message.');

    setIsSubmitting(true);
    try {
      await submitToFormspree({ name: name.trim(), email: email.trim(), message: message.trim() });
      setSuccessMsg("Thanks for reaching out! I'll get back to you soon.");
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">

        {/* ─── HERO ──────────────────────────────────── */}
        <motion.section
          className="contact-hero"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="contact-hero__eyebrow">
            <Mail size={16} />
            Get in Touch
          </div>
          <h1 className="contact-hero__title">Contact Us</h1>
          <p className="contact-hero__subtitle">
            Have feedback, partnership ideas, questions, or opportunities?
            I'd love to hear from you.
          </p>
        </motion.section>

        {/* ─── SOCIAL CARDS ──────────────────────────── */}
        <motion.section
          className="contact-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="contact-socials-grid">
            {SOCIALS.map((social, index) => (
              <motion.a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
              >
                <Card hoverEffect className="social-card__inner">
                  <div
                    className="social-card__icon"
                    style={{ background: social.bg, color: social.color }}
                  >
                    {social.icon}
                  </div>
                  <div className="social-card__body">
                    <span className="social-card__name">{social.name}</span>
                    <span className="social-card__cta">
                      <ExternalLink size={14} /> Visit
                    </span>
                  </div>
                </Card>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ─── CONTACT FORM ──────────────────────────── */}
        <motion.section
          className="contact-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <div className="contact-section__header">
            <h2>Send a Message</h2>
            <p>Whether it's a quick question or a detailed proposal, I'll respond within 48 hours.</p>
          </div>

          <div className="contact-form-wrapper">
            <Card className="contact-form-card">
              <AnimatePresence mode="wait">
                {successMsg ? (
                  <motion.div
                    key="success"
                    className="contact-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="contact-success__icon">
                      <CheckCircle2 size={40} strokeWidth={1.5} />
                    </div>
                    <h3>Message Sent!</h3>
                    <p>{successMsg}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSuccessMsg('')}
                      style={{ marginTop: '1.25rem' }}
                    >
                      Send Another Message
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
                    <div className="contact-form__row">
                      <div className="form-group">
                        <label htmlFor="contact-name">Your Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          className="ui-input"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSubmitting}
                          name="name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact-email">Email Address</label>
                        <input
                          id="contact-email"
                          type="email"
                          className="ui-input"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          name="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        className="ui-textarea"
                        placeholder="Tell me about your idea, question, or opportunity..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSubmitting}
                        style={{ minHeight: '150px' }}
                        name="message"
                        required
                      />
                    </div>

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
                        <>Sending <Loader2 size={16} className="ml-2 spinner" /></>
                      ) : (
                        <>Send Message <Send size={16} className="ml-2" /></>
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

export default Contact;
