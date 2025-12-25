# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 📝 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new farmer or trader.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "farmer",
  "phone": "+91-1234567890",
  "farmLocation": "Karnataka, India",
  "apmcLicense": ""
}
```

**Fields:**
- `name` (string, required): Full name
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 6 characters
- `role` (string, required): Either "farmer" or "trader"
- `phone` (string, optional): Contact number
- `farmLocation` (string, optional): Required if role is "farmer"
- `apmcLicense` (string, optional): Required if role is "trader"

**Response:**
```json
{
  "message": "Registration successful. Please wait for Admin approval."
}
```

**Status Codes:**
- `201`: Registration successful
- `400`: User already exists
- `500`: Server error

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Invalid credentials
- `403`: Account pending approval
- `500`: Server error

---

## 🌾 Farmer Endpoints

All farmer endpoints require authentication and farmer role.

### 1. Create Auction

**POST** `/farmer/create-auction`

Create a new auction listing.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "variety": "Rashi",
  "quantity": 100,
  "qualityGrade": "A",
  "basePrice": 25000,
  "location": "Mangalore APMC",
  "endTime": "2025-12-31T23:59:59Z",
  "image": "https://example.com/image.jpg"
}
```

**Fields:**
- `variety` (string, required): Type of arecanut (e.g., Rashi, Idi, Chooru)
- `quantity` (number, required): Quantity in KG
- `qualityGrade` (string, required): Quality grade
- `basePrice` (number, required): Starting price in currency
- `location` (string, required): APMC location
- `endTime` (string, required): ISO 8601 datetime
- `image` (string, optional): Image URL or path

**Response:**
```json
{
  "message": "Auction created successfully",
  "auction": {
    "_id": "507f1f77bcf86cd799439011",
    "farmer": "507f1f77bcf86cd799439012",
    "variety": "Rashi",
    "quantity": 100,
    "qualityGrade": "A",
    "basePrice": 25000,
    "currentHighestBid": 25000,
    "location": "Mangalore APMC",
    "startTime": "2025-12-25T10:00:00Z",
    "endTime": "2025-12-31T23:59:59Z",
    "status": "active",
    "createdAt": "2025-12-25T10:00:00Z"
  }
}
```

**Status Codes:**
- `201`: Auction created
- `401`: Unauthorized
- `500`: Server error

---

### 2. Get My Auctions

**GET** `/farmer/my-auctions`

Retrieve all auctions created by the authenticated farmer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "farmer": "507f1f77bcf86cd799439012",
    "variety": "Rashi",
    "quantity": 100,
    "qualityGrade": "A",
    "basePrice": 25000,
    "currentHighestBid": 27000,
    "location": "Mangalore APMC",
    "status": "active",
    "createdAt": "2025-12-25T10:00:00Z",
    "endTime": "2025-12-31T23:59:59Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

## 🏪 Trader Endpoints

All trader endpoints require authentication and trader role.

### 1. Browse Auctions

**GET** `/trader/auctions`

Browse all active auctions with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `location` (string, optional): Filter by location (case-insensitive)
- `variety` (string, optional): Filter by variety (case-insensitive)
- `minPrice` (number, optional): Minimum base price
- `maxPrice` (number, optional): Maximum base price

**Example:**
```
GET /trader/auctions?location=Mangalore&minPrice=20000&maxPrice=30000
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "farmer": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "farmLocation": "Karnataka, India"
    },
    "variety": "Rashi",
    "quantity": 100,
    "qualityGrade": "A",
    "basePrice": 25000,
    "currentHighestBid": 27000,
    "location": "Mangalore APMC",
    "status": "active",
    "endTime": "2025-12-31T23:59:59Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

### 2. Get Auction Details

**GET** `/trader/auction/:id`

Get detailed information about a specific auction including bid history.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (string, required): Auction ID

**Response:**
```json
{
  "auction": {
    "_id": "507f1f77bcf86cd799439011",
    "farmer": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe"
    },
    "variety": "Rashi",
    "quantity": 100,
    "qualityGrade": "A",
    "basePrice": 25000,
    "currentHighestBid": 27000,
    "location": "Mangalore APMC",
    "status": "active",
    "endTime": "2025-12-31T23:59:59Z"
  },
  "bids": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "trader": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Jane Smith"
      },
      "amount": 27000,
      "time": "2025-12-25T11:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "trader": {
        "_id": "507f1f77bcf86cd799439016",
        "name": "Bob Johnson"
      },
      "amount": 26000,
      "time": "2025-12-25T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Auction not found
- `500`: Server error

---

### 3. Place Bid

**POST** `/trader/bid`

