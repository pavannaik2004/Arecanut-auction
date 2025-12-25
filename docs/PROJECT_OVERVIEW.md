# Arecanut Auction Platform - Project Overview

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [User Roles](#user-roles)

## 🎯 Introduction

The Arecanut Auction Platform is a comprehensive e-auction system designed to digitize and streamline the traditional APMC (Agricultural Produce Market Committee) bidding process for arecanut (betel nut) trading. The platform connects farmers directly with traders through a secure, transparent online auction system.

### Problem Statement
Traditional arecanut trading through APMC markets involves:
- Physical presence requirements
- Limited market reach
- Time-consuming manual bidding
- Lack of transparency in pricing
- Delayed payments and settlements

### Solution
Our platform provides:
- Digital auction system accessible from anywhere
- Real-time bidding capabilities
- Transparent price discovery
- Admin oversight for fair trading
- Secure authentication and authorization

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Farmer  │  │  Trader  │  │  Admin   │             │
│  │Dashboard │  │Dashboard │  │Dashboard │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│          React Router + Context API + Axios            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTP/REST API
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Server (Node.js + Express)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Authentication Middleware              │   │
│  │              (JWT Verification)                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Auth   │  │  Farmer  │  │  Trader  │  ┌──────┐  │
│  │  Routes  │  │  Routes  │  │  Routes  │  │Admin │  │
│  └──────────┘  └──────────┘  └──────────┘  │Routes│  │
│                                             └──────┘  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Auth   │  │  Farmer  │  │  Trader  │  ┌──────┐  │
│  │Controller│  │Controller│  │Controller│  │Admin │  │
│  └──────────┘  └──────────┘  └──────────┘  │Ctrl  │  │
│                                             └──────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Mongoose ODM
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    MongoDB Database                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Users   │  │ Auctions │  │   Bids   │             │
│  │Collection│  │Collection│  │Collection│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  ┌──────────────────────┐                              │
│  │    Transactions      │                              │
│  │     Collection       │                              │
│  └──────────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Styling:** Tailwind CSS 4.1.18
- **Animations:** Framer Motion 12.23.26
- **Icons:** Lucide React 0.562.0

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB
- **ODM:** Mongoose 9.0.2
- **Authentication:** JSON Web Tokens (JWT) 9.0.3
- **Password Hashing:** bcryptjs 3.0.3
- **File Upload:** Multer 2.0.2
- **CORS:** cors 2.8.5
- **Environment Variables:** dotenv 17.2.3

### Development Tools
- **Backend Dev Server:** Nodemon 3.1.11
- **Code Quality:** ESLint
- **CSS Processing:** PostCSS, Autoprefixer

## ✨ Features

### For Farmers
1. **User Registration & Profile**
   - Register with farm details
   - Wait for admin approval
   - Manage profile information

2. **Auction Management**
   - Create new auctions with:
     - Variety (Rashi, Idi, Chooru)
     - Quantity (in KG)
     - Quality grade
     - Base price
     - Location (APMC)
     - End time
     - Product images
   - View all my auctions
   - Track bid history
   - View auction status

3. **Dashboard Features**
   - Active auctions overview
   - Bid tracking
   - Sales history
   - Revenue analytics

### For Traders
1. **User Registration**
   - Register with APMC license
   - Wait for admin approval
   - Manage profile

2. **Auction Browsing**
   - Browse active auctions
   - Filter by:
     - Location
     - Variety
     - Price range
   - View detailed auction information

3. **Bidding System**
   - Place competitive bids
   - Real-time bid updates
   - Bid validation (must exceed current highest)
   - View bidding history

4. **Dashboard Features**
   - Active bids tracking
   - Purchase history
   - Winning auctions
   - Spending analytics

### For Admins
1. **User Management**
   - View pending registrations
   - Approve/reject farmers
   - Approve/reject traders
   - Manage user accounts

2. **Auction Oversight**
   - Monitor all auctions
   - View auction statistics
   - Ensure fair trading

3. **Platform Analytics**
   - Total users statistics
   - Active auctions count
   - Transaction volumes
   - Platform revenue

## 👥 User Roles

### 1. Farmer
- **Primary Goal:** Sell arecanut produce at best prices
- **Capabilities:**
  - Create and manage auctions
  - View bids on their products
  - Track sales performance
- **Access:** After admin approval

### 2. Trader
- **Primary Goal:** Purchase quality arecanut at competitive prices
- **Capabilities:**
  - Browse available auctions
  - Place competitive bids
  - Track purchase history
- **Access:** After admin approval

### 3. Admin
- **Primary Goal:** Ensure fair and transparent trading
- **Capabilities:**
  - Approve/reject user registrations
  - Monitor all platform activities
  - View analytics and reports
  - Manage platform integrity
- **Access:** Pre-configured super admin account

## 🔒 Security Features

1. **Authentication:**
   - JWT-based authentication
   - Secure password hashing with bcrypt
   - Token expiration (24 hours)

2. **Authorization:**
   - Role-based access control
   - Protected routes on frontend
   - Middleware verification on backend

3. **Data Protection:**
   - Admin approval requirement
   - User-specific data isolation
   - Secure API endpoints

## 📊 Database Schema

### Users Collection
- Personal information
- Role-specific data (farm location, APMC license)
- Approval status
- Timestamps

### Auctions Collection
- Farmer reference
- Product details
- Pricing information
- Time constraints
- Status tracking

### Bids Collection
- Auction reference
- Trader reference
- Bid amount
- Timestamp

### Transactions Collection
- Auction reference
- Farmer and trader references
- Final amount
- Payment status
- Transaction date

## 🚀 Getting Started

Refer to [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

## 📝 Additional Documentation

- [Installation Guide](./INSTALLATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [User Guide](./USER_GUIDE.md)
- [Known Issues](./KNOWN_ISSUES.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 📞 Support

For issues or questions, please refer to the documentation or contact the development team.
