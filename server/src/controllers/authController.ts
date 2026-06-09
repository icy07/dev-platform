import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, nickname, email, password, role } = req.body;

		const existingUser = await User.findOne({ $or: [{ nickname }, { email }] });
		if (existingUser) {
			const message = existingUser.nickname === nickname ? "логин" : "email";
			return res.status(400).json({ message: `Этот ${message} уже занят` });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			firstName,
			lastName,
			nickname,
			email,
			password: hashedPassword,
			role,
		});

		res.status(201).json({ message: "Пользователь зарегистрирован", userId: user._id });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при регистрации пользователя" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { nickname, password } = req.body;

		const user = await User.findOne({ nickname });
		if (!user) {
			return res.status(401).json({ message: "Неверный логин или пароль" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Неверный логин или пароль" });
		}

		const token = jwt.sign(
			{ id: user._id, nickname: user.nickname, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: "1d" },
		);

		res.cookie("token", token, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			sameSite: "strict",
		});

		res.json({
			id: user._id,
			nickname: user.nickname,
			role: user.role,
			token,
		});
	} catch (error) {
		res.status(500).json({ message: "Ошибка при авторизации пользователя" });
	}
};

export const checkAuth = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.token;
		if (!token) return res.status(401).json({ message: "Нет доступа" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		const user = await User.findById(decoded.id).select("-password");

		if (!user) return res.status(401).json({ message: "Пользователь не найден" });

		res.json({ id: user._id, nickname: user.nickname, role: user.role, token });
	} catch (error) {
		res.status(401).json({ message: "Невалидный токен" });
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("token");
		res.json({ message: "Выход выполнен" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при выходе из аккаунта" });
	}
};
