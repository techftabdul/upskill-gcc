import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Copy, RefreshCcw, Download, Coins } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Button from '../ui/Button';
import { downloadAsPDF } from '../../utils/pdfExport';
import './ResultModal.css';

/**
 * Reusable result modal for all AI tools.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onRegenerate: () => void
 *  - result: string (markdown text from AI)
 *  - title: string (e.g. "CV Optimized Successfully!")
 *  - icon: React node (optional, defaults to CheckCircle)
 *  - accentColor: string (optional, e.g. "#0a66c2")
 *  - tags: string[] (e.g. ["Senior Engineer", "UAE"])
 *  - creditsRemaining: number | null
 *  - showDownload: boolean (show PDF download button)
 *  - downloadMeta: { targetRole, targetCountry } (for PDF filename)
 */
const ResultModal = ({
  isOpen,
  onClose,
  onRegenerate,
  result,
  title = 'Generated Successfully!',
  icon,
  accentColor,
  tags = [],
  creditsRemaining = null,
  showDownload = false,
  downloadMeta = {},
  showRegenerate = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadAsPDF(
      result,
      downloadMeta.targetRole,
      downloadMeta.targetCountry
    );
  };

  const IconComponent = icon || <CheckCircle size={20} />;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="result-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="result-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Header ──────────────────────────── */}
            <div className="result-modal__header">
              <div className="result-modal__title-group">
                <span
                  className="result-modal__success-icon"
                  style={accentColor ? { color: accentColor } : undefined}
                >
                  {IconComponent}
                </span>
                <h2 className="result-modal__title">{title}</h2>
              </div>
              <button className="result-modal__close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* ─── Meta tags ───────────────────────── */}
            {(tags.length > 0 || creditsRemaining !== null) && (
              <div className="result-modal__meta">
                {tags.map((tag, i) => (
                  <span key={i} className="result-modal__tag">{tag}</span>
                ))}
                <span className="result-modal__tag result-modal__tag--saved">
                  ✓ Saved to dashboard
                </span>
                {creditsRemaining !== null && (
                  <span className="result-modal__tag result-modal__tag--credits">
                    <Coins size={12} /> {creditsRemaining} credits left
                  </span>
                )}
              </div>
            )}

            {/* ─── Scrollable content ──────────────── */}
            <div className="result-modal__scroll">
              <div className="result-modal__content">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>

            {/* ─── Action buttons ──────────────────── */}
            <div className="result-modal__actions">
              <Button variant="outline" onClick={handleCopy}>
                <Copy size={15} />
                {copied ? 'Copied!' : 'Copy Text'}
              </Button>
              {showRegenerate && (
                <Button variant="outline" onClick={onRegenerate}>
                  <RefreshCcw size={15} />
                  Regenerate
                </Button>
              )}
              {showDownload && (
                <Button
                  variant="accent"
                  onClick={handleDownload}
                  style={accentColor ? { backgroundColor: accentColor } : undefined}
                >
                  <Download size={15} />
                  Download PDF
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
