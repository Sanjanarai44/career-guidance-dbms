import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Skills.css'; // Ensure this path is correct

const SkillAssessment = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [activeSection, setActiveSection] = useState('skills');
  const [userSkills, setUserSkills] = useState(state.skills || []);
  const [userInterests, setUserInterests] = useState(state.interests || []);

  const skillsDatabase = [
    { id: 1, name: 'JavaScript', category: 'Tech' },
    { id: 2, name: 'Python', category: 'Tech' },
    { id: 3, name: 'React', category: 'Tech' },
    { id: 4, name: 'Node.js', category: 'Tech' },
    { id: 5, name: 'SQL', category: 'Tech' },
    { id: 6, name: 'MongoDB', category: 'Tech' },
    { id: 7, name: 'UI/UX Design', category: 'Tech' },
    { id: 9, name: 'Data Analysis', category: 'Tech' },
    { id: 10, name: 'Machine Learning', category: 'Tech' },
    { id: 8, name: 'Project Management', category: 'Soft' },
    { id: 11, name: 'Communication', category: 'Soft' },
    { id: 12, name: 'Team Leadership', category: 'Soft' }
  ];

  const interestsDatabase = [
    { id: 1, name: 'Web Development', category: 'Technology' },
    { id: 2, name: 'Mobile App Development', category: 'Technology' },
    { id: 3, name: 'Data Science', category: 'Analytics' },
    { id: 4, name: 'Artificial Intelligence', category: 'Technology' },
    { id: 5, name: 'Cloud Computing', category: 'Infrastructure' },
    { id: 6, name: 'Cybersecurity', category: 'Security' },
    { id: 7, name: 'Digital Marketing', category: 'Business' },
    { id: 8, name: 'Product Management', category: 'Business' },
    { id: 9, name: 'Game Development', category: 'Creative' },
    { id: 10, name: 'UI/UX Design', category: 'Creative' },
    { id: 11, name: 'Research & Development', category: 'Science' },
    { id: 12, name: 'Entrepreneurship', category: 'Business' }
  ];

  const handleAddSkill = (skillObj) => {
    // skillObj will already contain id, name, category from the modal
    if (skillObj && !userSkills.some(skill => skill.id === skillObj.id)) {
      setUserSkills([...userSkills, { ...skillObj, level: 1 }]); // Add with default level 1
    }
  };

  const handleRemoveSkill = (skillId) => {
    setUserSkills(userSkills.filter(skill => skill.id !== skillId));
  };

  const handleSkillLevelChange = (skillId, level) => {
    setUserSkills(userSkills.map(skill => 
      skill.id === skillId ? { ...skill, level } : skill
    ));
  };

  const handleInterestToggle = (interestId) => {
    const isSelected = userInterests.some(interest => interest.id === interestId);
    if (isSelected) {
      setUserInterests(userInterests.filter(interest => interest.id !== interestId));
    } else {
      const interest = interestsDatabase.find(i => i.id === interestId);
      setUserInterests([...userInterests, interest]);
    }
  };

  const getSkillLevelLabel = (level) => {
    const labels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Not Selected';
  };

  const calculateCareerMatches = () => {
    const skillCount = userSkills.length;
    const interestCount = userInterests.length;
    return Math.min((skillCount + interestCount) * 8, 100);
  };

  const handleSaveAssessment = () => {
    if (userSkills.length === 0 && userInterests.length === 0) {
      alert('Please add at least one skill or interest before saving!');
      return;
    }
    actions.addSkills(userSkills);
    actions.addInterests(userInterests);
    alert('Assessment saved successfully! Your profile has been updated.');
    navigate('/dashboard');
  };

  return (
    <div className="skills-container">
      <header className="skills-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Skill & Interest Assessment</h1>
        <div className="assessment-progress">
          <span>Career Match Score: {calculateCareerMatches()}%</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateCareerMatches()}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="skills-content">
        <div className="assessment-tabs">
          <button 
            className={`tab ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveSection('skills')}
          >
            💼 Skills Inventory
          </button>
          <button 
            className={`tab ${activeSection === 'interests' ? 'active' : ''}`}
            onClick={() => setActiveSection('interests')}
          >
            🔍 Career Interests
          </button>
          <button 
            className={`tab ${activeSection === 'results' ? 'active' : ''}`}
            onClick={() => setActiveSection('results')}
          >
            🎯 Matching Results
          </button>
        </div>

        <div className="assessment-main">
          {activeSection === 'skills' && (
            <SkillsSection 
              skillsPool={skillsDatabase}
              userSkills={userSkills}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              onSkillLevelChange={handleSkillLevelChange}
              getSkillLevelLabel={getSkillLevelLabel}
            />
          )}

          {activeSection === 'interests' && (
            <InterestsSection 
              interests={interestsDatabase}
              userInterests={userInterests}
              onInterestToggle={handleInterestToggle}
            />
          )}

          {activeSection === 'results' && (
            <ResultsSection 
              userSkills={userSkills}
              userInterests={userInterests}
              matchScore={calculateCareerMatches()}
              onSave={handleSaveAssessment}
              getSkillLevelLabel={getSkillLevelLabel}
            />
          )}
        </div>

        <div className="assessment-actions">
          <button 
            className="save-button"
            onClick={handleSaveAssessment}
            disabled={userSkills.length === 0 && userInterests.length === 0}
          >
            Save Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SkillsSection Component (Updated for Modal and Sections) ---
const SkillsSection = ({ 
  skillsPool, 
  userSkills, 
  onAddSkill, 
  onRemoveSkill, 
  onSkillLevelChange, 
  getSkillLevelLabel 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkillCategory, setCurrentSkillCategory] = useState('Tech'); // 'Tech' or 'Soft'

  const handleOpenModal = (category) => {
    setCurrentSkillCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filter skills by category for display
  const techSkills = userSkills.filter(skill => skill.category === 'Tech');
  const softSkills = userSkills.filter(skill => skill.category === 'Soft');

  return (
    <div className="section">
      <h2>Your Skill Inventory</h2>
      <p className="section-description">
        Add technical and soft skills, then rate your proficiency (1=Beginner, 4=Expert).
      </p>

      {/* --- Add Skill Buttons (New) --- */}
      <div className="add-skill-buttons">
        <button 
          className="add-tech-skill-btn" 
          onClick={() => handleOpenModal('Tech')}
        >
          Add Technical Skill
        </button>
        <button 
          className="add-soft-skill-btn" 
          onClick={() => handleOpenModal('Soft')}
        >
          Add Soft Skill
        </button>
      </div>

      {/* --- Technical Skills Section --- */}
      <div className="category-section">
        <h3 className="category-title">Technical Skills</h3>
        {techSkills.length > 0 ? (
          <div className="skills-grid">
            {techSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onSkillLevelChange={onSkillLevelChange}
                onRemoveSkill={onRemoveSkill}
                getSkillLevelLabel={getSkillLevelLabel}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No technical skills added yet. Click "Add Technical Skill" to get started.</p>
        )}
      </div>

      {/* --- Soft Skills Section --- */}
      <div className="category-section">
        <h3 className="category-title">Soft Skills</h3>
        {softSkills.length > 0 ? (
          <div className="skills-grid">
            {softSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onSkillLevelChange={onSkillLevelChange}
                onRemoveSkill={onRemoveSkill}
                getSkillLevelLabel={getSkillLevelLabel}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No soft skills added yet. Click "Add Soft Skill" to get started.</p>
        )}
      </div>

      {/* --- Skill Selection Modal --- */}
      {isModalOpen && (
        <SkillSelectionModal
          skillsPool={skillsPool}
          userSkills={userSkills} // Pass userSkills to filter out already added ones
          category={currentSkillCategory}
          onSelectSkill={(skill) => {
            onAddSkill(skill);
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

// --- New SkillCard Component (for cleaner rendering) ---
const SkillCard = ({ skill, onSkillLevelChange, onRemoveSkill, getSkillLevelLabel }) => (
  <div className="skill-card selected">
    <div className="skill-header">
      <span className="skill-name">{skill.name}</span>
      <span className="skill-level">
        {getSkillLevelLabel(skill.level)}
      </span>
    </div>
    <div className="skill-level-selector">
      {[1, 2, 3, 4].map(level => (
        <button
          key={level}
          className={`level-btn ${skill.level === level ? 'active' : ''}`}
          onClick={() => onSkillLevelChange(skill.id, level)}
        >
          {level}
        </button>
      ))}
    </div>
    <button 
      className="remove-skill-btn"
      onClick={() => onRemoveSkill(skill.id)}
    >
      Remove
    </button>
  </div>
);


// --- New SkillSelectionModal Component ---
const SkillSelectionModal = ({ skillsPool, userSkills, category, onSelectSkill, onClose }) => {
  const availableSkills = skillsPool.filter(
    poolSkill => 
      poolSkill.category === category &&
      !userSkills.some(userSkill => userSkill.id === poolSkill.id)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Select {category} Skills</h2>
        <p>Choose skills from the list below to add to your profile.</p>

        <div className="modal-skills-grid">
          {availableSkills.length > 0 ? (
            availableSkills.map(skill => (
              <button 
                key={skill.id} 
                className={`modal-skill-chip ${skill.category.toLowerCase()}`}
                onClick={() => onSelectSkill(skill)}
              >
                {skill.name}
              </button>
            ))
          ) : (
            <p className="empty-modal-state">All available {category} skills have been added.</p>
          )}
        </div>
        <button className="modal-cancel-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
};

// --- Interests Section (Unchanged) ---
const InterestsSection = ({ interests, userInterests, onInterestToggle }) => {
  const interestsByCategory = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) acc[interest.category] = [];
    acc[interest.category].push(interest);
    return acc;
  }, {});

  return (
    <div className="section">
      <h2>Select Your Career Interests</h2>
      <p className="section-description">
        Choose areas that interest you for personalized career recommendations
      </p>

      {Object.entries(interestsByCategory).map(([category, categoryInterests]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="interests-grid">
            {categoryInterests.map(interest => {
              const isSelected = userInterests.some(i => i.id === interest.id);
              
              return (
                <div 
                  key={interest.id}
                  className={`interest-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onInterestToggle(interest.id)}
                >
                  <div className="interest-checkbox">
                    {isSelected ? '✓' : ''}
                  </div>
                  <span className="interest-name">{interest.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Results Section (Unchanged, minor prop adjustment) ---
const ResultsSection = ({ userSkills, userInterests, matchScore, onSave, getSkillLevelLabel }) => {
  const careerSuggestions = [
    { name: 'Frontend Developer', match: Math.min(matchScore + 20, 95), skills: ['JavaScript', 'React', 'UI/UX Design'] },
    { name: 'Data Scientist', match: Math.min(matchScore + 15, 90), skills: ['Python', 'Data Analysis', 'Machine Learning'] },
    { name: 'Full Stack Developer', match: Math.min(matchScore + 10, 85), skills: ['JavaScript', 'Node.js', 'SQL', 'React'] },
    { name: 'Product Manager', match: Math.min(matchScore + 5, 75), skills: ['Project Management', 'Communication'] }
  ];

  const handleExploreCareer = (career) => {
    alert(`Exploring ${career.name} path! This career has a ${career.match}% match with your profile.`);
  };

  return (
    <div className="section">
      <h2>Career Matching Results</h2>
      
      <div className="results-summary">
        <div className="stat-card">
          <h3>Skills Added</h3>
          <div className="stat-number">{userSkills.length}</div>
        </div>
        <div className="stat-card">
          <h3>Interests Selected</h3>
          <div className="stat-number">{userInterests.length}</div>
        </div>
        <div className="stat-card">
          <h3>Career Match</h3>
          <div className="stat-number">{matchScore}%</div>
        </div>
      </div>

      {userSkills.length > 0 && (
        <div className="skills-summary">
          <h3>Your Top Skills</h3>
          <div className="skills-tags">
            {userSkills
              .sort((a, b) => b.level - a.level)
              .slice(0, 6)
              .map(skill => (
                <span key={skill.id} className="skill-tag">
                  {skill.name} ({getSkillLevelLabel(skill.level)})
                </span>
              ))
            }
          </div>
        </div>
      )}

      <div className="career-suggestions">
        <h3>Recommended Career Paths</h3>
        <div className="careers-grid">
          {careerSuggestions.map((career, index) => (
            <div key={index} className="career-card">
              <div className="career-header">
                <h4>{career.name}</h4>
                <span className="match-badge">{career.match}% Match</span>
              </div>
              <div className="career-skills">
                {career.skills.map(skill => (
                  <span key={skill} className="skill-badge">{skill}</span>
                ))}
              </div>
              <button 
                className="explore-button"
                onClick={() => handleExploreCareer(career)}
              >
                Explore Path
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="save-prompt">
        <h4>Ready to save your assessment?</h4>
        <p>Your skills and interests will be used to personalize your career recommendations.</p>
        <button className="primary-btn" onClick={onSave}>
          Save Assessment
        </button>
      </div>
    </div>
  );
};

export default SkillAssessment;