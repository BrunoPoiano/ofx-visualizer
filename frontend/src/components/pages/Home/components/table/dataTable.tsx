import { AppEllipsis } from "@/components/global/appEllipsis";
import { ArrowSVG } from "@/components/icons/arrowUp";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseDate } from "@/lib/utils";
import { useHomeContext } from "@/Pages/Home/provider";
import { TableInfo, TableInfoSmall } from "./table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppPagination } from "@/components/global/appPagination";

export const TransactionTable = ({ small = false }: { small?: boolean }) => {
  const {
    transactions: [transactions],
    showValue: [showValue],
    filter: [filter, setFilter],
    pagination: [pagination, setPagination],
  } = useHomeContext();

  const tableData = transactions.map((item) => {
    return {
      id: item.id,
      date: parseDate(item.date),
      type: item.type,
      value: item.value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      desc: item.desc,
      bank_id: item.bank_id,
    };
  });

  const changeOrderBy = (order: string) => {
    let direction = filter.direction;
    if (filter.order === order) {
      direction = direction === "ASC" ? "DESC" : "ASC";
    } else {
      direction = "ASC";
    }

    setFilter((prev) => ({ ...prev, order, direction }));
  };

  return (
    <div className="grid gap-3.5">
      <div className="rounded-md border" style={{ maxWidth: "1280px" }}>
        <Table>
          <ScrollArea className={`${small ? "h-76" : "h-150"} w-full`}>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                {(small ? TableInfoSmall : TableInfo).map((item) => (
                  <TableHead key={item.id}>
                    <Button
                      variant="ghost"
                      className="t-al w-full"
                      onClick={() => changeOrderBy(item.id)}
                    >
                      {item.label}{" "}
                      <ArrowSVG
                        direction={
                          filter.order === item.id && filter.direction === "ASC"
                            ? "up"
                            : "down"
                        }
                      />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
              {tableData.map((item) => (
                <TableRow key={item.id}>
                  {(small ? TableInfoSmall : TableInfo).map((info) => (
                    <TableCell
                      key={info.id}
                      className="text-left"
                      style={
                        info.id === "desc"
                          ? { maxWidth: "30ch" }
                          : { width: "10ch" }
                      }
                    >
                      {showValue ? (
                        <AppEllipsis>
                          {(item as (typeof tableData)[0])[info.id]}
                        </AppEllipsis>
                      ) : (
                        "****"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <AppPagination pagination={pagination} setPagination={setPagination} />
    </div>
  );
};
