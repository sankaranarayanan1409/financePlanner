import { Response } from "express";
import { ExpenseService } from "../services/ExpenseService";
import { AuthRequest } from "../types/AuthRequest"; // Import custom type
import { Expense } from "../entities/Expense";

const expenseService = new ExpenseService();

export const getUserExpenses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return
    }

    // ✅ Get user ID from `req.user`
    const userId = req.user.id;
    const expenses = await expenseService.getUserExpenses(userId);

    res.status(200).json(expenses);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return
    }

    // ✅ Get user ID from `req.user`
    const expenses: Expense[] = req.body.expenses;
    const updatedExpenses = await expenseService.addExpenses(expenses);

    res.status(201).json(updatedExpenses);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}