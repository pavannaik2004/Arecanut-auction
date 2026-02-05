# Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.x or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **MySQL Database** (v8.0 or higher)
  - Download from: https://dev.mysql.com/downloads/installer/
  - Verify installation: `mysql --version`
  - Ensure MySQL Server is running on port 3306

- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Arecanut auction"
```

### 2. Backend Setup

#### 2.1 Navigate to Server Directory
```bash
cd server
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment File
Create a `.env` file in the `server` directory:

```bash
# For Windows PowerShell
New-Item -Path .env -ItemType File

# For Linux/Mac
touch .env
```

Add the following configuration to `.env`:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/arecanut-auction
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/arecanut-auction?retryWrites=true&w=majority

# JWT Secret Key (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Environment
NODE_ENV=development
```

**Important:** Generate a strong JWT secret using:
```bash
# PowerShell
-join ((65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Linux/Mac
openssl rand -base64 32
```

#### 2.4 Start MongoDB Service

**Windows:**
```powershell
# MongoDB is typically started as a service automatically
# Verify it's running:
Get-Service -Name MongoDB

# If not running, start it:
Start-Service -Name MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**MongoDB Atlas (Cloud):**
- No local service needed
- Use the connection string provided by Atlas in your `.env` file

#### 2.5 Create Admin Account
Run the admin creation script:

```bash
node create_admin.js
```

**Default Admin Credentials:**
- Email: `admin@arecanut.com`
- Password: `adminpassword123`

⚠️ **Security Note:** Change the admin password after first login in production!

#### 2.6 Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

### 3. Frontend Setup

Open a **new terminal** window/tab.

#### 3.1 Navigate to Client Directory
```bash
cd client
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Configure API Endpoint (Optional)

For development, the API URL is hardcoded to `http://localhost:5000`.

To change it, create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Then update `src/context/AuthContext.jsx` to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

#### 3.4 Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🧪 Verify Installation

### Test Backend API
```bash
curl http://localhost:5000/
# Should return: "Arecanut Auction API is running..."
```

### Test Admin Login
1. Go to http://localhost:5173/login
2. Use credentials:
   - Email: admin@arecanut.com
   - Password: adminpassword123
3. You should be redirected to admin dashboard

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `MongoNetworkError` or `Connection refused`**

**Solution:**
1. Verify MongoDB is running:
   ```bash
   # Windows
   Get-Service -Name MongoDB
   
   # Linux
   sudo systemctl status mongod
   ```

2. Check MongoDB port (default: 27017):
   ```bash
   netstat -an | findstr 27017  # Windows
   netstat -an | grep 27017     # Linux/Mac
   ```

3. Verify connection string in `.env` file

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::5000`**

**Solution:**
1. Find and kill the process:
   ```bash
   # Windows PowerShell
   Get-NetTCPConnection -LocalPort 5000
   Stop-Process -Id <PID> -Force
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

2. Or change the PORT in `.env` file

### Frontend Doesn't Connect to Backend

**Error: `Network Error` or `ERR_CONNECTION_REFUSED`**

**Solution:**
1. Ensure backend is running on port 5000
2. Check CORS configuration in `server/index.js`
3. Verify API URL in frontend code
4. Check browser console for detailed errors

### npm Install Fails

**Error: `EACCES` or permission errors**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Module Not Found Errors

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
Remove-Item -Recurse -Force node_modules, package-lock.json  # Windows PowerShell

# Reinstall
npm install
```

## 🔄 Updating the Application

### Pull Latest Changes
```bash
git pull origin main
```

### Update Backend
```bash
cd server
npm install
# Restart the server
```

### Update Frontend
```bash
cd client
npm install
# Restart the dev server
```

## 📦 Building for Production

### Build Frontend
```bash
cd client
npm run build
```

The build output will be in `client/dist/`

### Start Backend in Production Mode
```bash
cd server
NODE_ENV=production npm start
```

## 🔐 Security Checklist for Production

- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET
- [ ] Use Secure MySQL Instance with authentication
- [ ] Enable HTTPS
- [ ] Set up environment variables properly
- [ ] Remove or secure admin creation script
- [ ] Enable rate limiting
- [ ] Set up proper CORS origins
- [ ] Regular security updates

## 📞 Getting Help

If you encounter issues not covered here:
1. Check [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Check server logs and browser console
4. Contact the development team

## ✅ Next Steps

After successful installation:
1. Read [USER_GUIDE.md](./USER_GUIDE.md) to understand how to use the platform
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. Check [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for current limitations
