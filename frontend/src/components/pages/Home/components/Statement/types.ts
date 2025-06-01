import type { PaginationType } from "@/types";
import type { BankType, FilterType, OrderBy, StatementType } from "../../types";

export type StatementProviderState = {
  orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>];
  filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>];
  pagination: [
    PaginationType,
    React.Dispatch<React.SetStateAction<PaginationType>>,
  ];
  statements: [
    StatementType[],
    React.Dispatch<React.SetStateAction<StatementType[]>>,
  ];
  banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>];
  clearFilter: () => void;
  getBanksFunc: () => void;
};
