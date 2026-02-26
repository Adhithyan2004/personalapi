
import express from "express";
import { createApplication, updateApplicationStatus } from "../services/application.service";
import { ApplicationStatus } from "@prisma/client";

const router = express.Router();

// Create application
router.post("/", async (req, res) => {
  const { userId, companyName, role, appliedDate } = req.body;

  const application = await createApplication(
    userId,
    companyName,
    role,
    new Date(appliedDate)
  );

  res.json(application);
});

// Update status
router.patch("/:id/status", async (req, res) => {
  const { status, note } = req.body;

  const updated = await updateApplicationStatus(
    req.params.id,
    status as ApplicationStatus,
    note
  );

  res.json(updated);
});

export default router;