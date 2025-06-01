import type { PaginationType } from "@/types";
import type { DateRange } from "react-day-picker";

export type FilterType = {
  search: string;
  minValue: number | undefined;
  maxValue: number | undefined;
  date: DateRange | undefined;
  type: string;
  bank: string;
};

export type OrderBy = {
  direction: string;
  order: string;
};

export type HomeProviderState = {
  orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>];
  filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>];
  pagination: [
    PaginationType,
    React.Dispatch<React.SetStateAction<PaginationType>>,
  ];
  transactions: [
    TransactionType[],
    React.Dispatch<React.SetStateAction<TransactionType[]>>,
  ];
  statements: [
    StatementType[],
    React.Dispatch<React.SetStateAction<StatementType[]>>,
  ];
  banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>];
  showValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  transactionsInfo: [
    TransactionInfoType | undefined,
    React.Dispatch<React.SetStateAction<TransactionInfoType | undefined>>,
  ];
  clearFilter: () => void;
  getTransactionsFunc: () => void;
  getTransactionInfoFunc: () => void;
  getBanksFunc: () => void;
};

export type HomeProviderProps = {
  children: React.ReactNode;
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
