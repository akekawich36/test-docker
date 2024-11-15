const prisma = require("../prisma/client");

const createUser = async (userData) => {
  return prisma.users.create({
    data: userData,
  });
};

const findUserByEmail = async (email) => {
  const user = await prisma.users.findFirst({
    where: {
      email,
      is_deleted: false,
    },
  });

  return user;
};

const getUserById = async (id) => {
  return prisma.users.findFirst({
    where: {
      id,
      is_deleted: false,
    },
  });
};

const softDeleteUser = async (id) => {
  return prisma.users.update({
    where: { id },
    data: {
      is_deleted: true,
      deleted_date: new Date(),
    },
  });
};

const restoreUser = async (id) => {
  return prisma.users.update({
    where: { id },
    data: {
      is_deleted: false,
      deleted_date: null,
    },
  });
};

const createRefreshToken = async (userId, refreshToken) => {
  return prisma.user_loggedin.create({
    data: {
      userId,
      refreshToken,
    },
  });
};

const updateRefreshToken = async (userId, refreshToken) => {
  return prisma.user_loggedin.delete({
    where: { userId: userId },
  });
};

const findUserByRefreshToken = async (refreshToken) => {
  return prisma.findUserByRefreshToken.findFirst({
    where: {
      refreshToken,
      is_deleted: false,
    },
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  softDeleteUser,
  restoreUser,
  createRefreshToken,
  updateRefreshToken,
  findUserByRefreshToken,
};
