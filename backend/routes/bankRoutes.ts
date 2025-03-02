import { Router } from "express";
import { getUserBanks, addBank, deleteBank } from "../controller/BankController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/getByuser", authMiddleware, getUserBanks);  // ✅ Get user's banks
router.post("/addBank", authMiddleware, addBank);      // ✅ Add a new bank
router.delete("/:id", authMiddleware, deleteBank); // ✅ Delete a bank

export default router;