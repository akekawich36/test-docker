const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const userController = require("../controllers/user/userController")

// Authentication
router.post("/auth/register", authController.register);

// Users
router.get("/auth/user/getUser", userController.getUser);
router.get("/user/getUser", userController.getUser);

// Testing
router.get("/auth/hello", (req, res) => {
    res.send("Hello World!")
})

module.exports = router;
