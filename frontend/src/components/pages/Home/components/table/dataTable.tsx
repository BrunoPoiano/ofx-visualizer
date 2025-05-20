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
import { TableInfo } from "./table";

export const TransactionTable = () => {
  const {
    transactions: [transactions],
    showValue: [showValue],
    filter: [filter, setFilter],
  } = useHomeContext();

  const changeOrderBy = (order: string) => {
    let direction = filter.direction;
    if (filter.order === order) {
      direction = direction === "ASC" ? "DESC" : "ASC";
    } else {
      direction = "ASC";
    }
    console.log(filter.order, order, filter.order === order, direction);

    setFilter((prev) => ({ ...prev, order, direction }));
  };

  return (
    <div className="rounded-md border" style={{ maxWidth: "1280px" }}>
      <Table>
        <TableHeader>
          {TableInfo.map((item) => (
            <TableHead key={item.id}>
              <Button
                variant="ghost"
                className="w-full
                t-al"
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
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-left" style={{ width: "10ch" }}>
                {parseDate(item.date)}
              </TableCell>
              <TableCell className="text-left" style={{ width: "10ch" }}>
                {showValue ? item.type : "****"}
              </TableCell>
              <TableCell className="text-left" style={{ width: "15ch" }}>
                R$ {showValue ? item.value : "****"}
              </TableCell>
              <TableCell className="text-left" style={{ maxWidth: "30ch" }}>
                <AppEllipsis>{showValue ? item.desc : "****"}</AppEllipsis>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
