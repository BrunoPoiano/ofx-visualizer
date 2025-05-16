import type { PaginationType } from "@/types";

export type FilterType = {
  search: string;
  minValue: number;
  maxValue: number;
  date: Date | undefined;
  type: "CREDIT" | "DEBIT" | undefined;
  bank: string | undefined;
};

export type HomeProviderState = {
  filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>];
  pagination: [
    PaginationType | null,
    React.Dispatch<React.SetStateAction<PaginationType | null>>,
  ];
  transactions: [
    TransactionType[],
    React.Dispatch<React.SetStateAction<TransactionType[]>>,
  ];
};

export type HomeProviderProps = {
  children: React.ReactNode;
};

export type TransactionType = {
  id: string;
  bank_id: number;
  date: Date;
  type: string;
  value: number;
  desc: string;
};
