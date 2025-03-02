import { AppDataSource } from "../database";
import { Expense } from "../entities/Expense";

export class ExpenseRepository {
  private repo = AppDataSource.getRepository(Expense);

  async getUserExpenses(userId: number): Promise<Expense[]> {
    return await this.repo.find({ where: { user: { id: userId } } });
  }

  async addExpense(expense: Expense[]): Promise<Expense[]> {
    this.repo.create(expense)
    const userId = expense[0].user.id
    const updatedExpenses: Expense[] = await this.repo.find({ where: { user: { id: userId } } })
    return updatedExpenses
  }
}
