// components/Goals.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Goals.css';

const Goals = ({ user }) => {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'personal',
    deadline: '',
    description: ''
  });

  const categories = [
    { value: 'personal', label: 'Personal Development', icon: '🌱' },
    { value: 'academic', label: 'Academic', icon: '📚' },
    { value: 'spiritual', label: 'Spiritual Growth', icon: '🙏' },
    { value: 'social', label: 'Social & Relationships', icon: '👥' },
    { value: 'career', label: 'Career & Skills', icon: '💼' },
    { value: 'health', label: 'Health & Fitness', icon: '💪' }
  ];

  useEffect(() => {
    fetchGoals();
  }, [user.uid]);

  const fetchGoals = async () => {
    try {
      const q = query(collection(db, 'goals'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const goalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
    setLoading(false);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    try {
      const goalData = {
        ...newGoal,
        userId: user.uid,
        completed: false,
        createdAt: new Date(),
        progress: 0
      };

      await addDoc(collection(db, 'goals'), goalData);
      setNewGoal({ title: '', category: 'personal', deadline: '', description: '' });
      setShowAddForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const toggleGoalCompletion = async (goalId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'goals', goalId), {
        completed: !currentStatus,
        completedAt: !currentStatus ? new Date() : null
      });
      fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteDoc(doc(db, 'goals', goalId));
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const updateProgress = async (goalId, progress) => {
    try {
      await updateDoc(doc(db, 'goals', goalId), {
        progress: parseInt(progress)
      });
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  if (loading) {
    return (
      <div className="goals-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your goals...</p>
        </div>
      </div>
    );
  }

  const completedGoals = goals.filter(goal => goal.completed);
  const activeGoals = goals.filter(goal => !goal.completed);

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h2>My Development Goals 🎯</h2>
        <p>Set and track your personal growth journey</p>
        <button 
          className="btn btn-primary add-goal-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Goal'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-goal-form">
          <h3>Create a New Goal</h3>
          <form onSubmit={handleAddGoal}>
            <input
              type="text"
              placeholder="Goal title (e.g., Read 2 books this month)"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              required
            />
            
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
            />
            
            <textarea
              placeholder="Describe your goal and why it's important to you..."
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              rows="3"
            ></textarea>
            
            <button type="submit" className="btn btn-primary">
              Create Goal
            </button>
          </form>
        </div>
      )}

      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No goals yet!</h3>
          <p>Start your growth journey by setting your first goal.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Set Your First Goal
          </button>
        </div>
      ) : (
        <div className="goals-content">
          {activeGoals.length > 0 && (
            <div className="goals-section">
              <h3>Active Goals ({activeGoals.length})</h3>
              <div className="goals-grid">
                {activeGoals.map(goal => {
                  const categoryInfo = getCategoryInfo(goal.category);
                  return (
                    <div key={goal.id} className="goal-card">
                      <div className="goal-header">
                        <div className="goal-category">
                          {categoryInfo.icon} {categoryInfo.label}
                        </div>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          ×
                        </button>
                      </div>
                      
                      <h4>{goal.title}</h4>
                      
                      {goal.description && (
                        <p className="goal-description">{goal.description}</p>
                      )}
                      
                      {goal.deadline && (
                        <div className="goal-deadline">
                          📅 Due: {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      )}
                      
                      <div className="progress-section">
                        <label>Progress: {goal.progress || 0}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress || 0}
                          onChange={(e) => updateProgress(goal.id, e.target.value)}
                          className="progress-slider"
                        />
                      </div>
                      
                      <button 
                        className="btn btn-primary complete-btn"
                        onClick={() => toggleGoalCompletion(goal.id, goal.completed)}
                      >
                        Mark as Complete ✓
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div className="goals-section">
              <h3>Completed Goals ({completedGoals.length}) 🎉</h3>
              <div className="goals-grid">
                {completedGoals.map(goal => {
                  const categoryInfo = getCategoryInfo(goal.category);
                  return (
                    <div key={goal.id} className="goal-card completed">
                      <div className="goal-header">
                        <div className="goal-category">
                          {categoryInfo.icon} {categoryInfo.label}
                        </div>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          ×
                        </button>
                      </div>
                      
                      <h4>{goal.title}</h4>
                      
                      {goal.description && (
                        <p className="goal-description">{goal.description}</p>
                      )}
                      
                      <div className="completion-info">
                        ✅ Completed on {goal.completedAt ? new Date(goal.completedAt.toDate()).toLocaleDateString() : 'Unknown date'}
                      </div>
                      
                      <button 
                        className="btn btn-secondary"
                        onClick={() => toggleGoalCompletion(goal.id, goal.completed)}
                      >
                        Mark as Incomplete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Goals;