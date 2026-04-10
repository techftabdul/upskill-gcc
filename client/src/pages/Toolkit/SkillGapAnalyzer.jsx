import { useState } from 'react';
import { GraduationCap, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ResultModal from '../../components/shared/ResultModal';
import { analyzeSkillGap } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { saveSkillAnalysis } from '../../firebase/firestore';
import { GCC_COUNTRIES } from '../../utils/countryList';
import './AITool.css';

const SkillGapAnalyzer = () => {
  const { currentUser, refreshUserData } = useAuth();
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCountry, setTargetCountry] = useState('United Arab Emirates');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!currentSkills.trim() || !targetRole.trim()) {
      setError('Please fill in your current skills and target role.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    try {
      const data = await analyzeSkillGap(currentSkills, targetRole, targetCountry);
      setResult(data.result);
      setCreditsRemaining(data.creditsRemaining);
      setShowModal(true);

      await refreshUserData();

      if (currentUser) {
        await saveSkillAnalysis(currentUser.uid, {
          currentSkills,
          missingSkills: 'Refer to full analysis',
          recommendedSkills: data.result,
          targetRole,
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
          <div className="tool-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
            <GraduationCap size={16} /> Skill Gap Analyzer
          </div>
          <h1 className="tool-title">Map Your Career Path</h1>
          <p className="tool-subtitle">
            Enter your current skills and your dream job. Our AI will analyze the gap and generate a personalized 3-month roadmap to get you hired in the GCC.
          </p>
        </div>

        <div className="ai-tool-grid">
          <Card className="tool-form-card">
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label>Target Role / Dream Job</label>
                <input 
                  type="text" 
                  className="ui-input" 
                  placeholder="e.g. Senior Data Scientist"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label>Your Current Skills</label>
                <textarea 
                  className="ui-textarea" 
                  placeholder="e.g. Python, basic SQL, Excel, communication skills..."
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  disabled={isGenerating}
                  style={{ minHeight: '100px' }}
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
                style={{ backgroundColor: '#16a34a' }}
              >
                {isGenerating ? (
                  <>Analyzing Gap <Loader2 size={16} className="ml-2 spinner" /></>
                ) : (
                  <>Analyze Skill Gap <Sparkles size={16} className="ml-2" /></>
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
        title="Skill Gap Analysis Complete!"
        accentColor="#16a34a"
        icon={<GraduationCap size={20} />}
        tags={[targetRole, targetCountry]}
        creditsRemaining={creditsRemaining}
        showDownload={true}
        downloadMeta={{ targetRole, targetCountry }}
      />
    </div>
  );
};

export default SkillGapAnalyzer;
