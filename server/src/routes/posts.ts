import express from "express";
import { createPost, getPosts } from "../controllers/postController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", requireAuth, createPost);

export default router;
