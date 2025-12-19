# MangaVerse - Offline-Ready Manga Website

⚠️ IMPORTANT: This project must always use a local SQLite database (./data/database.db).
Login, signup, and admin seeding must always work offline after download/re-upload.
Any agent working on this project in the future must preserve this setup.
Do NOT revert to Replit-only authentication or ephemeral storage.

A complete, self-contained manga website that works entirely offline with a portable SQLite database. Features user authentication, admin management, and full manga browsing functionality without requiring external services.

## 🗂️ Project Structure

```
mangaverse/
├── client/               # React frontend application
├── server/               # Express.js backend server  
├── shared/               # Shared TypeScript schemas
├── scripts/              # Database and admin management scripts
├── data/                 # SQLite database storage
│   ├── database.db       # Main SQLite database (users, series, app data)
│   ├── sessions.db       # Session storage (always SQLite for offline capability)
│   └── backups/          # Database backup files
└── package.json          # Project dependencies and scripts
```

## ✨ Key Features

- **🔒 Offline Authentication**: Complete user signup/login system using SQLite with session persistence
- **👑 Admin Management**: Built-in admin user creation and management
- **📱 Modern Stack**: React + Express.js + TypeScript + Tailwind CSS
- **💾 Portable Database**: SQLite database that can be copied/backed up easily
- **🚀 Zero External Dependencies**: No cloud services or external APIs required
- **📦 Small Package Size**: Optimized for portability and deployment

## 🚀 Instant Setup

**MangaVerse works immediately after download - no manual setup required!**

```bash
# Install dependencies
npm install

# Start the application (everything auto-initializes)
npm run dev
```

🎉 **That's it!** The application will be available at `http://localhost:5000`

### What Happens Automatically:
- ✅ **Database creation**: SQLite database created automatically
- ✅ **Schema setup**: All tables and indexes created automatically  
- ✅ **Admin account**: Default admin user created automatically
- ✅ **Session persistence**: Secure session system ready
- ✅ **Data directories**: All required folders created

### Default Admin Credentials:
- **Username**: `admin`
- **Email**: `admin@localhost.com` 
- **Password**: `admin123` *(development only)*

### Optional Environment Variables:
```bash
# Only needed if you want custom admin credentials
export ADMIN_EMAIL="your@email.com"
export ADMIN_PASSWORD="your_secure_password"
export ADMIN_USERNAME="your_username"
```

## 📋 Available Scripts

### Database Management

*⚠️ These are maintenance commands - normal setup requires no manual database steps!*

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run db:backup` | Create timestamped database backup | Before major changes |
| `npm run db:restore` | Restore database from backup file | After data corruption |
| `npm run db:reset` | Reset database and recreate admin user | Development reset |
| `npm run db:verify` | Verify database connection and structure | Troubleshooting |
| `npm run db:push` | Push schema changes to database | Development (advanced) |
| `npm run db:init` | *(Legacy)* Manual database initialization | Not needed - auto-initializes |

### Admin User Management

*⚠️ Admin user is created automatically - these are for additional management only!*

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run admin:create` | Interactive script to create new admin user | Adding more admins |

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production version |
| `npm run start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run test:offline` | Test offline functionality |

## 🔧 Environment Variables

### All Variables Are Optional!

*⚠️ No environment variables are required - everything works with smart defaults!*

```bash
# Optional admin customization (only if you want different defaults)
ADMIN_EMAIL=your@email.com             # Default: admin@localhost.com
ADMIN_PASSWORD=your_secure_password    # Default: admin123 (dev), random (prod)
ADMIN_USERNAME=your_username           # Default: admin

# Optional server configuration
PORT=5000                              # Default: 5000
NODE_ENV=development                   # Default: development

# Optional database path (advanced)
DATABASE_PATH=./data/database.db       # Default: ./data/database.db
```

## 💾 Database Management

### SQLite Database Storage

The system uses two SQLite databases for complete offline functionality:

- **Main Database**: `./data/database.db` - Contains all user accounts, admin settings, and application data
- **Session Database**: `./data/sessions.db` - Contains user session data for authentication persistence

**Important**: Sessions are **always** stored in SQLite for true offline capability, regardless of environment configuration.

### Backup Your Database

**Automatic Backup:**
```bash
npm run db:backup
```

**Manual Backup:**
```bash
# Backup main database
cp ./data/database.db ./data/backups/manual-backup-$(date +%Y%m%d).db

# Backup session database (optional - sessions are temporary)
cp ./data/sessions.db ./data/backups/sessions-backup-$(date +%Y%m%d).db

# Complete backup of all data
cp -r ./data/ ./backups/complete-backup-$(date +%Y%m%d)/
```

### Restore Database

