// components/Profile.js
import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, updateEmail } from 'firebase/auth';
import { db, auth } from '../firebase';
import './Profile.css';

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    bio: '',
    interests: [],
    goals: '',
    location: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const interestOptions = [
    'Technology', 'Arts & Creativity', 'Sports & Fitness', 'Reading',
    'Music', 'Entrepreneurship', 'Leadership', 'Community Service',
    'Travel', 'Cooking', 'Photography', 'Writing', 'Learning Languages',
    'Spiritual Growth', 'Financial Literacy', 'Mental Health'
  ];

  const fetchUserData = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          name: data.name || '',
          age: data.age || '',
          email: data.email || user.email,
          bio: data.bio || '',
          interests: data.interests || [],
          goals: data.goals || '',
          location: data.location || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setLoading(false);
  }, [user.uid, user.email]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({
      ...formData,
      interests: updatedInterests
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        age: parseInt(formData.age),
        updatedAt: new Date()
      });

      // Update email if changed
      if (formData.email !== user.email) {
        await updateEmail(auth.currentUser, formData.email);
      }

      setUserData({ ...userData, ...formData });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again.');
    }
  };

  const getDaysOnPlatform = () => {
    if (!userData?.createdAt) return 0;
    const createdDate = userData.createdAt.toDate();
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h2>{formData.name || 'Your Name'}</h2>
          <p className="profile-email">{formData.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{getDaysOnPlatform()}</span>
              <span className="stat-label">Days on LifeMap</span>
            </div>
            {userData?.quizCompleted && (
              <div className="stat">
                <span className="stat-number">✅</span>
                <span className="stat-label">Quiz Completed</span>
              </div>
            )}
          </div>
        </div>
        <div className="profile-actions">
          {!editing ? (
            <button 
              className="btn btn-primary edit-btn"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  fetchUserData(); // Reset form
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSaveProfile} className="profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="13"
                  max="25"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>About You</h3>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your passions, and what drives you..."
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label>Life Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="What are your main life goals and aspirations?"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Interests</h3>
            <div className="interests-grid">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-section">
            <h3>About Me</h3>
            <p className="bio-text">
              {formData.bio || "No bio added yet. Click 'Edit Profile' to add information about yourself."}
            </p>
          </div>

          {formData.goals && (
            <div className="profile-section">
              <h3>My Goals</h3>
              <p className="goals-text">{formData.goals}</p>
            </div>
          )}

          {formData.interests.length > 0 && (
            <div className="profile-section">
              <h3>My Interests</h3>
              <div className="interests-display">
                {formData.interests.map(interest => (
                  <span key={interest} className="interest-badge">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {userData?.quizResults && (
            <div className="profile-section">
              <h3>Development Profile</h3>
              <div className="quiz-results-display">
                <h4>{userData.quizResults.recommendations?.title}</h4>
                <p>{userData.quizResults.recommendations?.description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Section */}
      <div className="security-section">
        <h3>Security Settings</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          🔒 Change Password
        </button>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                minLength="6"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                minLength="6"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;