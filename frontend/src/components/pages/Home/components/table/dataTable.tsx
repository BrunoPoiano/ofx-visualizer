import { AppEllipsis } from "@/components/global/appEllipsis";
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

export const TransactionTable = () => {
  const {
    transactions: [transactions],
  } = useHomeContext();

  return (
    <div className="rounded-md border" style={{ maxWidth: "1280px" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-left" style={{ width: "10ch" }}>
                {parseDate(item.date)}
              </TableCell>
              <TableCell className="text-left" style={{ width: "10ch" }}>
                {item.type}
              </TableCell>
              <TableCell className="text-left" style={{ width: "15ch" }}>
                R$ {item.value}
              </TableCell>
              <TableCell className="text-left" style={{ maxWidth: "30ch" }}>
                <AppEllipsis width="max(30ch,100%)">{item.desc}</AppEllipsis>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
