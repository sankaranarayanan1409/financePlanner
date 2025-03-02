import { ExpenseRepository } from "../../repositories/ExpenseRepository";
import { Expense } from "../../entities/Expense";
import { jest } from "@jest/globals";

export class MockExpenseRepository extends ExpenseRepository {
    getUserExpenses = jest.fn<(userId: number) => Promise<Expense[]>>();
    addExpense = jest.fn<(expense:Expense[]) => Promise<Expense[]>>();
}