```bash
# Interactive restore
npm run db:restore

# Manual restore main database
cp ./data/backups/backup-file.db ./data/database.db

# Note: sessions.db will be recreated automatically if missing
```

### Reset Database

```bash
# Completely reset database and recreate admin
npm run db:reset
```

## 🔐 Offline Authentication Setup

### Testing Login/Signup Locally

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Create admin user** (if not done during setup):
   ```bash
   npm run admin:create
   ```

3. **Test admin login:**
   - Navigate to `http://localhost:5000/login`
   - Use admin credentials created in step 2
   - Should redirect to admin dashboard

4. **Test user signup:**
   - Navigate to `http://localhost:5000/signup`
   - Create a new user account
   - Should allow login with new credentials

### Verify Offline Functionality

```bash
# Run offline test mode
npm run test:offline
```

This verifies:
- ✅ Database connectivity
- ✅ User authentication
- ✅ Admin user exists
- ✅ All API endpoints respond correctly

## 📥📤 Download/Upload & Migration Instructions

### Complete Project Download/Upload Process

This project is designed to work perfectly after download and re-upload to any environment. Follow these steps for seamless migration:

#### 1. Downloading the Project

**From Replit:**
1. Click "Download as zip" from the project menu
2. Extract the zip file to your local machine
3. Verify that the `./data/` directory contains:
   - `database.db` (main database file)
   - `sessions.db` (session storage - optional to backup)
   - `backups/` folder (database backups)

**Manual Backup (Recommended):**
```bash
# Create comprehensive backup before download
npm run db:backup

# Verify database integrity
npm run db:verify

# Download includes everything in ./data/ directory
```

#### 2. Re-uploading to New Environment

**Step-by-step Upload Process:**

1. **Upload the complete project directory** to your new Replit or hosting environment
2. **Verify data directory integrity:**
   ```bash
   ls -la ./data/
   # Should show: database.db, sessions.db, backups/
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Verify database and admin access:**
   ```bash
   # Check database structure and connectivity
   npm run db:verify
   
   # Should show existing admin user and confirm offline functionality
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

6. **Test login immediately:**
   - Navigate to `/login`
   - Use existing admin credentials
   - Confirm access to admin dashboard

#### 3. Failsafe Recovery Instructions

If login/signup stops working after upload, follow these steps **IN ORDER**:

**LEVEL 1 - Database Verification:**
```bash
# Check if database file exists and is readable
ls -la ./data/database.db
file ./data/database.db

# Verify database structure
npm run db:verify
```

**LEVEL 2 - Admin User Recovery:**
```bash
# Check for existing admin users or create additional ones
npm run admin:create

# Or restart server to trigger auto-initialization
npm run dev
# (Admin is created automatically on startup)
```

**LEVEL 3 - Session Reset:**
```bash
# Clear session database (users will need to log back in)
rm -f ./data/sessions.db

# Restart server to recreate session database
npm run dev
```

**LEVEL 4 - Database Reset (LAST RESORT):**
```bash
# Backup current database first!
cp ./data/database.db ./data/database.db.backup

# Reset database completely and recreate admin
npm run db:reset

# If reset fails, restore from backup
cp ./data/backups/[latest-backup].db ./data/database.db
```

#### 4. Environment-Specific Setup

**For Replit Upload:**
1. Upload project files via drag-and-drop or zip upload
2. Click "Run" - the project will auto-install dependencies
3. Check console for database initialization messages
4. Test login at the provided URL

**For Local Development:**
1. Extract project to local directory
2. Run `npm install` and `npm run dev`
3. Access `http://localhost:5000`
4. Login should work immediately with existing data

**For Production Deployment:**
1. Upload complete project including `./data/` directory
2. Set production environment variables if needed
3. Run `npm run build` and `npm start`
4. Verify admin access before going live

#### 5. Common Issues & Solutions

**Issue: "Admin user not found"**
- Solution: Run `npm run admin:create` to create new admin
- Cause: Database upload incomplete or corrupted

**Issue: "Cannot connect to database"**
- Solution: Check file permissions on `./data/` directory
- Run: `chmod 755 ./data/ && chmod 644 ./data/*.db`

**Issue: "Session not persisting"**
- Solution: Restart server to recreate session database
- Run: `rm ./data/sessions.db && npm run dev`

**Issue: "Database appears empty"**
- Solution: Restore from backup
- Run: `npm run db:restore` and select recent backup

#### 6. Verification Checklist

After any upload/migration, verify these work:

- [ ] ✅ Server starts without errors (`npm run dev`)
- [ ] ✅ Database connection successful (`npm run db:verify`)
- [ ] ✅ Admin user exists and can login
- [ ] ✅ New user signup works
- [ ] ✅ User login/logout works
- [ ] ✅ Admin dashboard accessible
- [ ] ✅ Data persists between server restarts

