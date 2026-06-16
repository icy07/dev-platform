import { Request, Response } from "express";
import mongoose, { QueryFilter } from "mongoose";
import Post, { AuthRequest, IPost, PostCategory } from "../models/Post";
import { UserRole } from "../models/User";

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
			likes: 0,
			likedBy: [],
			previewImage,
		});

		res.status(201).json(post);
	} catch (error) {
		res.status(500).json({ message: "Ошибка при создании поста" });
	}
};
