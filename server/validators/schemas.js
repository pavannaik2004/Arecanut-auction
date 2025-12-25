const Joi = require('joi');

// User Registration Validation
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim(),
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required().min(6).max(128),
  role: Joi.string().required().valid('farmer', 'trader'),
  phone: Joi.string().optional().pattern(/^[+]?[\d\s-()]+$/),
  farmLocation: Joi.string().when('role', {
    is: 'farmer',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).trim(),
  apmcLicense: Joi.string().when('role', {
    is: 'trader',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).trim()
});

// Login Validation
const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

// Auction Creation Validation
const auctionSchema = Joi.object({
  variety: Joi.string().required().min(2).max(50).trim(),
  quantity: Joi.number().required().min(1).max(100000),
  qualityGrade: Joi.string().required().min(1).max(20).trim(),
  basePrice: Joi.number().required().min(1),
  location: Joi.string().required().min(2).max(200).trim(),
  endTime: Joi.date().required().greater('now'),
  image: Joi.string().optional().uri().allow('')
});

// Bid Placement Validation
const bidSchema = Joi.object({
  auctionId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  amount: Joi.number().required().min(1)
});

module.exports = {
  registerSchema,
  loginSchema,
  auctionSchema,
  bidSchema
};
