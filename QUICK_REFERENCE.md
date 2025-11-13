# Quick Reference Card - User & Admin Auth

## 🚀 Quick Start (60 Seconds)

```bash
npm run dev              # Start development server
# Visit: http://localhost:3000
```

## 📍 Routes at a Glance

### User Routes
| Route | GET | POST | Notes |
|-------|-----|------|-------|
| `/user/login` | Login form | Authenticate | role='user' only |
| `/user/register` | Register form | Create user | No secret needed |

### Admin Routes
| Route | GET | POST | Notes |
|-------|-----|------|-------|
| `/admin/login` | Login form | Authenticate | role='admin' only |
| `/admin/register` | Register form | Create admin | Needs secret key |

### Shared Route
| Route | GET | Notes |
|-------|-----|-------|
| `/logout` | Destroy session | Works for both user & admin |

## 🔑 Test Credentials

**User Demo:**
- URL: `/user/login`
- Username: `user` | Password: `user123`

**Admin Demo:**
- URL: `/admin/login`
- Username: `admin` | Password: `admin123`

**Admin Secret (for registration):**
```
admin-secret-key-2024
```

## 📝 User Registration Flow

1. Visit: `/user/register`
2. Enter: username, password, confirm password
3. Click: "Register"
4. Success → Go to `/user/login`
5. Login → Redirected to `/`

## 🔐 Admin Registration Flow

1. Visit: `/admin/register`
2. Enter: username, password, confirm password, **admin secret**
3. Secret from `.env`: `ADMIN_SECRET=admin-secret-key-2024`
4. Click: "Register as Admin"
5. Success → Go to `/admin/login`
6. Login → Redirected to `/admin`

## 🔄 After Login

**User sees:** Home page, compose posts, profile
**Admin sees:** Admin dashboard with post management

## ⚙️ Configuration

### .env Variables
```
ADMIN_SECRET=admin-secret-key-2024    # Change this for security
SESSION_SECRET=myblog-...             # Session encryption
MONGODB_URI=mongodb://localhost...    # Database connection
PORT=3000                             # Server port
```

### Change Admin Secret
Edit `.env`:
```
ADMIN_SECRET=your-new-secret-here
```
Then restart server.

## 🧪 Test Checklist

- [ ] User can register at `/user/register`
- [ ] User can login at `/user/login`
- [ ] User redirects to `/` after login
- [ ] Admin can register at `/admin/register` with secret
- [ ] Admin can login at `/admin/login`
- [ ] Admin redirects to `/admin` after login
- [ ] Logout works for both
- [ ] User cannot access `/admin`
- [ ] Admin cannot use `/user` routes

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `export PORT=3001` or kill process |
| MongoDB error | Start MongoDB service |
| Views not found | Check `views/user/` and `views/admin/` exist |
| Admin secret fails | Check `.env` for typos |
| Session not working | Restart server |

## 📚 Full Documentation

- **Setup & Steps**: `SETUP_GUIDE.md`
- **All Routes**: `AUTH_ROUTES.md`
- **Visual Diagrams**: `ROUTES_SUMMARY.txt`
- **Testing Details**: `IMPLEMENTATION_CHECKLIST.md`
- **Changes Made**: `CHANGES_SUMMARY.txt`
- **Architecture**: `WARP.md`

## 🎯 Key Points

✅ Users register & login separately from admins
✅ Admin creation protected by secret key
✅ Role validation on every login
✅ Passwords hashed with bcrypt
✅ Sessions persist across requests
✅ Logout available for both roles

## 💡 Remember

- User role: `role: 'user'`
- Admin role: `role: 'admin'`
- Both use same User model in MongoDB
- Demo accounts auto-created on startup
- Admin secret from `.env` file

---

**Status**: ✅ Ready to test!
**Next**: Run `npm run dev` and visit routes above
