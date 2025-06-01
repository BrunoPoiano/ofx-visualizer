import { parseDate } from "@/lib/utils";
import { useHomeContext } from "@/Pages/Home/provider";
import { AppTable } from "@/components/global/appTable";
import { TableInfo } from "./table";

export const StatementsTable = ({ small = false }: { small?: boolean }) => {
  const {
    statements: [statements],
    showValue: [showValue],
    orderBy: [orderBy, setOrderBy],
    pagination: [pagination, setPagination],
  } = useHomeContext();

  const tableData = statements.map((item) => {
    return {
      balance_date: parseDate(item.balance_date),
      start_date: parseDate(item.start_date),
      end_date: parseDate(item.end_date),
      ledger_balance: item.ledger_balance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    };
  });

  return (
    <AppTable<(typeof tableData)[0]>
      orderBy={[orderBy, setOrderBy]}
      pagination={[pagination, setPagination]}
      tableData={tableData}
      showValue={showValue}
      tableContent={TableInfo}
      small={small}
    />
  );
};
