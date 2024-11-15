const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: expiresIn || process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: expiresIn || process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
