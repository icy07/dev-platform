import axios from "axios";
import type { PostType, UserRole } from "../types";
import type { PostFormData } from "../components/PostForm/PostForm";

const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	withCredentials: true,
});

export const getPostsRequest = (filters?: {
	type?: PostType | null;
	direction?: UserRole | null;
}) => api.get("/posts", { params: filters });

export const createPostRequest = (
	data: Omit<PostFormData, "previewImage"> & { previewImage?: string },
) => api.post("/posts", data);

export const updatePostRequest = (
	id: string,
	data: Omit<PostFormData, "previewImage"> & { previewImage?: string },
) => api.put(`/posts/${id}`, data);

export const deletePostRequest = (id: string) => api.delete(`/posts/${id}`);

export const likePostRequest = (id: string) => api.post(`/posts/${id}/like`);

export const unlikePostRequest = (id: string) => api.delete(`/posts/${id}/like`);

export const uploadImageRequest = (data: FormData) =>
	api.post("/upload", data, {
		headers: { "Content-Type": "multipart/form-data" },
	});
