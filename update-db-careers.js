const db = require('./server/config/database');

async function updateDatabase() {
    try {
        console.log('Updating database schema...');

        // Create career_options table
        await db.query(`
      CREATE TABLE IF NOT EXISTS career_options (
          career_id INT PRIMARY KEY AUTO_INCREMENT,
          career_name VARCHAR(100) NOT NULL,
          required_skills TEXT,
          description TEXT
      )
    `);
        console.log('✅ career_options table created/verified.');

        // Populate default careers
        const [careers] = await db.query('SELECT count(*) as count FROM career_options');
        if (careers[0].count === 0) {
            console.log('⚠️ career_options table is empty. Populating default careers...');
            const defaultCareers = [
                {
                    career_name: 'Frontend Developer',
                    required_skills: 'JavaScript, React, HTML, CSS, UI/UX Design',
                    description: 'Build interactive user interfaces for the web.'
                },
                {
                    career_name: 'Backend Developer',
                    required_skills: 'Node.js, SQL, API Design, Database Management, Python',
                    description: 'Design and build server-side logic and databases.'
                },
                {
                    career_name: 'Full Stack Developer',
                    required_skills: 'JavaScript, Node.js, SQL, React, HTML, CSS',
                    description: 'Work on both client-side and server-side software.'
                },
                {
                    career_name: 'Data Scientist',
                    required_skills: 'Python, Data Analysis, Machine Learning, Statistics, SQL',
                    description: 'Analyze complex data to help organizations make decisions.'
                },
                {
                    career_name: 'Product Manager',
                    required_skills: 'Project Management, Communication, Leadership, Agile, Strategy',
                    description: 'Oversee the development and delivery of products.'
                },
                {
                    career_name: 'UI/UX Designer',
                    required_skills: 'UI/UX Design, Prototyping, User Research, Figma, Wireframing',
                    description: 'Design intuitive and aesthetically pleasing user interfaces.'
                },
                {
                    career_name: 'DevOps Engineer',
                    required_skills: 'Cloud Computing, CI/CD, Linux, Docker, Kubernetes',
                    description: 'Bridge the gap between development and operations.'
                },
                {
                    career_name: 'Mobile App Developer',
                    required_skills: 'React Native, Flutter, Java, Swift, Mobile App Development',
                    description: 'Create applications for mobile devices.'
                }
            ];

            for (const career of defaultCareers) {
                await db.query(
                    'INSERT INTO career_options (career_name, required_skills, description) VALUES (?, ?, ?)',
                    [career.career_name, career.required_skills, career.description]
                );
            }
            console.log('✅ Default careers added.');
        } else {
            console.log(`✅ career_options table has ${careers[0].count} careers.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating database:', error.message);
        process.exit(1);
    }
}

updateDatabase();
