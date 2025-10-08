'use client'

import type { ReactNode } from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { generateKey } from '@/lib/utils'

type AreaChartComponentType = {
	chartData: object[]
	dataKey: string
	chartConfig: ChartConfig
	header?: ReactNode
	footer?: ReactNode
}

export const AreaChartComponent = ({
	chartData,
	dataKey,
	chartConfig,
	header,
	footer,
}: AreaChartComponentType) => {
	return (
		<Card className='min-h-[430px]'>
			{header}
			<CardContent className='max-w-[750px]'>
				<ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
					<LineChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={dataKey}
							tickLine={false}
							axisLine={false}
							tickMargin={10}
							tickFormatter={(value) => value.slice(0, 7)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						{Object.entries(chartConfig).map(([key, item]) => (
							<Line
								key={generateKey()}
								dataKey={key}
								type='linear'
								stroke={item.color}
								strokeWidth={2}
								dot={false}
								name={item.label as string}
							/>
						))}
						<ChartLegend content={<ChartLegendContent />} />
					</LineChart>
				</ChartContainer>
			</CardContent>
			{footer}
		</Card>
	)
}