**If all items check out, your migration was successful!**

### 🔒 Security Notes for Migration

- **Change default passwords** after upload to production
- **Update admin email** to your actual email address
- **Set secure environment variables** for production
- **Backup database regularly** in production environment

---

## 🛠️ Troubleshooting

### Database Issues

**Problem: "Cannot connect to database"**
```bash
# Verify database exists and is accessible
npm run db:verify

# If corrupted, reset database
npm run db:reset
```

**Problem: "Admin user not found"**
```bash
# Create additional admin user
npm run admin:create

# Or restart server (admin auto-creates on startup)
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change_me npm run dev
```

### Authentication Issues

**Problem: "Login not working"**
1. Verify database contains users: `npm run db:verify`
2. Check server logs for authentication errors
3. Ensure session storage is working (check browser dev tools)
4. Try creating new user: `npm run admin:create`

**Problem: "Cannot access admin features"**
1. Verify user has admin privileges in database
2. Create new admin user: `npm run admin:create`
3. Check user role in browser developer tools (Application > Cookies)

### Development Issues

**Problem: "Port 5000 already in use"**
```bash
# Kill existing processes on port 5000
npx kill-port 5000

# Or use different port
PORT=3000 npm run dev
```

**Problem: "Module not found" errors**
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

### File Permissions (Linux/Mac)

**Problem: "Permission denied" for database**
```bash
# Fix database permissions
chmod 755 data/
chmod 644 data/database.db

# Fix script permissions
chmod +x scripts/*.ts
```

## 📁 Backup Strategy

### For Development
- Run `npm run db:backup` before major changes
- Backups are stored in `./data/backups/` with timestamps

### For Production
1. **Regular backups:**
   ```bash
   # Daily backup (add to crontab)
   0 2 * * * cd /path/to/mangaverse && npm run db:backup
   ```

2. **Before updates:**
   ```bash
   npm run db:backup
   ```

3. **Manual archive:**
   ```bash
   # Create complete project backup
   tar -czf mangaverse-backup-$(date +%Y%m%d).tar.gz \
     --exclude=node_modules \
     --exclude=.git \
     ./mangaverse/
   ```

## 🚀 Deployment

### Self-Hosting

1. **Prepare for production:**
   ```bash
   npm run build
   ```

2. **Set production environment:**
   ```bash
   export NODE_ENV=production
   export ADMIN_EMAIL=admin@yourdomain.com
   export ADMIN_PASSWORD=your-secure-production-password
   ```

3. **Start production server (database auto-initializes):**
   ```bash
   npm start
   ```

### Replit Deployment

1. Upload the entire project directory to Replit
2. (Optional) Set environment variables in Replit secrets:
   - `ADMIN_EMAIL`: Your admin email (default: admin@localhost.com)
   - `ADMIN_PASSWORD`: Secure admin password (default: random generated)
3. Click "Run" to start the server (everything auto-initializes)

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mangaverse .
docker run -p 5000:5000 -v ./data:/app/data mangaverse
```

## 🔧 Advanced Configuration

### Custom Database Location

```bash
# Use custom database path
DATABASE_PATH=/custom/path/database.db npm run dev
```

### Development with Hot Reload

The development server includes:
- ✅ Hot reload for frontend changes
- ✅ Automatic server restart on backend changes
- ✅ Error overlay for debugging
- ✅ Source maps for debugging

### Production Optimizations

- **Database optimization**: SQLite with WAL mode for better performance
- **Static file serving**: Optimized static file serving for production
- **Session management**: Secure session handling with proper cleanup
- **Rate limiting**: Built-in rate limiting for API endpoints

## 📚 Technical Details

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript, SQLite, Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **Database**: SQLite with better-sqlite3 driver
- **Build Tools**: Vite for frontend, esbuild for backend

### Security Features

- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Session-based authentication
- ✅ Rate limiting on API endpoints
- ✅ Input validation with Zod schemas
- ✅ CORS protection
- ✅ SQL injection prevention with ORM

### Database Schema

The SQLite database includes tables for:
- **users**: User accounts with authentication data
- **sessions**: User session management
- **manga**: Manga series information (if applicable)
- **user_preferences**: User-specific settings

## 📝 Contributing

This project is designed to be self-contained and portable. When making changes:

1. **Preserve offline functionality** - Never add dependencies on external services
2. **Maintain database portability** - Keep using SQLite for easy backup/restore
3. **Test thoroughly** - Use `npm run test:offline` to verify offline capabilities
4. **Update documentation** - Keep this README current with any changes

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Remember**: This project is designed to work completely offline. The SQLite database file in `./data/database.db` contains all your data and can be easily backed up or moved to different environments.