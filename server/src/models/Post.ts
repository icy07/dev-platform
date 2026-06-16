import mongoose, { Document, PopulatedDoc } from "mongoose";
import { IUser, UserRole } from "./User";
import { Request } from "express";

export type PostCategory = "Контент" | "Событие" | "Вакансия";

export interface IPost extends Document {
	title: string;
	content: string;
	author: PopulatedDoc<IUser & Document>;
	type: PostCategory;
	direction: UserRole;
	likes: number;
	likedBy?: PopulatedDoc<IUser & Document>[];
	previewImage?: string;
}

export type AuthRequest = Request & {
	user?: {
		id: string;
		nickname: string;
		role: UserRole;
	};
};

const PostSchema = new mongoose.Schema<IPost>(
	{
		title: { type: String, required: true, maxlength: 100 },
		content: { type: String, required: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		type: { type: String, enum: ["Контент", "Событие", "Вакансия"], required: true },
		direction: {
			type: String,
			enum: [
				"Frontend Developer",
				"Backend Developer",
				"QA Engineer",
				"Designer",
				"Manager",
				"HR",
			],
			required: true,
		},
		likes: { type: Number, default: 0 },
		likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		previewImage: { type: String },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IPost>("Post", PostSchema);
