import express from "express";
import { requireAuth } from "../middleware/authMiddleware";
import {
	addPortfolio,
	deletePortfolio,
	editPortfolio,
	getUserProfile,
	updateUserProfile,
} from "../controllers/usersController";

const router = express.Router();

router.get("/users/:id", requireAuth, getUserProfile);
router.put("/users/:id", requireAuth, updateUserProfile);
router.post("/users/:id/portfolio", requireAuth, addPortfolio);
router.put("/users/:id/portfolio/:projectId", requireAuth, editPortfolio);
router.delete("/users/:id/portfolio/:projectId", requireAuth, deletePortfolio);

export default router;
