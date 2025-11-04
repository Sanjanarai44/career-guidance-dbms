import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mentors.css';

const MentorDirectory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [filters, setFilters] = useState({
    industry: 'all',
    expertise: 'all',
    availability: 'all'
  });

  // Sample mentors data
  const mentorsData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Frontend Engineer',
      company: 'Google',
      industry: 'Technology',
      expertise: ['React', 'JavaScript', 'Web Performance'],
      experience: '8 years',
      availability: 'High',
      rating: 4.9,
      sessions: 127,
      image: '👩‍💻',
      bio: 'Passionate about helping new developers break into the tech industry. Specialized in frontend technologies and interview preparation.',
      education: 'Computer Science, Stanford University',
      previousRoles: ['Facebook', 'Microsoft'],
      mentorshipAreas: ['Career Guidance', 'Technical Interviews', 'Project Reviews']
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Data Science Manager',
      company: 'Netflix',
      industry: 'Analytics',
      expertise: ['Python', 'Machine Learning', 'Data Visualization'],
      experience: '10 years',
      availability: 'Medium',
      rating: 4.8,
      sessions: 89,
      image: '👨‍🔬',
      bio: 'Data science professional with experience in recommendation systems and large-scale data processing. Love mentoring aspiring data scientists.',
      education: 'PhD in Data Science, MIT',
      previousRoles: ['Amazon', 'Spotify'],
      mentorshipAreas: ['ML Projects', 'Career Transition', 'Research Guidance']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Product Design Lead',
      company: 'Airbnb',
      industry: 'Design',
      expertise: ['UI/UX Design', 'Figma', 'User Research'],
      experience: '7 years',
      availability: 'High',
      rating: 4.7,
      sessions: 64,
      image: '👩‍🎨',
      bio: 'Design leader focused on creating user-centered products. Enjoy helping designers build their portfolios and career paths.',
      education: 'Design & Human-Computer Interaction, Carnegie Mellon',
      previousRoles: ['Adobe', 'IDEO'],
      mentorshipAreas: ['Portfolio Review', 'Design Process', 'Career Growth']
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'DevOps Architect',
      company: 'Amazon Web Services',
      industry: 'Infrastructure',
      expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      experience: '12 years',
      availability: 'Low',
      rating: 4.9,
      sessions: 156,
      image: '👨‍💼',
      bio: 'Cloud infrastructure expert passionate about teaching modern DevOps practices and cloud technologies.',
      education: 'Computer Engineering, UC Berkeley',
      previousRoles: ['Microsoft Azure', 'Startup Founder'],
      mentorshipAreas: ['Cloud Certification', 'Infrastructure Design', 'Career Advice']
    },
    {
      id: 5,
      name: 'Priya Patel',
      title: 'Product Manager',
      company: 'Microsoft',
      industry: 'Business',
      expertise: ['Product Strategy', 'Agile', 'User Stories'],
      experience: '6 years',
      availability: 'Medium',
      rating: 4.6,
      sessions: 42,
      image: '👩‍💼',
      bio: 'Product manager with experience in B2B and B2C products. Enjoy mentoring aspiring PMs and helping with career transitions.',
      education: 'MBA, Harvard Business School',
      previousRoles: ['Google', 'Consulting'],
      mentorshipAreas: ['PM Interviews', 'Product Strategy', 'Career Transition']
    },
    {
      id: 6,
      name: 'Alex Thompson',
      title: 'Full Stack Developer',
      company: 'Stripe',
      industry: 'Technology',
      expertise: ['Node.js', 'React', 'TypeScript', 'PostgreSQL'],
      experience: '5 years',
      availability: 'High',
      rating: 4.5,
      sessions: 38,
      image: '👨‍💻',
      bio: 'Full stack developer who transitioned from bootcamp to tech. Passionate about helping others make the same journey.',
      education: 'Bootcamp Graduate, Self-Taught',
      previousRoles: ['Startup', 'Freelance'],
      mentorshipAreas: ['Bootcamp Guidance', 'Project Help', 'Interview Prep']
    }
  ];

  // Sample mentorship requests
  const mentorshipRequests = [
    {
      id: 1,
      mentorId: 1,
      mentorName: 'Sarah Johnson',
      status: 'pending',
      date: '2024-01-15',
      message: 'I need help preparing for frontend interviews at FAANG companies.',
      type: 'Career Guidance'
    },
    {
      id: 2,
      mentorId: 2,
      mentorName: 'Michael Chen',
      status: 'accepted',
      date: '2024-01-10',
      message: 'Looking for guidance on my machine learning project.',
      type: 'Project Review',
      sessionDate: '2024-01-20'
    }
  ];

  const filteredMentors = mentorsData.filter(mentor => {
    if (filters.industry !== 'all' && mentor.industry !== filters.industry) return false;
    if (filters.expertise !== 'all' && !mentor.expertise.includes(filters.expertise)) return false;
    if (filters.availability !== 'all' && mentor.availability !== filters.availability) return false;
    return true;
  });

  const handleRequestMentorship = (mentor) => {
    const requestMessage = prompt(`Send mentorship request to ${mentor.name}:\n\nWhat would you like help with?`);
    if (requestMessage) {
      alert(`Mentorship request sent to ${mentor.name}! They will review your request and get back to you.`);
      // In real app, this would make an API call
    }
  };

  const handleViewProfile = (mentor) => {
    setSelectedMentor(mentor);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'High': return '#48bb78';
      case 'Medium': return '#ed8936';
      case 'Low': return '#e53e3e';
      default: return '#718096';
    }
  };

  if (selectedMentor) {
    return <MentorProfile mentor={selectedMentor} onBack={() => setSelectedMentor(null)} />;
  }

  return (
    <div className="mentors-container">
      <header className="mentors-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Alumni & Mentor Guidance</h1>
        <div className="mentor-stats">
          <span>{filteredMentors.length} Mentors Available</span>
        </div>
      </header>

      <div className="mentors-content">
        {/* Navigation Tabs */}
        <div className="mentors-tabs">
          <button 
            className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            👥 Browse Mentors
          </button>
          <button 
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📨 My Requests
          </button>
          <button 
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            🗓️ Sessions
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'browse' && (
          <div className="filters-section">
            <h3>Find Your Perfect Mentor</h3>
            <div className="filters-grid">
              <div className="filter-group">
                <label>Industry</label>
                <select 
                  value={filters.industry}
                  onChange={(e) => setFilters({...filters, industry: e.target.value})}
                >
                  <option value="all">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Expertise Area</label>
                <select 
                  value={filters.expertise}
                  onChange={(e) => setFilters({...filters, expertise: e.target.value})}
                >
                  <option value="all">All Expertise</option>
                  <option value="React">React</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="AWS">AWS</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Availability</label>
                <select 
                  value={filters.availability}
                  onChange={(e) => setFilters({...filters, availability: e.target.value})}
                >
                  <option value="all">Any Availability</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mentors-main">
          {activeTab === 'browse' && (
            <BrowseMentors 
              mentors={filteredMentors}
              onRequestMentorship={handleRequestMentorship}
              onViewProfile={handleViewProfile}
              getAvailabilityColor={getAvailabilityColor}
            />
          )}

          {activeTab === 'requests' && (
            <MentorshipRequests 
              requests={mentorshipRequests}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsSection />
          )}
        </div>
      </div>
    </div>
  );
};

