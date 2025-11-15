import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import StudentProfile from './pages/profile/StudentProfile';
import SkillAssessment from './pages/skills/SkillAssessment';
import Recommendations from './pages/career/Recommendations';
import MentorDirectory from './pages/mentors/MentorDirectory';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/skills" element={<SkillAssessment />} />
            <Route path="/career" element={<Recommendations />} />
            <Route path="/mentors" element={<MentorDirectory />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;