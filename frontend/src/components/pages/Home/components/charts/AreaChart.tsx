import { AreaChartComponent } from "@/components/global/chart/areaChart";
import { CardHeader, CardTitle } from "@/components/ui/card";
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

export const AreaChart = () => {
	const {
		transactions: [transactions],
	} = useHomeContext();
	const [chartData, setChartData] = useState<ChartType[]>([]);
	const chartConfig = {
		positive: {
			label: "Positive",
			color: "var(--chart-2)",
		},
		negative: {
			label: "Negative",
			color: "var(--destructive)",
		},
		total: {
			label: "Total",
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;

	useEffect(() => {
		const cData: ChartType[] = [];

		for (const item of transactions) {
			const date = moment(item.date).format("YYYY/MM");
			const month = cData.find((el) => el.month === date);
			if (month) {
				if (item.value > 0) {
					month.positive += item.value;
				} else {
					month.negative += Math.abs(item.value);
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
						negative: Math.abs(item.value),
						total: item.value,
					});
				}
			}
		}

		// Sort the data by month
		cData.sort((a, b) => {
			const monthA = moment(a.month, "YYYY/MMMM").month();
			const monthB = moment(b.month, "YYYY/MMMM").month();
			return monthA - monthB;
		});

		setChartData(cData);
	}, [transactions]);

	return (
		<AreaChartComponent
			header={
				<CardHeader className="items-center pb-0">
					<CardTitle>Filtered Financial Overview</CardTitle>
				</CardHeader>
			}
			chartData={chartData}
			chartConfig={chartConfig}
			dataKey="month"
		/>
	);
};