Place a bid on an active auction.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "auctionId": "507f1f77bcf86cd799439011",
  "amount": 28000
}
```

**Fields:**
- `auctionId` (string, required): ID of the auction
- `amount` (number, required): Bid amount (must be higher than current highest bid)

**Response:**
```json
{
  "message": "Bid placed successfully",
  "bid": {
    "_id": "507f1f77bcf86cd799439017",
    "auction": "507f1f77bcf86cd799439011",
    "trader": "507f1f77bcf86cd799439014",
    "amount": 28000,
    "time": "2025-12-25T12:00:00Z"
  }
}
```

**Status Codes:**
- `201`: Bid placed successfully
- `400`: Invalid bid (auction not active, ended, or amount too low)
- `401`: Unauthorized
- `404`: Auction not found
- `500`: Server error

**Validation Rules:**
- Bid amount must be higher than current highest bid
- Bid amount must be higher than base price
- Auction must be active
- Auction must not have ended

---

### 4. Get My Bids

**GET** `/trader/my-bids`

Retrieve all bids placed by the authenticated trader.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "auction": {
      "_id": "507f1f77bcf86cd799439011",
      "variety": "Rashi",
      "quantity": 100,
      "location": "Mangalore APMC",
      "status": "active"
    },
    "trader": "507f1f77bcf86cd799439014",
    "amount": 28000,
    "time": "2025-12-25T12:00:00Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

## 👨‍💼 Admin Endpoints

All admin endpoints require authentication and admin role.

### 1. Get Pending Users

**GET** `/admin/pending-users`

Retrieve all users awaiting approval.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439018",
    "name": "New Farmer",
    "email": "newfarmer@example.com",
    "role": "farmer",
    "phone": "+91-1234567890",
    "farmLocation": "Kerala, India",
    "isApproved": false,
    "createdAt": "2025-12-25T09:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439019",
    "name": "New Trader",
    "email": "newtrader@example.com",
    "role": "trader",
    "phone": "+91-0987654321",
    "apmcLicense": "APMC-12345",
    "isApproved": false,
    "createdAt": "2025-12-25T09:30:00Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `500`: Server error

---

### 2. Approve User

**PUT** `/admin/approve-user/:id`

Approve a pending user registration.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (string, required): User ID to approve

**Response:**
```json
{
  "message": "User approved successfully"
}
```

**Status Codes:**
- `200`: User approved
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `404`: User not found
- `500`: Server error

---

### 3. Reject User

**DELETE** `/admin/reject-user/:id`

Reject and remove a pending user registration.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (string, required): User ID to reject

**Response:**
```json
{
  "message": "User rejected and removed"
}
```

**Status Codes:**
- `200`: User rejected
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `500`: Server error

---

## 🔐 Authentication & Authorization

### JWT Token Structure

The JWT token contains the following payload:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "farmer",
  "iat": 1703505600,
  "exp": 1703592000
}
```

**Token Expiration:** 24 hours (1 day)

### Role-Based Access Control

| Endpoint | Admin | Farmer | Trader |
|----------|-------|--------|--------|
| POST /auth/register | ✓ | ✓ | ✓ |
| POST /auth/login | ✓ | ✓ | ✓ |
| POST /farmer/create-auction | ✗ | ✓ | ✗ |
| GET /farmer/my-auctions | ✗ | ✓ | ✗ |
| GET /trader/auctions | ✗ | ✗ | ✓ |
| GET /trader/auction/:id | ✗ | ✗ | ✓ |
| POST /trader/bid | ✗ | ✗ | ✓ |
| GET /trader/my-bids | ✗ | ✗ | ✓ |
| GET /admin/pending-users | ✓ | ✗ | ✗ |
| PUT /admin/approve-user/:id | ✓ | ✗ | ✗ |
| DELETE /admin/reject-user/:id | ✓ | ✗ | ✗ |

---

## ❌ Error Responses

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server-side error

### Example Error Responses

**Unauthorized (401):**
```json
{
  "message": "No token, authorization denied"
}
```

**Invalid Token (401):**
```json
{
  "message": "Token is not valid"
}
```

**Account Pending (403):**
```json
{
  "message": "Account pending approval"
}
```

**Invalid Bid (400):**
```json
{
  "message": "Bid must be higher than current highest bid and base price"
}
```

---

## 📊 Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['farmer', 'trader', 'admin']),
  phone: String,
  farmLocation: String,      // For farmers
  apmcLicense: String,        // For traders
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Auction Schema
```javascript
{
  _id: ObjectId,
  farmer: ObjectId (ref: User),
  variety: String,
  quantity: Number,
  qualityGrade: String,
  basePrice: Number,
  currentHighestBid: Number,
  location: String,
  image: String,
  startTime: Date,
  endTime: Date,
  status: String (enum: ['active', 'closed', 'completed']),
  createdAt: Date,
  updatedAt: Date
}
```

### Bid Schema
```javascript
{
  _id: ObjectId,
  auction: ObjectId (ref: Auction),
  trader: ObjectId (ref: User),
  amount: Number,
  time: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Schema
```javascript
{
  _id: ObjectId,
  auction: ObjectId (ref: Auction),
  farmer: ObjectId (ref: User),
  trader: ObjectId (ref: User),
  finalAmount: Number,
  paymentStatus: String (enum: ['pending', 'paid']),
  transactionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing with cURL

### Register a Farmer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farmer",
    "email": "farmer@test.com",
    "password": "password123",
    "role": "farmer",
    "phone": "+91-1234567890",
    "farmLocation": "Karnataka, India"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arecanut.com",
    "password": "adminpassword123"
  }'
```

### Create Auction
```bash
curl -X POST http://localhost:5000/api/farmer/create-auction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "variety": "Rashi",
    "quantity": 100,
    "qualityGrade": "A",
    "basePrice": 25000,
    "location": "Mangalore APMC",
    "endTime": "2025-12-31T23:59:59Z"
  }'
```

### Place Bid
```bash
curl -X POST http://localhost:5000/api/trader/bid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "auctionId": "507f1f77bcf86cd799439011",
    "amount": 28000
  }'
```

---

## 📝 Notes

1. **Token Storage:** Store JWT tokens securely (localStorage or httpOnly cookies)
2. **Token Refresh:** Tokens expire after 24 hours; users must login again
3. **Date Format:** All dates should be in ISO 8601 format
4. **Currency:** All prices are assumed to be in the same currency unit
5. **Auction Status:** Auction status is not automatically updated; implement a cron job or scheduler for production
6. **Real-time Updates:** Consider implementing WebSocket for real-time bid updates in production

---

## 🔄 Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware to prevent abuse.

---

## 📞 Support

For API-related issues or questions, refer to the main [README.md](../README.md) or contact the development team.
