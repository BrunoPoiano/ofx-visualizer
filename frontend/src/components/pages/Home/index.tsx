import { AppPagination } from "@/components/global/appPagination";
import { HomeFilter } from "./components/filter";
import { TransactionTable } from "./components/table/dataTable";
import { HomeCards } from "./components/cards/cards";
import { useHomeContext } from "@/Pages/Home/provider";
import { AppHeader } from "./components/header";
import { HomeChart } from "./components/chart/chart";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export const HomePage = () => {
  const {
    pagination: [pagination, setPagination],
  } = useHomeContext();

  const [toggle, settoggle] = useState(false);

  return (
    <>
      <AppHeader />
      <section className="grid w-full gap-2.5">
        <HomeFilter />
        <HomeCards />
        <div className="flex items-center space-x-2">
          <label htmlFor="airplane-mode">Graph Mode</label>
          <Switch
            id="airplane-mode"
            checked={toggle}
            onCheckedChange={() => settoggle(!toggle)}
          />
          <label htmlFor="airplane-mode">Table Mode</label>
        </div>
        {toggle ? (
          <>
            <TransactionTable />
            <AppPagination
              pagination={pagination}
              setPagination={setPagination}
            />
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <HomeChart />
            </div>
            <div>
              <TransactionTable small={true} />
              <AppPagination
                pagination={pagination}
                setPagination={setPagination}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};
