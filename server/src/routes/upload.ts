import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

const router = express.Router();

router.post(
	"/upload",
	requireAuth,
	upload.single("image"),
	(req: Request, res: Response) => {
		if (!req.file) {
			return res.status(400).json({ message: "Файл не загружен" });
		}

		const fileUrl = `/uploads/${req.file.filename}`;
		res.json({ url: fileUrl });
	},
	(err: unknown, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res
					.status(400)
					.json({ message: "Файл слишком большой. Максимальный размер — 5 МБ" });
			}
		}
		if (err instanceof Error) {
			return res.status(400).json({ message: err.message });
		}
		return res.status(400).json({ message: "Ошибка загрузки файла" });
	},
);

export default router;
