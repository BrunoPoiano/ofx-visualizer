import { AppPagination } from "@/components/global/appPagination";
import { HomeFilter } from "./components/filter";
import { TransactionTable } from "./components/table/dataTable";
import { HomeCards } from "./components/cards/cards";
import { useHomeContext } from "@/Pages/Home/provider";
import { AppHeader } from "./components/header";
import { useState } from "react";
import { AppToggle } from "@/components/global/appToggle";
import { AreaChart } from "./components/charts/AreaChart";
import { PieChartCredit } from "./components/charts/PieChartCredit";
import { PieChartDebit } from "./components/charts/PieChartDebit";

export const HomePage = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <AppHeader />
      <section className="@container grid w-full gap-2.5">
        <HomeFilter />
        <HomeCards />
        <div className="flex justify-end">
          <AppToggle
            toggle={[toggle, setToggle]}
            frontLabel="Graph Mode"
            backLabel="Table Mode"
          />
        </div>
        <TableSection toggle={toggle} />
      </section>
    </>
  );
};

const TableSection = ({ toggle }: { toggle: boolean }) => {
  const {
    pagination: [pagination, setPagination],
  } = useHomeContext();

  if (toggle) {
    return (
      <>
        <TransactionTable />

        <AppPagination pagination={pagination} setPagination={setPagination} />
      </>
    );
  }

  return (
    <div className=" grid @4xl:grid-cols-1 @5xl:grid-cols-2 gap-2.5">
      <AreaChart />
      <PieChartCredit />
      <PieChartDebit />
      <div>
        <TransactionTable small={true} />
        <AppPagination pagination={pagination} setPagination={setPagination} />
      </div>
    </div>
  );
};
