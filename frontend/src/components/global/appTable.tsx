import type { OrderBy } from "@/Pages/Home/types";
import { ArrowSVG } from "../icons/arrowUp";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AppEllipsis } from "./appEllipsis";
import { AppPagination } from "./appPagination";
import { generateKey } from "@/lib/utils";
import type { PaginationType } from "@/types";

type TableContent = {
  label: string;
  id: string;
};

type AppTableProps<T extends { [key: string]: string }> = {
  small?: boolean | undefined;
  tableContentSmall?: TableContent[];
  tableContent: TableContent[];
  orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>];
  showValue: boolean;
  pagination: [
    PaginationType,
    React.Dispatch<React.SetStateAction<PaginationType>>,
  ];
  tableData: T[];
};

export const AppTable = <T extends { [key: string]: string }>({
  small = false,
  tableContentSmall,
  tableContent,
  orderBy: [orderBy, setOrderBy],
  pagination: [pagination, setPagination],
  showValue,
  tableData,
}: AppTableProps<T>) => {
  const changeOrderBy = (order: string) => {
    let direction = orderBy.direction;
    if (orderBy.order === order) {
      direction = direction === "ASC" ? "DESC" : "ASC";
    } else {
      direction = "ASC";
    }

    setOrderBy(() => ({ direction, order }));
  };

  return (
    <div className="grid gap-3.5">
      <div className="rounded-md border" style={{ maxWidth: "1280px" }}>
        <ScrollArea className={`${small ? "h-76" : "h-150"} w-full`}>
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                {(small && tableContentSmall
                  ? tableContentSmall
                  : tableContent
                ).map((item) => (
                  <TableHead key={item.id}>
                    <Button
                      variant="ghost"
                      className="t-al w-full"
                      onClick={() => changeOrderBy(item.id)}
                    >
                      {item.label}{" "}
                      <ArrowSVG
                        direction={
                          orderBy.order === item.id &&
                          orderBy.direction === "ASC"
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
              {tableData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No content found.
                  </TableCell>
                </TableRow>
              )}
              {tableData.map((item) => (
                <TableRow key={generateKey()}>
                  {(small && tableContentSmall
                    ? tableContentSmall
                    : tableContent
                  ).map((info) => (
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
                        <AppEllipsis>{(item as T)[info.id]}</AppEllipsis>
                      ) : (
                        "****"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <AppPagination pagination={pagination} setPagination={setPagination} />
    </div>
  );
};
