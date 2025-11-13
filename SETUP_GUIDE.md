# Setup Guide - Separate User & Admin Authentication

## What Changed

Your blog application now has **completely separate authentication routes** for users and admins:

### Before
- `/login` - worked for both users and admins
- `/register` - worked for both users and admins

### After
- **User routes**: `/user/login` and `/user/register`
- **Admin routes**: `/admin/login` and `/admin/register`
- **Logout**: `/logout` (works for both)

## Quick Start

### 1. Dependencies Already Installed ✅
All required packages are already in your `package.json`:
```bash
npm start     # Production server on port 3000
npm run dev   # Development server with auto-reload
```

### 2. Test the Routes

#### Test User Registration & Login
1. Visit `http://localhost:3000/user/register`
2. Create a new user account
3. Visit `http://localhost:3000/user/login` and login
4. You'll be redirected to home page `/`
5. Compose posts at `/compose`

#### Test Admin Registration & Login
1. Visit `http://localhost:3000/admin/register`
2. Enter the **admin secret key**: `admin-secret-key-2024` (from `.env`)
3. Create an admin account
4. Visit `http://localhost:3000/admin/login` and login
5. You'll be redirected to admin dashboard `/admin`
6. Manage posts from admin dashboard

#### Use Demo Accounts (Auto-Created)
- **User Demo**: username: `user` | password: `user123` | Go to `/user/login`
- **Admin Demo**: username: `admin` | password: `admin123` | Go to `/admin/login`

## File Changes

### Modified Files
- `app.js` - Updated with new separated routes
- `.env` - Added `ADMIN_SECRET` variable

### New Files Created
```
views/user/
├── login.ejs      # User login page
└── register.ejs   # User registration page

views/admin/
├── login.ejs      # Admin login page
└── register.ejs   # Admin registration page

Documentation:
├── AUTH_ROUTES.md      # Detailed route documentation
└── SETUP_GUIDE.md      # This file
```

## Key Features

✅ **Role Validation** - Users can only login with 'user' role, admins with 'admin' role  
✅ **Admin Security** - Admin registration requires a secret key  
✅ **Password Confirmation** - Both flows check passwords match before registration  
✅ **Clear Navigation** - Links on each page to switch between user/admin flows  
✅ **Visual Distinction** - Admin pages have red accent color, user pages have blue  
✅ **Automatic Redirects** - Users go to `/`, admins go to `/admin` after login  

## Environment Variables

Your `.env` now includes:
```
MONGODB_URI=mongodb://localhost:27017/blogDB
SESSION_SECRET=myblog-super-secret-key-2024-xyz789abc123
ADMIN_SECRET=admin-secret-key-2024
PORT=3000
NODE_ENV=development
```

### Change Admin Secret Key
Edit `.env` and update `ADMIN_SECRET`:
```
ADMIN_SECRET=your-super-secret-key-12345
```

## Database Schema

No changes to database structure. Same models are used:

**User Collection:**
```
{
  username: String (unique),
  password: String (bcrypt hashed),
  role: "user" or "admin"
}
```

**Post Collection:**
```
{
  title: String,
  content: String,
  createdAt: Date
}
```

## Testing Flow

### User Journey
1. Go to `http://localhost:3000/user/register`
2. Register with username/password
3. Login at `http://localhost:3000/user/login`
4. Browse home page, write posts, view profile
5. Logout at `http://localhost:3000/logout`

### Admin Journey
1. Go to `http://localhost:3000/admin/register`
2. Register with admin secret key
3. Login at `http://localhost:3000/admin/login`
4. Manage posts on admin dashboard
5. Edit/Delete posts
6. Logout at `http://localhost:3000/logout`

## Troubleshooting

### Admin Secret Key Not Working
- Check the `.env` file for exact `ADMIN_SECRET` value
- Make sure there are no extra spaces
- Restart the server after changing `.env`

### Views Not Found Error
- Ensure new `views/user/` and `views/admin/` directories exist
- All `.ejs` files are in the correct subdirectories
- Check file permissions

### Session Not Persisting
- Verify `SESSION_SECRET` is set in `.env`
- Check browser cookie settings aren't blocking session cookies
- Try in a different browser or incognito window

## Security Recommendations

1. **Change Secrets in Production**
   - Change `SESSION_SECRET` to a random string
   - Change `ADMIN_SECRET` to a secure value
   - Never commit actual secrets to git

2. **Add Password Validation**
   - Minimum 8 characters
   - Require uppercase/lowercase/numbers/symbols
   - Show password strength indicator

3. **Rate Limiting**
   - Add rate limiting to login/register routes
   - Prevent brute force attacks

4. **HTTPS in Production**
   - Set `secure: true` in session cookie config
   - Only send cookies over HTTPS

## Support

For detailed route documentation, see `AUTH_ROUTES.md`

For overall project architecture, see `WARP.md`
