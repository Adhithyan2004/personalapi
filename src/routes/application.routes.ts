
import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { applicationController, 
    applicationUpdateController,
    getAllApplicationContoller } from "../controllers/application.controller";



const router = express.Router();


// Create application
router.post("/", authenticate,applicationController);

router.get('/',authenticate, getAllApplicationContoller);

// Update status
router.patch("/:id/status",authenticate, applicationUpdateController);

export default router;