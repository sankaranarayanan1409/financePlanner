import { Router } from "express";
import { registerUser, loginUser, getUserDetails } from "../controller/UserController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserDetails); // ✅ Protected route

export default router;
