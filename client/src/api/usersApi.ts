import axios from "axios";
import type { UserProfile } from "../types";

const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	withCredentials: true,
});

export const getUserRequest = (id: string) => api.get(`/users/${id}`);

export const updateUserRequest = (id: string, data: Partial<UserProfile>) =>
	api.put(`/users/${id}`, data);

export const addProjectRequest = (id: string, data: FormData) =>
	api.post(`/users/${id}/portfolio`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const updateProjectRequest = (id: string, projectId: string, data: FormData) =>
	api.put(`/users/${id}/portfolio/${projectId}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const deleteProjectRequest = (id: string, projectId: string) =>
	api.delete(`/users/${id}/portfolio/${projectId}`);
