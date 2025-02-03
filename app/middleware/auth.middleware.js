import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { prisma } from "../prisma.js";
import { UserFields } from "../utils/user.utils.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userFound = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: UserFields,
    });

    if (userFound) {
      req.user = userFound;
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, I do not have a token");
  }
});

export const adminProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userFound = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: UserFields,
      });

      if (!userFound) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }

      if (userFound.role !== "ADMIN") {
        res.status(403);
        throw new Error("Access denied, admin only");
      }

      req.user = userFound;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, I do not have a token");
  }
});

// export const protect = asyncHandler(async (req, res, next) => { let token = 1; if (token != 1) {res.status(401)}})
