# 🚀 Quick Setup Guide - Gym Management System

## For Users Without MongoDB Installed

**Recommended: Use MongoDB Atlas (Cloud) - It's FREE and requires NO installation!**

## Step-by-Step Setup

### 1. MongoDB Atlas Setup (5 minutes)

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email (free account)

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `gymadmin` (or any name)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin" (or "Read and write to any database")
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Clusters" (left sidebar)
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://gymadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>` with your database user password**
   - **Add database name:** Change `?retryWrites=true` to `/gym_management?retryWrites=true`
   - Final string: `mongodb+srv://gymadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority`

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the connection string from step 1.5 above
```

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://gymadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD` with your actual database user password!

```bash
# Seed sample data (creates admin user and sample data)
node seed.js

# Start backend server
npm start
```

You should see: `Server running in development mode on port 5000`
And: `MongoDB Connected: ...`

### 3. Frontend Setup

Open a **NEW terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
```

Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Start React app
npm start
```

Browser should automatically open `http://localhost:3000`

### 4. Login

- **Email:** `admin@gym.com`
- **Password:** `admin123`

(These are created by the seed script)

## That's It! 🎉

You should now see the Gym Management System dashboard!

## Common Issues

### "MongoDB connection failed"
- Check your `.env` file has the correct connection string
- Make sure you replaced `<password>` with your actual password
- Verify your IP is whitelisted in MongoDB Atlas
- Check that the database name `/gym_management` is in the URI

### "Cannot find module"
- Make sure you ran `npm install` in both backend and frontend folders
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### "Port already in use"
- Backend: Change `PORT=5000` to `PORT=5001` in `backend/.env`
- Frontend: React will ask to use a different port automatically

### Backend not starting
- Make sure MongoDB connection is working first
- Check that all dependencies are installed: `npm install`
- Look at the error message in the terminal

## Need Help?

1. Check the main `README.md` for detailed documentation
2. Verify your MongoDB Atlas connection string is correct
3. Make sure both backend and frontend servers are running
4. Check browser console (F12) for frontend errors
5. Check terminal for backend errors