// Browse Mentors Component
const BrowseMentors = ({ mentors, onRequestMentorship, onViewProfile, getAvailabilityColor }) => {
  return (
    <div className="section">
      <h2>Available Mentors</h2>
      <p className="section-description">
        Connect with experienced professionals who can guide your career journey
      </p>

      <div className="mentors-grid">
        {mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-header">
              <div className="mentor-avatar">
                <span className="avatar-icon">{mentor.image}</span>
              </div>
              <div className="mentor-info">
                <h3>{mentor.name}</h3>
                <p className="mentor-title">{mentor.title}</p>
                <p className="mentor-company">{mentor.company}</p>
              </div>
            </div>

            <div className="mentor-stats">
              <div className="stat">
                <span className="stat-value">{mentor.rating}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">{mentor.sessions}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat">
                <span 
                  className="stat-value availability"
                  style={{ color: getAvailabilityColor(mentor.availability) }}
                >
                  {mentor.availability}
                </span>
                <span className="stat-label">Available</span>
              </div>
            </div>

            <div className="mentor-expertise">
              <h4>Expertise:</h4>
              <div className="expertise-tags">
                {mentor.expertise.map(skill => (
                  <span key={skill} className="expertise-tag">{skill}</span>
                ))}
              </div>
            </div>

            <p className="mentor-bio">{mentor.bio}</p>

            <div className="mentor-actions">
              <button 
                className="primary-btn"
                onClick={() => onRequestMentorship(mentor)}
              >
                Request Mentorship
              </button>
              <button 
                className="secondary-btn"
                onClick={() => onViewProfile(mentor)}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mentorship Requests Component
const MentorshipRequests = ({ requests }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ed8936';
      case 'accepted': return '#48bb78';
      case 'rejected': return '#e53e3e';
      default: return '#718096';
    }
  };

  return (
    <div className="section">
      <h2>My Mentorship Requests</h2>
      <p className="section-description">
        Track your mentorship requests and session bookings
      </p>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📨</div>
          <h3>No Mentorship Requests</h3>
          <p>You haven't sent any mentorship requests yet.</p>
          <button className="primary-btn">Browse Mentors</button>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>Request to {request.mentorName}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              
              <div className="request-details">
                <div className="detail">
                  <span className="label">Request Type:</span>
                  <span className="value">{request.type}</span>
                </div>
                <div className="detail">
                  <span className="label">Date Sent:</span>
                  <span className="value">{request.date}</span>
                </div>
                {request.sessionDate && (
                  <div className="detail">
                    <span className="label">Session Date:</span>
                    <span className="value highlight">{request.sessionDate}</span>
                  </div>
                )}
              </div>

              <div className="request-message">
                <strong>Your Message:</strong>
                <p>{request.message}</p>
              </div>

              <div className="request-actions">
                {request.status === 'pending' && (
                  <>
                    <button className="secondary-btn small">Edit Request</button>
                    <button className="secondary-btn small delete">Cancel</button>
                  </>
                )}
                {request.status === 'accepted' && (
                  <button className="primary-btn small">Schedule Session</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Sessions Section Component
const SessionsSection = () => {
  const upcomingSessions = [
    {
      id: 1,
      mentorName: 'Michael Chen',
      date: '2024-01-20',
      time: '2:00 PM - 3:00 PM',
      type: 'Project Review',
      status: 'confirmed'
    }
  ];

  return (
    <div className="section">
      <h2>Upcoming Sessions</h2>
      <p className="section-description">
        Manage your scheduled mentorship sessions
      </p>

      {upcomingSessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗓️</div>
          <h3>No Upcoming Sessions</h3>
          <p>You don't have any scheduled mentorship sessions.</p>
          <button className="primary-btn">Browse Mentors</button>
        </div>
      ) : (
        <div className="sessions-list">
          {upcomingSessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-header">
                <h3>Session with {session.mentorName}</h3>
                <span className="session-status confirmed">Confirmed</span>
              </div>
              
              <div className="session-details">
                <div className="detail">
                  <span className="label">Date:</span>
                  <span className="value">{session.date}</span>
                </div>
                <div className="detail">
                  <span className="label">Time:</span>
                  <span className="value">{session.time}</span>
                </div>
                <div className="detail">
                  <span className="label">Type:</span>
                  <span className="value">{session.type}</span>
                </div>
              </div>

              <div className="session-actions">
                <button className="primary-btn small">Join Session</button>
                <button className="secondary-btn small">Reschedule</button>
                <button className="secondary-btn small delete">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mentor Profile Component
const MentorProfile = ({ mentor, onBack }) => {
  const handleRequestMentorship = () => {
    const requestMessage = prompt(`Send mentorship request to ${mentor.name}:\n\nWhat would you like help with?`);
    if (requestMessage) {
      alert(`Mentorship request sent to ${mentor.name}! They will review your request and get back to you.`);
    }
  };

  return (
    <div className="mentor-profile">
      <header className="profile-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Mentors
        </button>
        <h1>{mentor.name}'s Profile</h1>
      </header>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-overview">
            <div className="mentor-hero">
              <div className="hero-avatar">
                <span className="avatar-icon large">{mentor.image}</span>
              </div>
              <div className="hero-info">
                <h2>{mentor.name}</h2>
                <p className="hero-title">{mentor.title} at {mentor.company}</p>
                <p className="hero-industry">{mentor.industry} • {mentor.experience} experience</p>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <span className="stat-value">{mentor.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="hero-stat">
                    <span className="stat-value">{mentor.sessions}</span>
                    <span className="stat-label">Sessions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-bio">
              <h3>About Me</h3>
              <p>{mentor.bio}</p>
            </div>

            <div className="profile-expertise">
              <h3>Areas of Expertise</h3>
              <div className="expertise-grid">
                {mentor.expertise.map(skill => (
                  <div key={skill} className="expertise-item">
                    <span className="expertise-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-education">
              <h3>Education & Background</h3>
              <p><strong>Education:</strong> {mentor.education}</p>
              <p><strong>Previous Roles:</strong> {mentor.previousRoles.join(', ')}</p>
            </div>

            <div className="profile-mentorship">
              <h3>Mentorship Areas</h3>
              <div className="mentorship-areas">
                {mentor.mentorshipAreas.map(area => (
                  <span key={area} className="mentorship-tag">{area}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="sidebar-card">
            <h3>Request Mentorship</h3>
            <p>Send a personalized request to connect with {mentor.name}</p>
            <button 
              className="primary-btn full-width"
              onClick={handleRequestMentorship}
            >
              Send Request
            </button>
          </div>

          <div className="sidebar-card">
            <h3>Availability</h3>
            <div className="availability-info">
              <span className={`availability-status ${mentor.availability.toLowerCase()}`}>
                {mentor.availability} Availability
              </span>
              <p>Typically responds within 24-48 hours</p>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>What to Include</h3>
            <ul className="tips-list">
              <li>Your specific goals</li>
              <li>Areas you need help with</li>
              <li>Your background/experience</li>
              <li>Preferred meeting times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDirectory;