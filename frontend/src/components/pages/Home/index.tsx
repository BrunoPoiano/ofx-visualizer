import { HomeFilter } from "./components/filter";
import { TransactionTable } from "./components/table/dataTable";
import { HomeCards } from "./components/cards/cards";
import { AppHeader } from "./components/header";
import { AppToggle } from "@/components/global/appToggle";
import { AreaChart } from "./components/charts/AreaChart";
import { PieChartCredit } from "./components/charts/PieChartCredit";
import { PieChartDebit } from "./components/charts/PieChartDebit";
import useLocalStorage from "@/lib/localstorage";

export const HomePage = () => {
  const [toggle, setToggle] = useLocalStorage("toggle", false);

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
  if (toggle) {
    return <TransactionTable />;
  }

  const card = "w-full max-h-[500px] p-0 mb-[20px]  break-inside-avoid";

  return (
    <div className="gap-x-2.5 p-0 md:columns-1 lg:columns-2">
      <div className={card}>
        <AreaChart />
      </div>
      <div className={card}>
        <PieChartCredit />
      </div>
      <div className={card}>
        <TransactionTable small={true} />
      </div>
      <div className={card}>
        <PieChartDebit />
      </div>
    </div>
  );
};
