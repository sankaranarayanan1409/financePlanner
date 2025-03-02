import { ExpenseService } from "../services/ExpenseService";
import { MockExpenseRepository } from "./mock/ExpenseRepostiory.mock";
import { Expense } from "../entities/Expense";
import { User } from "../entities/User";
import { BankDetails } from "../entities/BankDetails";

jest.mock("../repositories/ExpenseRepository");

describe("ExpenseService", () => {
  let expenseService: ExpenseService;
  let mockExpenseRepo: MockExpenseRepository;

  const mockUser: User = { id: 1, username: "testuser", password: "hashed_password", bankAccounts: [], expenses: [] };

  const mockExpenses: Expense[] = [
    { id: 1, amount: 100, type: "Savings", subtype: "Groceries", date: "2024-01-01", user: mockUser, bankDetails: new BankDetails() },
    { id: 2, amount: 200, type: "Investment", subtype: "Stocks", date: "2024-02-01", user: mockUser, bankDetails: new BankDetails() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockExpenseRepo = new MockExpenseRepository();
    expenseService = new ExpenseService();
    (expenseService as any).expenseRepo = mockExpenseRepo; // Injecting mock repository
  });

  // ✅ Test getUserExpenses
  describe("getUserExpenses", () => {
    it("should return user expenses when a valid user ID is provided", async () => {
      mockExpenseRepo.getUserExpenses.mockResolvedValue(mockExpenses);

      const expenses = await expenseService.getUserExpenses(1);

      expect(mockExpenseRepo.getUserExpenses).toHaveBeenCalledWith(1);
      expect(expenses).toEqual(mockExpenses);
    });

    it("should throw an error when user ID is invalid", async () => {
      await expect(expenseService.getUserExpenses(0)).rejects.toThrow("Invalid user ID");
      await expect(expenseService.getUserExpenses(-1)).rejects.toThrow("Invalid user ID");
      await expect(expenseService.getUserExpenses(null as any)).rejects.toThrow("Invalid user ID");
    });
  });

  // ✅ Test addExpenses
  describe("addExpenses", () => {
    it("should successfully add expenses", async () => {
      mockExpenseRepo.addExpense.mockResolvedValue(mockExpenses);

      const addedExpenses = await expenseService.addExpenses(mockExpenses);

      expect(mockExpenseRepo.addExpense).toHaveBeenCalledWith(mockExpenses);
      expect(addedExpenses).toEqual(mockExpenses);
    });

    it("should throw an error when expense list is empty", async () => {
      await expect(expenseService.addExpenses([])).rejects.toThrow("Expense list cannot be empty");
    });

    it("should throw an error for a negative or zero amount", async () => {
      const invalidExpenses = [{ ...mockExpenses[0], amount: -100 }];

      await expect(expenseService.addExpenses(invalidExpenses)).rejects.toThrow("Invalid amount for expense: -100");
    });

    it("should throw an error if type is empty", async () => {
      const invalidExpenses = [{ ...mockExpenses[0], type: " " }];

      await expect(expenseService.addExpenses(invalidExpenses)).rejects.toThrow("Expense type cannot be empty");
    });

    it("should throw an error if subtype is empty", async () => {
      const invalidExpenses = [{ ...mockExpenses[0], subtype: "" }];

      await expect(expenseService.addExpenses(invalidExpenses)).rejects.toThrow("Expense subtype cannot be empty");
    });

    it("should throw an error if date is invalid", async () => {
      const invalidExpenses = [{ ...mockExpenses[0], date: "invalid-date" }];

      await expect(expenseService.addExpenses(invalidExpenses)).rejects.toThrow("Invalid date format: invalid-date");
    });

    it("should throw an error if expenses belong to different users", async () => {
      const invalidExpenses = [
        { ...mockExpenses[0], user: { id: 1, username: "user1", password: "pass", bankAccounts: [], expenses: [] } },
        { ...mockExpenses[1], user: { id: 2, username: "user2", password: "pass", bankAccounts: [], expenses: [] } },
      ];

      await expect(expenseService.addExpenses(invalidExpenses)).rejects.toThrow("All expenses must belong to the same user");
    });
  });
});
