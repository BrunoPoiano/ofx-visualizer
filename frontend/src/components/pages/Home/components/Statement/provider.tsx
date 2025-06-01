import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { PaginationType } from "@/types";
import { useDebounce } from "@/lib/debounce";
import useLocalStorage from "@/lib/localstorage";
import { getBanks, getStatesments } from "../../functions";
import { parseFilterDate } from "../../parsers";
import type { StatementProviderState } from "./types";
import type { BankType, FilterType, OrderBy, StatementType } from "../../types";

const StatementProviderContext = createContext<StatementProviderState>(
  {} as StatementProviderState,
);

export function StatementProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useLocalStorage<FilterType>("FILTER_STATEMENT", {
    search: "",
    minValue: undefined,
    maxValue: undefined,
    date: undefined,
    type: "",
    bank: "",
  });

  const [orderBy, setOrderBy] = useLocalStorage<OrderBy>("ORDERBY_STATEMENT", {
    direction: "ASC",
    order: "id",
  });

  const [pagination, setPagination] = useLocalStorage<PaginationType>(
    "PAGINATION_STATEMENT",
    {
      per_page: 5,
      total_items: 0,
      last_page: 1,
      current_page: 1,
    },
  );

  const [statements, setStatements] = useState<StatementType[]>([]);
  const [banks, setBanks] = useState<BankType[]>([]);

  const getStatementFunc = useDebounce(
    useCallback(async () => {
      const { data, paginationContent } = await getStatesments({
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
      setStatements(data);
    }, [
      pagination.current_page,
      pagination.per_page,
      filter,
      orderBy,
      setPagination,
    ]),
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
  }, [getBanksFunc]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getStatementFunc();
  }, [pagination.current_page, pagination.per_page, filter, orderBy]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Every change on the filters, the pagination returns to page 1
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [filter]);

  return (
    <StatementProviderContext.Provider
      value={{
        orderBy: [orderBy, setOrderBy],
        filter: [filter, setFilter],
        pagination: [pagination, setPagination],
        statements: [statements, setStatements],
        banks: [banks, setBanks],
        clearFilter,
        getBanksFunc,
      }}
    >
      {children}
    </StatementProviderContext.Provider>
  );
}

export const useStatementContext = () => {
  const context = useContext(StatementProviderContext);

  if (context === undefined)
    throw new Error(
      "useStatementContext must be used within a StatementProviderContext",
    );

  return context;
};
