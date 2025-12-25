# Known Issues and Limitations

## 📋 Current Known Issues

This document tracks known issues, limitations, and planned improvements for the Arecanut Auction Platform.

---

## 🔴 Critical Issues

### 1. No Automatic Auction Status Updates
**Issue:** Auctions remain in "active" status even after endTime has passed.

**Impact:** 
- Traders can still place bids on expired auctions
- Farmers see incorrect auction status
- Manual status updates required

**Workaround:**
- Manually check auction end times
- Implement client-side validation before bidding

**Planned Fix:** 
- Implement scheduled job (cron) to auto-close expired auctions
- Add backend validation in bid endpoint
- Priority: High

### 2. No Transaction Creation Logic
**Issue:** Transaction model exists but no controller/route to create transactions.

**Impact:**
- Winning bids don't automatically create transactions
- No payment tracking
- Manual transaction creation required

**Workaround:**
- Admin manually creates transaction records in database

**Planned Fix:**
- Create transaction automatically when auction closes
- Implement auction close handler
- Add payment integration
- Priority: High

### 3. Hardcoded API URL
**Issue:** Frontend has hardcoded `http://localhost:5000` in AuthContext.

**Impact:**
- Deployment issues
- Can't easily change API URL
- Environment-specific configs not supported

**Workaround:**
- Manually edit AuthContext.jsx for different environments

**Planned Fix:**
- Use environment variables (VITE_API_URL)
- Create API configuration file
- Priority: Medium

---

## 🟡 Medium Priority Issues

### 4. No Real-time Bid Updates
**Issue:** Traders must manually refresh to see new bids.

**Impact:**
- Poor user experience
- Delayed bid information
- Risk of overbidding
- Missing competitive bidding experience

**Workaround:**
- Manual page refresh
- Set auto-refresh intervals

**Planned Fix:**
- Implement WebSocket for real-time updates
- Use Socket.io for live bidding
- Priority: Medium

### 5. Missing Input Validation
**Issue:** Limited validation on both frontend and backend.

**Examples:**
- No email format validation
- No password strength requirements
- No phone number format checking
- No price range validation
- No file size/type validation for images

**Impact:**
- Security vulnerabilities
- Data quality issues
- Potential crashes

**Workaround:**
- Manual data verification by users

**Planned Fix:**
- Add comprehensive validation middleware
- Implement joi or express-validator
- Add frontend form validation
- Priority: Medium

### 6. No Rate Limiting
**Issue:** API endpoints have no rate limiting.

**Impact:**
- Vulnerable to DDoS attacks
- Potential abuse through rapid requests
- Server overload possible

**Workaround:**
- Monitor server manually
- Firewall rules

**Planned Fix:**
- Implement express-rate-limit
- Add per-user rate limits
- Priority: Medium

### 7. No Password Reset Functionality
**Issue:** Users can't reset forgotten passwords.

**Impact:**
- Locked out users
- Admin intervention required
- Poor user experience

**Workaround:**
- Contact admin for password reset
- Admin manually updates password in database

**Planned Fix:**
- Implement password reset via email
- Add nodemailer integration
- Create reset token system
- Priority: Medium

### 8. Missing Error Boundaries (Frontend)
**Issue:** No React error boundaries to catch errors.

**Impact:**
- White screen on errors
- Poor error messages
- App crashes completely

**Workaround:**
- Refresh page when errors occur

**Planned Fix:**
- Add Error Boundary components
- Implement graceful error handling
- Add error reporting
- Priority: Medium

---

## 🟢 Low Priority Issues

### 9. No Logging System
**Issue:** No structured logging for debugging.

**Impact:**
- Difficult debugging
- Can't track issues in production
- No audit trail

**Workaround:**
- Use console.log statements
- Check directly in database

**Planned Fix:**
- Implement winston or pino logger
- Log to files and external services
- Priority: Low

### 10. No Image Upload to Server
**Issue:** Images are only stored as URLs/paths, no actual upload handling.

**Impact:**
- External image hosting required
- Broken image links possible
- No image validation

**Workaround:**
- Use external image hosting (Imgur, Cloudinary)
- Provide image URLs

**Planned Fix:**
- Implement multer file upload
- Add image storage (local or cloud)
- Integrate with Cloudinary or AWS S3
- Priority: Low

### 11. No Search Functionality
**Issue:** Can't search auctions by keywords.

