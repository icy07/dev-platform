import { Request, Response } from "express";
import mongoose, { QueryFilter } from "mongoose";
import Post, { IPost, PostCategory } from "../models/Post";
import { UserRole } from "../models/User";
import { AuthRequest } from "../types/AuthRequest";

const formatPostResponse = (post: IPost, userId?: string) => {
	const { likedBy, ...postData } = post.toObject();
	return {
		...postData,
		isLikedByUser: userId
			? (likedBy?.some((id: any) => id?.toString() === userId) ?? false)
			: false,
	};
};

export const getPosts = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { type, direction } = req.query;

		const filter: QueryFilter<IPost> = {};
		if (type) filter.type = type as PostCategory;
		if (direction) filter.direction = direction as UserRole;

		const posts = await Post.find(filter)
			.populate("author", "nickname role")
			.sort({ createdAt: -1 });

		const postsWithLikes = posts.map((post) => formatPostResponse(post, userId));

		res.json(postsWithLikes);
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
			title: title?.trim(),
			content: content?.trim(),
			author: new mongoose.Types.ObjectId(userId),
			type,
			direction,
			previewImage,
		});

		await post.populate("author", "nickname role");

		res.status(201).json(formatPostResponse(post, userId));
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

		post.title = title?.trim();
		post.content = content?.trim();
		post.type = type;
		post.direction = direction;
		if (previewImage !== undefined) post.previewImage = previewImage;

		await post.save();
		await post.populate("author", "nickname role");

		res.json(formatPostResponse(post, userId));
	} catch (error) {
		res.status(500).json({ message: "Ошибка при обновлении поста" });
	}
};

export const deletePost = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id } = req.params;

		if (!userId) return res.status(401).json({ message: "Нет доступа" });

		const post = await Post.findById(id);
		if (!post) return res.status(404).json({ message: "Пост не найден" });

		const isAuthor = post.author?.toString() === userId;
		if (!isAuthor) return res.status(403).json({ message: "Нет прав на удаление" });

		await post.deleteOne();

		res.status(200).json({ message: "Пост удален" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка при удалении поста" });
	}
};

export const likePost = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id } = req.params;

		if (!userId) return res.status(401).json({ message: "Нет доступа" });

		const updatedPost = await Post.findOneAndUpdate(
			{
				_id: id,
				likedBy: { $ne: new mongoose.Types.ObjectId(userId) },
			},
			{
				$addToSet: { likedBy: new mongoose.Types.ObjectId(userId) },
				$inc: { likes: 1 },
			},
			{ returnDocument: "after" },
		);

		if (!updatedPost) {
			return res.status(400).json({ message: "Пользователь уже лайкнул этот пост" });
		}

		return res.json({ message: "Пост лайкнут", post: updatedPost });
	} catch {
		return res.status(500).json({ message: "Ошибка при лайке поста" });
	}
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		const { id } = req.params;

		if (!userId) return res.status(401).json({ message: "Нет доступа" });

		const updatedPost = await Post.findOneAndUpdate(
			{
				_id: id,
				likedBy: new mongoose.Types.ObjectId(userId),
			},
			{
				$pull: { likedBy: new mongoose.Types.ObjectId(userId) },
				$inc: { likes: -1 },
			},
			{ returnDocument: "after" },
		);

		if (!updatedPost) {
			return res.status(400).json({ message: "Пользователь не лайкал этот пост" });
		}

		return res.json({ message: "Лайк убран", post: updatedPost });
	} catch {
		return res.status(500).json({ message: "Ошибка при удалении лайка с поста" });
	}
};
