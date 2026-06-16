import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

app.use("/api", authRoutes);
app.use("/api", postRoutes);

mongoose
	.connect(process.env.MONGODB_URI!)
	.then(() => {
		console.log("Подключение к MongoDB");
		app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
	})
	.catch((err) => console.error("Ошибка подключения к MongoDB:", err));
