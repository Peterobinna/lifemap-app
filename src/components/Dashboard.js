// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Quiz from './Quiz';
import Goals from './Goals';
import Mentorship from './Mentorship';
import Analytics from './Analytics';
import Resources from './Resources';
import Profile from './Profile';
// import AdminDashboard from './AdminDashboard';  // Uncomment if you have this component
// import AddMentors from './AddMentors';            // Uncomment if you have this component
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user.uid]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'quiz':
        return <Quiz user={user} userData={userData} onComplete={() => setCurrentView('home')} />;
      case 'goals':
        return <Goals user={user} />;
      case 'mentorship':
        return <Mentorship user={user} />;
      case 'analytics':
        return <Analytics user={user} />;
      case 'resources':
        return <Resources user={user} />;
      case 'profile':
        return <Profile user={user} />;
      // Uncomment these cases if you have the components
      // case 'admin':
      //   return <AdminDashboard user={user} onBack={() => setCurrentView('home')} />;
      // case 'addmentors':
      //   return <AddMentors />;
      default:
        return (
          <div className="home-content">
              <div className="welcome-section">
                <h2>Welcome back, {userData?.name || 'Friend'}!</h2>
                <p className="motivation-quote">
                  "Your future is created by what you do today, not tomorrow."
                </p>
              </div>

              <div className="dashboard-grid">
                <div className="card feature-card" onClick={() => setCurrentView('quiz')}>
                  <div className="card-icon">
                    <div className="icon-circle">🎯</div>
                  </div>
                  <h3>Self Discovery</h3>
                  <p>Take our comprehensive assessment to understand your strengths and growth areas.</p>
                  <div className="card-status">
                    {userData?.quizCompleted ? (
                      <>
                        <span className="status-icon">✓</span>
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <span className="status-icon">▶</span>
                        <span>Start Assessment</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card feature-card" onClick={() => setCurrentView('goals')}>
                  <div className="card-icon">
                    <div className="icon-circle">📈</div>
                  </div>
                  <h3>Goal Management</h3>
                  <p>Set, track, and achieve your personal development goals across different life areas.</p>
                  <div className="card-status">
                    <span className="status-icon">⚡</span>
                    <span>Manage Goals</span>
                  </div>
                </div>

                <div className="card feature-card" onClick={() => setCurrentView('mentorship')}>
                  <div className="card-icon">
                    <div className="icon-circle">👥</div>
                  </div>
                  <h3>Mentorship</h3>
                  <p>Connect with experienced mentors who can guide your personal and professional growth.</p>
                  <div className="card-status">
                    <span className="status-icon">🤝</span>
                    <span>Find Mentor</span>
                  </div>
                </div>

                <div className="card feature-card" onClick={() => setCurrentView('resources')}>
                  <div className="card-icon">
                    <div className="icon-circle">📚</div>
                  </div>
                  <h3>Learning Hub</h3>
                  <p>Access curated content tailored to your interests and development needs.</p>
                  <div className="card-status">
                    <span className="status-icon">📖</span>
                    <span>Browse Resources</span>
                  </div>
                </div>

                <div className="card feature-card" onClick={() => setCurrentView('analytics')}>
                  <div className="card-icon">
                    <div className="icon-circle">📊</div>
                  </div>
                  <h3>Progress Analytics</h3>
                  <p>Track your growth journey with detailed insights and achievements.</p>
                  <div className="card-status">
                    <span className="status-icon">📈</span>
                    <span>View Progress</span>
                  </div>
                </div>
              </div>

            {userData?.quizCompleted && (
              <div className="card progress-summary">
                <h3>Your Growth Summary</h3>
                <p>You've completed your self-discovery assessment! 🎉</p>
                <p>Continue setting goals and tracking your progress to keep growing.</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>LifeMap</h1>
          <nav className="main-nav">
            <button 
              className={currentView === 'home' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('home')}
            >
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </button>
            <button 
              className={currentView === 'quiz' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('quiz')}
            >
              <span className="nav-icon">🎯</span>
              <span>Discovery</span>
            </button>
            <button 
              className={currentView === 'goals' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('goals')}
            >
              <span className="nav-icon">📈</span>
              <span>Goals</span>
            </button>
            <button 
              className={currentView === 'mentorship' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('mentorship')}
            >
              <span className="nav-icon">👥</span>
              <span>Mentors</span>
            </button>
            <button 
              className={currentView === 'resources' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('resources')}
            >
              <span className="nav-icon">📚</span>
              <span>Resources</span>
            </button>
            <button 
              className={currentView === 'analytics' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('analytics')}
            >
              <span className="nav-icon">📊</span>
              <span>Analytics</span>
            </button>
            <button 
              className={currentView === 'profile' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('profile')}
            >
              <span className="nav-icon">👤</span>
              <span>Profile</span>
            </button>
          </nav>
          <button className="btn btn-secondary logout-btn" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;