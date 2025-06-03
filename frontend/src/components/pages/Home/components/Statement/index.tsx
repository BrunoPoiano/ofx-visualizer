import { StatementProvider } from "./provider";
import { Table } from "./components/table";
import { Filter } from "./components/filter";
import { Cards } from "./components/cards/cards";

export const StatementsSection = () => {
  return (
    <StatementProvider>
      <section className="@container grid w-full gap-2.5">
        <Filter />
        <Cards />
        <Table />
      </section>
    </StatementProvider>
  );
};
