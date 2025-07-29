// components/Analytics.js
import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Analytics.css';

const Analytics = ({ user }) => {
  const [analyticsData, setAnalyticsData] = useState({
    goals: [],
    totalGoals: 0,
    completedGoals: 0,
    completionRate: 0,
    quizResults: null,
    mentorshipRequests: [],
    joinDate: null,
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, month, week

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // Fetch goals
      const goalsQuery = query(collection(db, 'goals'), where('userId', '==', user.uid));
      const goalsSnapshot = await getDocs(goalsQuery);
      const goals = goalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch mentorship requests
      const mentorshipQuery = query(collection(db, 'mentorshipRequests'), where('userId', '==', user.uid));
      const mentorshipSnapshot = await getDocs(mentorshipQuery);
      const mentorshipRequests = mentorshipSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by time range
      const filteredGoals = filterByTimeRange(goals, timeRange);
      const completedGoals = filteredGoals.filter(goal => goal.completed);
      
      const analytics = {
        goals: filteredGoals,
        totalGoals: filteredGoals.length,
        completedGoals: completedGoals.length,
        completionRate: filteredGoals.length > 0 ? Math.round((completedGoals.length / filteredGoals.length) * 100) : 0,
        quizResults: userData.quizResults || null,
        mentorshipRequests,
        joinDate: userData.createdAt,
        streakDays: calculateStreak(goals)
      };

      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
    setLoading(false);
  }, [user.uid, timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const filterByTimeRange = (items, range) => {
    if (range === 'all') return items;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (range === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return items.filter(item => {
      const itemDate = item.createdAt?.toDate() || new Date();
      return itemDate >= cutoffDate;
    });
  };

  const calculateStreak = (goals) => {
    // Simple streak calculation based on goal completion
    const completed = goals.filter(g => g.completed).sort((a, b) => 
      (b.completedAt?.toDate() || new Date()) - (a.completedAt?.toDate() || new Date())
    );
    
    if (completed.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < completed.length - 1; i++) {
      const currentDate = completed[i].completedAt?.toDate() || new Date();
      const nextDate = completed[i + 1].completedAt?.toDate() || new Date();
      
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.abs((currentDate - nextDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) { // Within a week
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getGoalsByCategory = () => {
    const categories = {};
    analyticsData.goals.forEach(goal => {
      const category = goal.category || 'personal';
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0 };
      }
      categories[category].total++;
      if (goal.completed) {
        categories[category].completed++;
      }
    });
    return categories;
  };

  const getProgressTrend = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const completedOnDay = analyticsData.goals.filter(goal => {
        if (!goal.completed || !goal.completedAt) return false;
        const completedDate = goal.completedAt.toDate();
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === date.getTime();
      }).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedOnDay
      });
    }
    
    return last7Days;
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your progress analytics...</p>
        </div>
      </div>
    );
  }

  const categoryData = getGoalsByCategory();
  const progressTrend = getProgressTrend();
  const maxCompleted = Math.max(...progressTrend.map(d => d.completed), 1);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Your Progress Analytics 📊</h2>
        <p>Track your growth journey and celebrate your achievements</p>
        
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
          <button 
            className={timeRange === 'all' ? 'active' : ''}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>{analyticsData.totalGoals}</h3>
            <p>Total Goals</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>{analyticsData.completedGoals}</h3>
            <p>Goals Completed</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{analyticsData.completionRate}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <h3>{analyticsData.streakDays}</h3>
            <p>Goal Streak</p>
          </div>
        </div>
      </div>

      {/* Progress Trend */}
      <div className="chart-section">
        <h3>7-Day Progress Trend</h3>
        <div className="progress-chart">
          {progressTrend.map((day, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill"
                style={{ 
                  height: `${(day.completed / maxCompleted) * 100}%`,
                  minHeight: day.completed > 0 ? '10px' : '2px'
                }}
              ></div>
              <span className="bar-value">{day.completed}</span>
              <span className="bar-label">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals by Category */}
      <div className="category-section">
        <h3>Goals by Category</h3>
        <div className="category-grid">
          {Object.entries(categoryData).map(([category, data]) => {
            const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            const categoryEmojis = {
              personal: '🌱',
              academic: '📚',
              spiritual: '🙏',
              social: '👥',
              career: '💼',
              health: '💪'
            };
            
            return (
              <div key={category} className="category-card">
                <div className="category-header">
                  <span className="category-emoji">{categoryEmojis[category] || '📋'}</span>
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                </div>
                
                <div className="category-stats">
                  <div className="stat">
                    <span className="stat-number">{data.completed}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{data.total}</span>
                    <span className="stat-label">Total</span>
                  </div>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="percentage">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Development Profile */}
      {analyticsData.quizResults && (
        <div className="profile-section">
          <h3>Your Development Profile</h3>
          <div className="profile-card">
            <div className="profile-header">
              <h4>{analyticsData.quizResults.recommendations?.title || 'Growth-Oriented Individual'}</h4>
              <p>{analyticsData.quizResults.recommendations?.description || 'Focused on continuous improvement'}</p>
            </div>
            
            <div className="profile-recommendations">
              <h5>Recommended Focus Areas:</h5>
              <ul>
                {(analyticsData.quizResults.recommendations?.suggestions || []).slice(0, 3).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="achievements-section">
        <h3>Your Achievements 🏆</h3>
        <div className="achievements-grid">
          <div className={`achievement ${analyticsData.completedGoals >= 1 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🎯</div>
            <h4>First Goal</h4>
            <p>Complete your first goal</p>
          </div>
          
          <div className={`achievement ${analyticsData.completedGoals >= 5 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">⭐</div>
            <h4>Goal Achiever</h4>
            <p>Complete 5 goals</p>
          </div>
          
          <div className={`achievement ${analyticsData.completedGoals >= 10 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">💎</div>
            <h4>Consistent Performer</h4>
            <p>Complete 10 goals</p>
          </div>
          
          <div className={`achievement ${analyticsData.quizResults ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🧭</div>
            <h4>Self-Aware</h4>
            <p>Complete the self-discovery quiz</p>
          </div>
          
          <div className={`achievement ${analyticsData.mentorshipRequests.length > 0 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🤝</div>
            <h4>Mentor Seeker</h4>
            <p>Request a mentor</p>
          </div>
          
          <div className={`achievement ${analyticsData.streakDays >= 7 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🔥</div>
            <h4>On Fire</h4>
            <p>Maintain a 7-day streak</p>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="motivation-section">
        <h3>Keep Going! 💪</h3>
        <div className="motivation-content">
          {analyticsData.completionRate >= 80 ? (
            <div className="motivation-high">
              <p>🎉 <strong>Amazing work!</strong> You're crushing your goals with an {analyticsData.completionRate}% success rate!</p>
              <p>Keep up this incredible momentum. You're an inspiration!</p>
            </div>
          ) : analyticsData.completionRate >= 50 ? (
            <div className="motivation-medium">
              <p>👏 <strong>Great progress!</strong> You're doing well with a {analyticsData.completionRate}% completion rate.</p>
              <p>Consider breaking down larger goals into smaller, achievable steps.</p>
            </div>
          ) : (
            <div className="motivation-low">
              <p>🌱 <strong>Every journey starts with a single step.</strong> You're {analyticsData.completionRate}% of the way there!</p>
              <p>Remember: Progress, not perfection. Keep setting small, achievable goals.</p>
            </div>
          )}
          
          {analyticsData.joinDate && (
            <p className="journey-time">
              📅 You've been on your LifeMap journey for{' '}
              {Math.ceil((new Date() - analyticsData.joinDate.toDate()) / (1000 * 60 * 60 * 24))} days!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;