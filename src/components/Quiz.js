// components/Quiz.js
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Quiz.css';

const Quiz = ({ user, userData, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const questions = [
    {
      id: 'strengths',
      question: 'What do you consider your greatest strength?',
      options: [
        'Leadership and inspiring others',
        'Creativity and artistic expression',
        'Analytical thinking and problem-solving',
        'Communication and building relationships',
        'Helping and supporting others'
      ]
    },
    {
      id: 'interests',
      question: 'Which area interests you most?',
      options: [
        'Technology and innovation',
        'Arts and creative expression',
        'Business and entrepreneurship',
        'Social impact and community service',
        'Science and research'
      ]
    },
    {
      id: 'challenges',
      question: 'What is your biggest personal challenge?',
      options: [
        'Building confidence and self-esteem',
        'Managing time and staying organized',
        'Developing social and communication skills',
        'Finding my purpose and direction',
        'Balancing different life priorities'
      ]
    },
    {
      id: 'goals',
      question: 'What is most important to you right now?',
      options: [
        'Academic and educational success',
        'Building meaningful relationships',
        'Developing my talents and skills',
        'Contributing to my community',
        'Spiritual growth and personal values'
      ]
    },
    {
      id: 'future',
      question: 'How do you see yourself in 5 years?',
      options: [
        'Leading a successful business or organization',
        'Making a positive impact in my community',
        'Excelling in my chosen career field',
        'Having strong family and social connections',
        'Living according to my values and purpose'
      ]
    },
    {
      id: 'learning',
      question: 'How do you prefer to learn new things?',
      options: [
        'Hands-on practice and experience',
        'Reading books and studying alone',
        'Group discussions and collaboration',
        'Watching videos and visual content',
        'Listening to mentors and experts'
      ]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    setLoading(true);
    
    // Simple result calculation based on answers
    const categories = {
      leadership: 0,
      creative: 0,
      analytical: 0,
      social: 0,
      service: 0
    };

    // Count preferences based on answer patterns
    Object.values(answers).forEach(answer => {
      if (answer.includes('Leadership') || answer.includes('business') || answer.includes('Leading')) {
        categories.leadership++;
      }
      if (answer.includes('Creativity') || answer.includes('Arts') || answer.includes('creative')) {
        categories.creative++;
      }
      if (answer.includes('Analytical') || answer.includes('Technology') || answer.includes('Science')) {
        categories.analytical++;
      }
      if (answer.includes('Communication') || answer.includes('relationships') || answer.includes('social')) {
        categories.social++;
      }
      if (answer.includes('Helping') || answer.includes('community') || answer.includes('impact')) {
        categories.service++;
      }
    });

    // Find dominant category
    const dominantCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b
    );

    const resultData = {
      dominantCategory,
      answers,
      completedAt: new Date(),
      recommendations: getRecommendations(dominantCategory)
    };

    try {
      // Update user document with quiz results
      await updateDoc(doc(db, 'users', user.uid), {
        quizCompleted: true,
        quizResults: resultData
      });

      setResults(resultData);
      setShowResults(true);
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
    
    setLoading(false);
  };

  const getRecommendations = (category) => {
    const recommendations = {
      leadership: {
        title: 'Natural Leader',
        description: 'You have strong leadership potential and enjoy inspiring others.',
        suggestions: [
          'Join student government or leadership clubs',
          'Practice public speaking and presentation skills',
          'Read books about leadership and management',
          'Volunteer to lead projects or initiatives'
        ]
      },
      creative: {
        title: 'Creative Innovator',
        description: 'You have a strong creative side and enjoy artistic expression.',
        suggestions: [
          'Explore different forms of art and creativity',
          'Take courses in design, writing, or music',
          'Join creative communities and workshops',
          'Start a personal creative project'
        ]
      },
      analytical: {
        title: 'Problem Solver',
        description: 'You excel at analytical thinking and solving complex problems.',
        suggestions: [
          'Learn programming or data analysis',
          'Join STEM clubs and competitions',
          'Practice logical reasoning and critical thinking',
          'Explore careers in technology or research'
        ]
      },
      social: {
        title: 'People Connector',
        description: 'You have strong social skills and enjoy building relationships.',
        suggestions: [
          'Develop communication and interpersonal skills',
          'Join clubs focused on networking and socializing',
          'Practice active listening and empathy',
          'Consider careers in counseling or human resources'
        ]
      },
      service: {
        title: 'Community Builder',
        description: 'You are passionate about helping others and making a positive impact.',
        suggestions: [
          'Volunteer for local community organizations',
          'Join service-oriented clubs and initiatives',
          'Learn about social issues and advocacy',
          'Consider careers in nonprofit or social work'
        ]
      }
    };

    return recommendations[category] || recommendations.service;
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h2>Your LifeMap Profile: {results.recommendations.title} 🎯</h2>
          <div className="result-description">
            <p>{results.recommendations.description}</p>
          </div>
          
          <div className="recommendations">
            <h3>Recommended Actions:</h3>
            <ul>
              {results.recommendations.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={onComplete}>
              Continue to Dashboard
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowResults(false)}
            >
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Self-Discovery Assessment</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="quiz-content">
        <div className="question">
          <h3>{questions[currentQuestion].question}</h3>
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentQuestion > 0 && (
        <button 
          className="btn btn-secondary back-btn"
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
        >
          ← Previous Question
        </button>
      )}
    </div>
  );
};

export default Quiz;