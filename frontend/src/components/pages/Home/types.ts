import type { DateRange } from "react-day-picker";

export type DefaultFilterType = {
  date: DateRange | undefined;
  bank: string;
};

export type OrderBy = {
  direction: string;
  order: string;
};

export type TransactionType = {
  id: string;
  bank_id: number;
  date: string;
  type: "CREDIT" | "DEBIT";
  value: number;
  desc: string;
};

export type BankType = {
  id: number;
  name: string;
  account_id: string;
};

export type TransactionInfoType = {
  positive: number;
  negative: number;
  value: number;
};

export type StatementType = {
  id: number;
  bank_id: number;
  start_date: string;
  end_date: string;
  ledger_balance: number;
  balance_date: string;
  server_date: string;
  language: string;
  yields: balanceType[];
};

export type balanceType = {
  id: number;
  statement_id: number;
  name: string;
  desc: string;
  bal_type: string;
  value: number;
};
