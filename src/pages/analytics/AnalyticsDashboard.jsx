import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Analytics.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [timeRange, setTimeRange] = useState('month');
  const [activeChart, setActiveChart] = useState('skills');

  // Calculate analytics based on user data
  const analyticsData = {
    overview: {
      readinessScore: state.analytics.readinessScore,
      skillGrowth: state.analytics.skillGrowth,
      profileCompletion: state.user.profileCompletion,
      mentorConnections: state.mentorshipRequests.length,
      careerMatches: Math.min(state.skills.length * 2, 10) // Based on skills
    },
    skillProgress: state.skills.map(skill => ({
      name: skill.name,
      current: skill.level * 25, // Convert 1-4 scale to percentage
      target: 85,
      growth: Math.floor(Math.random() * 30) + 10 // Random growth for demo
    })),
    monthlyProgress: [
      { month: 'Jan', skills: 20, readiness: 30, connections: 1 },
      { month: 'Feb', skills: 35, readiness: 45, connections: 1 },
      { month: 'Mar', skills: state.analytics.skillGrowth, readiness: state.analytics.readinessScore, connections: state.mentorshipRequests.length },
      { month: 'Apr', skills: Math.min(state.analytics.skillGrowth + 15, 100), readiness: Math.min(state.analytics.readinessScore + 10, 100), connections: state.mentorshipRequests.length + 1 },
      { month: 'May', skills: Math.min(state.analytics.skillGrowth + 30, 100), readiness: Math.min(state.analytics.readinessScore + 20, 100), connections: state.mentorshipRequests.length + 2 },
      { month: 'Jun', skills: Math.min(state.analytics.skillGrowth + 45, 100), readiness: Math.min(state.analytics.readinessScore + 30, 100), connections: state.mentorshipRequests.length + 3 }
    ],
    careerReadiness: {
      technical: Math.min(state.skills.length * 15, 100),
      communication: 60,
      problemSolving: Math.min(state.skills.length * 12, 100),
      teamwork: 65,
      leadership: 50
    },
    goals: state.goals.length > 0 ? state.goals : [
      { id: 1, title: 'Complete React Project', progress: 75, deadline: '2024-02-15', priority: 'high' },
      { id: 2, title: 'Learn Node.js Basics', progress: 30, deadline: '2024-03-01', priority: 'medium' },
      { id: 3, title: 'Build Portfolio Website', progress: 20, deadline: '2024-04-01', priority: 'high' },
      { id: 4, title: 'Complete 5 Mock Interviews', progress: 40, deadline: '2024-03-15', priority: 'medium' }
    ]
  };

  const getReadinessLevel = (score) => {
    if (score >= 80) return { level: 'Ready', color: '#48bb78', description: 'You are well-prepared for job applications!' };
    if (score >= 60) return { level: 'Almost Ready', color: '#d69e2e', description: 'You are close to being job-ready!' };
    return { level: 'Needs Work', color: '#e53e3e', description: 'Focus on skill development and preparation.' };
  };

  const readinessInfo = getReadinessLevel(analyticsData.overview.readinessScore);

  const handleAddGoal = () => {
    const goalTitle = prompt('Enter your new goal:');
    if (goalTitle) {
      const goalDeadline = prompt('Enter deadline (YYYY-MM-DD):');
      if (goalDeadline) {
        actions.addGoal({
          title: goalTitle,
          deadline: goalDeadline,
          priority: 'medium'
        });
        alert('New goal added successfully!');
      }
    }
  };

  const handleUpdateGoalProgress = (goalId, progress) => {
    const newProgress = prompt('Enter new progress percentage (0-100):');
    if (newProgress !== null) {
      const progressNum = parseInt(newProgress);
      if (!isNaN(progressNum) && progressNum >= 0 && progressNum <= 100) {
        actions.updateGoalProgress(goalId, progressNum);
        alert('Progress updated successfully!');
      } else {
        alert('Please enter a valid number between 0 and 100.');
      }
    }
  };

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Progress Tracking & Analytics</h1>
        {/* <div className="time-filter">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div> */}
      </header>

      <div className="analytics-content">
        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="overview-card main">
            <div className="card-header">
              <h3>Career Readiness Score</h3>
              <span 
                className="readiness-badge"
                style={{ backgroundColor: readinessInfo.color }}
              >
                {readinessInfo.level}
              </span>
            </div>
            <div className="readiness-score">
              <div className="score-circle">
                <div 
                  className="circle-progress"
                  style={{ 
                    background: `conic-gradient(${readinessInfo.color} ${analyticsData.overview.readinessScore * 3.6}deg, #e2e8f0 0deg)` 
                  }}
                >
                  <div className="score-inner">
                    <span className="score-value">{analyticsData.overview.readinessScore}%</span>
                  </div>
                </div>
              </div>
              <p className="score-description">{readinessInfo.description}</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h4>Skill Growth</h4>
              <div className="card-value">{analyticsData.overview.skillGrowth}%</div>
              <div className="card-trend positive">+{Math.floor(analyticsData.overview.skillGrowth / 4)}% this month</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">👤</div>
            <div className="card-content">
              <h4>Profile Completion</h4>
              <div className="card-value">{analyticsData.overview.profileCompletion}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${analyticsData.overview.profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🤝</div>
            <div className="card-content">
              <h4>Mentor Connections</h4>
              <div className="card-value">{analyticsData.overview.mentorConnections}</div>
              <div className="card-trend positive">+{analyticsData.overview.mentorConnections} active</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h4>Career Matches</h4>
              <div className="card-value">{analyticsData.overview.careerMatches}</div>
              <div className="card-trend positive">Based on your skills</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="section-header">
            <h2>Progress Analytics</h2>
            <div className="chart-tabs">
              <button 
                className={`chart-tab ${activeChart === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveChart('skills')}
              >
                Skill Progress
              </button>
              {/* <button 
                className={`chart-tab ${activeChart === 'growth' ? 'active' : ''}`}
                onClick={() => setActiveChart('growth')}
              >
                Growth Trends
              </button> */}
              <button 
                className={`chart-tab ${activeChart === 'readiness' ? 'active' : ''}`}
                onClick={() => setActiveChart('readiness')}
              >
                Readiness Breakdown
              </button>
            </div>
          </div>

          <div className="charts-container">
            {activeChart === 'skills' && <SkillProgressChart data={analyticsData.skillProgress} />}
            {activeChart === 'growth' && <GrowthTrendsChart data={analyticsData.monthlyProgress} />}
            {activeChart === 'readiness' && <ReadinessBreakdown data={analyticsData.careerReadiness} />}
          </div>
        </div>

        {/* Goals Section */}
        <div className="goals-section">
          <div className="section-header">
            <h2>Your Goals & Targets</h2>
            <button className="add-goal-btn" onClick={handleAddGoal}>
              + Add New Goal
            </button>
          </div>
          <GoalsList 
            goals={analyticsData.goals} 
            onUpdateProgress={handleUpdateGoalProgress}
          />
        </div>

        {/* Recommendations Section */}
        {/* <div className="recommendations-section">
          <h2>Personalized Recommendations</h2>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="rec-icon">💼</div>
              <h4>Complete Your Profile</h4>
              <p>Add your projects and certifications to increase your readiness score by 15%</p>
              <button 
                className="rec-action-btn" 
                onClick={() => navigate('/profile')}
              >
                Complete Now
              </button>
            </div>
            
            <div className="recommendation-card">
              <div className="rec-icon">📚</div>
              <h4>Develop Technical Skills</h4>
              <p>Focus on {state.skills.length === 0 ? 'programming fundamentals' : 'advanced topics'} to improve your technical readiness.</p>
              <button 
                className="rec-action-btn" 
                onClick={() => navigate('/skills')}
              >
                View Courses
              </button>
            </div>
            
            <div className="recommendation-card">
              <div className="rec-icon">🤝</div>
              <h4>Connect with Mentors</h4>
              <p>Schedule sessions with industry professionals to get career guidance.</p>
              <button 
                className="rec-action-btn" 
                onClick={() => navigate('/mentors')}
              >
                Find Mentors
              </button>
            </div>
            
            <div className="recommendation-card">
              <div className="rec-icon">🎯</div>
              <h4>Explore Career Paths</h4>
              <p>Based on your {state.skills.length} skills, you have strong career matches to explore.</p>
              <button 
                className="rec-action-btn" 
                onClick={() => navigate('/career')}
              >
                View Matches
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Skill Progress Chart Component
const SkillProgressChart = ({ data }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Skill Progress vs Target</h3>
        <p>Track your skill development progress</p>
      </div>
      <div className="skills-progress-chart">
        {data.length === 0 ? (
          <div className="empty-chart">
            <p>No skills added yet. Complete your skill assessment to see progress.</p>
          </div>
        ) : (
          data.map((skill, index) => (
            <div key={skill.name} className="skill-progress-item">
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.current}%</span>
              </div>
              <div className="progress-bars">
                <div className="progress-bar">
                  <div 
                    className="progress-fill current" 
                    style={{ width: `${skill.current}%` }}
                  ></div>
                </div>
                <div className="progress-bar target">
                  <div 
                    className="progress-fill target" 
                    style={{ width: `${skill.target}%` }}
                  ></div>
                </div>
              </div>
              <div className="skill-growth">
                <span className="growth-badge positive">+{skill.growth}% growth</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Growth Trends Chart Component
const GrowthTrendsChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.skills, d.readiness, d.connections))) * 1.2;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Monthly Progress Trends</h3>
        <p>Track your growth over time</p>
      </div>
      <div className="growth-trends-chart">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color skills"></div>
            <span>Skills</span>
          </div>
          <div className="legend-item">
            <div className="legend-color readiness"></div>
            <span>Readiness</span>
          </div>
          <div className="legend-item">
            <div className="legend-color connections"></div>
            <span>Connections</span>
          </div>
        </div>
        <div className="chart-bars">
          {data.map((month, index) => (
            <div key={month.month} className="chart-bar-group">
              <div className="bar-label">{month.month}</div>
              <div className="bars-container">
                <div 
                  className="bar skills" 
                  style={{ height: `${(month.skills / maxValue) * 100}%` }}
                  title={`Skills: ${month.skills}%`}
                ></div>
                <div 
                  className="bar readiness" 
                  style={{ height: `${(month.readiness / maxValue) * 100}%` }}
                  title={`Readiness: ${month.readiness}%`}
                ></div>
                <div 
                  className="bar connections" 
                  style={{ height: `${(month.connections / maxValue) * 100}%` }}
                  title={`Connections: ${month.connections}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Readiness Breakdown Component
const ReadinessBreakdown = ({ data }) => {
  const categories = [
    { key: 'technical', label: 'Technical Skills', icon: '💻' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'problemSolving', label: 'Problem Solving', icon: '🔍' },
    { key: 'teamwork', label: 'Teamwork', icon: '👥' },
    { key: 'leadership', label: 'Leadership', icon: '🌟' }
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Career Readiness Breakdown</h3>
        <p>Detailed analysis of your preparedness areas</p>
      </div>
      <div className="readiness-breakdown">
        {categories.map(category => (
          <div key={category.key} className="readiness-category">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
              <span className="category-score">{data[category.key]}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${data[category.key]}%`,
                  backgroundColor: data[category.key] >= 70 ? '#48bb78' : data[category.key] >= 50 ? '#d69e2e' : '#e53e3e'
                }}
              ></div>
            </div>
            <div className="category-feedback">
              {data[category.key] >= 70 ? 'Strong area' : data[category.key] >= 50 ? 'Developing well' : 'Needs improvement'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Goals List Component
const GoalsList = ({ goals, onUpdateProgress }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#d69e2e';
      case 'low': return '#38a169';
      default: return '#718096';
    }
  };

  const getDaysUntil = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="goals-list">
      {goals.length === 0 ? (
        <div className="empty-state">
          <p>No goals set yet. Add your first goal to track your progress!</p>
        </div>
      ) : (
        goals.map(goal => {
          const daysUntil = getDaysUntil(goal.deadline);
          const isOverdue = daysUntil < 0;
          
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <h4>{goal.title}</h4>
                <div className="goal-meta">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(goal.priority) }}
                  >
                    {goal.priority}
                  </span>
                  <span className={`deadline ${isOverdue ? 'overdue' : ''}`}>
                    {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
                  </span>
                </div>
              </div>
              
              <div className="goal-progress">
                <div className="progress-info">
                  <span className="progress-text">{goal.progress}% Complete</span>
                  <span className="progress-percentage">{goal.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="goal-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => onUpdateProgress(goal.id, goal.progress)}
                >
                  Update Progress
                </button>
                <button className="action-btn secondary">Edit Goal</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AnalyticsDashboard;