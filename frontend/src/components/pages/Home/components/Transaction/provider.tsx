import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  TransactionProviderProps,
  TransactionProviderState,
} from "./types";
import {
  getBanks,
  getTransactions,
  getTransactionsInfo,
} from "../../functions";
import type { PaginationType } from "@/types";
import { parseFilterDate } from "../../parsers";
import { useDebounce } from "@/lib/debounce";
import useLocalStorage from "@/lib/localstorage";
import type {
  BankType,
  FilterType,
  OrderBy,
  TransactionInfoType,
  TransactionType,
} from "../../types";

const TransactionProviderContext = createContext<TransactionProviderState>(
  {} as TransactionProviderState,
);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactionsInfo, setTransactionsInfo] =
    useState<TransactionInfoType>();

  const [filter, setFilter] = useLocalStorage<FilterType>(
    "FILTER_TRANSACTION",
    {
      search: "",
      minValue: undefined,
      maxValue: undefined,
      date: undefined,
      type: "",
      bank: "",
    },
  );

  const [orderBy, setOrderBy] = useLocalStorage<OrderBy>(
    "ORDERBY_TRANSACTION",
    {
      direction: "ASC",
      order: "date",
    },
  );

  const [pagination, setPagination] = useState<PaginationType>({
    per_page: 5,
    total_items: 0,
    last_page: 1,
    current_page: 1,
  });

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [banks, setBanks] = useState<BankType[]>([]);

  const getTransactionsFunc = useDebounce(
    useCallback(async () => {
      const { data, paginationContent } = await getTransactions({
        current_page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
        search: filter.search,
        ...(filter.minValue ? { min_value: filter.minValue.toString() } : {}),
        ...(filter.maxValue ? { max_value: filter.maxValue.toString() } : {}),
        ...(filter.date ? parseFilterDate(filter.date) : {}),
        ...(filter.type ? { type: filter.type } : {}),
        ...(filter.bank ? { bank: filter.bank } : {}),
        ...(orderBy.order ? { order: orderBy.order } : {}),
        ...(orderBy.direction ? { direction: orderBy.direction } : {}),
      });
      setPagination(paginationContent);
      setTransactions(data);
    }, [pagination.current_page, pagination.per_page, filter, orderBy]),
    500,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getBanksFunc = useCallback(async () => {
    const { data } = await getBanks({
      current_page: "1",
      per_page: "1000",
    });
    setBanks(() => {
      if (filter.bank === "") {
        setFilter((prev_filter) => ({
          ...prev_filter,
          bank: data[0].id.toString(),
        }));
      }

      return data;
    });
  }, [filter]);

  const getTransactionInfoFunc = useCallback(async () => {
    const response = await getTransactionsInfo({ bank: filter.bank || "" });
    setTransactionsInfo(response);
  }, [filter.bank]);

  const clearFilter = () => {
    setFilter({
      search: "",
      minValue: undefined,
      maxValue: undefined,
      date: undefined,
      type: "",
      bank: banks[0].id.toString() || "",
    });

    setOrderBy({
      order: "id",
      direction: "ASC",
    });
  };

  useEffect(() => {
    getBanksFunc();
    getTransactionInfoFunc();
  }, [getBanksFunc, getTransactionInfoFunc]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getTransactionsFunc();
  }, [pagination.current_page, pagination.per_page, filter, orderBy]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Every change on the filters, the pagination returns to page 1
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [filter]);

  return (
    <TransactionProviderContext.Provider
      value={{
        orderBy: [orderBy, setOrderBy],
        filter: [filter, setFilter],
        pagination: [pagination, setPagination],
        transactions: [transactions, setTransactions],
        banks: [banks, setBanks],
        transactionsInfo: [transactionsInfo, setTransactionsInfo],
        clearFilter,
        getTransactionsFunc,
        getTransactionInfoFunc,
        getBanksFunc,
      }}
    >
      {children}
    </TransactionProviderContext.Provider>
  );
}

export const useTransactionContext = () => {
  const context = useContext(TransactionProviderContext);

  if (context === undefined)
    throw new Error(
      "useTransactionContext must be used within a TransactionProviderContext",
    );

  return context;
};
