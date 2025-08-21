'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import type { ReactNode } from 'react';

type PieChartComponentType = {
	chartData: object[];
	dataKey: string;
	nameKey: string;
	header?: ReactNode;
	chartConfig: ChartConfig;
};

export const PieChartComponent: React.FC<PieChartComponentType> = ({
	chartData,
	dataKey,
	nameKey,
	chartConfig,
	header,
}) => {
	return (
		<Card className='flex flex-col'>
			{header}
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px] px-0'
				>
					<PieChart>
						<ChartTooltip
							content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
						/>
						<Pie
							data={chartData}
							nameKey={nameKey}
							dataKey={dataKey}
							labelLine={false}
							label={({ payload, ...props }) => {
								return (
									<text
										cx={props.cx}
										cy={props.cy}
										x={props.x}
										y={props.y}
										textAnchor={props.textAnchor}
										dominantBaseline={props.dominantBaseline}
										fill='hsla(var(--foreground))'
									>
										{payload[dataKey]}
									</text>
								);
							}}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
