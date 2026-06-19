import axios from "axios";
import type { UserRole } from "../types";

const api = axios.create({
	baseURL: "http://localhost:5000/api",
	withCredentials: true,
});

export const getPostsRequest = (filters?: { type?: string; direction?: UserRole }) => {
	api.get("/posts", { params: filters });
};

export const createPostRequest = (data: FormData) => api.post("/posts", data);

export const updatePostRequest = (id: string, data: FormData) => api.put(`/posts/${id}`, data);

export const deletePostRequest = (id: string) => api.delete(`/posts/${id}`);

export const likePostRequest = (id: string) => api.post(`/posts/${id}/like`);

export const unlikePostRequest = (id: string) => api.delete(`/posts/${id}/like`);

export const uploadImageRequest = (data: FormData) =>
	api.post("/upload", data, {
		headers: { "Content-Type": "multipart/form-data" },
	});
