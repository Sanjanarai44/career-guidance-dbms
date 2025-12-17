# Database Setup Instructions

## 1. Install Dependencies

First, install all required npm packages:

```bash
npm install
```

## 2. Set Up MySQL Database

1. Make sure MySQL is running on your system
2. Open MySQL command line or MySQL Workbench
3. Run the SQL script to create the database and users table:

```bash
mysql -u root -p < server/database/schema.sql
```

Or manually execute the SQL in `server/database/schema.sql`:
- Creates database `career_guidance_db`
- Creates `users` table with necessary fields

## 3. Create a Test User (Optional)

To test the login, you can create a test user in MySQL:

```sql
USE career_guidance_db;

-- Note: This password hash is for "password123"
-- You can generate your own using bcrypt
INSERT INTO users (username, email, password, name) 
VALUES ('testuser', 'test@example.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Test User');
```

Or use the register endpoint once it's set up.

## 4. Start the Backend Server

In one terminal, start the Express server:

```bash
npm run server
```

The server will run on `http://localhost:5000`

## 5. Start the React Frontend

In another terminal, start the React app:

```bash
npm start
```

The app will run on `http://localhost:3000`

## 6. Test the Login

1. Navigate to `http://localhost:3000/login`
2. Enter your username/email and password
3. The login will authenticate against the MySQL database

## Environment Variables

The `.env` file contains:
- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password (Roun@k2006)
- `DB_NAME`: Database name (career_guidance_db)
- `PORT`: Server port (5000)
- `JWT_SECRET`: Secret key for JWT tokens

## Troubleshooting

- **Database connection error**: Make sure MySQL is running and credentials are correct
- **Table doesn't exist**: Run the schema.sql script to create the database and tables
- **Port already in use**: Change the PORT in .env file

