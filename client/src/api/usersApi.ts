import axios from "axios";
import type { Project, UserProfile } from "../types";

const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	withCredentials: true,
});

export const getUserRequest = (id: string) => api.get(`/users/${id}`);

export const updateUserRequest = (id: string, data: Partial<UserProfile>) =>
	api.put(`/users/${id}`, data);

export const addProjectRequest = (id: string, data: Omit<Project, "_id">) =>
	api.post(`/users/${id}/portfolio`, data);

export const updateProjectRequest = (id: string, projectId: string, data: Omit<Project, "_id">) =>
	api.put(`/users/${id}/portfolio/${projectId}`, data);

export const deleteProjectRequest = (id: string, projectId: string) =>
	api.delete(`/users/${id}/portfolio/${projectId}`);
