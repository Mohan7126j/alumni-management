# Alumni Management System

A next-generation Alumni Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform goes beyond a static alumni directory and functions as a living professional network for institutions.

## 🎯 Core Vision

Treat alumni as lifelong stakeholders, not past students. Enable career mobility, mentorship, hiring, donations, and community intelligence in one comprehensive system.

## ✨ Key Features

### 🔐 Smart Authentication
- Role-based access control (Admin, Alumni, Student, Faculty)
- JWT-based authentication
- Admin-approved alumni verification workflow

### 👤 Dynamic Alumni Profiles
- Comprehensive profile management
- Skills, current role, company, achievements
- Social links integration
- Career timeline visualization
- Public/private profile settings

### 🤖 AI-like Matching Logic (Rule-based)
- **Mentor-Mentee Pairing**: Intelligent matching based on industry, skills, experience level, and location
- **Career Alignment**: Connect students with alumni in similar career paths
- Compatibility scoring system with detailed match reasons

### 💼 Opportunities Hub
- Jobs, internships, referrals
- Startup collaborations
- Application tracking
- Opportunity filtering and search

### 📅 Events Engine
- Reunions, webinars, meetups, workshops
- RSVP management
- Event reminders
- Virtual and in-person events

### 💰 Donation & Impact Tracking
- Transparent contribution history
- Impact outcomes tracking
- Multiple donation types
- Payment status management

### 📊 Community Intelligence Dashboard (Admin)
- Alumni distribution by industry, country, graduation year
- Engagement heatmaps
- Success metrics and analytics
- Real-time statistics

### 💬 Secure Messaging & Groups
- One-on-one messaging
- Group conversations
- Cohort-based groups
- Interest-based communities
- Geographic chapters

### ✅ Verification Workflow
- Admin-approved alumni validation
- Pending verification queue
- Verification history tracking

## 🚀 Innovation Hooks

### 1. Give Back Score
A gamified system that tracks and rewards alumni contributions:
- Mentorship hours (5 points/hour)
- Referrals given (15 points/referral)
- Talks/webinars delivered (25 points/talk)
- Donations made (10 points/donation)
- Events attended (5 points/event)

### 2. Career Timeline Visualization
Visual representation of each alumni's career progression with role transitions, companies, and achievements.

### 3. Student → Alumni Auto-Transition
Automated system that transitions students to alumni status after graduation, with admin verification workflow.

### 4. Institution-Level Alumni Success Index
Comprehensive metric (0-100) measuring:
- Engagement score (mentorship availability)
- Career score (employment rate)
- Contribution score (hiring/referral openness)

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Material-UI (MUI)** for components
- **Recharts** for data visualization
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Express Rate Limit** for security

## 📁 Project Structure

```
alumni-management-system/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── index.js         # Server entry point
├── client/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # Context providers
│       └── App.js       # Main app component
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone (https://github.com/Mohan7126j/alumni-management)
cd alumni-management-system
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alumni_management
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**

From the root directory:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) concurrently.

Or run separately:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-alumni/:userId` - Verify alumni (Admin)
- `GET /api/auth/pending-verifications` - Get pending verifications (Admin)

### Profiles
- `GET /api/profiles` - Get all profiles (with filters)
- `GET /api/profiles/me` - Get current user's profile
- `GET /api/profiles/:id` - Get profile by ID
- `POST /api/profiles` - Create/update profile
- `PUT /api/profiles/me` - Update own profile
- `POST /api/profiles/me/career-timeline` - Add career timeline entry

### Matching
- `GET /api/matching/mentors` - Find mentor matches
- `GET /api/matching/career` - Find career-aligned matches
- `GET /api/matching/suggestions` - Get personalized suggestions

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get opportunity by ID
- `POST /api/opportunities` - Create opportunity
- `POST /api/opportunities/:id/apply` - Apply to opportunity

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `POST /api/events/:id/rsvp` - RSVP to event

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `PUT /api/donations/:id/status` - Update donation status (Admin)

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:id` - Get conversation messages
- `POST /api/messages` - Send message
- `GET /api/messages/unread` - Get unread count

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `POST /api/admin/transition-students` - Transition students to alumni
- `POST /api/admin/transition/:userId` - Transition specific student

### Analytics
- `GET /api/analytics/community-intelligence` - Get community intelligence (Admin)
- `GET /api/analytics/success-index` - Get success index (Admin)
- `GET /api/analytics/give-back-leaderboard` - Get Give Back leaderboard

## 🗄️ Database Schema

### User
- Authentication and role management
- Verification status tracking

### Profile
- Comprehensive alumni/student information
- Skills, achievements, career timeline
- Give Back Score and breakdown

### Opportunity
- Job postings, internships, referrals
- Application tracking

### Event
- Event management with RSVP
- Attendee tracking

### Donation
- Contribution records
- Impact tracking

### Message & Conversation
- Secure messaging system
- Conversation management

### Group
- Community groups (cohorts, interests, chapters)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with express-validator
- Rate limiting
- CORS configuration
- Secure password requirements

## 🎨 UI/UX Features

- Modern Material-UI design
- Responsive layout
- Intuitive navigation
- Real-time data updates
- Loading states
- Error handling
- Success notifications

## 🚢 Deployment

### Backend Deployment
1. Set environment variables on hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy to platforms like Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy `build` folder to platforms like Netlify, Vercel, or AWS S3

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for institutions that value lifelong connections**


