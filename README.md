# Arecanut Auction Platform

A comprehensive e-auction system for farmers and traders to simulate the APMC (Agricultural Produce Market Committee) bidding process. This project uses the **MERN Stack** (MongoDB, Express, React, Node.js).

## 🚀 Key Features

*   **Farmer Portal**: List arecanut lots, view bids, and track sales.
*   **Trader Portal**: Browse auctions, place bids, and view purchase history.
*   **Admin Dashboard**: Approve users, monitor auctions, view auction details, and view platform stats.
*   **Real-time Updates**: Live bidding status and auction timers.
*   **Automated Auction Closure**: Cron job automatically closes expired auctions.

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS, React Router
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose
*   **Auth**: JWT (JSON Web Tokens) with bcrypt
*   **Additional**: Node-cron for scheduled tasks, Express Rate Limiting

## 📂 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components (auth, farmer, trader, admin)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── config/         # API configuration
│   │   └── layouts/        # Layout components
│   └── public/
├── server/                 # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & validation middleware
│   ├── services/           # Business logic (auction service)
│   └── validators/         # Request validation schemas
└── docs/                   # Project documentation
```

## 🏁 Getting Started

### Prerequisites
*   Node.js (v16 or higher) installed
*   MongoDB installed locally OR MongoDB Atlas account
*   Git installed

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Arecanut auction"
```

### 2. Setup Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/arecanut-auction
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/arecanut-auction?retryWrites=true&w=majority
```

### 3. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 4. Create Admin Account

Run this script once to create the Super Admin account:
```bash
cd server
node create_admin.js
```

**Default Admin Credentials:**
*   **Email**: `admin@arecanut.com`
*   **Password**: `adminpassword123`

⚠️ **Important**: Change the admin password after first login in production!

### 5. Start the Application

**Option A: Run Separately (Recommended for Development)**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

**Option B: Run with Nodemon (Backend only)**
```bash
cd server
nodemon index.js
```

### 6. Access the Application

*   **Frontend**: http://localhost:5173
*   **Backend API**: http://localhost:5000
*   **MongoDB**: mongodb://localhost:27017 (if local)

## 📖 How to Use

### For Admin
1. Login with admin credentials: `admin@arecanut.com` / `adminpassword123`
2. **Approve/Reject Users**: Navigate to "User Approvals" tab
3. **Monitor Auctions**: View all auctions with filtering options
4. **View Auction Details**: Click "View Details" on any auction card
5. **Terminate Auctions**: Manually close active auctions if needed
6. **View Transactions**: Track all completed transactions
7. **Dashboard Stats**: Monitor platform metrics (users, auctions, revenue)

### For Farmers
1. **Register**: Create account with role "Farmer" and farm location
2. **Wait for Approval**: Admin must approve your account
3. **Login**: Use approved credentials
4. **Create Auction**: 
   - Fill in product details (variety, quantity, quality grade)
   - Set base price and auction duration
   - Upload product image (optional)
5. **Monitor Auctions**: View your active auctions and bids
6. **Track Sales**: View completed transactions

### For Traders
1. **Register**: Create account with role "Trader" and APMC license
2. **Wait for Approval**: Admin must approve your account
3. **Login**: Use approved credentials
4. **Browse Auctions**: View all active auctions with search/filter
5. **View Auction Details**: Click on any auction to see full details
6. **Place Bids**: 
   - Enter bid amount (must be higher than current highest bid)
   - Submit bid
   - Monitor bid status in real-time
7. **View Bid History**: Track all your bids and purchases

## 🔒 Security Features

*   JWT-based authentication with httpOnly cookies
*   Password hashing with bcrypt (10 salt rounds)
*   Protected API routes with authentication middleware
*   Role-based access control (Admin, Farmer, Trader)
*   Request validation with Joi schemas
*   Rate limiting on API endpoints (disabled in development)

## ⚙️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Farmer Routes
- `POST /api/farmer/create-auction` - Create new auction
- `GET /api/farmer/my-auctions` - Get farmer's auctions

### Trader Routes
- `GET /api/trader/auctions` - Browse all active auctions
- `GET /api/trader/auctions/:id` - Get auction details
- `POST /api/trader/bid` - Place a bid
- `GET /api/trader/my-bids` - Get trader's bid history

### Admin Routes
- `GET /api/admin/pending-users` - Get pending approvals
- `PUT /api/admin/approve-user/:id` - Approve user
- `DELETE /api/admin/reject-user/:id` - Reject user
- `GET /api/admin/all-auctions` - Get all auctions
- `GET /api/admin/auctions/:id` - Get auction details
- `PUT /api/admin/terminate-auction/:id` - Terminate auction
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/stats` - Get dashboard statistics

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running (Windows)
net start MongoDB

# Check if MongoDB is running (Mac/Linux)
sudo systemctl status mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues
- Clear browser localStorage
- Check if JWT_SECRET is set in .env
- Verify token is being sent in Authorization header

## 📝 Development Notes

*   Auctions are automatically closed by a cron job that runs every minute
*   Closed auctions with bids create transactions automatically
*   Users must be approved by admin before accessing the platform
*   All monetary values are in Indian Rupees (₹)
*   Timestamps are stored in UTC and converted to local time in frontend

## 🔄 Auction Lifecycle

1. **Created**: Farmer creates auction with start/end time
2. **Active**: Auction is live and accepting bids
3. **Closed**: Auction ended with bids → Transaction created
4. **Completed**: Auction ended without bids
5. **Terminated**: Manually closed by admin

## 📚 Additional Documentation

For more detailed information, check the `docs/` folder:
- `PROJECT_OVERVIEW.md` - Complete project description
- `API_DOCUMENTATION.md` - Detailed API documentation
- `USER_GUIDE.md` - User manual
- `INSTALLATION.md` - Installation guide
- `DESIGN_ANALYSIS.md` - System design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes.

## 👥 Authors

MCA 1st Semester - Web Application Development Project

---

**Happy Bidding! 🎯**
