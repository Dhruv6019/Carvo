import { Router } from "express";
import { upload } from "../services/UploadService";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // In production, return the public URL (e.g., S3 URL or static path)
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl });
});

export default router;
