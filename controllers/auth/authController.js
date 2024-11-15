const userService = require("../../services/userService");
const jwt = require("../../utils/jwt.js");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    await userService.createRefreshToken(user, refreshToken);

    res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error.message)
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.generateAccessToken(user.id);
    const refreshToken = jwt.generateRefreshToken(user.id);

    await userService.createRefreshToken(user.id, refreshToken);

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

const logout = async (req, res) => {
  try {
    await userService.updateRefreshToken(req.user.id, null);
    res.json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
