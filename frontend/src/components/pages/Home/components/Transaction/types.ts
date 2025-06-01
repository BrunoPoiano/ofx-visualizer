import type { PaginationType } from "@/types";
import type {
  BankType,
  FilterType,
  OrderBy,
  TransactionInfoType,
  TransactionType,
} from "../../types";

export type TransactionProviderState = {
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

  banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>];
  transactionsInfo: [
    TransactionInfoType | undefined,
    React.Dispatch<React.SetStateAction<TransactionInfoType | undefined>>,
  ];
  clearFilter: () => void;
  getTransactionsFunc: () => void;
  getTransactionInfoFunc: () => void;
  getBanksFunc: () => void;
};

export type TransactionProviderProps = {
  children: React.ReactNode;
};
