# Separate User and Admin Authentication Routes

This document explains the new separate authentication system for users and admins.

## Routes Overview

### User Routes
- **Login**: `/user/login` (GET/POST)
  - Users can only login with 'user' role accounts
  - After login, redirects to home page `/`
  - View file: `views/user/login.ejs`

- **Register**: `/user/register` (GET/POST)
  - Register as a regular user (automatically assigned 'user' role)
  - Requires username and password (with confirmation)
  - View file: `views/user/register.ejs`

### Admin Routes
- **Login**: `/admin/login` (GET/POST)
  - Admins can only login with 'admin' role accounts
  - After login, redirects to admin dashboard `/admin`
  - View file: `views/admin/login.ejs`

- **Register**: `/admin/register` (GET/POST)
  - Register as an admin (automatically assigned 'admin' role)
  - Requires **admin secret key** for security (set in `.env` as `ADMIN_SECRET`)
  - Default secret: `admin-secret-key-2024`
  - View file: `views/admin/register.ejs`

### Logout
- **Logout**: `/logout` (GET)
  - Works for both users and admins
  - Destroys session and redirects to home page

## Directory Structure
```
views/
├── user/
│   ├── login.ejs         # User login page
│   └── register.ejs      # User registration page
├── admin/
│   ├── login.ejs         # Admin login page
│   └── register.ejs      # Admin registration page
├── partials/
│   ├── header.ejs        # Shared header
│   └── footer.ejs        # Shared footer
└── [other pages...]
```

## Environment Variables
Add to `.env`:
```
ADMIN_SECRET=admin-secret-key-2024
```

## Key Features

### Role Validation
- User login route only accepts 'user' role accounts
- Admin login route only accepts 'admin' role accounts
- Error messages clarify which role is required

### Admin Security
- Admin registration requires a secret key
- This prevents unauthorized admin account creation
- Secret key is configured in `.env` file

### Password Validation
- Both user and admin registration verify password matches confirmation
- Bcrypt is used for secure password hashing (10 salt rounds)

### Navigation Links
- Login/Register pages include links to switch between user and admin flows
- Clear UI separation with visual styling

## Demo Users
Demo users are still created on startup:
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

## How to Use

### For Regular Users
1. Go to `/user/register` to create a new account
2. Go to `/user/login` to login
3. After login, access blog features at `/` (home), `/compose` (write posts), `/profile`

### For Admins
1. Go to `/admin/register` with the admin secret key to create an admin account
2. Go to `/admin/login` to login
3. After login, access admin dashboard at `/admin` to manage posts

## Customization

### Change Admin Secret Key
Edit `.env`:
```
ADMIN_SECRET=your-new-secret-key-here
```

### Update Error Messages
Edit the respective route files in `views/user/login.ejs`, `views/user/register.ejs`, `views/admin/login.ejs`, or `views/admin/register.ejs`

## Security Considerations
- Passwords are hashed with bcrypt before storing in MongoDB
- Session secrets should be changed in production (set in `.env` as `SESSION_SECRET`)
- Admin secret key should be kept confidential and changed regularly
- Consider adding password validation rules (minimum length, complexity, etc.)
