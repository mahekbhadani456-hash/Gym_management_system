#!/bin/bash

# Backend .env file
cat > backend/.env << EOF
PORT=5000



# Frontend .env file
cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

echo "✅ Created .env files!"
echo ""
echo "⚠️  IMPORTANT: You need to set up MongoDB!"
echo ""
echo "Option 1 (Recommended - No installation needed):"
echo "  1. Go to https://www.mongodb.com/cloud/atlas/register"
echo "  2. Create free account and cluster"
echo "  3. Get connection string"
echo "  4. Update backend/.env with your MongoDB Atlas connection string"
echo ""
echo "Option 2: Install MongoDB locally"
echo "  macOS: brew install mongodb-community"
echo "  Then update backend/.env MONGODB_URI if needed"
echo ""

