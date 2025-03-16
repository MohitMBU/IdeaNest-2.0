import express from 'express'
import Idea from '../models/ideaSubmission.js'

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const projects = await Idea.find({ approved: true });
    res.json({ success: true, projects }); // Ensure the response has `success` and `projects`
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router