"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { ReactNode } from "react";
import { generateKey } from "@/lib/utils";

type AreaChartComponentType = {
  chartData: object[];
  dataKey: string;
  chartConfig: ChartConfig;
  header?: ReactNode;
  footer?: ReactNode;
};

export const AreaChartComponent = ({
  chartData,
  dataKey,
  chartConfig,
  header,
  footer,
}: AreaChartComponentType) => {
  return (
    <Card>
      {header}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={dataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {Object.entries(chartConfig).map(([key, item]) => (
              <Line
                key={generateKey()}
                dataKey={key}
                type="linear"
                stroke={item.color}
                strokeWidth={2}
                dot={false}
                name={item.label as string}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {footer}
    </Card>
  );
};
