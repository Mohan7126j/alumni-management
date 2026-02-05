# Deployment Guide

This guide covers deploying the Alumni Management System to production.

## 🎯 Recommended Deployment Stack

- **Backend**: Render, Railway, or Heroku
- **Frontend**: Vercel or Netlify
- **Database**: MongoDB Atlas (Free tier available)

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Environment variables prepared
- [ ] Code pushed to Git repository
- [ ] Build scripts tested locally

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free tier: M0)

### 1.2 Configure Database Access
1. Go to **Database Access**
2. Create a database user:
   - Username: `alumni_admin`
   - Password: Generate secure password
   - Database User Privileges: **Read and write to any database**

### 1.3 Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Add `0.0.0.0/0` (allows all IPs)
4. For production: Add specific IPs or use VPC peering

### 1.4 Get Connection String
1. Go to **Clusters** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials
5. Add database name: `mongodb+srv://.../alumni_management?retryWrites=true&w=majority`

---

## 🚀 Step 2: Deploy Backend

### Option A: Deploy to Render (Recommended)

#### 2.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with GitHub

#### 2.2 Create Web Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Select the repository
4. Configure:
   - **Name**: `alumni-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 2.3 Set Environment Variables
In Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/alumni_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 2.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Copy the service URL (e.g., `https://alumni-backend.onrender.com`)

---

### Option B: Deploy to Railway

#### 2.1 Create Railway Account
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

#### 2.2 Create New Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository

#### 2.3 Configure Service
1. Railway auto-detects Node.js
2. Set **Root Directory** to `server`
3. Add environment variables (same as Render)

#### 2.4 Deploy
1. Railway auto-deploys on push
2. Get your service URL from dashboard

---

### Option C: Deploy to Heroku

#### 2.1 Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### 2.2 Login and Create App
```bash
heroku login
heroku create alumni-backend
```

#### 2.3 Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_secret_key
heroku config:set JWT_EXPIRE=7d
heroku config:set FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 2.4 Deploy
```bash
cd server
git subtree push --prefix server heroku main
# Or use Heroku Git
heroku git:remote -a alumni-backend
git push heroku main
```

---

## 🎨 Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

#### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub

#### 3.2 Import Project
1. Click **New Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### 3.3 Set Environment Variables
Add these in Vercel dashboard:
```env
REACT_APP_API_URL=https://alumni-backend.onrender.com
```

#### 3.4 Update API Calls (if needed)
If your frontend uses relative URLs (`/api/...`), update `client/src/context/AuthContext.js`:

```javascript
// Change from:
axios.get('/api/auth/me')

// To:
axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`)
```

#### 3.5 Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Get your frontend URL

---

### Option B: Deploy to Netlify

#### 3.1 Create Netlify Account
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub

#### 3.2 Add New Site
1. Click **Add new site** → **Import an existing project**
2. Connect GitHub repository
3. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`

#### 3.3 Set Environment Variables
In **Site settings** → **Environment variables**:
```env
REACT_APP_API_URL=https://alumni-backend.onrender.com
```

#### 3.4 Deploy
1. Click **Deploy site**
2. Wait for deployment
3. Get your site URL

---

## 🔧 Step 4: Update Configuration

### 4.1 Update Frontend API URL

Update `client/src/context/AuthContext.js` to use environment variable:

```javascript
// Add at the top
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Update all axios calls
axios.get(`${API_URL}/api/auth/me`)
```

### 4.2 Update CORS in Backend

Ensure `server/index.js` has correct CORS configuration:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 4.3 Update Backend FRONTEND_URL

Update the backend environment variable:
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "message": "Alumni Management System API is running"
}
```

### 5.2 Test Frontend
1. Visit your frontend URL
2. Try registering a new user
3. Check browser console for errors
4. Verify API calls in Network tab

### 5.3 Test Database Connection
1. Login to MongoDB Atlas
2. Check **Collections** for your database
3. Verify data is being created

---

## 🔒 Step 6: Security Checklist

- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] MongoDB Atlas network access restricted
- [ ] Environment variables not exposed in code
- [ ] HTTPS enabled (automatic on Vercel/Netlify/Render)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Password requirements enforced

---

## 📊 Step 7: Monitoring (Optional)

### 7.1 Add Logging
Consider adding logging service:
- **Winston** for backend logging
- **Sentry** for error tracking

### 7.2 Set Up Monitoring
- **Uptime monitoring**: UptimeRobot
- **Error tracking**: Sentry
- **Analytics**: Google Analytics

---

## 🚨 Troubleshooting

### Backend Issues

**Problem**: MongoDB connection error
- Check connection string format
- Verify network access in Atlas
- Ensure username/password are correct

**Problem**: CORS errors
- Verify FRONTEND_URL matches frontend domain
- Check CORS configuration in server

**Problem**: Environment variables not working
- Restart service after adding variables
- Check variable names (case-sensitive)
- Verify no extra spaces

### Frontend Issues

**Problem**: API calls failing
- Check REACT_APP_API_URL is set
- Verify backend URL is correct
- Check CORS configuration

**Problem**: Build fails
- Check Node.js version compatibility
- Review build logs
- Ensure all dependencies are in package.json

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: echo "Deploy to your platform"
```

Most platforms (Vercel, Netlify, Render) auto-deploy on git push.

---

## 📝 Post-Deployment

1. **Create Admin User**:
   - Register via frontend
   - Update role in MongoDB Atlas:
     ```javascript
     db.users.updateOne(
       { email: "admin@example.com" },
       { $set: { role: "admin" } }
     )
     ```

2. **Test All Features**:
   - User registration/login
   - Profile creation
   - Matching system
   - Opportunities
   - Events
   - Admin dashboard

3. **Set Up Custom Domain** (Optional):
   - Vercel/Netlify: Add custom domain in settings
   - Update DNS records
   - Update FRONTEND_URL in backend

---

## 🎉 Success!

Your Alumni Management System is now live! 🚀

**Next Steps**:
- Monitor performance
- Set up backups
- Configure email notifications
- Add custom domain
- Set up SSL certificates (usually automatic)

---

## 📞 Support

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Verify environment variables
4. Test locally first

