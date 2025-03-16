import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from "./config/db.js";
import { requireAuth } from "@clerk/express";
import userRoutes from "./routes/userRoutes.js";
import ideaRoutes from "./routes/ideas.js";
import projectRoutes from './routes/projects.js'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

connectDB();

app.use("/api/users", requireAuth(), userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
