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
  TransactionInfoType,
  TransactionType,
} from "./types";
import { getBanks, getTransactions, getTransactionsInfo } from "./functions";
import type { PaginationType } from "@/types";
import { parseFilterDate } from "./parsers";
import { useDebounce } from "@/lib/debounce";

const HomeProviderContext = createContext<HomeProviderState>(
  {} as HomeProviderState,
);

export function HomeProvider({ children }: HomeProviderProps) {
  const [showValue, setShowValue] = useState(true);
  const [transactionsInfo, setTransactionsInfo] =
    useState<TransactionInfoType>();

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

  const getTransactionsCallback = useCallback(async () => {
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

  const getTransactionsFunc = useDebounce(getTransactionsCallback, 500);

  const getBanksFunc = useCallback(async () => {
    const { data } = await getBanks({
      current_page: "1",
      per_page: "1000",
    });
    setBanks(data);
  }, []);

  const getTransactionInfoFunc = useCallback(async () => {
    const response = await getTransactionsInfo();
    setTransactionsInfo(response);
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
  }, [getTransactionsFunc]);

  useEffect(() => {
    getTransactionInfoFunc();
    getBanksFunc();
  }, [getBanksFunc, getTransactionInfoFunc]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [filter]);

  return (
    <HomeProviderContext.Provider
      value={{
        filter: [filter, setFilter],
        pagination: [pagination, setPagination],
        transactions: [transactions, setTransactions],
        showValue: [showValue, setShowValue],
        banks: [banks, setBanks],
        transactionsInfo: [transactionsInfo, setTransactionsInfo],
        clearFilter,
        getTransactionsFunc,
        getTransactionInfoFunc,
        getBanksFunc,
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
