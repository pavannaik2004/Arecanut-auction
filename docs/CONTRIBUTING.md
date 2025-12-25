# Contributing Guidelines

Thank you for considering contributing to the Arecanut Auction Platform! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Testing](#testing)
9. [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and professional in all interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js (v18.x or higher)
- MongoDB
- Git
- Code editor (VS Code recommended)
- Basic knowledge of MERN stack

### First Time Contributors

If this is your first contribution:
1. Start with issues labeled `good first issue`
2. Read the entire codebase
3. Understand the project structure
4. Set up the development environment

---

## 🛠️ Development Setup

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/arecanut-auction.git
cd arecanut-auction
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/arecanut-auction.git
```

### 4. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 5. Set Up Environment Variables

Create `.env` files as described in [INSTALLATION.md](./INSTALLATION.md).

### 6. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Bug may already be reported
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. **Check existing feature requests**
2. **Create a new issue** with:
   - Clear use case
   - Detailed description
   - Mockups or examples (if applicable)
   - Benefits to users

### Code Contributions

1. **Pick an issue** or create one
2. **Comment on the issue** to claim it
3. **Wait for approval** from maintainers
4. **Create a branch** from main
5. **Make your changes**
6. **Test thoroughly**
7. **Submit a pull request**

---

## 📝 Coding Standards

### JavaScript/React Style Guide

#### General Rules

- Use ES6+ features
- Use meaningful variable names
- Keep functions small and focused
- Comment complex logic
- Remove console.logs before committing

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Classes and components: PascalCase
class UserProfile {}
const LoginForm = () => {}

// Constants: UPPER_SNAKE_CASE
const MAX_BID_AMOUNT = 100000;
const API_BASE_URL = 'http://localhost:5000';

// Private methods: _camelCase (if needed)
function _privateHelper() {}
```

#### File Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 2. Constants
const API_URL = 'http://localhost:5000/api';

// 3. Component
const MyComponent = () => {
  // 3.1. Hooks
  const [state, setState] = useState(null);
  const navigate = useNavigate();
  
  // 3.2. Effects
  useEffect(() => {
    fetchData();
  }, []);
  
  // 3.3. Functions
  const fetchData = async () => {
    // Implementation
  };
  
  // 3.4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

#### React Best Practices

```javascript
// ✅ Good
const UserCard = ({ name, email }) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

// ❌ Avoid
const UserCard = (props) => {
  return (
    <div>
      <h3>{props.name}</h3>
    </div>
  );
};
```

### Backend Style Guide

#### Express Routes

```javascript
// ✅ Good - RESTful and descriptive
router.get('/auctions', getAuctions);
router.post('/auctions', createAuction);
router.get('/auctions/:id', getAuctionById);
router.put('/auctions/:id', updateAuction);
router.delete('/auctions/:id', deleteAuction);

// ❌ Avoid - Unclear endpoints
router.get('/get-all-auctions', getAuctions);
router.post('/new-auction', createAuction);
```

#### Controllers

```javascript
// ✅ Good - Proper error handling
exports.createAuction = async (req, res) => {
  try {
    const { variety, quantity, basePrice } = req.body;
    
    // Validation
    if (!variety || !quantity || !basePrice) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }
    
    // Business logic
    const auction = new Auction({
      farmer: req.user.id,
      variety,
      quantity,
      basePrice
    });
    
    await auction.save();
    
    res.status(201).json({ 
      message: 'Auction created', 
      auction 
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// ❌ Avoid - No error handling
exports.createAuction = async (req, res) => {
  const auction = new Auction(req.body);
  await auction.save();
  res.json(auction);
};
```

#### Models

```javascript
// ✅ Good - Proper validation and methods
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['farmer', 'trader', 'admin'],
    required: true
  }
}, {
  timestamps: true
});

// Instance methods
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// ❌ Avoid - Minimal validation
const userSchema = new mongoose.Schema({
  email: String,
  role: String
});
```

---

## 📋 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(auction): add real-time bid updates using Socket.io"
git commit -m "fix(auth): resolve JWT expiration issue"
git commit -m "docs(api): update authentication endpoints"
git commit -m "refactor(farmer): extract auction creation logic"

# Avoid
git commit -m "fixed bug"
git commit -m "updates"
git commit -m "changes"
```

### Commit Best Practices

✅ **Do:**
- Write clear, descriptive messages
- Use present tense ("add" not "added")
- Keep commits focused on single change
- Reference issue numbers (#123)

❌ **Don't:**
- Commit incomplete features
- Mix multiple unrelated changes
- Use vague messages
- Commit debugging code

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### Creating Pull Request

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub:**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Related Issue
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Automated checks** run first
2. **Maintainer review** - May request changes
3. **Address feedback** - Make requested changes
4. **Approval** - Once approved
5. **Merge** - Maintainer merges PR

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests (when available)
cd server
npm test

# Frontend tests (when available)
cd client
npm test
```

### Writing Tests

```javascript
// Example test structure
describe('Auction Controller', () => {
  describe('createAuction', () => {
    it('should create auction with valid data', async () => {
      // Test implementation
    });
    
    it('should return error with invalid data', async () => {
      // Test implementation
    });
  });
});
```

### Test Coverage

- Aim for 70%+ code coverage
- Test critical paths thoroughly
- Include edge cases
- Test error scenarios

---

## 📚 Documentation

### Code Comments

```javascript
// ✅ Good - Explains why
// Calculate discount for bulk orders (>100kg)
if (quantity > 100) {
  price = price * 0.9;
}

// ❌ Bad - Explains what (code is self-explanatory)
// Set price to price times 0.9
price = price * 0.9;
```

### Documentation Updates

When contributing, update:
- README.md (if needed)
- API documentation
- User guide (for new features)
- Known issues (for bug fixes)
- Code comments

---

## 🎯 Priority Areas

Current priority areas for contributions:

1. **High Priority:**
   - Real-time bidding (WebSocket)
   - Automatic auction closure
   - Transaction creation logic
   - Input validation

2. **Medium Priority:**
   - Password reset functionality
   - Email notifications
   - Rate limiting
   - Error boundaries

3. **Low Priority:**
   - UI/UX improvements
   - Dark mode
   - Search functionality
   - Pagination

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## 📞 Getting Help

Need help?
- Check existing documentation
- Ask in issue comments
- Contact maintainers
- Join community discussions (if available)

---

## ✅ Quick Checklist

Before submitting your contribution:

- [ ] Read these guidelines completely
- [ ] Set up development environment
- [ ] Created feature branch
- [ ] Made changes following style guide
- [ ] Tested changes thoroughly
- [ ] Updated documentation
- [ ] Wrote clear commit messages
- [ ] Pushed to your fork
- [ ] Created pull request with description
- [ ] Responded to review feedback

---

Thank you for contributing to the Arecanut Auction Platform! 🎉

*Last Updated: December 25, 2025*
