import jwt from "jsonwebtoken";

export const generateToken = (userId, role) =>
  jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
