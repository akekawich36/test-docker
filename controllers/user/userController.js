const userService = require("../../services/userService");
const prisma = require("../../prisma/client");

const getUser = async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUser,
};
