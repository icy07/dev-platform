import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../types/AuthRequest";

export const getUserProfile = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).select("-password");
		if (!user) return res.status(404).json({ message: "Пользователь не найден" });

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Ошибка при получении профиля пользователя" });
	}
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id } = req.params;

		if (userId !== id) return res.status(403).json({ message: "Нет прав на редактирование" });

		const user = await User.findById(id).select("-password");
		if (!user) return res.status(404).json({ message: "Пользователь не найден" });

		const { firstName, lastName, nickname, role, description, workplace } = req.body;

		if (nickname?.trim() !== user.nickname) {
			const exists = await User.findOne({ nickname: nickname?.trim() });
			if (exists)
				return res
					.status(400)
					.json({ message: "Пользователь с таким никнеймом уже существует" });
		}

		user.firstName = firstName.trim();
		user.lastName = lastName.trim();
		user.nickname = nickname.trim();
		user.role = role;
		if (description !== undefined) user.description = description;
		if (workplace !== undefined) user.workplace = workplace;

		await user.save();

		const { email, ...userResponse } = user.toObject();
		res.json({ message: "Профиль обновлен", user: userResponse });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при обновлении профиля пользователя" });
	}
};

export const addPortfolio = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id } = req.params;

		if (userId !== id) return res.status(403).json({ message: "Нет прав на редактирование" });

		const user = await User.findById(id).select("-password");
		if (!user) return res.status(404).json({ message: "Пользователь не найден" });

		const { title, description, links, previewImage } = req.body;

		user.portfolio!.push({
			title: title.trim(),
			description: description?.trim(),
			links: links || [],
			previewImage: previewImage || "",
		});

		await user.save();

		const newProject = user.portfolio![user.portfolio!.length - 1];
		res.status(201).json({ message: "Проект добавлен", project: newProject });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при добавлении проекта" });
	}
};

export const editPortfolio = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id, projectId } = req.params;

		if (userId !== id) return res.status(403).json({ message: "Нет прав на редактирование" });

		const user = await User.findById(id).select("-password");
		if (!user) return res.status(404).json({ message: "Пользователь не найден" });

		const { title, description, links, previewImage } = req.body;

		const project = user.portfolio?.find((p) => p._id?.toString() === projectId);
		if (!project) return res.status(404).json({ message: "Проект не найден" });

		project.title = title.trim();
		project.description = description?.trim();
		project.links = links || [];
		if (previewImage !== undefined) project.previewImage = previewImage;

		await user.save();
		res.json({ message: "Проект обновлен", project });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при редактировании проекта" });
	}
};

export const deletePortfolio = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id, projectId } = req.params;

		if (userId !== id) return res.status(403).json({ message: "Нет прав на редактирование" });

		const user = await User.findById(id).select("-password");
		if (!user) return res.status(404).json({ message: "Пользователь не найден" });

		const projectExists = user.portfolio?.some((p) => p._id?.toString() === projectId);
		if (!projectExists) return res.status(404).json({ message: "Проект не найден" });

		await User.updateOne({ _id: id }, { $pull: { portfolio: { _id: projectId } } });

		res.json({ message: "Проект удален" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при удалении проекта" });
	}
};
