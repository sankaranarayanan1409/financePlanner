import { User } from "../../entities/User";
import { BankRepository } from "../../repositories/BankRepository";
import { BankDetails } from "../../entities/BankDetails";
import { DeleteResult } from "typeorm";
import { jest } from "@jest/globals";

export class MockBankRepository extends BankRepository {
    findByUserId = jest.fn<(userId: number) => Promise<BankDetails[]>>();
    createBank = jest.fn<(user: User, subtype: string, accountName: string) => Promise<BankDetails>>();
    removeBank = jest.fn<(userId: number, bankId: number) => Promise<DeleteResult>>();
    findById = jest.fn<(bankId: number) => Promise<BankDetails | null>>();
}
