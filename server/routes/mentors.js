const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get all mentors
router.get('/', verifyToken, async (req, res) => {
  try {
    const [mentors] = await db.query(
      'SELECT * FROM mentors ORDER BY rating DESC'
    );
    res.json(mentors);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request mentorship
router.post('/request', verifyToken, async (req, res) => {
  try {
    const { mentor_id, message } = req.body;

    await db.query(
      'INSERT INTO mentorship_requests (user_id, mentor_id, message, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [req.userId, mentor_id, message, 'pending']
    );

    res.json({ message: 'Mentorship request sent successfully' });
  } catch (error) {
    console.error('Request mentorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

