# User Guide

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Farmer Guide](#farmer-guide)
3. [Trader Guide](#trader-guide)
4. [Admin Guide](#admin-guide)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the Platform

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. You'll see the landing page with options to Login or Register

### User Registration

#### For Farmers:
1. Click **"Register"** button
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Phone Number
   - Select Role: **Farmer**
   - Farm Location
3. Click **"Register"**
4. Wait for admin approval (you'll receive a message)
5. Check back later and try logging in

#### For Traders:
1. Click **"Register"** button
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Phone Number
   - Select Role: **Trader**
   - APMC License Number
3. Click **"Register"**
4. Wait for admin approval
5. Check back later and try logging in

### Login

1. Click **"Login"** button
2. Enter your:
   - Email Address
   - Password
3. Click **"Login"**
4. You'll be redirected to your role-specific dashboard

**Note:** If your account isn't approved yet, you'll see: "Account pending approval"

---

## 🌾 Farmer Guide

### Farmer Dashboard Overview

After logging in as a farmer, you'll see:
- **My Auctions:** List of all your auctions
- **Active Auctions:** Currently running auctions
- **Closed Auctions:** Completed auctions
- **Statistics:** Total auctions, active bids, sales

### Creating a New Auction

1. **Navigate to Create Auction**
   - Click **"Create Auction"** button from dashboard
   - Or use the navigation menu

2. **Fill in Auction Details**
   - **Variety:** Select or enter type (Rashi, Idi, Chooru, etc.)
   - **Quantity:** Enter quantity in kilograms
   - **Quality Grade:** Specify grade (A, B, C, Premium, etc.)
   - **Base Price:** Set starting price (minimum bid)
   - **Location:** Your APMC location
   - **End Date/Time:** When auction should close
   - **Image:** Upload product image (optional)

3. **Review and Submit**
   - Double-check all details
   - Click **"Create Auction"**
   - Your auction will go live immediately

### Managing Your Auctions

#### Viewing Auction Details
1. Go to **"My Auctions"**
2. Click on any auction to see:
   - Current highest bid
   - Number of bids
   - Bid history
   - Time remaining
   - Bidder information

#### Monitoring Bids
- Real-time bid updates appear on auction details
- See all bidders and their bid amounts
- Track highest bidder
- View bid timestamps

#### Auction Status
- **Active:** Auction is live and accepting bids
- **Closed:** Auction time has ended
- **Completed:** Transaction finalized

### Best Practices for Farmers

✅ **Do:**
- Provide accurate product details
- Upload clear product images
- Set competitive base prices
- Set reasonable auction end times (24-72 hours recommended)
- Monitor your auctions regularly
- Respond to queries promptly

❌ **Don't:**
- Set unrealistic base prices
- Provide misleading information
- Create duplicate auctions for same product
- Set very short auction times (less than 4 hours)

---

## 🏪 Trader Guide

### Trader Dashboard Overview

After logging in as a trader, you'll see:
- **Browse Auctions:** All active auctions
- **My Bids:** Your bidding history
- **Won Auctions:** Auctions you've won
- **Statistics:** Total bids, wins, spending

### Browsing Auctions

1. **View All Auctions**
   - Dashboard shows all active auctions
   - Scroll through available listings

2. **Filter Auctions**
   - **By Location:** Select specific APMC location
   - **By Variety:** Filter by type (Rashi, Idi, etc.)
   - **By Price Range:** Set min/max price
   - Click **"Apply Filters"**

3. **Search Auctions**
   - Use search bar to find specific products
   - Search by keywords, location, or variety

### Viewing Auction Details

1. Click on any auction card
2. View comprehensive details:
   - Product variety and quality
   - Quantity available
   - Current highest bid
   - Base price
   - Farmer information
   - Location
   - Time remaining
   - Complete bid history
   - Product images

### Placing a Bid

1. **Select an Auction**
   - Browse and click on desired auction

2. **Review Current Status**
   - Check current highest bid
   - See time remaining
   - Review product details

3. **Enter Your Bid**
   - Your bid must be **higher** than current highest bid
   - Enter your bid amount
   - Click **"Place Bid"**

4. **Confirmation**
   - You'll receive confirmation message
   - Your bid appears in bid history
   - You become the highest bidder

### Bid Validation Rules

❗ Your bid will be rejected if:
- Amount is lower than or equal to current highest bid
- Amount is lower than base price
- Auction has already ended
- Auction is not active

### Managing Your Bids

#### View My Bids
1. Go to **"My Bids"** section
2. See all your bids with:
   - Auction details
   - Your bid amount
   - Current status (winning/outbid)
   - Time of bid

#### Tracking Winning Bids
- Auctions where you're the highest bidder are highlighted
- Receive notifications when outbid (if notifications enabled)
- Monitor time remaining on your winning bids

### Best Practices for Traders

✅ **Do:**
- Research product quality before bidding
- Monitor auctions regularly
- Bid strategically (don't reveal your max early)
- Check farmer ratings/history
- Verify product details
- Bid within your budget

❌ **Don't:**
- Bid on products you can't afford
- Place frivolous bids
- Ignore auction end times
- Bid without verifying details

---

## 👨‍💼 Admin Guide

### Admin Dashboard Overview

As an admin, you have oversight over the entire platform:
- **User Management:** Approve/reject registrations
- **Auction Monitoring:** View all auctions
- **Platform Statistics:** Overall performance metrics
- **User Activity:** Monitor user behavior

### Default Admin Credentials

**Email:** `admin@arecanut.com`  
**Password:** `adminpassword123`

⚠️ **IMPORTANT:** Change the password immediately after first login!

### User Management

#### Viewing Pending Users
1. Navigate to **"Pending Approvals"**
2. You'll see list of users awaiting approval:
   - Name and email
   - Role (Farmer/Trader)
   - Registration date
   - Additional details (farm location/APMC license)

#### Approving Users
1. Review user details carefully
2. Verify information:
   - For Farmers: Check farm location validity
   - For Traders: Verify APMC license format
3. Click **"Approve"** button
4. User will now be able to login

#### Rejecting Users
1. Review suspicious or invalid registrations
2. Click **"Reject"** button
3. User account will be removed from system
4. User can register again with correct information

### Monitoring Auctions

#### View All Auctions
1. Go to **"All Auctions"** section
2. See comprehensive list of:
   - Active auctions
   - Closed auctions
   - Completed auctions

#### Auction Details
- Farmer information
- Bid history
- Current status
- Transaction details
- Bid count and values

### Platform Analytics

View important metrics:
- **Total Users:** Farmers, Traders, admins
- **Total Auctions:** Active and completed
- **Total Bids:** Platform-wide bidding activity
- **Revenue/Transaction Volume:** Financial overview
- **User Activity:** Registration trends
- **Popular Locations:** Most active APMC centers
- **Popular Varieties:** Most traded products

### Admin Best Practices

✅ **Do:**
- Review registrations promptly (within 24 hours)
- Verify user credentials carefully
- Monitor for suspicious activity
- Keep admin credentials secure
- Regularly check platform statistics
- Investigate disputes fairly

❌ **Don't:**
- Approve users without verification
- Share admin credentials
- Ignore user complaints
- Delay approval unnecessarily
- Show favoritism

### Security Guidelines

1. **Change Default Password**
   - Go to profile settings
   - Update to a strong password
   - Use combination of letters, numbers, symbols

2. **Monitor Suspicious Activity**
   - Multiple failed login attempts
   - Unusual bidding patterns
   - Duplicate registrations
   - Fake APMC licenses

3. **Regular Audits**
   - Review user accounts monthly
   - Check auction completion rates
   - Verify transaction accuracy
   - Monitor system logs

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### "Account pending approval"
**Problem:** Can't login after registration  
**Solution:**
- Your account needs admin approval
- Wait for admin to review your registration
- Usually takes 24-48 hours
- Contact admin if urgent

#### "Invalid credentials"
**Problem:** Can't login with email/password  
**Solution:**
- Verify email is correct
- Check password (case-sensitive)
- Ensure account is approved
- Try password reset (if available)
- Re-register if necessary

#### "Bid must be higher than current highest bid"
**Problem:** Can't place bid  
**Solution:**
- Check current highest bid
- Increase your bid amount
- Ensure it's also higher than base price
- Refresh page for latest bid info

#### "Auction has ended"
**Problem:** Can't bid on auction  
**Solution:**
- Check auction end time
- Look for similar active auctions
- Set up alerts for new auctions

#### Page Not Loading
**Problem:** Dashboard or page doesn't load  
**Solution:**
1. Check internet connection
2. Refresh the page (F5 or Ctrl+R)
3. Clear browser cache
4. Try different browser
5. Check if server is running (for local setup)

#### Auction Not Appearing
**Problem:** Created auction doesn't show  
**Solution:**
1. Refresh the page
2. Check "My Auctions" section
3. Verify all required fields were filled
4. Check console for errors
5. Try creating again

#### Can't Upload Image
**Problem:** Image upload fails  
**Solution:**
1. Check file size (max usually 5MB)
2. Use supported formats (JPG, PNG)
3. Try different image
4. Check internet connection
5. Image is optional - skip if issues persist

### Getting Help

If you encounter issues not listed here:

1. **Check Documentation:**
   - [Installation Guide](./INSTALLATION.md)
   - [API Documentation](./API_DOCUMENTATION.md)
   - [Known Issues](./KNOWN_ISSUES.md)

2. **Technical Issues:**
   - Check browser console (F12)
   - Check server logs
   - Verify backend is running

3. **Contact Support:**
   - Email platform admin
   - Report bugs with details
   - Include screenshots if possible

### Tips for Best Experience

1. **Use Modern Browsers:**
   - Chrome (recommended)
   - Firefox
   - Edge
   - Safari

2. **Stable Internet:**
   - Reliable connection for real-time updates
   - Wi-Fi recommended over mobile data

3. **Regular Monitoring:**
   - Check auctions frequently
   - Enable notifications if available
   - Set reminders for auction end times

4. **Account Security:**
   - Use strong passwords
   - Don't share credentials
   - Logout after use on shared devices

---

## 📱 Quick Reference

### Keyboard Shortcuts
- `Ctrl + R` or `F5`: Refresh page
- `F12`: Open developer console
- `Ctrl + Shift + Delete`: Clear cache

### Important Pages
- Dashboard: `/[role]/dashboard`
- Create Auction (Farmer): `/farmer/create-auction`
- Browse Auctions (Trader): `/trader/dashboard`
- Auction Detail: `/trader/auction/[id]`
- Admin Panel: `/admin/dashboard`

### Status Indicators
- 🟢 **Active:** Auction is live
- 🟡 **Ending Soon:** Less than 1 hour remaining
- 🔴 **Closed:** Auction has ended
- ✅ **Completed:** Transaction finalized

---

## 📞 Support Contacts

For assistance:
- **Technical Support:** [Your support email]
- **Admin Contact:** admin@arecanut.com
- **Documentation:** Check docs folder
- **Report Issues:** [GitHub issues or support portal]

---

## 📝 Glossary

- **APMC:** Agricultural Produce Market Committee
- **Base Price:** Minimum starting bid for an auction
- **Bid:** An offer to purchase at a specific price
- **Auction:** Timed sale of agricultural produce
- **Variety:** Type of arecanut (Rashi, Idi, Chooru)
- **Quality Grade:** Quality classification (A, B, C)
- **Trader:** Buyer who bids on auctions
- **Farmer:** Seller who creates auctions
- **JWT:** JSON Web Token for authentication

---

*Last Updated: December 25, 2025*
