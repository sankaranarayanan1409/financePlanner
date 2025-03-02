import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User";
import { Expense } from "./Expense";

@Entity()
export class BankDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subtype: string; // e.g., "Groceries", "Food"

  @Column()
  accountName: string;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  @JoinColumn({ name: "ownedBy", referencedColumnName: "username"})
  user: User;

  @OneToMany(() => Expense, (expense) => expense.bankDetails)
  expenses: Expense[];
}
