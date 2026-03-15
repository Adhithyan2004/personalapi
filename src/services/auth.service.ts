import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });

  return user;
};


export const refreshAccessToken = async (refreshToken: string) => {

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as { userId: string };

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId }
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  return newAccessToken;
};


export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  // store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { accessToken, refreshToken };
};