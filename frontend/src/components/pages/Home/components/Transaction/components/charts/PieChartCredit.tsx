import { PieChartComponent } from "@/components/global/chart/piechart";
import { CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";

import { useEffect, useState } from "react";
import { useTransactionContext } from "../../provider";

type ChartType = {
  to: string;
  value: number;
  fill: string;
};

export const PieChartCredit = () => {
  const {
    transactions: [transactions],
  } = useTransactionContext();
  const [chartData, setChartData] = useState<ChartType[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  useEffect(() => {
    const cData: ChartType[] = [];
    const cConfig: ChartConfig = {};

    for (const item of transactions) {
      if (item.type !== "CREDIT") continue;
      const desc = item.desc.replace(/ /g, "-").toLowerCase();

      const data = cData.find((el) => el.to === desc);

      if (data) {
        data.value += item.value;
      } else {
        cData.push({
          to: desc,
          value: item.value,
          fill: `var(--color-${desc})`,
        });
      }
    }

    if (cData.length > 5) cData.splice(5);

    cData.sort((a, b) => {
      return b.value - a.value;
    });

    let i = 1;
    for (const cd of cData) {
      cConfig[cd.to] = {
        label: cd.to,
        color: `var(--chart-${i})`,
      };
      i++;
    }

    setChartConfig(cConfig satisfies ChartConfig);
    setChartData(cData);
  }, [transactions]);

  return (
    <PieChartComponent
      header={
        <CardHeader className="items-center pb-0">
          <CardTitle>Credit Transactions</CardTitle>
        </CardHeader>
      }
      chartData={chartData}
      chartConfig={{
        ...chartConfig,
      }}
      dataKey="value"
      nameKey="to"
    />
  );
};
