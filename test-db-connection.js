// Simple script to test database connection
const db = require('./server/config/database');

console.log('Testing database connection...\n');

// Test 1: Basic connection
db.connect((err, connection) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('\nPossible issues:');
    console.error('1. MySQL server is not running');
    console.error('2. Wrong credentials in .env file');
    console.error('3. Database does not exist');
    console.error('4. Network/firewall issues\n');
    process.exit(1);
  } else {
    console.log('✅ Basic connection successful!');
    connection.release();
    
    // Test 2: Query test
    db.query('SELECT 1 as test')
      .then(([rows]) => {
        console.log('✅ Query test successful!');
        console.log('✅ Database connection is fully working!\n');
        
        // Test 3: Check if users table exists
        return db.query("SHOW TABLES LIKE 'users'");
      })
      .then(([rows]) => {
        if (rows.length > 0) {
          console.log('✅ Users table exists!');
          
          // Test 4: Count users
          return db.query('SELECT COUNT(*) as count FROM users');
        } else {
          console.log('⚠️  Users table does not exist. Run the schema.sql file to create it.');
          process.exit(0);
        }
      })
      .then(([rows]) => {
        if (rows) {
          console.log(`✅ Found ${rows[0].count} user(s) in the database\n`);
        }
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Query test failed:', error.message);
        process.exit(1);
      });
  }
});

