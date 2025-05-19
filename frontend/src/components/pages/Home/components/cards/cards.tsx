import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

import { useHomeContext } from "../../provider";
import type { DateRange } from "react-day-picker";

export const HomeCards = () => {
  const {
    filter: [filter, setFilter],
  } = useHomeContext();

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2.5">
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
