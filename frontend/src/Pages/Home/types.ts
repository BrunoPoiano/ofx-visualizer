import type { PaginationType } from "@/types";
import type { DateRange } from "react-day-picker";

export type FilterType = {
  search: string;
  minValue: number | undefined;
  maxValue: number | undefined;
  date: DateRange | undefined;
  type: string;
  bank: string;
  direction: string;
  order: string;
};

export type HomeProviderState = {
  filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>];
  pagination: [
    PaginationType,
    React.Dispatch<React.SetStateAction<PaginationType>>,
  ];
  transactions: [
    TransactionType[],
    React.Dispatch<React.SetStateAction<TransactionType[]>>,
  ];
  banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>];
  showValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  transactionsInfo: [
    TransactionInfoType | undefined,
    React.Dispatch<React.SetStateAction<TransactionInfoType | undefined>>,
  ];
  clearFilter: () => void;
  getTransactionsFunc: () => void;
};

export type HomeProviderProps = {
  children: React.ReactNode;
};

export type TransactionType = {
  id: string;
  bank_id: number;
  date: string;
  type: string;
  value: number;
  desc: string;
};

export type BankType = {
  id: number;
  name: string;
  account_id: string;
};

export type TableInfoType = {
  id: keyof TransactionType;
  label: string;
};

export type TransactionInfoType = {
  positive: number;
  negative: number;
  value: number;
};