**Impact:**
- Must browse all auctions
- Time-consuming to find specific products
- Poor user experience for large catalogs

**Workaround:**
- Use browser find (Ctrl+F)
- Manual browsing

**Planned Fix:**
- Add search bar
- Implement text search in MongoDB
- Add search filters
- Priority: Low

### 12. No Pagination
**Issue:** All auctions/bids loaded at once.

**Impact:**
- Slow page loads with many items
- High memory usage
- Poor performance

**Workaround:**
- Works fine for small datasets

**Planned Fix:**
- Implement pagination on backend
- Add infinite scroll or page numbers
- Priority: Low

### 13. No Email Notifications
**Issue:** Users don't receive email notifications.

**Missing Notifications:**
- Account approval
- New bid on your auction
- You've been outbid
- Auction ending soon
- Auction won

**Impact:**
- Users miss important updates
- Must constantly check platform

**Workaround:**
- Regular manual checking

**Planned Fix:**
- Implement nodemailer
- Create email templates
- Add notification preferences
- Priority: Low

### 14. No User Profiles
**Issue:** Can't view or edit user profiles after registration.

**Impact:**
- Can't update contact information
- Can't change password
- No profile pictures
- Limited user information

**Workaround:**
- Contact admin for updates
- Manual database edits

**Planned Fix:**
- Create profile page
- Add edit profile functionality
- Add change password feature
- Priority: Low

### 15. No Auction Edit/Delete
**Issue:** Farmers can't edit or delete auctions after creation.

**Impact:**
- Typos can't be fixed
- Wrong auctions can't be removed
- Must contact admin

**Workaround:**
- Double-check before creating
- Admin intervention

**Planned Fix:**
- Add edit auction feature (before first bid)
- Add delete auction (before first bid)
- Add cancel auction feature
- Priority: Low

---

## 🛡️ Security Concerns

### 16. JWT Secret in .env Not Documented
**Issue:** .env.example file doesn't exist.

**Impact:**
- Users may use weak secrets
- Security best practices not followed

**Planned Fix:**
- Create .env.example
- Document required variables
- Add secret generation instructions
- Priority: High

### 17. No HTTPS in Production Guide
**Issue:** No SSL/TLS configuration documented.

**Impact:**
- Insecure data transmission
- Vulnerable to man-in-the-middle attacks

**Planned Fix:**
- Add HTTPS setup guide
- Document SSL certificate installation
- Add nginx/Apache config examples
- Priority: High

### 18. Admin Password Not Changed
**Issue:** Default admin password is weak and well-known.

**Impact:**
- Security vulnerability
- Unauthorized admin access possible

**Workaround:**
- Manually change in database after creation

**Planned Fix:**
- Force password change on first login
- Add password strength requirements
- Priority: High

### 19. No CORS Configuration for Production
**Issue:** CORS allows all origins in current setup.

**Impact:**
- Security risk
- Vulnerable to CSRF attacks

**Workaround:**
- Manually configure in server/index.js

**Planned Fix:**
- Add environment-specific CORS settings
- Whitelist specific origins
- Priority: Medium

---

## 🚧 Performance Issues

### 20. No Database Indexing
**Issue:** Database queries may be slow without proper indexes.

**Impact:**
- Slow search and filter operations
- Poor performance with large datasets

**Planned Fix:**
- Add indexes on frequently queried fields
- Email, auction dates, status fields
- Priority: Low

### 21. No Caching
**Issue:** No caching mechanism for frequent queries.

**Impact:**
- Repeated database queries
- Slower response times

**Planned Fix:**
- Implement Redis caching
- Cache auction listings
- Cache user data
- Priority: Low

---

## 🎨 UI/UX Issues

### 22. No Loading States
**Issue:** No loading indicators during API calls.

**Impact:**
- Users don't know if action is processing
- Duplicate submissions possible
- Poor user experience

**Workaround:**
- Wait patiently

**Planned Fix:**
- Add loading spinners
- Disable buttons during processing
- Add skeleton screens
- Priority: Low

### 23. Limited Mobile Responsiveness
**Issue:** Some components may not be fully mobile-optimized.

**Impact:**
- Poor mobile experience
- Layout issues on small screens

**Planned Fix:**
- Full responsive design audit
- Mobile-first approach
- Priority: Low

### 24. No Dark Mode
**Issue:** Only light theme available.

**Impact:**
- Eye strain in low light
- No user preference options

**Planned Fix:**
- Implement dark mode
- Add theme switcher
- Save user preference
- Priority: Very Low

