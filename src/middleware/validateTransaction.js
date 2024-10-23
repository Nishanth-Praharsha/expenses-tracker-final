const Joi = require("joi");

// Define the transaction schema
const transactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  amount: Joi.number().greater(0).required(),
  date: Joi.date().iso().required(),
  description: Joi.string().optional(),
});

// Middleware for validating transaction input
const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateTransaction;