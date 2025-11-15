#!/bin/bash

# Quick Start Script for Career Guidance DBMS
# This script helps you start the application

echo "🚀 Career Guidance DBMS - Quick Start"
echo "======================================"
echo ""

# Check if MySQL is running
echo "📊 Checking MySQL connection..."
node test-db-connection.js > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection OK"
else
    echo "❌ Database connection failed!"
    echo "   Make sure MySQL is running and credentials are correct"
    exit 1
fi

echo ""
echo "Starting servers..."
echo ""

# Start both servers
npm run dev

