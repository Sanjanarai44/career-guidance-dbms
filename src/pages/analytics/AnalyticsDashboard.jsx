import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Analytics.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [activeChart, setActiveChart] = useState('skills');

  // Sample analytics data
  const analyticsData = {
    overview: {
      readinessScore: 65,
      skillGrowth: 42,
      profileCompletion: 40,
      mentorConnections: 2,
      careerMatches: 6
    },
    skillProgress: [
      { name: 'JavaScript', current: 75, target: 90, growth: 15 },
      { name: 'React', current: 60, target: 85, growth: 25 },
      { name: 'Python', current: 45, target: 80, growth: 35 },
      { name: 'Node.js', current: 30, target: 75, growth: 45 },
      { name: 'UI/UX Design', current: 55, target: 80, growth: 25 },
      { name: 'SQL', current: 40, target: 75, growth: 35 }
    ],
    monthlyProgress: [
      { month: 'Jan', skills: 20, readiness: 30, connections: 1 },
      { month: 'Feb', skills: 35, readiness: 45, connections: 1 },
      { month: 'Mar', skills: 42, readiness: 65, connections: 2 },
      { month: 'Apr', skills: 50, readiness: 75, connections: 3 },
      { month: 'May', skills: 65, readiness: 85, connections: 4 },
      { month: 'Jun', skills: 80, readiness: 95, connections: 5 }
    ],
    careerReadiness: {
      technical: 70,
      communication: 60,
      problemSolving: 75,
      teamwork: 65,
      leadership: 50
    },
    goals: [
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

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Progress Tracking & Analytics</h1>
        <div className="time-filter">
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
        </div>
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
              <div className="card-trend positive">+12% this month</div>
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
              <div className="card-trend positive">+1 this month</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h4>Career Matches</h4>
              <div className="card-value">{analyticsData.overview.careerMatches}</div>
              <div className="card-trend positive">+3 new matches</div>
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
              <button 
                className={`chart-tab ${activeChart === 'growth' ? 'active' : ''}`}
                onClick={() => setActiveChart('growth')}
              >
                Growth Trends
              </button>
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
            <button className="add-goal-btn">+ Add New Goal</button>
          </div>
          <GoalsList goals={analyticsData.goals} />
        </div>

        {/* Recommendations Section */}
        <div className="recommendations-section">
          <h2>Personalized Recommendations</h2>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="rec-icon">💼</div>
              <h4>Complete Your Profile</h4>
              <p>Add your projects and certifications to increase your readiness score by 15%</p>
              <button className="rec-action-btn">Complete Now</button>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">📚</div>
              <h4>Focus on Node.js</h4>
              <p>Your Node.js skills are below target. Consider taking an advanced course.</p>
              <button className="rec-action-btn">View Courses</button>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">🤝</div>
              <h4>Connect with Mentors</h4>
              <p>Schedule sessions with DevOps mentors to improve your infrastructure skills.</p>
              <button className="rec-action-btn">Find Mentors</button>
            </div>
            <div className="recommendation-card">
              <div className="rec-icon">🎯</div>
              <h4>Explore Career Paths</h4>
              <p>Based on your skills, you have 6 strong career matches to explore.</p>
              <button className="rec-action-btn">View Matches</button>
            </div>
          </div>
        </div>
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
        {data.map((skill, index) => (
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
        ))}
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
const GoalsList = ({ goals }) => {
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
      {goals.map(goal => {
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
              <button className="action-btn primary">Update Progress</button>
              <button className="action-btn secondary">Edit Goal</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsDashboard;