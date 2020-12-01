const Joi = require('joi');

// ==================== register validation ====================
const schemaRegister = Joi.object({
  email: Joi.string()
    .min(7)
    .email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ua']}})
    .required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

module.exports.registerValidation = async (req, res, next) => {
  try {
    await schemaRegister.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({message: error.details[0].message});
  }
};

// ==================== register validation ====================
const schemaLogin = Joi.object({
  email: Joi.string()
    .min(7)
    .email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ua']}})
    .required(),
  password: Joi.string().min(6).required(),
});

module.exports.loginValidation = async (req, res, next) => {
  try {
    await schemaLogin.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({message: error.details[0].message});
  }
};
