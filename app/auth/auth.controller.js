import { hash, verify } from "argon2";
import asyncHandler from "express-async-handler";

import { prisma } from "../prisma.js";
import { UserFields } from "../utils/user.utils.js";

import { generateToken } from "./generate-token.js";

// @desc    Auth user
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      login,
    },
  });
  
  const isValidPassword = await verify(user.password, password);

  if (user && isValidPassword) {
    const token = generateToken(user.id, user.role);
    res.json({ user, token });
  } else {
    res.status(401);
    throw new Error("Email and password are not correct");
  }
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { login, email, password, name } = req.body;

  const isHaveUser = await prisma.user.findUnique({
    where: {
      login,
    },
  });

  if (isHaveUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await prisma.user.create({
    data: {
      login,
      email,
      password: await hash(password),
      name,
      role: "USER",
    },
    select: UserFields,
  });

  const token = generateToken(user.id);

  res.json({ user, token });
});
