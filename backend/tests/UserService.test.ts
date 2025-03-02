import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";
import { MockUserRepository } from "./mock/UserRepository.mock";
import { User } from "../entities/User";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepo: MockUserRepository;
  const mockUser: User = { id: 1, username: "testuser", password: "hashed_password", bankAccounts: [], expenses: [] };

  beforeEach(() => {
    jest.clearAllMocks(); 
    mockUserRepo = new MockUserRepository();
    userService = new UserService();
    (userService as any).userRepo = mockUserRepo; // ✅ Inject the shared mock repository
  });

  // ✅ Test registerUser
  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      mockUserRepo.findUserByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      mockUserRepo.createUser.mockResolvedValue(mockUser);

      const user = await userService.registerUser("testuser", "password123");

      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith("testuser");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockUserRepo.createUser).toHaveBeenCalledWith("testuser", "hashed_password");
      expect(user).toEqual(mockUser);
    });

    it("should throw an error if the username already exists", async () => {
      mockUserRepo.findUserByUsername.mockResolvedValue(mockUser);

      await expect(userService.registerUser("testuser", "password123")).rejects.toThrow("Username already exists");
      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith("testuser");
    });
  });

  // ✅ Test loginUser
  describe("loginUser", () => {
    it("should login successfully and return a token", async () => {
      mockUserRepo.findUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mocked_token");

      const result = await userService.loginUser("testuser", "password123");

      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith("testuser");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed_password");
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, "your_secret_key", { expiresIn: "1h" });
      expect(result).toEqual({ token: "mocked_token", user: mockUser });
    });

    it("should throw an error for an invalid username", async () => {
      mockUserRepo.findUserByUsername.mockResolvedValue(null);

      await expect(userService.loginUser("testuser", "password123")).rejects.toThrow("Invalid username or password");
      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith("testuser");
    });

    it("should throw an error for an invalid password", async () => {
      mockUserRepo.findUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.loginUser("testuser", "wrongpassword")).rejects.toThrow("Invalid username or password");
      expect(mockUserRepo.findUserByUsername).toHaveBeenCalledWith("testuser");
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashed_password");
    });
  });

  // ✅ Test getUserById
  describe("getUserById", () => {
    it("should return a user if found", async () => {
      mockUserRepo.findUserById.mockResolvedValue(mockUser);

      const user = await userService.getUserById(1);

      expect(mockUserRepo.findUserById).toHaveBeenCalledWith(1);
      expect(user).toEqual(mockUser);
    });

    it("should return null if user is not found", async () => {
      mockUserRepo.findUserById.mockResolvedValue(null);

      const user = await userService.getUserById(999);
      expect(mockUserRepo.findUserById).toHaveBeenCalledWith(999);
      expect(user).toBeNull();
    });
  });
});
