// components/Resources.js
import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Resources.css';

const Resources = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setLoading(false);
  }, [user.uid]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚', color: '#667eea' },
    { id: 'personal', name: 'Personal Development', icon: '🌱', color: '#28a745' },
    { id: 'academic', name: 'Academic Success', icon: '🎓', color: '#007bff' },
    { id: 'spiritual', name: 'Spiritual Growth', icon: '🙏', color: '#6f42c1' },
    { id: 'career', name: 'Career & Skills', icon: '💼', color: '#fd7e14' },
    { id: 'leadership', name: 'Leadership', icon: '👑', color: '#dc3545' },
    { id: 'wellness', name: 'Mental Wellness', icon: '🧘', color: '#20c997' }
  ];

  const resources = [
    {
      id: 1,
      title: "The 7 Habits of Highly Effective People",
      type: "Book",
      category: "personal",
      description: "Stephen Covey's timeless principles for personal and professional effectiveness",
      link: "https://www.amazon.com/7-Habits-Highly-Effective-People/dp/0743269519",
      duration: "375 pages",
      level: "Beginner",
      rating: 4.8
    },
    {
      id: 2,
      title: "How to Study Effectively - Nigerian Student Guide",
      type: "Article",
      category: "academic",
      description: "Proven study techniques specifically designed for Nigerian educational system",
      link: "https://www.nairaland.com/6891234/how-study-effectively-nigerian-students",
      duration: "12 min read",
      level: "Beginner",
      rating: 4.6
    },
    {
      id: 3,
      title: "Daily Devotions for Young Adults",
      type: "Devotional",
      category: "spiritual",
      description: "Morning and evening devotions to strengthen your relationship with God",
      link: "https://www.youversion.com/reading-plans",
      duration: "5 min daily",
      level: "All levels",
      rating: 4.9
    },
    {
      id: 4,
      title: "Leadership Skills for African Youth",
      type: "Video Course",
      category: "leadership",
      description: "Practical leadership principles taught by successful African leaders",
      link: "https://youtu.be/J8VYv7vj568?si=515NN4cMHDDmHgqB",
      duration: "2.5 hours",
      level: "Intermediate",
      rating: 4.7
    },
    {
      id: 5,
      title: "Building Emotional Intelligence",
      type: "Podcast",
      category: "personal",
      description: "Daniel Goleman's insights on understanding and managing emotions",
      link: "https://podcasts.apple.com/us/podcast/ten-percent-happier-with-dan-harris/id1087147821",
      duration: "45 min",
      level: "Beginner",
      rating: 4.5
    },
    {
      id: 6,
      title: "Study Techniques That Actually Work",
      type: "Video",
      category: "academic",
      description: "Science-backed methods to improve learning and retention",
      link: "https://www.youtube.com/watch?v=VcT8puLpNKA",
      duration: "25 min",
      level: "Beginner",
      rating: 4.6
    },
    {
      id: 7,
      title: "Mindfulness for Students",
      type: "Course",
      category: "wellness",
      description: "Practical meditation and stress management techniques",
      link: "https://www.headspace.com/meditation/students",
      duration: "1.5 hours",
      level: "Beginner",
      rating: 4.8
    },
    {
      id: 8,
      title: "Career Planning for Nigerian Graduates",
      type: "eBook",
      category: "career",
      description: "Navigate the Nigerian job market with confidence and strategy",
      link: "https://www.jobberman.com/career-advice",
      duration: "120 pages",
      level: "Intermediate",
      rating: 4.4
    },
    {
      id: 9,
      title: "Bible Study Methods for Beginners",
      type: "Guide",
      category: "spiritual",
      description: "Simple approaches to personal Bible study and reflection",
      link: "https://www.biblestudytools.com/bible-study/topical-studies/how-to-study-the-bible.html",
      duration: "15 min daily",
      level: "Beginner",
      rating: 4.7
    },
    {
      id: 10,
      title: "Public Speaking Confidence Masterclass",
      type: "Video Course",
      category: "leadership",
      description: "Overcome fear and become a confident public speaker",
      link: "https://www.youtube.com/watch?v=Unzc731iCUY",
      duration: "3 hours",
      level: "Beginner",
      rating: 4.5
    },
    {
      id: 11,
      title: "Financial Literacy for Young Nigerians",
      type: "Article",
      category: "personal",
      description: "Essential money management skills for the Nigerian economy",
      link: "https://www.cbn.gov.ng/out/2013/ccd/cbn%20financial%20literacy%20framework.pdf",
      duration: "20 min read",
      level: "Beginner",
      rating: 4.3
    },
    {
      id: 12,
      title: "JAMB Success Strategies 2024",
      type: "Guide",
      category: "academic",
      description: "Comprehensive guide to excel in JAMB and gain university admission",
      link: "https://www.jamb.gov.ng/",
      duration: "50 pages",
      level: "Intermediate",
      rating: 4.8
    },
    {
      id: 13,
      title: "Entrepreneurship in Nigeria",
      type: "Podcast",
      category: "career",
      description: "Success stories and practical advice from Nigerian entrepreneurs",
      link: "https://techpoint.africa/podcast/",
      duration: "40 min",
      level: "Intermediate",
      rating: 4.6
    },
    {
      id: 14,
      title: "Mental Health Awareness for Students",
      type: "Video",
      category: "wellness",
      description: "Recognizing and managing stress, anxiety, and depression",
      link: "https://www.youtube.com/watch?v=3QIfkeA6HBY",
      duration: "30 min",
      level: "All levels",
      rating: 4.7
    },
    {
      id: 15,
      title: "Purpose Driven Life Study Guide",
      type: "Book",
      category: "spiritual",
      description: "Rick Warren's guide to discovering your life's purpose",
      link: "https://www.amazon.com/Purpose-Driven-Life-Rick-Warren/dp/0310205719",
      duration: "334 pages",
      level: "Beginner",
      rating: 4.8
    },
    {
      id: 16,
      title: "Digital Skills for Nigerian Youth",
      type: "Course",
      category: "career",
      description: "Learn in-demand digital skills: coding, design, and marketing",
      link: "https://www.coursera.org/specializations/google-it-support",
      duration: "6 months",
      level: "Beginner",
      rating: 4.5
    },
    {
      id: 17,
      title: "Time Management for Busy Students",
      type: "Article",
      category: "academic",
      description: "Proven strategies to balance studies, work, and personal life",
      link: "https://www.mindtools.com/pages/article/newHTE_07.htm",
      duration: "10 min read",
      level: "Beginner",
      rating: 4.4
    },
    {
      id: 18,
      title: "Building Healthy Relationships",
      type: "Video",
      category: "personal",
      description: "Creating meaningful connections and setting healthy boundaries",
      link: "https://www.youtube.com/watch?v=1Evwgu369Jw",
      duration: "35 min",
      level: "All levels",
      rating: 4.6
    },
    {
      id: 19,
      title: "Nigerian History and Cultural Pride",
      type: "eBook",
      category: "personal",
      description: "Understanding your roots and building cultural confidence",
      link: "https://www.nigeriagalleria.com/Nigeria/Nigeria_History.html",
      duration: "200 pages",
      level: "Intermediate",
      rating: 4.5
    },
    {
      id: 20,
      title: "Prayer and Meditation Practices",
      type: "Guide",
      category: "spiritual",
      description: "Different approaches to prayer and spiritual meditation",
      link: "https://www.openbible.info/topics/prayer_and_meditation",
      duration: "20 min daily",
      level: "All levels",
      rating: 4.8
    },
    {
      id: 21,
      title: "Networking for Career Success",
      type: "Podcast",
      category: "career",
      description: "Building professional relationships in the Nigerian business environment",
      link: "https://www.linkedin.com/learning/",
      duration: "35 min",
      level: "Intermediate",
      rating: 4.3
    },
    {
      id: 22,
      title: "Healthy Living on a Student Budget",
      type: "Article",
      category: "wellness",
      description: "Nutrition, exercise, and wellness tips for cash-strapped students",
      link: "https://www.healthline.com/nutrition/19-ways-to-eat-healthy-on-a-budget",
      duration: "15 min read",
      level: "Beginner",
      rating: 4.5
    },
    {
      id: 23,
      title: "Critical Thinking Skills Development",
      type: "Course",
      category: "academic",
      description: "Enhance your analytical and problem-solving abilities",
      link: "https://www.edx.org/course/critical-thinking",
      duration: "4 weeks",
      level: "Intermediate",
      rating: 4.7
    },
    {
      id: 24,
      title: "Overcoming Fear and Building Confidence",
      type: "Video",
      category: "personal",
      description: "Practical strategies to build self-confidence and overcome limiting beliefs",
      link: "https://www.youtube.com/watch?v=w-HYZv6HzAs",
      duration: "42 min",
      level: "All levels",
      rating: 4.6
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Book': return '📖';
      case 'Article': return '📄';
      case 'Video': return '🎥';
      case 'Video Course': return '🎬';
      case 'Podcast': return '🎧';
      case 'Course': return '🎓';
      case 'eBook': return '📱';
      case 'Guide': return '📋';
      case 'Workshop': return '🏫';
      case 'Devotional': return '✨';
      default: return '📚';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return '#28a745';
      case 'Intermediate': return '#ffc107';
      case 'Advanced': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPersonalizedResources = () => {
    if (!userData?.quizResults) return resources;
    
    const dominantCategory = userData.quizResults.dominantCategory;
    const categoryMapping = {
      leadership: 'leadership',
      creative: 'personal',
      analytical: 'career',
      social: 'personal',
      service: 'spiritual'
    };
    
    const preferredCategory = categoryMapping[dominantCategory] || 'personal';
    
    // Sort resources to prioritize user's dominant category
    return resources.sort((a, b) => {
      if (a.category === preferredCategory && b.category !== preferredCategory) return -1;
      if (b.category === preferredCategory && a.category !== preferredCategory) return 1;
      return b.rating - a.rating;
    });
  };

  const filteredResources = selectedCategory === 'all' 
    ? getPersonalizedResources()
    : getPersonalizedResources().filter(resource => resource.category === selectedCategory);

  if (loading) {
    return (
      <div className="resources-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h2>Learning Resources 📚</h2>
        <p>Curated content to accelerate your personal and professional growth</p>
        
        {userData?.quizResults && (
          <div className="personalization-notice">
            <span className="notice-icon">✨</span>
            <p>Resources are personalized based on your {userData.quizResults.recommendations?.title} profile</p>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            style={{ '--category-color': category.color }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="resources-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <div className="resource-type">
                <span className="type-icon">{getTypeIcon(resource.type)}</span>
                <span className="type-text">{resource.type}</span>
              </div>
              <div className="resource-rating">
                <span className="star">⭐</span>
                <span className="rating-value">{resource.rating}</span>
              </div>
            </div>
            
            <h3 className="resource-title">{resource.title}</h3>
            <p className="resource-description">{resource.description}</p>
            
            <div className="resource-meta">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>{resource.duration}</span>
              </div>
              <div className="meta-item">
                <span 
                  className="level-badge"
                  style={{ backgroundColor: getLevelColor(resource.level) }}
                >
                  {resource.level}
                </span>
              </div>
            </div>
            
            <div className="resource-actions">
              <button 
                className="btn btn-primary resource-btn"
                onClick={() => window.open(resource.link, '_blank', 'noopener,noreferrer')}
              >
                Access Resource
              </button>
              <button className="btn btn-secondary bookmark-btn">
                🔖 Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No resources found</h3>
          <p>Try selecting a different category or check back later for new content.</p>
        </div>
      )}

      {/* Learning Path Suggestion */}
      {userData?.quizResults && (
        <div className="learning-path-section">
          <h3>Recommended Learning Path 🛤️</h3>
          <div className="learning-path">
            <div className="path-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Foundation Building</h4>
                <p>Start with personal development and self-awareness resources</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Skill Development</h4>
                <p>Focus on {userData.quizResults.recommendations?.title.toLowerCase()} related skills</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Advanced Application</h4>
                <p>Apply your knowledge through leadership and mentoring opportunities</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="study-tips-section">
        <h3>Study Tips for Maximum Impact 💡</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Set Clear Goals</h4>
            <p>Define what you want to achieve before starting any resource</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📝</div>
            <h4>Take Notes</h4>
            <p>Write down key insights and action points as you learn</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>Apply Immediately</h4>
            <p>Practice what you learn within 24 hours for better retention</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">👥</div>
            <h4>Discuss & Share</h4>
            <p>Share insights with friends or mentors to deepen understanding</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;