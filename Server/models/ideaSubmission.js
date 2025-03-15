import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    media: [{ type: String, required: true }], // Array for images/videos
    description: { type: String, required: true },
    category: { type: String, required: true },
    starCount: { type: Number, default: 0 },
    techStacks: { type: [String], required: true }, // Array of technologies
    approved: { type: Boolean, default: false },
    userObject: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("Idea", IdeaSchema);
