import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { 
    signupController,
    loginController, 
    logoutContoller, 
    refreshController,
    deleteUserController } from "../controllers/auth.controller";

const router = express.Router();


router.post("/signup", signupController);

router.post("/login", loginController);
 
router.post("/logout", logoutContoller)

router.post("/refresh", refreshController);

router.delete("/:id",deleteUserController);



// sample protected route (for checking purpose will remove 
// later and add actual protected routes)
router.get("/me",authenticate,async(req,res) =>{
    res.json({
        message : "You are authenticated",
        userId:(req as any).userId
    });
});


export default router; 