# Deployment Checklist

Use this checklist to ensure successful deployment.

## Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] All environment variables documented
- [ ] `.env` files added to `.gitignore`
- [ ] No sensitive data in code
- [ ] Build tested locally (`npm run build`)

## MongoDB Atlas Setup

- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Free cluster created (M0)
- [ ] Database user created (username/password saved)
- [ ] Network access configured (0.0.0.0/0 for testing)
- [ ] Connection string copied and formatted correctly
- [ ] Database name added to connection string: `.../alumni_management?retryWrites=true&w=majority`

## Backend Deployment

### Platform: _______________ (Render/Railway/Heroku)

- [ ] Account created
- [ ] Repository connected
- [ ] Service created
- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000` (or platform default)
  - [ ] `MONGODB_URI=<connection_string>`
  - [ ] `JWT_SECRET=<32+ character secret>`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `FRONTEND_URL=<frontend_url>`
- [ ] Deployment successful
- [ ] Health check passed: `curl https://your-backend-url/api/health`
- [ ] Backend URL saved: `_________________`

## Frontend Deployment

### Platform: _______________ (Vercel/Netlify)

- [ ] Account created
- [ ] Repository connected
- [ ] Project created
- [ ] Root directory set to `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] Environment variable set:
  - [ ] `REACT_APP_API_URL=<backend_url>`
- [ ] Deployment successful
- [ ] Frontend URL saved: `_________________`

## Post-Deployment Configuration

- [ ] Backend `FRONTEND_URL` updated with frontend URL
- [ ] Frontend `REACT_APP_API_URL` updated with backend URL
- [ ] Both services redeployed (if needed)

## Testing

- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Profile creation works
- [ ] API calls successful (check browser Network tab)
- [ ] No CORS errors in console
- [ ] Database connection verified (check Atlas)
- [ ] Data persists after refresh

## Admin Setup

- [ ] Admin user created via registration
- [ ] User role updated to `admin` in MongoDB:
  ```javascript
  db.users.updateOne(
    { email: "admin@example.com" },
    { $set: { role: "admin" } }
  )
  ```
- [ ] Admin can access `/admin` route
- [ ] Admin dashboard loads

## Security

- [ ] Strong JWT_SECRET used (32+ characters)
- [ ] MongoDB password is strong
- [ ] Environment variables not exposed
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] CORS configured correctly
- [ ] Rate limiting active

## Monitoring

- [ ] Backend logs accessible
- [ ] Frontend logs accessible
- [ ] Error tracking set up (optional)
- [ ] Uptime monitoring configured (optional)

## Documentation

- [ ] Deployment URLs documented
- [ ] Environment variables documented
- [ ] Admin credentials secured
- [ ] Team members have access

## Final Verification

- [ ] All features tested:
  - [ ] Authentication
  - [ ] Profile management
  - [ ] Matching system
  - [ ] Opportunities
  - [ ] Events
  - [ ] Donations
  - [ ] Messages
  - [ ] Admin dashboard
- [ ] Mobile responsiveness checked
- [ ] Performance acceptable
- [ ] No console errors

## ✅ Deployment Complete!

**Backend URL**: `_________________`  
**Frontend URL**: `_________________`  
**Deployment Date**: `_________________`

---

## Troubleshooting Notes

_Add any issues encountered and solutions here:_

1. 
2. 
3. 

