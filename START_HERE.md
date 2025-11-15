# 🚀 Quick Start Guide

Follow these steps to run your Career Guidance application:

## Prerequisites
- MySQL server must be running
- Node.js and npm installed
- Database `career_guidance` and `users` table already created

## Steps to Run (Every Time)

### Option 1: Manual (Two Terminals)

**Terminal 1 - Start Backend Server:**
```bash
cd /home/runtime-terror/Desktop/career-guidance-dbms
npm run server
```

You should see:
```
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
✅ Database connected successfully
```

**Terminal 2 - Start React Frontend:**
```bash
cd /home/runtime-terror/Desktop/career-guidance-dbms
npm start
```

The React app will open automatically at `http://localhost:3000`

### Option 2: Using the Start Script (One Command)

```bash
cd /home/runtime-terror/Desktop/career-guidance-dbms
npm run dev
```

This will start both servers in the same terminal.

## Verify Everything is Working

1. **Check Backend:** Open `http://localhost:5000/api/health` in browser
   - Should show: `{"status":"OK","message":"Server is running"}`

2. **Check Database:** Open `http://localhost:5000/api/test-db` in browser
   - Should show database connection status

3. **Check Frontend:** Open `http://localhost:3000`
   - Should show the login page

## Troubleshooting

### Database Connection Error
- Make sure MySQL is running: `sudo systemctl status mysql` (or `mysql.server status` on Mac)
- Check credentials in `.env` file
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
- Backend (port 5000): `lsof -ti:5000 | xargs kill -9`
- Frontend (port 3000): `lsof -ti:3000 | xargs kill -9`

### "Failed to Fetch" Error
- Make sure backend server is running (Terminal 1)
- Check that backend is on port 5000
- Verify CORS is enabled (it should be)

## Quick Commands Reference

```bash
# Start backend only
npm run server

# Start frontend only  
npm start

# Start both (if concurrently installed)
npm run dev

# Test database connection
node test-db-connection.js

# Check if servers are running
lsof -ti:5000  # Backend
lsof -ti:3000  # Frontend
```

## First Time Setup (If Not Done Already)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create database and table:
   ```bash
   mysql -u root -p < server/database/schema.sql
   ```
   (Enter password: `Roun@k2006`)

3. Verify database:
   ```bash
   node test-db-connection.js
   ```

That's it! You're ready to go! 🎉

