import express from "express";
import { isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAllIdeas,
  getAllProjects,
  createEvent,
} from "../controllers/adminController.js";

const router = express.Router();

// Routes
router.get("/users", isAdmin, getAllUsers);
router.get("/ideas", isAdmin, getAllIdeas);
router.get("/projects", isAdmin, getAllProjects);
// router.post("/create-event", isAdmin, createEvent);

export default router;
