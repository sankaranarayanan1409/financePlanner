import { BankService } from "../services/BankService";
import { MockBankRepository } from "./mock/BankRepository.mock";
import { User } from "../entities/User";
import { BankDetails } from "../entities/BankDetails";

describe("BankService", () => {
  let bankService: BankService;
  let mockBankRepo: MockBankRepository;
  
  const mockUser: User = { id: 1, username: "testuser", password: "hashed_password", bankAccounts: [], expenses: [] };

  const mockBank: BankDetails = {
    id: 1,
    subtype: "Savings",
    accountName: "My Savings Account",
    user: mockUser,
    expenses: [],
  };

  beforeEach(() => {
    mockBankRepo = new MockBankRepository();
    bankService = new BankService();
    (bankService as any).bankRepo = mockBankRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test getUserBanks
  describe("getUserBanks", () => {
    it("should return user bank accounts when a valid user ID is provided", async () => {
      mockBankRepo.findByUserId.mockResolvedValue([mockBank]);

      const banks = await bankService.getUserBanks(1);

      expect(mockBankRepo.findByUserId).toHaveBeenCalledWith(1);
      expect(banks).toEqual([mockBank]);
    });

    it("should throw an error when user ID is invalid", async () => {
      await expect(bankService.getUserBanks(0)).rejects.toThrow("Invalid user ID");
      await expect(bankService.getUserBanks(-1)).rejects.toThrow("Invalid user ID");
      await expect(bankService.getUserBanks(null as any)).rejects.toThrow("Invalid user ID");
    });
  });

  // ✅ Test addBank
  describe("addBank", () => {
    it("should successfully add a bank account", async () => {
      mockBankRepo.createBank.mockResolvedValue(mockBank);

      const bank = await bankService.addBank(mockUser, "Savings", "My Savings Account");

      expect(mockBankRepo.createBank).toHaveBeenCalledWith(mockUser, "Savings", "My Savings Account");
      expect(bank).toEqual(mockBank);
    });

    it("should throw an error when user is invalid", async () => {
      await expect(bankService.addBank(null as any, "Savings", "My Savings Account")).rejects.toThrow("Invalid user");
      await expect(bankService.addBank({} as any, "Savings", "My Savings Account")).rejects.toThrow("Invalid user");
    });

    it("should throw an error when subtype is empty", async () => {
      await expect(bankService.addBank(mockUser, "", "My Savings Account")).rejects.toThrow("Subtype cannot be empty");
      await expect(bankService.addBank(mockUser, " ", "My Savings Account")).rejects.toThrow("Subtype cannot be empty");
    });

    it("should throw an error when account name is empty", async () => {
      await expect(bankService.addBank(mockUser, "Savings", "")).rejects.toThrow("Account name cannot be empty");
      await expect(bankService.addBank(mockUser, "Savings", " ")).rejects.toThrow("Account name cannot be empty");
    });
  });

  // ✅ Test deleteBank
  describe("deleteBank", () => {
    it("should successfully delete a bank account if user owns it", async () => {
      mockBankRepo.findById.mockResolvedValue(mockBank);

      const result = await bankService.deleteBank(1, 1);

      expect(mockBankRepo.findById).toHaveBeenCalledWith(1);
      expect(mockBankRepo.removeBank).toHaveBeenCalledWith(1, 1);
    });

    it("should throw an error when user ID is invalid", async () => {
      await expect(bankService.deleteBank(0, 1)).rejects.toThrow("Invalid user ID");
      await expect(bankService.deleteBank(-1, 1)).rejects.toThrow("Invalid user ID");
    });

    it("should throw an error when bank ID is invalid", async () => {
      await expect(bankService.deleteBank(1, 0)).rejects.toThrow("Invalid bank ID");
      await expect(bankService.deleteBank(1, -1)).rejects.toThrow("Invalid bank ID");
    });

    it("should throw an error when bank account does not exist", async () => {
      mockBankRepo.findById.mockResolvedValue(null);

      await expect(bankService.deleteBank(1, 1)).rejects.toThrow("Bank account not found");
      expect(mockBankRepo.findById).toHaveBeenCalledWith(1);
    });

    it("should throw an error when the user does not own the bank account", async () => {
      const anotherUserBank = { ...mockBank, user: { id: 2, username: "anotherUser", password: "pass", bankAccounts: [], expenses: [] } };
      mockBankRepo.findById.mockResolvedValue(anotherUserBank);

      await expect(bankService.deleteBank(1, 1)).rejects.toThrow("User does not own this bank account");
    });
  });
});
