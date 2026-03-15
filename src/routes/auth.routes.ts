import express from "express";
import { registerUser, loginUser,refreshAccessToken } from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";
import {prisma} from "../lib/prisma";

const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      } 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginUser(email, password);

// setting both access and refresh token in cookies (safer instead of localstorage)
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 60 * 1000 // 15 mins
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

res.json({ message: "Login successful" });

  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});


router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null }
    });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
});

// sample protected route (for checking purpose will remove 
// later and add actual protected routes)
router.get("/me",authenticate,async(req,res) =>{
    res.json({
        message : "You are authenticated",
        userId:(req as any).userId
    });
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const newAccessToken = await refreshAccessToken(refreshToken);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: "Access token refreshed" });

  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
});

export default router; 