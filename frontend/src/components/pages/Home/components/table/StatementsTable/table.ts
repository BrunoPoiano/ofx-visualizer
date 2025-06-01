import type { StatementType } from "@/Pages/Home/types";

type TableInfoType = {
  id: keyof StatementType;
  label: string;
};

export const TableInfo = <TableInfoType[]>[
  {
    label: "Balance date",
    id: "balance_date",
  },
  {
    label: "Start date",
    id: "start_date",
  },
  {
    label: "End date",
    id: "end_date",
  },
  {
    label: "Ledger balance",
    id: "ledger_balance",
  },
];
