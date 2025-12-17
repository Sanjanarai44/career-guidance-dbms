const db = require('./server/config/database');

async function checkSchema() {
    try {
        console.log('Checking student_skill schema...');
        const [columns] = await db.query("SHOW COLUMNS FROM student_skill");
        console.log('Columns:', columns.map(c => c.Field));

        const hasProficiency = columns.some(c => c.Field === 'proficiency_level');

        if (!hasProficiency) {
            console.log('❌ Missing proficiency_level column! Adding it now...');
            await db.query("ALTER TABLE student_skill ADD COLUMN proficiency_level INT DEFAULT 1");
            console.log('✅ Column added.');
        } else {
            console.log('✅ proficiency_level column exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkSchema();
