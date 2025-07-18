import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

import { generateKey } from "@/lib/utils";
import { useTransactionContext } from "../../provider";
import { useHomeContext } from "@/components/pages/Home/provider";

type FilteredTransactionType = {
  positive: number;
  negative: number;
  value: number;
};

type CardWrapperType = {
  label: string;
  value: number;
  color: string;
};

export const Cards = () => {
  const {
    transactionsInfo: [transactionsInfo],
    transactions: [transactions],
  } = useTransactionContext();

  const {
    defaultFilter: [defaultFilter, setDefaultFilter],
  } = useHomeContext();

  const filteredTransaction = transactions.reduce<FilteredTransactionType>(
    (acc, item) => {
      if (item.value > 0) {
        acc.positive += item.value;
      } else {
        acc.negative += item.value;
      }

      acc.value += item.value;

      return acc;
    },
    { positive: 0, negative: 0, value: 0 },
  );

  const cards: CardWrapperType[] = [
    {
      label: "Total Expending",
      color: "var(--destructive)",
      value: transactionsInfo?.negative || 0,
    },
    {
      label: "Total Earning",
      color: "var(--chart-2)",
      value: transactionsInfo?.positive || 0,
    },
    {
      label: "Total Revenue",
      color:
        transactionsInfo && transactionsInfo?.value > 0
          ? "var(--chart-2)"
          : "var(--destructive)",
      value: transactionsInfo?.value || 0,
    },
    {
      label: "Filtered Expending",
      color: "var(--destructive)",
      value: filteredTransaction.negative,
    },
    {
      label: "Filtered Earning",
      color: "var(--chart-2)",
      value: filteredTransaction.positive,
    },
    {
      label: "Filtered Revenue",
      color:
        filteredTransaction?.value > 0
          ? "var(--chart-2)"
          : "var(--destructive)",
      value: filteredTransaction?.value,
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2.5">
      <Calendar
        defaultMonth={defaultFilter.date?.from || new Date()}
        mode="range"
        className="rounded-md border shadow"
        style={{ gridArea: "span 2 / 1" }}
        selected={defaultFilter.date}
        onSelect={(e: DateRange | undefined) => {
          setDefaultFilter((prev) => ({ ...prev, date: e }));
        }}
      />
      {cards.map((card) => (
        <CardWrapper
          key={generateKey()}
          label={card.label}
          value={card.value}
          color={card.color}
        />
      ))}
    </div>
  );
};

const CardWrapper = ({ label, value, color }: CardWrapperType) => {
  const {
    showValue: [showValue],
  } = useHomeContext();

  return (
    <Card>
      <CardTitle>{label}</CardTitle>
      <CardContent>
        <span
          className="font-bold text-2xl"
          style={{
            color: color,
          }}
        >
          {showValue
            ? `${value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}`
            : "****"}
        </span>
      </CardContent>
    </Card>
  );
};
