import { Request } from "express";
import { UserRole } from "../models/User";

export type AuthRequest = Request & {
	user?: {
		id: string;
		nickname: string;
		role: UserRole;
	};
};
