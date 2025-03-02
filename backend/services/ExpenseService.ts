import { Expense } from "../entities/Expense";
import { ExpenseRepository } from "../repositories/ExpenseRepository";

export class ExpenseService {
  private expenseRepo = new ExpenseRepository()
  async getUserExpenses(userId: number) {
    if (!userId || userId <= 0) {
      throw new Error("Invalid user ID");
    }
    return this.expenseRepo.getUserExpenses(userId);
  }

  async addExpenses(expenses: Expense[]) {
    if (!expenses.length) {
      throw new Error("Expense list cannot be empty");
    }

    // Validate all expenses
    const userId = expenses[0].user.id;
    for (const expense of expenses) {
      if (expense.amount <= 0) {
        throw new Error(`Invalid amount for expense: ${expense.amount}`);
      }
      if (!expense.type.trim()) {
        throw new Error("Expense type cannot be empty");
      }
      if (!expense.subtype.trim()) {
        throw new Error("Expense subtype cannot be empty");
      }
      if (isNaN(Date.parse(expense.date))) {
        throw new Error(`Invalid date format: ${expense.date}`);
      }
      if (expense.user.id !== userId) {
        throw new Error("All expenses must belong to the same user");
      }
    }

    return await this.expenseRepo.addExpense(expenses);
  }
}
