import { Request, Response } from "express";
import mongoose, { QueryFilter } from "mongoose";
import Post, { IPost, PostCategory } from "../models/Post";
import { UserRole } from "../models/User";
import { AuthRequest } from "../types/AuthRequest";

export const getPosts = async (req: Request, res: Response) => {
	try {
		const { type, direction } = req.query;

		const filter: QueryFilter<IPost> = {};
		if (type) filter.type = type as PostCategory;
		if (direction) filter.direction = direction as UserRole;

		const posts = await Post.find(filter)
			.populate("author", "nickname role")
			.sort({ createdAt: -1 });

		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Ошибка при получении постов" });
	}
};

export const createPost = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;

		if (!userId) return res.status(401).json({ message: "Нет доступа" });

		const { title, content, type, direction, previewImage } = req.body;

		const post = await Post.create({
			title,
			content,
			author: new mongoose.Types.ObjectId(userId),
			type,
			direction,
			previewImage,
		});

		res.status(201).json(post);
	} catch (error) {
		res.status(500).json({ message: "Ошибка при создании поста" });
	}
};

export const editPost = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id } = req.params;

		if (!userId) return res.status(401).json({ message: "Нет доступа" });

		const post = await Post.findById(id);
		if (!post) return res.status(404).json({ message: "Пост не найден" });

		const isAuthor = post.author?.toString() === userId;
		if (!isAuthor) return res.status(403).json({ message: "Нет прав редактировать" });

		const { title, content, type, direction, previewImage } = req.body;

		post.title = title;
		post.content = content;
		post.type = type;
		post.direction = direction;
		if (previewImage !== undefined) post.previewImage = previewImage;

		await post.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Ошибка при обновлении поста" });
	}
};

export const deletePost = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const id = String(req.params.id);

		if (!userId) return res.status(401).json({ message: "Нет доступа" });

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: "Некорректный id поста" });

		const deletedPost = await Post.findOneAndDelete({ _id: id, author: userId });

		if (!deletedPost)
			return res
				.status(404)
				.json({ message: "Пост не найден или у вас нет прав на его удаление" });

		res.status(200).json({ message: "Пост удален", post: deletedPost });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при удалении поста" });
	}
};
