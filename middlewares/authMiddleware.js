const jwt = require('jsonwebtoken');
const {SECRET} = require('./../config/config');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({message: 'No authorisation header'});
  }

  // Bearer token
  const [, jwtToken] = authHeader.split(' ');

  try {
    req.user = jwt.verify(jwtToken, SECRET);
    next();
  } catch (err) {
    return res.status(401).json({message: 'Invalid jwt token'});
  }
};
