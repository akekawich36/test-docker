const jwt = require("../utils/jwt.js");
const userService = require("../services/userService.js");

const authenticateValidation = async (req, res, next) => {
  if (req.path.includes("/auth")) {
    next();
  } else {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const refreshToken = req.headers["x-refresh-token"];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verifyAccessToken(token);

    if (!decoded) {
      if (!refreshToken) {
        return res.status(401).json({
          message: "Access token expired and no refresh token provided",
          forceLogout: true,
        });
      }

      const refreshDecoded = jwt.verifyRefreshToken(refreshToken);
      if (!refreshDecoded) {
        return res.status(401).json({
          message: "Refresh token expired",
          forceLogout: true,
        });
      }

      const user = await userService.findUserByRefreshToken(refreshToken);
      if (!user) {
        return res.status(401).json({
          message: "Invalid refresh token",
          forceLogout: true,
        });
      }

      const newAccessToken = jwt.generateAccessToken(user.id);
      const newRefreshToken = jwt.generateRefreshToken(user.id);

      await userService.updateRefreshToken(user.id, newRefreshToken);

      res.set({
        "x-new-access-token": newAccessToken,
        "x-new-refresh-token": newRefreshToken,
      });

      req.user = { id: user.id };
      return next();
    }

    req.user = decoded;
    next();
  }
};

module.exports = authenticateValidation;
