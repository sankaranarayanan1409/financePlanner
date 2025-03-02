import { Router } from "express";
import { addExpense, getUserExpenses } from "../controller/ExpenseController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/getByUser", authMiddleware, getUserExpenses);  // ✅ Get user's expenses
router.post("/addExpenses", authMiddleware, addExpense);  // ✅ Add user's expenses

export default router;
