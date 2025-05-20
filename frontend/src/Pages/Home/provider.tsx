import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  BankType,
  FilterType,
  HomeProviderProps,
  HomeProviderState,
  TransactionType,
} from "./types";
import { getBanks, getTransactions, parseFilterDate } from "./functions";
import type { PaginationType } from "@/types";

const HomeProviderContext = createContext<HomeProviderState>(
  {} as HomeProviderState,
);

export function HomeProvider({ children }: HomeProviderProps) {
  const [showValue, setShowValue] = useState(true);

  const [filter, setFilter] = useState<FilterType>({
    search: "",
    minValue: undefined,
    maxValue: undefined,
    date: undefined,
    type: "",
    bank: "",
    order: "date",
    direction: "DESC",
  });

  const [pagination, setPagination] = useState<PaginationType>({
    per_page: 5,
    total_items: 0,
    last_page: 1,
    current_page: 1,
  });

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [banks, setBanks] = useState<BankType[]>([]);

  const getTransactionsFunc = useCallback(async () => {
    const { data, paginationContent } = await getTransactions({
      current_page: pagination.current_page.toString(),
      per_page: pagination.per_page.toString(),
      search: filter.search,
      ...(filter.minValue ? { min_value: filter.minValue.toString() } : {}),
      ...(filter.maxValue ? { max_value: filter.maxValue.toString() } : {}),
      ...(filter.date ? parseFilterDate(filter.date) : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.bank ? { bank: filter.bank } : {}),
      ...(filter.order ? { order: filter.order } : {}),
      ...(filter.direction ? { direction: filter.direction } : {}),
    });
    setPagination(paginationContent);
    setTransactions(data);
  }, [pagination.current_page, pagination.per_page, filter]);

  const getBanksFunc = useCallback(async () => {
    const { data } = await getBanks({
      current_page: "1",
      per_page: "1000",
    });
    setBanks(data);
  }, []);

  const clearFilter = () => {
    setFilter({
      search: "",
      minValue: undefined,
      maxValue: undefined,
      date: undefined,
      type: "",
      bank: "",
      order: "date",
      direction: "DESC",
    });
  };

  useEffect(() => {
    getTransactionsFunc();
    getBanksFunc();
  }, [getTransactionsFunc, getBanksFunc]);

  return (
    <HomeProviderContext.Provider
      value={{
        filter: [filter, setFilter],
        pagination: [pagination, setPagination],
        transactions: [transactions, setTransactions],
        showValue: [showValue, setShowValue],
        banks: [banks, setBanks],
        clearFilter,
        getTransactionsFunc,
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
