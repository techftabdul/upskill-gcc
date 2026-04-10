import { useState } from 'react';
import { FileText, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ResultModal from '../../components/shared/ResultModal';
import { generateOptimizedCV } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { saveCVOptimization } from '../../firebase/firestore';
import { GCC_COUNTRIES } from '../../utils/countryList';
import './AITool.css';

const AiCvOptimizer = () => {
  const { currentUser, refreshUserData } = useAuth();
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [targetCountry, setTargetCountry] = useState('Qatar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!cvFile && !cvText.trim()) {
      setError('Please provide your current CV text or upload a file.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const data = await generateOptimizedCV(cvText, targetRole, targetCountry, cvFile);
      setResult(data.result);
      setCreditsRemaining(data.creditsRemaining);
      setShowModal(true);

      // Refresh user data to update credits in context
      await refreshUserData();

      if (currentUser) {
        await saveCVOptimization(currentUser.uid, {
          originalCV: cvText,
          optimizedCV: data.result,
          targetRole: targetRole || 'General Professional',
          targetCountry,
        });
      }
    } catch (err) {
      if (err.code === 'NO_CREDITS') {
        setError('You have no credits remaining. Please upgrade your plan to continue.');
      } else {
        setError(err.message || 'An error occurred while communicating with the AI.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setShowModal(false);
    handleGenerate();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCvFile(file || null);
  };

  return (
    <div className="ai-tool-page">
      <div className="container">
        <div className="ai-tool-header">
          <div className="tool-badge">
            <FileText size={16} /> CV Optimizer
          </div>
          <h1 className="tool-title">AI CV Optimizer for GCC</h1>
          <p className="tool-subtitle">
            Paste your current CV or upload a PDF/DOCX and let our AI rewrite it to perfectly match ATS formats and recruiter expectations in the Middle East.
          </p>
        </div>

        <div className="ai-tool-grid">
          <Card className="tool-form-card">
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label>Paste your current CV / Profile Summary</label>
                <textarea
                  className="ui-textarea"
                  placeholder="E.g., I have 5 years of experience in retail marketing..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  disabled={isGenerating || !!cvFile}
                />
              </div>

              <div className="form-group">
                <label>Target Role (Optional)</label>
                <input
                  type="text"
                  className="ui-input"
                  placeholder="e.g. Senior Marketing Manager"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label>Target Country</label>
                <select
                  className="ui-select"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  disabled={isGenerating}
                >
                  {GCC_COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Upload CV (PDF/DOCX) — Optional</label>
                <input
                  type="file"
                  className="ui-input"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  disabled={isGenerating}
                />
                {cvFile && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Uploaded: {cvFile.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <Button
                type="submit"
                variant="accent"
                className="w-full mt-4"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Analyzing & Rewriting <Loader2 size={16} className="ml-2 spinner" /></>
                ) : (
                  <>Optimize My CV <Sparkles size={16} className="ml-2" /></>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <ResultModal
        isOpen={showModal && !!result}
        onClose={() => setShowModal(false)}
        onRegenerate={handleRegenerate}
        result={result}
        title="CV Optimized Successfully!"
        tags={[targetRole || 'General Professional', targetCountry]}
        creditsRemaining={creditsRemaining}
        showDownload={true}
        downloadMeta={{ targetRole, targetCountry }}
      />
    </div>
  );
};

export default AiCvOptimizer;
