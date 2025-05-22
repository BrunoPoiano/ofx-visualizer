import { AreaChartComponent } from "@/components/global/chart/areaChart";
import type { ChartConfig } from "@/components/ui/chart";
import { useHomeContext } from "@/Pages/Home/provider";
import moment from "moment";
import { useEffect, useState } from "react";

type ChartType = {
  month: string;
  positive: number;
  negative: number;
  total: number;
};

export const HomeChart = () => {
  const {
    transactions: [transactions],
  } = useHomeContext();
  const [chartData, setChartData] = useState<ChartType[]>([]);
  const chartConfig = {
    positive: {
      label: "positive",
      color: "var(--chart-2)",
    },
    negative: {
      label: "negative",
      color: "var(--destructive)",
    },
    total: {
      label: "total",
      color: "var(--default)",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const cData: ChartType[] = [];

    for (const item of transactions) {
      const date = moment(item.date).format("MMMM");
      const month = cData.find((el) => el.month === date);
      if (month) {
        if (item.value > 0) {
          month.positive += item.value;
        } else {
          month.negative += item.value;
        }
        month.total += item.value;
      } else {
        if (item.value > 0) {
          cData.push({
            month: date,
            positive: item.value,
            negative: 0,
            total: item.value,
          });
        } else {
          cData.push({
            month: date,
            positive: 0,
            negative: item.value,
            total: item.value,
          });
        }
      }
    }

    setChartData(cData);
  }, [transactions]);

  return (
    <AreaChartComponent
      chartData={chartData}
      chartConfig={chartConfig}
      dataKey="month"
    />
  );
};
