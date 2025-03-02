import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthRequest } from "../types/AuthRequest";

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    await userService.registerUser(username, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await userService.loginUser(username, password);
    res.json({ token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
