import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserData } from '../../firebase/firestore';
import { GCC_COUNTRIES } from '../../utils/countryList';
import Button from '../../components/ui/Button';
import { Coins } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { currentUser, userData, refreshUserData } = useAuth();

  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Populate form from context
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setTargetRole(userData.targetRole || '');
      setTargetCountry(userData.targetCountry || '');
    }
  }, [userData]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const { success, error: saveError } = await updateUserData(currentUser.uid, {
        name: name.trim(),
        targetRole: targetRole.trim(),
        targetCountry,
      });

      if (!success) throw new Error(saveError);

      await refreshUserData();
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (userData) {
      setName(userData.name || '');
      setTargetRole(userData.targetRole || '');
      setTargetCountry(userData.targetCountry || '');
    }
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p className="profile-subtitle">Manage your account details and career preferences.</p>

      <div className="profile-card">
        {/* Email — read only */}
        <div className="profile-field">
          <label>Email</label>
          <div className="profile-value">{currentUser?.email}</div>
        </div>

        {/* Name */}
        <div className="profile-field">
          <label>Full Name</label>
          {isEditing ? (
            <input
              type="text"
              className="ui-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <div className="profile-value">{userData?.name || 'Not set'}</div>
          )}
        </div>

        {/* Target Role & Country — side by side */}
        <div className="profile-row">
          <div className="profile-field">
            <label>Target Role</label>
            {isEditing ? (
              <input
                type="text"
                className="ui-input"
                placeholder="e.g. Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            ) : (
              <div className="profile-value">{userData?.targetRole || 'Not specified'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Target Country</label>
            {isEditing ? (
              <select
                className="ui-select"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
              >
                <option value="">Select country</option>
                {GCC_COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            ) : (
              <div className="profile-value">{userData?.targetCountry || 'Not specified'}</div>
            )}
          </div>
        </div>

        {/* Subscription */}
        <div className="profile-field">
          <label>Plan</label>
          <div className="profile-value" style={{ textTransform: 'capitalize' }}>
            {userData?.subscription || 'Free'}
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ marginTop: '0.5rem' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="profile-success">{successMsg}</div>
        )}

        {/* Actions */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <Button variant="accent" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Credits card */}
      <div className="profile-credits-card">
        <div className="credits-info">
          <h3><Coins size={14} style={{ marginRight: '0.25rem', verticalAlign: '-2px' }} /> AI Credits</h3>
          <p>{userData?.credits ?? 0}</p>
        </div>
        <Button variant="accent" size="sm" disabled>
          Buy More (Coming Soon)
        </Button>
      </div>
    </div>
  );
};

export default Profile;
