import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎓 Career Guidance Dashboard</h1>
        <button 
          className="logout-button"
          onClick={() => {
            // In real app, we would clear authentication tokens
            alert('Logged out successfully!');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, Student! 👋</h2>
          <p>Let's start building your career path together!</p>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card" onClick={() => navigate('/profile')}>
            <h3>👤 Profile Completion</h3>
            <p className="stat-number">40%</p>
            <p>Complete your profile</p>
          </div>
          
          <div className="stat-card" onClick={() => navigate('/skills')}>
            <h3>💼 Your Skills</h3>
            <p className="stat-number">0</p>
            <p>Add your skills</p>
          </div>
          
          <div className="stat-card" onClick={() => navigate('/career')}>
            <h3>🎯 Career Ideas</h3>
            <p className="stat-number">3</p>
            <p>Explore opportunities</p>
          </div>

          <div className="stat-card" onClick={() => navigate('/mentors')}>
            <h3>👥 Available Mentors</h3>
            <p className="stat-number">6</p>
            <p>Connect for guidance</p>
          </div>

          <div className="stat-card" onClick={() => navigate('/analytics')}>
            <h3>📊 Readiness Score</h3>
            <p className="stat-number">65%</p>
            <p>Track your progress</p>
          </div>
        </div>
        
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-button" onClick={() => navigate('/profile')}>
              👤 Complete Profile
            </button>
            <button className="action-button" onClick={() => navigate('/skills')}>
              💡 Skill Assessment
            </button>
            <button className="action-button" onClick={() => navigate('/career')}>
              🔍 Career Paths
            </button>
            <button className="action-button" onClick={() => navigate('/mentors')}>
              👥 Find Mentors
            </button>
            <button className="action-button" onClick={() => navigate('/analytics')}>
              📊 View Analytics
            </button>
          </div>
        </div>

        {/* All Prompt Sections */}
        <div className="profile-prompt">
          <div className="prompt-content">
            <h3>🚀 Start Your Journey!</h3>
            <p>Complete your profile to get personalized career recommendations</p>
            <button className="primary-button" onClick={() => navigate('/profile')}>
              Complete My Profile
            </button>
          </div>
        </div>

        <div className="skills-prompt">
          <div className="prompt-content">
            <h3>🔍 Discover Your Career Path!</h3>
            <p>Complete your skill assessment to get personalized career recommendations</p>
            <button className="primary-button" onClick={() => navigate('/skills')}>
              Start Skill Assessment
            </button>
          </div>
        </div>

        <div className="career-prompt">
          <div className="prompt-content">
            <h3>🚀 Discover Your Dream Career!</h3>
            <p>Get personalized career recommendations based on your skills and interests</p>
            <button className="primary-button" onClick={() => navigate('/career')}>
              Explore Career Paths
            </button>
          </div>
        </div>

        <div className="mentors-prompt">
          <div className="prompt-content">
            <h3>🤝 Get Expert Guidance!</h3>
            <p>Connect with experienced alumni and industry mentors for personalized career advice</p>
            <button className="primary-button" onClick={() => navigate('/mentors')}>
              Browse Mentors
            </button>
          </div>
        </div>

        <div className="analytics-prompt">
          <div className="prompt-content">
            <h3>📊 Track Your Progress!</h3>
            <p>Monitor your skill growth and career readiness with detailed analytics</p>
            <button className="primary-button" onClick={() => navigate('/analytics')}>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;