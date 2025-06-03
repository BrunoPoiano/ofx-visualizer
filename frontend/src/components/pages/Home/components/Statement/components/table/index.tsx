import { generateKey, parseDate } from "@/lib/utils";

import { AppTable } from "@/components/global/appTable";
import { TableInfo } from "./table";
import { useStatementContext } from "../../provider";
import { useHomeContext } from "@/components/pages/Home/provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const Table = ({ small = false }: { small?: boolean }) => {
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
      start_date: parseDate(item.start_date, item.end_date),
      ledger_balance: item.ledger_balance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      balance: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Balances</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="grid gap-2.5">
                  {item.yields.map((yieldItem) => (
                    <Card key={generateKey()}>
                      <CardTitle className="px-6">{yieldItem.name}</CardTitle>
                      <CardContent>
                        <p>{yieldItem.desc}</p>
                        <p>
                          {yieldItem.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
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
