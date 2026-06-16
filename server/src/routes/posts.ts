import express from "express";
import {
	createPost,
	deletePost,
	editPost,
	getPosts,
	likePost,
	unlikePost,
} from "../controllers/postController";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", requireAuth, createPost);
router.put("/posts/:id", requireAuth, editPost);
router.delete("/posts/:id", requireAuth, deletePost);
router.post("/posts/:id/like", requireAuth, likePost);
router.delete("/posts/:id/like", requireAuth, unlikePost);

export default router;
