import { AppPagination } from "@/components/global/appPagination";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HomeFilter } from "./components/filter";
import { TransactionTable } from "./components/table/dataTable";
import { HomeCards } from "./components/cards/cards";
import { useHomeContext } from "@/Pages/Home/provider";

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
      <TransactionTable />
      <AppPagination pagination={pagination} setPagination={setPagination} />
    </section>
  );
};
