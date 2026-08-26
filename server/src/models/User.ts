import mongoose, { Document } from "mongoose";

export type UserRole =
	| "Frontend Developer"
	| "Backend Developer"
	| "QA Engineer"
	| "Designer"
	| "Manager"
	| "HR";

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	nickname: string;
	email: string;
	password: string;
	role: UserRole;
	description?: string;
	workplace?: string;
	portfolio?: IProject[];
}

export interface IProject {
	_id?: mongoose.Types.ObjectId;
	title: string;
	description?: string;
	links?: string[];
	previewImage?: string;
}

const ProjectSchema = new mongoose.Schema<IProject>({
	title: { type: String, required: true, maxLength: 100 },
	description: { type: String },
	links: [{ type: String }],
	previewImage: { type: String },
});

const UserSchema = new mongoose.Schema<IUser>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	nickname: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: ["Frontend Developer", "Backend Developer", "QA Engineer", "Designer", "Manager", "HR"],
		required: true,
	},
	description: { type: String },
	workplace: { type: String },
	portfolio: [ProjectSchema],
});

export default mongoose.model<IUser>("User", UserSchema);
