import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { useHomeContext } from "@/Pages/Home/provider";

type FilteredTransactionType = {
  positive: number;
  negative: number;
  value: number;
};

export const HomeCards = () => {
  const {
    filter: [filter, setFilter],
    transactionsInfo: [transactionsInfo],
    transactions: [transactions],
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

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2.5">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2.5">
        <Card>
          <CardTitle>Total Expending</CardTitle>
          <CardContent>
            <span
              className="font-bold text-2xl"
              style={{ color: "var(--destructive)" }}
            >
              R$ {transactionsInfo?.negative.toFixed(2)}
            </span>
            {/* <p className="text-xs text-muted-foreground"></p> */}
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Total Earning</CardTitle>
          <CardContent>
            <span
              className="font-bold text-2xl"
              style={{ color: "var(--chart-2)" }}
            >
              R$ {transactionsInfo?.positive.toFixed(2)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Total Revenue</CardTitle>
          <CardContent>
            <span
              className="font-bold text-2xl"
              style={{
                color:
                  transactionsInfo && transactionsInfo?.value > 0
                    ? "var(--chart-2)"
                    : "var(--destructive)",
              }}
            >
              R$ {transactionsInfo?.value.toFixed(2)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Filtered Expending</CardTitle>
          <CardContent>
            <span
              className="font-bold text-2xl"
              style={{ color: "var(--destructive)" }}
            >
              R$ {filteredTransaction.negative.toFixed(2)}
            </span>
            {/* <p className="text-xs text-muted-foreground"></p> */}
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Filtered Earning</CardTitle>
          <CardContent>
            <span
              className="font-bold text-2xl"
              style={{ color: "var(--chart-2)" }}
            >
              R$ {filteredTransaction?.positive.toFixed(2)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Filtered Revenue</CardTitle>
          <CardContent>
            <span
              className="font-bold text-2xl"
              style={{
                color:
                  filteredTransaction && filteredTransaction?.value > 0
                    ? "var(--chart-2)"
                    : "var(--destructive)",
              }}
            >
              R$ {filteredTransaction?.value.toFixed(2)}
            </span>
          </CardContent>
        </Card>
      </div>
      <Calendar
        mode="range"
        className="rounded-md border shadow "
        selected={filter.date}
        onSelect={(e: DateRange | undefined) => {
          setFilter((prev) => ({ ...prev, date: e }));
        }}
      />
    </div>
  );
};
