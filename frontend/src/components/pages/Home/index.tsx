import { AppPagination } from "@/components/global/appPagination";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HomeFilter } from "./components/filter";
import { TransactionTable } from "./components/table/dataTable";
import { useHomeContext } from "./provider";
import { HomeCards } from "./components/cards/cards";

export const HomePage = () => {
  const {
    pagination: [pagination, setPagination],
  } = useHomeContext();

  return (
    <section className="grid gap-3.5">
      <div>
        <ModeToggle />
      </div>
      <HomeFilter />
      <HomeCards />
      <div>
        <TransactionTable />
      </div>
      <AppPagination pagination={pagination} setPagination={setPagination} />
    </section>
  );
};
