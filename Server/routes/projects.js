import express from "express";
import Idea from "../models/ideaSubmission.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Idea.find({ approved: true });
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Idea.findOne({ _id: id, approved: true });
    if (project) {
      res.json({ success: true, project });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
