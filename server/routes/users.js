const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get student profile
router.get('/student', verifyToken, async (req, res) => {
  try {
    const [students] = await db.query(
      'SELECT student_id, name, email, cgpa, graduation_year, department FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json(students[0]);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Update student profile
router.put('/student', verifyToken, async (req, res) => {
  try {
    const { name, email, department, graduation_year, cgpa } = req.body;

    // Helper function to convert empty strings to null for optional fields
    const toNullIfEmpty = (value) => {
      if (value === '' || value === undefined) return null;
      return value;
    };

    // Check if student record exists
    const [existing] = await db.query(
      'SELECT student_id FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (existing.length === 0) {
      // Create new student record if it doesn't exist
      await db.query(
        'INSERT INTO Student (user_id, name, email, department, graduation_year, cgpa) VALUES (?, ?, ?, ?, ?, ?)',
        [
          req.userId,
          name || '',
          email || '',
          toNullIfEmpty(department),
          toNullIfEmpty(graduation_year),
          toNullIfEmpty(cgpa)
        ]
      );
      return res.json({ message: 'Student profile created successfully' });
    }

    // Update existing record
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name || '');
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email || '');
    }
    if (department !== undefined) {
      updates.push('department = ?');
      values.push(toNullIfEmpty(department));
    }
    if (graduation_year !== undefined) {
      updates.push('graduation_year = ?');
      values.push(toNullIfEmpty(graduation_year));
    }
    if (cgpa !== undefined) {
      updates.push('cgpa = ?');
      values.push(toNullIfEmpty(cgpa));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.userId);

    await db.query(
      `UPDATE Student SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    res.json({ message: 'Student profile updated successfully' });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get academic records with courses
router.get('/academic-records', verifyToken, async (req, res) => {
  try {
    // First get student_id from user_id
    const [students] = await db.query(
      'SELECT student_id FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    // Get all academic records for this student
    const [records] = await db.query(
      'SELECT record_id, term_name, gpa FROM academic_record WHERE student_id = ? ORDER BY term_name DESC',
      [studentId]
    );

    // Get all courses for each record
    const recordsWithCourses = await Promise.all(
      records.map(async (record) => {
        const [courses] = await db.query(
          'SELECT course_name FROM record_courses WHERE record_id = ?',
          [record.record_id]
        );
        return {
          ...record,
          courses: courses.map(c => c.course_name)
        };
      })
    );

    res.json(recordsWithCourses);
  } catch (error) {
    console.error('Get academic records error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Add academic record with courses
router.post('/academic-records', verifyToken, async (req, res) => {
  try {
    const { term_name, gpa, courses } = req.body;

    if (!term_name) {
      return res.status(400).json({ error: 'Term name is required' });
    }

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: 'At least one course is required' });
    }

    // Get student_id from user_id
    const [students] = await db.query(
      'SELECT student_id FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    // Helper function to convert empty strings to null
    const toNullIfEmpty = (value) => {
      if (value === '' || value === undefined) return null;
      return value;
    };

    // Insert academic record
    const [result] = await db.query(
      'INSERT INTO academic_record (student_id, term_name, gpa) VALUES (?, ?, ?)',
      [studentId, term_name, toNullIfEmpty(gpa)]
    );

    const recordId = result.insertId;

    // Insert courses
    const validCourses = courses
      .filter(course => course && course.trim() !== '')
      .map(course => course.trim());

    if (validCourses.length > 0) {
      // Insert courses one by one or use a different approach
      for (const courseName of validCourses) {
        await db.query(
          'INSERT INTO record_courses (record_id, course_name) VALUES (?, ?)',
          [recordId, courseName]
        );
      }
    }

    res.status(201).json({
      message: 'Academic record added successfully',
      record_id: recordId
    });
  } catch (error) {
    console.error('Add academic record error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get all skills (no authentication required - public skills list)
router.get('/skills', async (req, res) => {
  try {
    const [skills] = await db.query(
      'SELECT skill_id as id, skill_name as name, skill_type FROM Skill ORDER BY skill_type, skill_name'
    );

    // Map skill_type to category for frontend compatibility
    // "Technical" -> "Tech", "Soft" -> "Soft"
    const mappedSkills = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.skill_type.toLowerCase() === 'technical' ? 'Tech' : 'Soft'
    }));

    console.log(`Returning ${mappedSkills.length} skills from database`);
    res.json(mappedSkills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get student skills
router.get('/student/skills', verifyToken, async (req, res) => {
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

    // Get skills
    const [skills] = await db.query(
      `SELECT s.skill_id as id, s.skill_name as name, s.skill_type, ss.proficiency_level as level 
       FROM student_skill ss
       JOIN Skill s ON ss.skill_id = s.skill_id
       WHERE ss.student_id = ?`,
      [studentId]
    );

    const mappedSkills = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.skill_type.toLowerCase() === 'technical' ? 'Tech' : 'Soft',
      level: skill.level
    }));

    res.json(mappedSkills);
  } catch (error) {
    console.error('Get student skills error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Update student skills
router.post('/student/skills', verifyToken, async (req, res) => {
  let connection;
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    // Get student_id (can use pool here)
    const [students] = await db.query(
      'SELECT student_id FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    // Get a dedicated connection for the transaction
    connection = await db.promisePool.getConnection();
    await connection.beginTransaction();

    try {
      // Remove existing skills
      await connection.query('DELETE FROM student_skill WHERE student_id = ?', [studentId]);

      // Add new skills
      if (skills.length > 0) {
        const values = skills.map(skill => [studentId, skill.id, skill.level || 1]);
        await connection.query(
          'INSERT INTO student_skill (student_id, skill_id, proficiency_level) VALUES ?',
          [values]
        );
      }

      await connection.commit();
      res.json({ message: 'Skills updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update student skills error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

// Get all interests (public)
router.get('/interests', async (req, res) => {
  try {
    const [interests] = await db.query(
      'SELECT interest_id as id, interest_name as name, category FROM Interest ORDER BY category, interest_name'
    );
    res.json(interests);
  } catch (error) {
    console.error('Get interests error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get student interests
router.get('/student/interests', verifyToken, async (req, res) => {
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

    // Get interests
    const [interests] = await db.query(
      `SELECT i.interest_id as id, i.interest_name as name, i.category
       FROM student_career_interests sci
       JOIN Interest i ON sci.interest_id = i.interest_id
       WHERE sci.student_id = ?`,
      [studentId]
    );

    res.json(interests);
  } catch (error) {
    console.error('Get student interests error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Update student interests
router.post('/student/interests', verifyToken, async (req, res) => {
  let connection;
  try {
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: 'Interests must be an array' });
    }

    // Get student_id
    const [students] = await db.query(
      'SELECT student_id FROM Student WHERE user_id = ?',
      [req.userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    // Get a dedicated connection for the transaction
    connection = await db.promisePool.getConnection();
    await connection.beginTransaction();

    try {
      // Remove existing interests
      await connection.query('DELETE FROM student_career_interests WHERE student_id = ?', [studentId]);

      // Add new interests
      if (interests.length > 0) {
        const values = interests.map(interest => [studentId, interest.id]);
        await connection.query(
          'INSERT INTO student_career_interests (student_id, interest_id) VALUES ?',
          [values]
        );
      }

      await connection.commit();
      res.json({ message: 'Interests updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Update student interests error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

