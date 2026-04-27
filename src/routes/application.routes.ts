
import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { applicationController, 
    applicationUpdateStatusController,
    deleteApplicationController,
    getAllApplicationContoller,
    getSingleApplicationContoller } from "../controllers/application.controller";



const router = express.Router();


// Create application
router.post("/", authenticate,applicationController);

// Get all applications
router.get('/',authenticate, getAllApplicationContoller);

// Get specific apllication
router.get('/:id',authenticate,getSingleApplicationContoller);

//Delete a application
//Will autenticate after testing !! 
router.delete('/:id',authenticate,deleteApplicationController);

// Update status
router.patch("/:id/status",authenticate, applicationUpdateStatusController);

export default router;