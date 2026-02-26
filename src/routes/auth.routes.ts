import express from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";

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

    const token = await loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // cookies expire after 7 days
    });

    res.json({ message: "Login successful" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.post("/logout",(req,res) =>{
    res.clearCookie("token",{
        httpOnly : true,
        secure:false,
        sameSite:"lax"
    });
    res.json({message:"Logged out successfully"});
});

// sample protected route (for checking purpose will remove 
// later and add actual protected routes)
router.get("/me",authenticate,async(req,res) =>{
    res.json({
        message : "You are authenticated",
        userId:(req as any).userId
    });
});

export default router; 