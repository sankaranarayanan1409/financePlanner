import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";


export class UserService {
private  userRepo = new UserRepository();
  async registerUser(username: string, password: string) {
    const existingUser = await this.userRepo.findUserByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.createUser(username, hashedPassword);
  }

  async loginUser(username: string, password: string) {
    const user = await this.userRepo.findUserByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });
    return { token, user };
  }

  async getUserById(id: number) {
    return this.userRepo.findUserById(id);
  }
}
