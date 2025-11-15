const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get career recommendations
router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    // Get user skills and interests to generate recommendations
    const [skills] = await db.query(
      'SELECT skill_name, proficiency_level FROM user_skills WHERE user_id = ?',
      [req.userId]
    );

    // This is a simplified version - you can enhance this with ML/AI logic
    const recommendations = [
      {
        id: 1,
        title: 'Software Developer',
        matchScore: 85,
        description: 'Based on your skills, this career path aligns well with your profile.',
        requiredSkills: ['Programming', 'Problem Solving'],
        salaryRange: '$60k - $120k'
      },
      {
        id: 2,
        title: 'Data Analyst',
        matchScore: 75,
        description: 'Your analytical skills make you a good fit for this role.',
        requiredSkills: ['Data Analysis', 'Statistics'],
        salaryRange: '$50k - $100k'
      }
    ];

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

