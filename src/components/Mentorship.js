// components/Mentorship.js
import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Mentorship.css';

const Mentorship = ({ user }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [requestForm, setRequestForm] = useState({
    mentorshipType: 'general',
    specificArea: '',
    goals: '',
    experience: '',
    timeCommitment: 'weekly',
    preferredGender: 'no-preference',
    additionalInfo: ''
  });

  const mentorshipTypes = [
    { value: 'general', label: 'General Life Guidance', icon: '🌟' },
    { value: 'academic', label: 'Academic Support', icon: '📚' },
    { value: 'career', label: 'Career Development', icon: '💼' },
    { value: 'spiritual', label: 'Spiritual Growth', icon: '🙏' },
    { value: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀' },
    { value: 'leadership', label: 'Leadership Development', icon: '👑' }
  ];

  const timeCommitments = [
    { value: 'weekly', label: 'Weekly check-ins' },
    { value: 'biweekly', label: 'Every two weeks' },
    { value: 'monthly', label: 'Monthly meetings' },
    { value: 'asneeded', label: 'As needed basis' }
  ];

  const fetchUserData = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [user.uid]);

  const fetchMentorshipRequests = useCallback(async () => {
    try {
      const q = query(collection(db, 'mentorshipRequests'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMentorshipRequests(requests.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()));
    } catch (error) {
      console.error('Error fetching mentorship requests:', error);
    }
    setLoading(false);
  }, [user.uid]);

  useEffect(() => {
    fetchUserData();
    fetchMentorshipRequests();
  }, [fetchUserData, fetchMentorshipRequests]);

  const handleInputChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const requestData = {
        ...requestForm,
        userId: user.uid,
        userName: userData?.name || 'Unknown',
        userEmail: userData?.email || user.email,
        userAge: userData?.age || 'Not specified',
        status: 'pending',
        createdAt: new Date(),
        matchedMentor: null
      };

      await addDoc(collection(db, 'mentorshipRequests'), requestData);
      
      // Reset form and close
      setRequestForm({
        mentorshipType: 'general',
        specificArea: '',
        goals: '',
        experience: '',
        timeCommitment: 'weekly',
        preferredGender: 'no-preference',
        additionalInfo: ''
      });
      setShowRequestForm(false);
      
      // Refresh requests
      fetchMentorshipRequests();
      
    } catch (error) {
      console.error('Error submitting mentorship request:', error);
      alert('Error submitting request. Please try again.');
    }
    
    setSubmitLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'matched': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'matched': return '✅';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="mentorship-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading mentorship information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mentorship-container">
      <div className="mentorship-header">
        <h2>Find Your Mentor 👥</h2>
        <p>Connect with experienced mentors who can guide your personal and professional growth</p>
        
        {mentorshipRequests.length === 0 && (
          <button 
            className="btn btn-primary request-mentor-btn"
            onClick={() => setShowRequestForm(true)}
          >
            Request a Mentor
          </button>
        )}
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h3>Why Get a Mentor?</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h4>Clear Direction</h4>
            <p>Get guidance on setting and achieving your life goals</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💡</div>
            <h4>Wisdom & Experience</h4>
            <p>Learn from someone who has walked the path before you</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌱</div>
            <h4>Personal Growth</h4>
            <p>Accelerate your development with personalized advice</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h4>Accountability</h4>
            <p>Stay motivated with regular check-ins and support</p>
          </div>
        </div>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <div className="request-form-overlay">
          <div className="request-form">
            <div className="form-header">
              <h3>Request a Mentor</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRequestForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest}>
              <div className="form-section">
                <label>What type of mentorship are you looking for?</label>
                <select 
                  name="mentorshipType" 
                  value={requestForm.mentorshipType}
                  onChange={handleInputChange}
                  required
                >
                  {mentorshipTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Specific area of focus (optional)</label>
                <input
                  type="text"
                  name="specificArea"
                  placeholder="e.g., Starting a business, choosing a career path, building confidence"
                  value={requestForm.specificArea}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-section">
                <label>What are your main goals for this mentorship?</label>
                <textarea
                  name="goals"
                  placeholder="Describe what you hope to achieve through mentorship..."
                  value={requestForm.goals}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-section">
                <label>Tell us about your current experience/background</label>
                <textarea
                  name="experience"
                  placeholder="Share your current situation, challenges, and what you've tried so far..."
                  value={requestForm.experience}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-section">
                <label>Preferred meeting frequency</label>
                <select 
                  name="timeCommitment" 
                  value={requestForm.timeCommitment}
                  onChange={handleInputChange}
                >
                  {timeCommitments.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Mentor gender preference</label>
                <select 
                  name="preferredGender" 
                  value={requestForm.preferredGender}
                  onChange={handleInputChange}
                >
                  <option value="no-preference">No preference</option>
                  <option value="male">Male mentor</option>
                  <option value="female">Female mentor</option>
                </select>
              </div>

              <div className="form-section">
                <label>Additional information (optional)</label>
                <textarea
                  name="additionalInfo"
                  placeholder="Anything else you'd like your potential mentor to know..."
                  value={requestForm.additionalInfo}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Requests */}
      {mentorshipRequests.length > 0 && (
        <div className="requests-section">
          <div className="section-header">
            <h3>Your Mentorship Requests</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowRequestForm(true)}
            >
              + New Request
            </button>
          </div>
          
          <div className="requests-list">
            {mentorshipRequests.map(request => {
              const typeInfo = mentorshipTypes.find(t => t.value === request.mentorshipType);
              return (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-type">
                      {typeInfo?.icon} {typeInfo?.label}
                    </div>
                    <div 
                      className="request-status"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {getStatusIcon(request.status)} {request.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="request-content">
                    {request.specificArea && (
                      <div className="request-detail">
                        <strong>Focus Area:</strong> {request.specificArea}
                      </div>
                    )}
                    <div className="request-detail">
                      <strong>Goals:</strong> {request.goals}
                    </div>
                    <div className="request-detail">
                      <strong>Meeting Frequency:</strong> {timeCommitments.find(t => t.value === request.timeCommitment)?.label}
                    </div>
                  </div>
                  
                  <div className="request-footer">
                    <span className="request-date">
                      Submitted: {request.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    {request.status === 'matched' && request.matchedMentor && (
                      <div className="mentor-info">
                        <strong>Matched with:</strong> {request.matchedMentor.name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* How it Works */}
      <div className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Submit Request</h4>
            <p>Tell us about your goals and what kind of mentor you're looking for</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Get Matched</h4>
            <p>We'll connect you with a suitable mentor based on your needs</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Start Growing</h4>
            <p>Begin your mentorship journey with regular meetings and guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;