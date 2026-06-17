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
import upload from "../middleware/upload";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", requireAuth, createPost);
router.put("/posts/:id", requireAuth, editPost);
router.delete("/posts/:id", requireAuth, deletePost);
router.post("/posts/:id/like", requireAuth, likePost);
router.delete("/posts/:id/like", requireAuth, unlikePost);

router.post("/upload", requireAuth, upload.single("image"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "Файл не загружен" });
	}

	const fileUrl = `/uploads/${req.file.filename}`;
	res.json({ url: fileUrl });
});

export default router;
