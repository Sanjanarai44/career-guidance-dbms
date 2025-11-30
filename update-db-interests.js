const db = require('./server/config/database');

async function updateDatabase() {
    try {
        console.log('Updating database schema...');

        // Create Interest table
        await db.query(`
      CREATE TABLE IF NOT EXISTS Interest (
          interest_id INT PRIMARY KEY AUTO_INCREMENT,
          interest_name VARCHAR(100) NOT NULL,
          category VARCHAR(100) NOT NULL
      )
    `);
        console.log('✅ Interest table created/verified.');

        // Create student_career_interests table
        await db.query(`
      CREATE TABLE IF NOT EXISTS student_career_interests (
          student_interest_id INT PRIMARY KEY AUTO_INCREMENT,
          student_id INT NOT NULL,
          interest_id INT NOT NULL,
          FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
          FOREIGN KEY (interest_id) REFERENCES Interest(interest_id) ON DELETE CASCADE,
          UNIQUE KEY unique_student_interest (student_id, interest_id)
      )
    `);
        console.log('✅ student_career_interests table created/verified.');

        // Populate default interests
        const [interests] = await db.query('SELECT count(*) as count FROM Interest');
        if (interests[0].count === 0) {
            console.log('⚠️ Interest table is empty. Populating default interests...');
            const defaultInterests = [
                ['Web Development', 'Technology'],
                ['Mobile App Development', 'Technology'],
                ['Data Science', 'Analytics'],
                ['Artificial Intelligence', 'Technology'],
                ['Cloud Computing', 'Infrastructure'],
                ['Cybersecurity', 'Security'],
                ['Digital Marketing', 'Business'],
                ['Product Management', 'Business'],
                ['Game Development', 'Creative'],
                ['UI/UX Design', 'Creative'],
                ['Research & Development', 'Science'],
                ['Entrepreneurship', 'Business']
            ];

            for (const interest of defaultInterests) {
                await db.query(
                    'INSERT INTO Interest (interest_name, category) VALUES (?, ?)',
                    interest
                );
            }
            console.log('✅ Default interests added.');
        } else {
            console.log(`✅ Interest table has ${interests[0].count} interests.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating database:', error.message);
        process.exit(1);
    }
}

updateDatabase();
