import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { useHomeContext } from "@/Pages/Home/provider";

export const HomeCards = () => {
  const {
    filter: [filter, setFilter],
    transactionsInfo: [transactionsInfo, setTransactionsInfo],
  } = useHomeContext();

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2.5">
      <div className="grid grid-cols-[1fr_1fr] gap-2.5">
        <Card>
          <CardTitle>Total Expending</CardTitle>
          <CardContent>
            <span
              className="text-2xl font-bold"
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
              className="text-2xl font-bold"
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
              className="text-2xl font-bold"
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
