import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute";
import bankRoutes from "./routes/bankRoutes"
import expensesRoutes from "./routes/expenseRoute"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/expenses", expensesRoutes);

export default app;
