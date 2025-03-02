import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { BankDetails } from "./entities/BankDetails";
import { Expense } from "./entities/Expense";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_PATH || "finance_tracker.db",
  entities: [User, BankDetails, Expense],
  synchronize: true, // Auto-sync DB schema
  logging: false,
});

export const initDb = async () => {
  return AppDataSource.initialize()
    .then(() => console.log("📦 Database connected successfully"))
    .catch((error) => console.log("❌ Database connection error:", error));
}