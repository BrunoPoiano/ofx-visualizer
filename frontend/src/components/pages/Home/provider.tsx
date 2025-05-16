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
import { getTransactions } from "./functions";
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
    type: undefined,
    bank: undefined,
  });
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const getTransactionsFunc = useCallback(async () => {
    const { data, pagination } = await getTransactions();
    setPagination(pagination);
    setTransactions(data);
    console.log("data", data);
    console.log("pagination", pagination);
    console.log("filter", filter);
  }, [filter]);

  useEffect(() => {
    getTransactionsFunc();
  }, [getTransactionsFunc]);

  return (
    <HomeProviderContext.Provider
      value={{
        filter: [filter, setFilter],
        pagination: [pagination, setPagination],
        transactions: [transactions, setTransactions],
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
