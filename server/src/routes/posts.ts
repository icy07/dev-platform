import express from "express";
import { createPost, deletePost, editPost, getPosts } from "../controllers/postController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", requireAuth, createPost);
router.put("/posts/:id", requireAuth, editPost);
router.delete("/posts/:id", requireAuth, deletePost);

export default router;
