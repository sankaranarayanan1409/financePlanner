import { User } from "../entities/User";
import { BankRepository } from "../repositories/BankRepository";
import { BankDetails } from "../entities/BankDetails";

export class BankService {
  private bankRepo = new BankRepository();

  async getUserBanks(userId: number) {
    if (!userId || userId <= 0) {
      throw new Error("Invalid user ID");
    }
    return await this.bankRepo.findByUserId(userId);
  }

  async addBank(user: User, subtype: string, accountName: string) {
    if (!user || !user.id) {
      throw new Error("Invalid user");
    }
    if (!subtype || subtype.trim() === "") {
      throw new Error("Subtype cannot be empty");
    }
    if (!accountName || accountName.trim() === "") {
      throw new Error("Account name cannot be empty");
    }

    return await this.bankRepo.createBank(user, subtype.trim(), accountName.trim());
  }

  async deleteBank(userId: number, bankId: number) {
    if (!userId || userId <= 0) {
      throw new Error("Invalid user ID");
    }
    if (!bankId || bankId <= 0) {
      throw new Error("Invalid bank ID");
    }

    const bank = await this.bankRepo.findById(bankId);
    if (!bank) {
      throw new Error("Bank account not found");
    }
    if (bank.user.id !== userId) {
      throw new Error("User does not own this bank account");
    }

    return await this.bankRepo.removeBank(userId, bankId);
  }
}
