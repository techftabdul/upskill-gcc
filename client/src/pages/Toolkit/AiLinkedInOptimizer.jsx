import { useState } from 'react';
import { Linkedin, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ResultModal from '../../components/shared/ResultModal';
import { optimizeLinkedInProfile } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { saveLinkedinOptimization } from '../../firebase/firestore';
import { GCC_COUNTRIES } from '../../utils/countryList';
import './AITool.css';

const AiLinkedInOptimizer = () => {
  const { currentUser, refreshUserData } = useAuth();
  const [headline, setHeadline] = useState('');
  const [role, setRole] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [targetCountry, setTargetCountry] = useState('United Arab Emirates');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!headline.trim() || !role.trim() || !careerGoal.trim()) {
      setError('Please fill in all the required fields.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    try {
      const data = await optimizeLinkedInProfile(headline, role, careerGoal, targetCountry);
      setResult(data.result);
      setCreditsRemaining(data.creditsRemaining);
      setShowModal(true);

      await refreshUserData();

      if (currentUser) {
        await saveLinkedinOptimization(currentUser.uid, {
          originalProfile: `Role: ${role}\nHeadline: ${headline}`,
          optimizedProfile: data.result,
          targetRole: careerGoal,
          targetCountry
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

  return (
    <div className="ai-tool-page">
      <div className="container">
        <div className="ai-tool-header">
          <div className="tool-badge" style={{ backgroundColor: 'rgba(10, 102, 194, 0.1)', color: '#0a66c2' }}>
            <Linkedin size={16} /> LinkedIn Optimizer
          </div>
          <h1 className="tool-title">Attract Top GCC Recruiters</h1>
          <p className="tool-subtitle">
            Enhance your LinkedIn visibility. Our AI restructures your headline and about section to hit the ATS keywords headhunters in the Middle East search for.
          </p>
        </div>

        <div className="ai-tool-grid">
          <Card className="tool-form-card">
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label>Current Role</label>
                <input 
                  type="text" 
                  className="ui-input" 
                  placeholder="e.g. Marketing Executive"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label>Current LinkedIn Headline</label>
                <input 
                  type="text" 
                  className="ui-input" 
                  placeholder="e.g. Marketing Exec exploring new opportunities"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label>Career Goal / Target Position</label>
                <textarea 
                  className="ui-textarea" 
                  placeholder="e.g. Looking to transition into a Digital Marketing Manager role in the luxury sector."
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  disabled={isGenerating}
                  style={{ minHeight: '80px' }}
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
                style={{ backgroundColor: '#0a66c2' }}
              >
                {isGenerating ? (
                  <>Optimizing Profile <Loader2 size={16} className="ml-2 spinner" /></>
                ) : (
                  <>Optimize LinkedIn <Sparkles size={16} className="ml-2" /></>
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
        title="LinkedIn Profile Optimized!"
        accentColor="#0a66c2"
        icon={<Linkedin size={20} />}
        tags={[role || 'Professional', targetCountry]}
        creditsRemaining={creditsRemaining}
        showDownload={false}
      />
    </div>
  );
};

export default AiLinkedInOptimizer;
