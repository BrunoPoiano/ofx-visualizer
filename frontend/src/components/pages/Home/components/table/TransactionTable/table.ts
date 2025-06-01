import type { TransactionType } from "@/Pages/Home/types";

export type TableInfoType = {
  id: keyof TransactionType;
  label: string;
};

export const TableInfo = <TableInfoType[]>[
  {
    label: "Date",
    id: "date",
  },
  {
    label: "Type",
    id: "type",
  },
  {
    label: "Value",
    id: "value",
  },
  {
    label: "Description",
    id: "desc",
  },
];

export const TableInfoSmall = <TableInfoType[]>[
  {
    label: "Date",
    id: "date",
  },
  {
    label: "Type",
    id: "type",
  },
  {
    label: "Value",
    id: "value",
  },
];
