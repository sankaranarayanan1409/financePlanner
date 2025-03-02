import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BankDetails } from "./BankDetails";
import { Expense } from "./Expense";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Hashed password

  @OneToMany(() => BankDetails, (bankDetails) => bankDetails.user)
  bankAccounts: BankDetails[];

  @OneToMany(() => Expense, (expense) => expense.user )
  expenses: Expense[]
}
