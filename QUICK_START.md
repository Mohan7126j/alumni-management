# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js (v14+) installed
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] npm or yarn package manager

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
# From project root
npm run install-all
```

This installs dependencies for both server and client.

### Step 2: Configure Environment

Create `server/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alumni_management
JWT_SECRET=change_this_to_a_random_secret_key_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas**, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni_management
```

### Step 3: Start MongoDB

**Local MongoDB**:
```bash
mongod
```

**MongoDB Atlas**: No setup needed, just use the connection string.

### Step 4: Run the Application

```bash
# From project root
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend app on `http://localhost:3000`

### Step 5: Create Admin Account

1. Register a new user via the UI at `http://localhost:3000/register`
2. In MongoDB, update the user's role to `admin`:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass/Atlas UI to manually change the role.

## First Steps After Setup

1. **Login** with your admin account
2. **Complete your profile** at `/profile`
3. **Create test data**:
   - Register a few test users (students, alumni)
   - Create some opportunities
   - Create events
4. **Explore features**:
   - Try the matching system
   - Test the admin dashboard
   - Check analytics

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Verify network access settings

### Port Already in Use
- Change `PORT` in `server/.env`
- Or kill the process using port 5000/3000

### Module Not Found
- Run `npm install` in both `server/` and `client/` directories
- Delete `node_modules` and reinstall if needed

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that backend is running on correct port

## Testing the System

### Test Authentication
1. Register a new user
2. Login with credentials
3. Access protected routes

### Test Matching
1. Create profiles with skills and industries
2. Request matches at `/matching`
3. Verify compatibility scores

### Test Admin Features
1. Login as admin
2. Access `/admin` dashboard
3. Verify alumni accounts
4. View analytics

## Next Steps

- Read `README.md` for detailed documentation
- Check `ARCHITECTURE.md` for system design
- Review `API_DOCUMENTATION.md` for API details
- Customize the system for your institution

## Support

For issues or questions:
1. Check the documentation files
2. Review error messages in console
3. Check MongoDB connection
4. Verify environment variables

Happy building! 🚀

