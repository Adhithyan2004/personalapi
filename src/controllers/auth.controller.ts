import { registerUser,loginUser,refreshAccessToken } from "../services/auth.service";
import { Request,Response } from "express";
import { prisma } from "../lib/prisma";
import { SignupBody,LoginBody } from "../types/auth.types";

export const signupController = async (
  req: Request<{}, {}, SignupBody>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Signup failed",
    });
  }
};

export const loginController = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //attacker cant access cookies via doc.cookies (cheeky)
      secure: false, //  change in production to "true" (https)
      sameSite: "lax", //to tricksters playing wit fake ass websites type shyt
      maxAge: 15 * 60 * 1000, // Shortlived
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //  change in production to true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Longlived
    });

    return res.json({
      message: "Login successful",
    });
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    return res.status(401).json({ message });
  }
};

export const logoutContoller = async(req:Request,res:Response) => {
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
}

export const refreshController = async(req:Request,res:Response) =>{
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
}