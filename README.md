# 🏋️ Gym Management System

A full-stack web application for managing gym members, trainers, membership plans, and payments.

## Tech Stack

### Backend
- Node.js
- Express.js (REST API)
- MongoDB
- Mongoose (ODM)
- JWT Authentication
- bcryptjs (Password Hashing)

### Frontend
- React
- Bootstrap & React-Bootstrap
- Axios (API calls)
- React Router (Navigation)

## Project Structure

```
gym-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── trainerController.js
│   │   ├── planController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Member.js
│   │   ├── Trainer.js
│   │   ├── Plan.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── trainerRoutes.js
│   │   ├── planRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Choose one option below)

## MongoDB Setup Options

You have **3 options** to set up MongoDB:

### Option 1: MongoDB Atlas (Cloud - Recommended if you don't have MongoDB installed)

**This is the easiest option - no installation required!**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)
4. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Set username and password (remember these!)
5. Whitelist your IP:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
6. Get your connection string:
   - Go to "Clusters" → Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password
   - Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority`

**Use this connection string in your `.env` file (see Backend Setup below)**

### Option 2: Install MongoDB Locally

**For macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Windows:**
- Download MongoDB from [mongodb.com/download](https://www.mongodb.com/try/download/community)
- Run the installer
- MongoDB will start automatically as a service

**For Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 3: Docker (If you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Setup Instructions

### Step 1: MongoDB Setup

Choose one of the options above and get your MongoDB connection string ready.

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:

**If using MongoDB Atlas (Cloud):**
```env

NODE_ENV=development
```

**If using Local MongoDB:**
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Replace the values:**
- `MONGODB_URI` - Your MongoDB connection string (from Option 1, 2, or 3 above)
- `JWT_SECRET` - Any random string (keep it secret!)

4. (Optional) Seed dummy data to get started quickly:
```bash
node seed.js
```
   This will create:
   - Admin user (email: `admin@gym.com`, password: `admin123`)
   - Sample members, trainers, plans, and payments

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

After running the seed script, you can login with:
- **Email:** admin@gym.com
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Trainers
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get single trainer
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get single plan
- `POST /api/plans` - Create new plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Record new payment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

**Note:** All endpoints except `/api/auth/login` and `/api/auth/register` require JWT authentication token in the Authorization header.

## Features

### Admin Features
- ✅ Login/Logout
- ✅ Dashboard with statistics
- ✅ Member Management (CRUD)
- ✅ Trainer Management (CRUD)
- ✅ Membership Plan Management (CRUD)
- ✅ Payment Recording and History
- ✅ Search functionality
- ✅ Responsive design

### Member Fields
- Name, Email, Phone, Age, Gender
- Membership Plan
- Join Date, Expiry Date
- Status (Active/Inactive)

### Trainer Fields
- Name, Specialization, Phone
- Experience (years)
- Status (Active/Inactive)

### Plan Fields
- Plan Name
- Duration (1/3/6/12 months)
- Price
- Description

### Payment Fields
- Member ID
- Plan ID
- Amount
- Payment Date
- Payment Mode (Cash/UPI/Card)

## Quick Start Guide

### Complete Setup Steps:

1. **Set up MongoDB** (choose one option from above)
   - **Easiest:** Use MongoDB Atlas (cloud) - no installation needed!

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file with your MongoDB connection string
   node seed.js  # Optional: Create sample data
   npm start     # Server runs on http://localhost:5000
   ```

3. **Frontend Setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   # Create .env file with REACT_APP_API_URL=http://localhost:5000/api
   npm start     # Opens http://localhost:3000
   ```

4. **Login:**
   - Open `http://localhost:3000` in your browser
   - If you ran `seed.js`, use:
     - Email: `admin@gym.com`
     - Password: `admin123`
   - Or register a new admin account

5. **Start using the system!**
   - Navigate through Dashboard, Members, Trainers, Plans, and Payments

## Troubleshooting

### MongoDB Connection Issues

**If using MongoDB Atlas:**
- Make sure your IP is whitelisted in Network Access
- Check that your connection string has the correct password
- Ensure the database name is included in the URI

**If using Local MongoDB:**
- Make sure MongoDB service is running:
  - macOS: `brew services list` (should show mongodb-community as started)
  - Windows: Check Services app for MongoDB
  - Linux: `sudo systemctl status mongod`

**Connection Error?**
- Check your `.env` file has the correct `MONGODB_URI`
- Make sure there are no extra spaces in the connection string
- Try connecting with MongoDB Compass (GUI tool) to test your connection string

## Future Enhancements

- Online payment gateway integration
- Attendance tracking system
- Email reminders for membership expiry
- Role-based access control (Member portal)
- Mobile app version
- Reports and analytics
- Workout plans assignment

## License

ISC