---

## 📊 Data Issues

### 25. No Data Validation on Schema Level
**Issue:** Mongoose schemas lack detailed validation.

**Impact:**
- Invalid data may be stored
- Data integrity issues

**Planned Fix:**
- Add custom validators
- Add min/max constraints
- Add enum validations
- Priority: Medium

### 26. No Soft Delete
**Issue:** Rejected users are permanently deleted.

**Impact:**
- Can't recover accidentally rejected users
- No audit trail of deletions

**Planned Fix:**
- Implement soft delete
- Add isDeleted flag
- Keep records for audit
- Priority: Low

---

## 🧪 Testing Issues

### 27. No Tests Written
**Issue:** Zero test coverage.

**Impact:**
- No confidence in code changes
- Regressions not caught
- Difficult refactoring

**Planned Fix:**
- Write unit tests (Jest)
- Write integration tests (Supertest)
- Add E2E tests (Cypress/Playwright)
- Priority: Medium

### 28. No API Documentation Tool
**Issue:** Only markdown documentation exists.

**Impact:**
- No interactive API testing
- Hard to explore API

**Planned Fix:**
- Add Swagger/OpenAPI
- Interactive API documentation
- Priority: Low

---

## 📦 Deployment Issues

### 29. No Deployment Guide
**Issue:** No production deployment instructions.

**Impact:**
- Difficult to deploy
- Configuration errors likely

**Planned Fix:**
- Create deployment guide
- Add Docker support
- Document cloud deployment (AWS, Azure, Heroku)
- Priority: Medium

### 30. No Environment Variables Validation
**Issue:** Missing environment variables cause cryptic errors.

**Impact:**
- Hard to debug startup issues
- App may partially work

**Planned Fix:**
- Validate env vars on startup
- Clear error messages
- Use dotenv-safe
- Priority: Low

---

## 📈 Feature Requests

### Not Yet Implemented Features

1. **Auction Extensions:** Extend auction time if bid placed near end
2. **Bidding Limits:** Set maximum auto-bid amount
3. **Auction Categories:** Categorize different types of products
4. **Ratings & Reviews:** Rate farmers and traders
5. **Favorite Auctions:** Save auctions for later
6. **Bid History Export:** Download bid history as CSV
7. **Payment Integration:** Actual payment processing
8. **SMS Notifications:** Send SMS for critical updates
9. **Multi-language Support:** Support local languages
10. **Analytics Dashboard:** Detailed charts and graphs
11. **Auction Templates:** Save and reuse auction details
12. **Bulk Auction Creation:** Create multiple auctions at once
13. **API for Third-party Integration:** Public API access
14. **Mobile Apps:** iOS and Android native apps

---

## 🔄 Workarounds Summary

| Issue | Temporary Solution |
|-------|-------------------|
| Expired auctions still active | Manually check end times |
| No transactions created | Admin creates manually |
| No real-time updates | Refresh page regularly |
| No password reset | Contact admin |
| Hardcoded API URL | Edit code for deployment |
| No email notifications | Check platform frequently |
| Can't edit auctions | Be careful when creating |

---

## 📝 Reporting New Issues

If you discover new issues:

1. **Check this document first** - Issue may be known
2. **Document the issue:**
   - What happened?
   - What did you expect?
   - Steps to reproduce
   - Screenshots if applicable
3. **Include environment details:**
   - Browser version
   - Operating system
   - Node.js version
4. **Contact the development team**

---

## 🎯 Priority Definitions

- **Critical:** Breaks core functionality, must fix immediately
- **High:** Important issues affecting many users
- **Medium:** Noticeable issues with workarounds
- **Low:** Minor issues or nice-to-have improvements
- **Very Low:** Cosmetic or rarely-used features

---

## 📅 Roadmap

### Version 2.0 (Planned)
- Real-time bidding with WebSocket
- Automatic transaction creation
- Email notifications
- Password reset functionality
- Comprehensive validation
- Rate limiting

### Version 2.1 (Future)
- Payment integration
- Image upload to server
- Search and pagination
- User profiles
- Auction edit/delete
- Tests coverage

### Version 3.0 (Future)
- Mobile apps
- Advanced analytics
- Multi-language support
- Third-party API
- Enhanced security features

---

*Last Updated: December 25, 2025*

**Note:** This is a living document. Issues will be updated as they are discovered, fixed, or deprioritized.
