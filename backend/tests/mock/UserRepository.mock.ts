import { UserRepository } from "../../repositories/UserRepository";
import { User } from "../../entities/User";
import { jest } from "@jest/globals";

export class MockUserRepository extends UserRepository {
  findUserByUsername = jest.fn<(username: string) => Promise<User | null>>();
  createUser = jest.fn<(username: string, hashedPassword: string) => Promise<User>>();
  findUserById = jest.fn<(id: number) => Promise<User | null>>();
}
