import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { BankDetails } from "./BankDetails";
import { User } from "./User";

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal")
  amount: number;

  @Column()
  type: string; // e.g., "Savings", "Investment"

  @Column()
  subtype: string; // e.g., "Groceries", "Food", "Travel", "Rent", etc.

  @Column()
  date: string;

  @ManyToOne(() => BankDetails, (bankDetails) => bankDetails.expenses)
  @JoinColumn({ name: "bankName", referencedColumnName: "accountName" })
  bankDetails: BankDetails;

  @ManyToOne(() => (User), (user) => user.expenses)
  @JoinColumn({ name: "user", referencedColumnName: "username" })
  user: User
}
