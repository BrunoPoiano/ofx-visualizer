import { useEffect, useState } from 'react';
import { PieChartComponent } from '@/components/global/chart/piechart';
import { CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { useTransactionContext } from '../../provider';

type ChartType = {
	to: string;
	value: number;
	fill: string;
};

export const PieChartDebit = () => {
	const {
		transactions: [transactions],
	} = useTransactionContext();
	const [chartData, setChartData] = useState<ChartType[]>([]);
	const [chartConfig, setChartConfig] = useState<ChartConfig>({});

	useEffect(() => {
		const cData: ChartType[] = [];
		const cConfig: ChartConfig = {};

		for (const item of transactions) {
			if (item.type !== 'DEBIT') continue;

			const desc = item.desc.replace(/ /g, '-').toLowerCase();

			const data = cData.find((el) => el.to === desc);
			if (data) {
				data.value += item.value * -1;
			} else {
				cData.push({
					to: desc,
					value: item.value * -1,
					fill: `var(--color-${desc})`,
				});
			}
		}

		cData.sort((a, b) => {
			return b.value - a.value;
		});

		if (cData.length > 5) cData.splice(5);

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
				<CardHeader className='items-center pb-0'>
					<CardTitle>Debit Breakdown</CardTitle>
				</CardHeader>
			}
			chartData={chartData}
			chartConfig={chartConfig}
			dataKey='value'
			nameKey='to'
		/>
	);
};
