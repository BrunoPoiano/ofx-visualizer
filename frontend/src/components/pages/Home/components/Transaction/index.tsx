import { AppToggle } from "@/components/global/appToggle";
import { HomeCards } from "./components/cards/cards";
import { HomeFilter } from "./components/filter";
import useLocalStorage from "@/lib/localstorage";
import { AreaChart } from "./components/charts/AreaChart";
import { PieChartCredit } from "./components/charts/PieChartCredit";
import { PieChartDebit } from "./components/charts/PieChartDebit";
import { TransactionProvider } from "./provider";
import { TransactionTable } from "./components/table";

export const TransactionSection = () => {
  return (
    <TransactionProvider>
      <section className="@container grid w-full gap-2.5">
        <HomeFilter />
        <HomeCards />

        <TransactionsSection />
      </section>
    </TransactionProvider>
  );
};

const TransactionsSection = () => {
  const [toggle, setToggle] = useLocalStorage("toggle", false);

  const card = "w-full max-h-[500px] p-0 mb-[20px]  break-inside-avoid";

  return (
    <>
      <div className="flex justify-end">
        <AppToggle
          toggle={[toggle, setToggle]}
          frontLabel="Graph Mode"
          backLabel="Table Mode"
        />
      </div>
      {toggle ? (
        <TransactionTable />
      ) : (
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
      )}
    </>
  );
};
