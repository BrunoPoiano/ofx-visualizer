import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHomeContext } from "../../provider";

export const TransactionTable = () => {
  const {
    transactions: [transactions],
  } = useHomeContext();

  return (
    <div className="rounded-md border" style={{ maxWidth: "1280px" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-left">{item.type}</TableCell>
              <TableCell className="text-left">R$ {item.value}</TableCell>
              <TableCell className="text-left" style={{ maxWidth: "30ch" }}>
                {item.desc}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
