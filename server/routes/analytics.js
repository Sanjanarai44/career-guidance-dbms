const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get user analytics
router.get('/', verifyToken, async (req, res) => {
  try {
    // Get user skills count
    const [skillCount] = await db.query(
      'SELECT COUNT(*) as count FROM user_skills WHERE user_id = ?',
      [req.userId]
    );

    // Get user profile completion
    const [user] = await db.query(
      'SELECT profile_completion FROM users WHERE id = ?',
      [req.userId]
    );

    // Calculate readiness score based on profile completion and skills
    const profileCompletion = user[0]?.profile_completion || 0;
    const skillsCount = skillCount[0]?.count || 0;
    const readinessScore = Math.min(profileCompletion + (skillsCount * 5), 100);

    const analytics = {
      readinessScore,
      skillGrowth: skillsCount * 10,
      profileCompletion,
      skillsCount
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

