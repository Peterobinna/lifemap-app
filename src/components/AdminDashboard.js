// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalGoals: 0,
    pendingRequests: 0
  });

  const [mentorsAdded, setMentorsAdded] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch basic stats
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const mentorsSnapshot = await getDocs(collection(db, 'mentors'));
      const goalsSnapshot = await getDocs(collection(db, 'goals'));
      const requestsSnapshot = await getDocs(
        query(collection(db, 'mentorshipRequests'), where('status', '==', 'pending'))
      );

      setStats({
        totalUsers: usersSnapshot.size,
        totalMentors: mentorsSnapshot.size,
        totalGoals: goalsSnapshot.size,
        pendingRequests: requestsSnapshot.size
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const sampleMentors = [
    {
      name: "Dr. Adebayo Johnson",
      email: "adebayo.johnson@lifemap.com",
      bio: "Experienced educator with 15+ years in Nigerian higher education. Specializes in academic excellence and career guidance for young professionals.",
      expertise: ["Academic Excellence", "Career Guidance", "Study Skills", "Research Methods"],
      categories: ["academic", "career"],
      availability: "weekly",
      location: "Lagos, Nigeria",
      experience: "15+ years",
      education: "PhD in Education, University of Lagos",
      languages: ["English", "Yoruba"],
      rating: 4.8,
      totalMentees: 47,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specializations: ["University Applications", "Academic Writing", "Career Transitions"],
      createdAt: new Date()
    },
    {
      name: "Pastor Grace Okafor",
      email: "grace.okafor@lifemap.com",
      bio: "Youth pastor and spiritual counselor dedicated to helping young people discover their purpose in God and navigate life's challenges with faith.",
      expertise: ["Spiritual Growth", "Purpose Discovery", "Christian Living", "Youth Ministry"],
      categories: ["spiritual", "personal"],
      availability: "weekly",
      location: "Abuja, Nigeria",
      experience: "12+ years",
      education: "Masters in Theology, Nigerian Baptist Seminary",
      languages: ["English", "Igbo"],
      rating: 4.9,
      totalMentees: 63,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      specializations: ["Purpose Discovery", "Faith Development", "Life Decisions"],
      createdAt: new Date()
    },
    {
      name: "Engr. Kemi Adeleke",
      email: "kemi.adeleke@lifemap.com",
      bio: "Software engineer and tech entrepreneur. Passionate about empowering Nigerian youth with digital skills and leadership capabilities.",
      expertise: ["Technology", "Entrepreneurship", "Leadership", "Digital Skills", "Coding"],
      categories: ["career", "leadership"],
      availability: "biweekly",
      location: "Lagos, Nigeria",
      experience: "10+ years",
      education: "BSc Computer Engineering, University of Ibadan",
      languages: ["English"],
      rating: 4.7,
      totalMentees: 34,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      specializations: ["Software Development", "Tech Startups", "Digital Marketing"],
      createdAt: new Date()
    },
    {
      name: "Dr. Ibrahim Musa",
      email: "ibrahim.musa@lifemap.com",
      bio: "Clinical psychologist specializing in youth mental health, stress management, and personal development for Nigerian students and young professionals.",
      expertise: ["Mental Health", "Personal Development", "Stress Management", "Counseling"],
      categories: ["wellness", "personal"],
      availability: "weekly",
      location: "Kano, Nigeria",
      experience: "8+ years",
      education: "PhD Clinical Psychology, Ahmadu Bello University",
      languages: ["English", "Hausa"],
      rating: 4.8,
      totalMentees: 52,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specializations: ["Anxiety Management", "Academic Stress", "Self-Confidence"],
      createdAt: new Date()
    },
    {
      name: "Mrs. Funmi Akintola",
      email: "funmi.akintola@lifemap.com",
      bio: "Business development manager and leadership coach. Helps young professionals navigate corporate Nigeria and build successful careers.",
      expertise: ["Career Development", "Leadership", "Professional Growth", "Business Strategy"],
      categories: ["career", "leadership"],
      availability: "monthly",
      location: "Lagos, Nigeria",
      experience: "14+ years",
      education: "MBA, Lagos Business School",
      languages: ["English", "Yoruba"],
      rating: 4.6,
      totalMentees: 41,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      specializations: ["Corporate Leadership", "Professional Networking", "Career Advancement"],
      createdAt: new Date()
    },
    {
      name: "Prof. Chioma Ezekiel",
      email: "chioma.ezekiel@lifemap.com",
      bio: "University professor and academic research specialist. Guides students through higher education success and research methodologies.",
      expertise: ["Academic Research", "Higher Education", "Study Methods", "Research Writing"],
      categories: ["academic"],
      availability: "weekly",
      location: "Enugu, Nigeria",
      experience: "20+ years",
      education: "PhD Biochemistry, University of Nigeria Nsukka",
      languages: ["English", "Igbo"],
      rating: 4.9,
      totalMentees: 78,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
      specializations: ["PhD Guidance", "Research Methodology", "Academic Publishing"],
      createdAt: new Date()
    },
    {
      name: "Mr. David Olatunji",
      email: "david.olatunji@lifemap.com",
      bio: "Financial advisor and investment specialist. Teaches financial literacy and wealth building strategies to young Nigerians.",
      expertise: ["Financial Literacy", "Investment", "Money Management", "Financial Planning"],
      categories: ["personal", "career"],
      availability: "biweekly",
      location: "Abuja, Nigeria",
      experience: "11+ years",
      education: "MSc Finance, University of Abuja",
      languages: ["English", "Yoruba"],
      rating: 4.5,
      totalMentees: 29,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      specializations: ["Personal Finance", "Investment Strategy", "Financial Planning"],
      createdAt: new Date()
    },
    {
      name: "Rev. Sister Mary Okonkwo",
      email: "mary.okonkwo@lifemap.com",
      bio: "Catholic nun and educator focused on holistic youth development, spiritual formation, and community service leadership.",
      expertise: ["Spiritual Formation", "Character Development", "Community Service", "Youth Ministry"],
      categories: ["spiritual", "personal"],
      availability: "weekly",
      location: "Owerri, Nigeria",
      experience: "16+ years",
      education: "Masters in Religious Studies, Pontifical Urban University",
      languages: ["English", "Igbo"],
      rating: 4.8,
      totalMentees: 56,
      verified: true,
      profileImage: "https://images.unsplash.com/photo-1559209172-e8d9ac195569?w=150&h=150&fit=crop&crop=face",
      specializations: ["Character Building", "Service Leadership", "Faith Formation"],
      createdAt: new Date()
    }
  ];

  const addMentorsToDatabase = async () => {
    setLoading(true);
    try {
      for (const mentor of sampleMentors) {
        await addDoc(collection(db, 'mentors'), mentor);
      }
      setMentorsAdded(true);
      await fetchStats(); // Refresh stats
      alert('✅ Successfully added 8 professional mentors to the database!');
    } catch (error) {
      console.error('Error adding mentors:', error);
      alert('❌ Error adding mentors. Please try again.');
    }
    setLoading(false);
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.totalMentors}</h3>
            <p>Available Mentors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.totalGoals}</h3>
            <p>Goals Created</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <div className="action-card">
            <h4>🎓 Mentor Management</h4>
            <p>Add professional mentors to expand the mentorship network</p>
            {stats.totalMentors === 0 ? (
              <button 
                className="btn btn-primary"
                onClick={addMentorsToDatabase}
                disabled={loading || mentorsAdded}
              >
                {loading ? 'Adding Mentors...' : mentorsAdded ? '✅ Mentors Added' : 'Add Sample Mentors'}
              </button>
            ) : (
              <button className="btn btn-secondary" disabled>
                ✅ {stats.totalMentors} Mentors Available
              </button>
            )}
          </div>
          
          <div className="action-card">
            <h4>📊 Platform Analytics</h4>
            <p>Monitor user engagement and platform performance</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setActiveTab('analytics')}
            >
              View Analytics
            </button>
          </div>
          
          <div className="action-card">
            <h4>📚 Resource Management</h4>
            <p>Manage learning resources and content library</p>
            <button className="btn btn-secondary" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentors = () => (
    <div className="admin-mentors">
      <div className="section-header">
        <h3>Mentor Management</h3>
        <p>Add and manage professional mentors for the platform</p>
      </div>
      
      {stats.totalMentors === 0 ? (
        <div className="empty-state">
          <h4>No Mentors Added Yet</h4>
          <p>Add professional mentors to enable the mentorship feature</p>
          <button 
            className="btn btn-primary"
            onClick={addMentorsToDatabase}
            disabled={loading}
          >
            {loading ? 'Adding 8 Professional Mentors...' : 'Add Sample Mentors'}
          </button>
        </div>
      ) : (
        <div className="mentors-preview">
          <h4>✅ {stats.totalMentors} Professional Mentors Added</h4>
          <div className="mentors-grid">
            {sampleMentors.slice(0, 4).map((mentor, index) => (
              <div key={index} className="mentor-preview-card">
                <div className="mentor-avatar">
                  <img src={mentor.profileImage} alt={mentor.name} />
                </div>
                <h5>{mentor.name}</h5>
                <p>{mentor.experience} • {mentor.location}</p>
                <div className="mentor-rating">
                  ⭐ {mentor.rating} ({mentor.totalMentees} mentees)
                </div>
              </div>
            ))}
          </div>
          <p>And {sampleMentors.length - 4} more professional mentors...</p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="admin-analytics">
      <h3>Platform Analytics</h3>
      <div className="analytics-content">
        <div className="analytics-card">
          <h4>User Engagement</h4>
          <div className="engagement-stats">
            <div className="engagement-item">
              <span className="label">Quiz Completion Rate:</span>
              <span className="value">78%</span>
            </div>
            <div className="engagement-item">
              <span className="label">Average Goals per User:</span>
              <span className="value">3.2</span>
            </div>
            <div className="engagement-item">
              <span className="label">Mentorship Success Rate:</span>
              <span className="value">92%</span>
            </div>
          </div>
        </div>
        
        <div className="analytics-card">
          <h4>Growth Metrics</h4>
          <p>📈 User growth: +{stats.totalUsers} new users</p>
          <p>🎯 Goals created: {stats.totalGoals} total goals</p>
          <p>🤝 Mentorship matches: Active mentoring relationships</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h1>LifeMap Admin Dashboard</h1>
            <p>Manage and monitor the youth development platform</p>
          </div>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to Platform
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-nav">
          <button 
            className={activeTab === 'overview' ? 'admin-nav-btn active' : 'admin-nav-btn'}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={activeTab === 'mentors' ? 'admin-nav-btn active' : 'admin-nav-btn'}
            onClick={() => setActiveTab('mentors')}
          >
            🎓 Mentors
          </button>
          <button 
            className={activeTab === 'analytics' ? 'admin-nav-btn active' : 'admin-nav-btn'}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        <div className="admin-main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'mentors' && renderMentors()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;