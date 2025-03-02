import { Response } from "express";
import { BankService } from "../services/BankService";
import { AuthRequest } from "../types/AuthRequest"; // Import custom type
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

const bankService = new BankService();

export const getUserBanks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return
        }

        const userId = req.user.id;
        const banks = await bankService.getUserBanks(userId);

        res.json(banks);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const addBank = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return
        }

        const userRepo = new UserRepository()
        const user: User | null = await userRepo.findUserByUsername(req.user.username);
        if (!user) {
            res.status(401).json({
                message: "Provided user doe not exist"
            })
            return
        }
        const { subtype, accountName } = req.body;

        const bank = await bankService.addBank(user, subtype, accountName);
        res.status(201).json(bank);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBank = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return
        }

        const userId = req.user.id;
        const bankId = parseInt(req.params.id, 10);

        await bankService.deleteBank(userId, bankId);
        res.json({ message: "Bank deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
