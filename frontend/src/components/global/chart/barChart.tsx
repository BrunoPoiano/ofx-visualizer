'use client'

import { AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart'
import type { ReactNode } from 'react'

type BarChartComponentType = {
	chartData: object[]
	dataKey: string
	chartConfig: ChartConfig
	children?: ReactNode
}

export const BarChartComponent: React.FC<BarChartComponentType> = ({
	chartData,
	dataKey,
	chartConfig,
	children
}) => {
	return (
		<ChartContainer
			config={chartConfig}
			className='w-full'
			style={{ height: 'min(400px, 100%)' }}
		>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 12,
					right: 12
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey={dataKey}
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				{children}
			</AreaChart>
		</ChartContainer>
	)
}
