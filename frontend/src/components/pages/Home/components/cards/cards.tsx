import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { useHomeContext } from "@/Pages/Home/provider";

export const HomeCards = () => {
  const {
    filter: [filter, setFilter],
  } = useHomeContext();

  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
      <Card>
        <CardTitle>Total Expending</CardTitle>
        <CardFooter>
          <Button>Teste</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardTitle>Total Earning</CardTitle>
        <CardFooter>
          <Button>Teste</Button>
        </CardFooter>
      </Card>
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
