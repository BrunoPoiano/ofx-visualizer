import type { PaginationType } from "@/types";
import type { DateRange } from "react-day-picker";

export type FilterType = {
  search: string;
  minValue: number;
  maxValue: number;
  date: DateRange | undefined;
  type: "CREDIT" | "DEBIT" | undefined;
  bank: string | undefined;
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
};

export type HomeProviderProps = {
  children: React.ReactNode;
};

export type TransactionType = {
  id: string;
  bank_id: number;
  date: { from: undefined };
  type: string;
  value: number;
  desc: string;
};
