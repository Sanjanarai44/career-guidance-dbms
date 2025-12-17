const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get career recommendations
router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    // Get student_id
    const [students] = await db.query(
      'SELECT student_id FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = students[0].student_id;

    // Get user skills
    const [skills] = await db.query(
      `SELECT s.skill_name, ss.proficiency_level 
       FROM student_skill ss
       JOIN Skill s ON ss.skill_id = s.skill_id
       WHERE ss.student_id = ?`,
      [studentId]
    );

    // Get user interests
    const [interests] = await db.query(
      `SELECT i.interest_name, i.category
       FROM student_career_interests sci
       JOIN Interest i ON sci.interest_id = i.interest_id
       WHERE sci.student_id = ?`,
      [studentId]
    );

    // Get all career options
    const [careers] = await db.query('SELECT * FROM career_options');

    // Calculate match scores
    const recommendations = careers.map(career => {
      let score = 0;
      let matchedSkills = [];

      // Parse required skills (comma separated)
      const requiredSkills = career.required_skills ?
        career.required_skills.split(',').map(s => s.trim().toLowerCase()) : [];

      if (requiredSkills.length === 0) return null;

      // Check skill matches
      skills.forEach(studentSkill => {
        const skillName = studentSkill.skill_name.toLowerCase();
        // Check for direct match or partial match
        if (requiredSkills.some(req => req === skillName || skillName.includes(req) || req.includes(skillName))) {
          matchedSkills.push(studentSkill.skill_name);
          // Add score based on proficiency (1-4)
          // Base score for match + bonus for proficiency
          score += 10 + (studentSkill.proficiency_level * 5);
        }
      });

      // Check interest matches (boost score)
      interests.forEach(interest => {
        const interestName = interest.interest_name.toLowerCase();
        const careerName = career.career_name.toLowerCase();
        const careerDesc = career.description ? career.description.toLowerCase() : '';

        // If interest matches career name or description
        if (careerName.includes(interestName) || careerDesc.includes(interestName)) {
          score += 15; // Interest bonus
        }
      });

      // Normalize score (cap at 100, but allow it to be relative)
      // A simple normalization: (score / (requiredSkills.length * 20)) * 100
      // Assuming max score per skill is ~30 (10 base + 20 proficiency)
      let matchPercentage = Math.min(Math.round((score / (requiredSkills.length * 15)) * 100), 100);

      // Ensure minimum reasonable score if there are matches
      if (matchedSkills.length > 0 && matchPercentage < 20) matchPercentage = 20;
      if (matchedSkills.length === 0) matchPercentage = 0;

      return {
        id: career.career_id,
        title: career.career_name,
        matchScore: matchPercentage,
        description: career.description,
        requiredSkills: career.required_skills.split(',').map(s => s.trim()),
        matchedSkills: matchedSkills
      };
    });

    // Filter out zero matches and sort by score
    const sortedRecommendations = recommendations
      .filter(r => r && r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Return top 5

    res.json(sortedRecommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;

