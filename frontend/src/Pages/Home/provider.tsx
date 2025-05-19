import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  FilterType,
  HomeProviderProps,
  HomeProviderState,
  TransactionType,
} from "./types";
import { getTransactions, parseFilterDate } from "./functions";
import type { PaginationType } from "@/types";

const HomeProviderContext = createContext<HomeProviderState>(
  {} as HomeProviderState,
);

export function HomeProvider({ children }: HomeProviderProps) {
  const [filter, setFilter] = useState<FilterType>({
    search: "",
    minValue: 0,
    maxValue: 0,
    date: undefined,
    type: "",
    bank: "",
  });
  const [pagination, setPagination] = useState<PaginationType>({
    per_page: 5,
    total_items: 0,
    last_page: 1,
    current_page: 1,
  });
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const getTransactionsFunc = useCallback(async () => {
    const { data, paginationContent } = await getTransactions({
      current_page: pagination.current_page.toString(),
      per_page: pagination.per_page.toString(),
      search: filter.search,
      ...(filter.minValue ? { min_value: filter.minValue.toString() } : {}),
      ...(filter.maxValue ? { max_value: filter.maxValue.toString() } : {}),
      ...(filter.date ? parseFilterDate(filter.date) : {}),
      ...(filter.type ? { type: filter.type.toString() } : {}),
      ...(filter.bank ? { bank: filter.bank.toString() } : {}),
    });
    setPagination(paginationContent);
    setTransactions(data);
  }, [pagination.current_page, pagination.per_page, filter]);

  const clearFilter = () => {
    setFilter({
      search: "",
      minValue: 0,
      maxValue: 0,
      date: undefined,
      type: "",
      bank: "",
    });
  };

  useEffect(() => {
    getTransactionsFunc();
  }, [getTransactionsFunc]);

  return (
    <HomeProviderContext.Provider
      value={{
        filter: [filter, setFilter],
        pagination: [pagination, setPagination],
        transactions: [transactions, setTransactions],
        clearFilter,
      }}
    >
      {children}
    </HomeProviderContext.Provider>
  );
}

export const useHomeContext = () => {
  const context = useContext(HomeProviderContext);

  if (context === undefined)
    throw new Error("useHomeContext must be used within a HomeProviderContext");

  return context;
};
