import axios from "axios";
import type { RegisterData, LoginData } from "../types";

const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	withCredentials: true,
});

export const registerRequest = (data: Omit<RegisterData, "confirmPassword">) =>
	api.post("/register", data);

export const loginRequest = (data: LoginData) => api.post("/login", data);

export const checkAuthRequest = () => api.get("/auth");

export const logoutRequest = () => api.post("/logout");
