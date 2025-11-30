const db = require('./server/config/database');

async function checkDatabase() {
    try {
        console.log('Checking database tables...');
        const [rows] = await db.query("SHOW TABLES LIKE 'student_skill'");

        if (rows.length === 0) {
            console.error('❌ Table student_skill does NOT exist!');
            console.log('Attempting to create table...');

            const createTableQuery = `
        CREATE TABLE IF NOT EXISTS student_skill (
            student_skill_id INT PRIMARY KEY AUTO_INCREMENT,
            student_id INT NOT NULL,
            skill_id INT NOT NULL,
            proficiency_level INT DEFAULT 1,
            FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
            FOREIGN KEY (skill_id) REFERENCES Skill(skill_id) ON DELETE CASCADE,
            UNIQUE KEY unique_student_skill (student_id, skill_id)
        );
      `;

            await db.query(createTableQuery);
            console.log('✅ Table student_skill created successfully!');
        } else {
            console.log('✅ Table student_skill exists.');
        }

        // Check if Skill table has data
        const [skills] = await db.query('SELECT count(*) as count FROM Skill');
        if (skills[0].count === 0) {
            console.log('⚠️ Skill table is empty. Populating default skills...');
            const defaultSkills = [
                ['JavaScript', 'Technical'],
                ['Python', 'Technical'],
                ['Java', 'Technical'],
                ['C++', 'Technical'],
                ['React', 'Technical'],
                ['Node.js', 'Technical'],
                ['SQL', 'Technical'],
                ['Communication', 'Soft'],
                ['Teamwork', 'Soft'],
                ['Problem Solving', 'Soft'],
                ['Leadership', 'Soft'],
                ['Time Management', 'Soft']
            ];

            await db.query(
                'INSERT INTO Skill (skill_name, skill_type) VALUES ?',
                [defaultSkills]
            );
            console.log('✅ Default skills added.');
        } else {
            console.log(`✅ Skill table has ${skills[0].count} skills.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking database:', error.message);
        process.exit(1);
    }
}

checkDatabase();
