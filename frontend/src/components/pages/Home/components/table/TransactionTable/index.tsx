import { parseDate } from "@/lib/utils";
import { useHomeContext } from "@/Pages/Home/provider";
import { AppTable } from "@/components/global/appTable";
import { TableInfo, TableInfoSmall } from "./table";

export const TransactionTable = ({ small = false }: { small?: boolean }) => {
  const {
    transactions: [transactions],
    showValue: [showValue],
    orderBy: [orderBy, setOrderBy],
    pagination: [pagination, setPagination],
  } = useHomeContext();

  const tableData = transactions.map((item) => {
    return {
      id: item.id,
      date: parseDate(item.date),
      type: item.type as string,
      value: item.value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      desc: item.desc,
      bank_id: item.bank_id.toString(),
    };
  });

  return (
    <AppTable<(typeof tableData)[0]>
      orderBy={[orderBy, setOrderBy]}
      pagination={[pagination, setPagination]}
      tableData={tableData}
      showValue={showValue}
      tableContentSmall={TableInfoSmall}
      tableContent={TableInfo}
      small={small}
    />
  );
};
