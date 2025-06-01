import { parseDate } from "@/lib/utils";

import { AppTable } from "@/components/global/appTable";
import { TableInfo } from "./table";
import { useStatementContext } from "../../provider";
import { useHomeContext } from "@/components/pages/Home/provider";

export const StatementsTable = ({ small = false }: { small?: boolean }) => {
  const {
    statements: [statements],
    orderBy: [orderBy, setOrderBy],
    pagination: [pagination, setPagination],
  } = useStatementContext();
  const {
    showValue: [showValue],
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
