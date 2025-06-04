import { parseDate } from "@/lib/utils";

import { AppTable } from "@/components/global/appTable";
import { TableInfo, TableInfoSmall } from "./table";
import { useHomeContext } from "@/components/pages/Home/provider";
import { useTransactionContext } from "../../provider";
import { DialogInfo } from "./components/DialogInfo";

export const Table = ({ small = false }: { small?: boolean }) => {
  const {
    transactions: [transactions],
    orderBy: [orderBy, setOrderBy],
    pagination: [pagination, setPagination],
  } = useTransactionContext();
  const {
    showValue: [showValue],
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
      comp: <DialogInfo item={item} />,
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
