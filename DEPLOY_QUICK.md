# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (15 minutes)

### Step 1: MongoDB Atlas (5 min)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up → Create free cluster
3. **Database Access**: Create user (save username/password)
4. **Network Access**: Add `0.0.0.0/0` (allow all IPs)
5. **Connect**: Get connection string
   - Format: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/alumni_management?retryWrites=true&w=majority`

### Step 2: Deploy Backend to Render (5 min)
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `alumni-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your_atlas_connection_string>
   JWT_SECRET=<generate_random_32_char_string>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Click **Create Web Service**
7. Wait for deployment → Copy URL (e.g., `https://alumni-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel (5 min)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **New Project** → Import repo
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://alumni-backend.onrender.com
   ```
5. Click **Deploy**
6. Wait for deployment → Copy URL

### Step 4: Update Backend CORS
1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Redeploy (or it auto-redeploys)

### Step 5: Test
1. Visit your frontend URL
2. Register a new user
3. Login
4. Check if everything works!

## ✅ Done!

Your app is now live! 🎉

**Backend**: `https://alumni-backend.onrender.com`  
**Frontend**: `https://your-app.vercel.app`

## 🔧 Create Admin User

1. Register via frontend
2. Go to MongoDB Atlas → **Browse Collections**
3. Find `users` collection
4. Find your user document
5. Update `role` field to `"admin"`
6. Save

## 📝 Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://alumni-backend.onrender.com
```

## 🆘 Troubleshooting

**CORS Error?**
- Check `FRONTEND_URL` in backend matches frontend domain exactly

**API Not Working?**
- Verify `REACT_APP_API_URL` is set in Vercel
- Check backend logs in Render dashboard

**Database Error?**
- Verify MongoDB connection string
- Check network access in Atlas (should allow all IPs for testing)

**Build Fails?**
- Check Node.js version (should be 14+)
- Review build logs in deployment platform

## 🎯 Next Steps

- Set up custom domain
- Configure email notifications
- Add monitoring
- Set up backups

For detailed instructions, see `DEPLOYMENT.md`

