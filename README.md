# Arecanut Auction Platform

A comprehensive e-auction system for farmers and traders to simulate the APMC (Agricultural Produce Market Committee) bidding process. This project uses the **MERN Stack** (MongoDB, Express, React, Node.js).

## 🚀 Key Features

*   **Farmer Portal**: List arecanut lots, view bids, and track sales.
*   **Trader Portal**: Browse auctions, place bids, and view purchase history.
*   **Admin Dashboard**: Approve users, monitor auctions, and view platform stats.
*   **Real-time Updates**: Live bidding status and auction timers.

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Auth**: JWT (JSON Web Tokens)

## 📂 Project Structure

*   `client/`: Frontend React application.
*   `server/`: Backend API and database logic.

## 🏁 How to Start

### Prerequisites
*   Node.js installed.
*   MongoDB installed or a MongoDB Atlas connection string.

## 🛠️ Setting Up on a New Machine
If you clone this project to a new computer, the database will be empty. Follow these steps to set up the **Super Admin** account:

1.  **Install Dependencies**:
    ```bash
    cd server && npm install
    cd client && npm install
    ```
2.  **Start MongoDB**: Ensure your MongoDB service is running.
3.  **Create Admin User**:
    Run this script once to generate the Super Admin account:
    ```bash
    node server/create_admin.js
    ```
    *   **Email**: `admin@arecanut.com`
    *   **Password**: `adminpassword123`

## 🚀 Running the Project
1.  **Backend**: `cd server && npm run dev`
2.  **Frontend**: `cd client && npm run dev`

### 1. Setup Backend
```bash
cd server
npm install
# Create a .env file with PORT and MONGO_URI
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

The application will be running at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).
