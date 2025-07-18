import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { BankType, DefaultFilterType } from "./types";
import useLocalStorage from "@/lib/localstorage";
import { getBanks } from "./functions";

export type HomeProviderState = {
  showValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  defaultFilter: [
    DefaultFilterType,
    React.Dispatch<React.SetStateAction<DefaultFilterType>>,
  ];
  banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>];
  getBanksFunc: () => void;
};

const HomeProviderContext = createContext<HomeProviderState>(
  {} as HomeProviderState,
);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [showValue, setShowValue] = useState(true);
  const [banks, setBanks] = useState<BankType[]>([]);
  const [defaultFilter, setDefaultFilter] = useLocalStorage<DefaultFilterType>(
    "DEFAULT_FILTER",
    {
      date: undefined,
      bank_id: "",
    },
  );

  const getBanksFunc = useCallback(async () => {
    const { data } = await getBanks({
      current_page: "1",
      per_page: "1000",
    });
    setBanks(() => {
      if (defaultFilter.bank_id === "") {
        setDefaultFilter((prev_filter) => ({
          ...prev_filter,
          bank_id: data[0].id.toString(),
        }));
      }
      return data;
    });
  }, []);

  useEffect(() => {
    getBanksFunc();
  }, [getBanksFunc]);

  return (
    <HomeProviderContext.Provider
      value={{
        showValue: [showValue, setShowValue],
        defaultFilter: [defaultFilter, setDefaultFilter],
        banks: [banks, setBanks],
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
