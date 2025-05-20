import { AppPagination } from "@/components/global/appPagination";
import { HomeFilter } from "./components/filter";
import { TransactionTable } from "./components/table/dataTable";
import { HomeCards } from "./components/cards/cards";
import { useHomeContext } from "@/Pages/Home/provider";
import { AppHeader } from "./components/header";

export const HomePage = () => {
  const {
    pagination: [pagination, setPagination],
  } = useHomeContext();

  return (
    <>
      <AppHeader />
      <section className="w-full grid gap-2.5">
        <HomeFilter />
        <HomeCards />
        <TransactionTable />
        <AppPagination pagination={pagination} setPagination={setPagination} />
      </section>
    </>
  );
};
