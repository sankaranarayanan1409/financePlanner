import { DeleteResult } from "typeorm";
import { AppDataSource } from "../database";
import { BankDetails } from "../entities/BankDetails";
import { User } from "../entities/User";

export class BankRepository {
  private repo = AppDataSource.getRepository(BankDetails);

  async findByUserId(userId: number): Promise<BankDetails[]> {
    return await this.repo.find({ where: { user: { id: userId } } });
  }

  async createBank(user: User, subtype: string, accountName: string): Promise<BankDetails> {
    const bank = this.repo.create({ user, subtype, accountName });
    return await this.repo.save(bank);
  }

  async removeBank(userId: number, bankId: number): Promise<DeleteResult> {
    return await this.repo.delete({ id: bankId, user: { id: userId } });
  }

  async findById(bankId: number): Promise<BankDetails | null> {
    return await this.repo.findOne({where: {id: bankId}})
  }
}
