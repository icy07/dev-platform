import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";
import { AuthRequest } from "../types/AuthRequest";

type jwtUser = {
	id: string;
	nickname: string;
	role: UserRole;
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token;
		if (!token) return res.status(401).json({ message: "Нет доступа" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtUser;
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Невалидный токен" });
	}
};
