import express from "express";
import { register, login, checkAuth, logout } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth", checkAuth);
router.post("/logout", logout);

export default router;
