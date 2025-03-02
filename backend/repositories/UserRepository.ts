import { AppDataSource } from "../database";
import { User } from "../entities/User";

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  async createUser(username: string, hashedPassword: string): Promise<User> {
    const user = this.repo.create({ username, password: hashedPassword });
    return this.repo.save(user);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: ["expenses"] });
  }
}
