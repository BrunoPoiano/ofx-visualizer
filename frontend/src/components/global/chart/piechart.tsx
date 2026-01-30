'use client'

import { Pie, PieChart, type PieLabelRenderProps } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import type { ReactNode } from 'react'

type PieChartComponentType = {
	chartData: object[]
	dataKey: string
	nameKey: string
	header?: ReactNode
	footer?: ReactNode
	chartConfig: ChartConfig
	tooltip?: true
}

export const PieChartComponent: React.FC<PieChartComponentType> = ({
	chartData,
	dataKey,
	nameKey,
	chartConfig,
	header,
	footer,
	tooltip
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
						{tooltip && (
							<ChartTooltip
								content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
							/>
						)}
						<Pie
							data={chartData}
							nameKey={nameKey}
							dataKey={dataKey}
							labelLine={false}
							label={renderCustomizedLabel}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			{footer}
		</Card>
	)
}
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent
}: PieLabelRenderProps) => {
	if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
		return null
	}
	const radius =
		Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
	const ncx = Number(cx)
	const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
	const ncy = Number(cy)
	const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

	return (
		<text
			x={x}
			y={y}
			fill='white'
			textAnchor={x > ncx ? 'start' : 'end'}
			dominantBaseline='central'
		>
			{`${((percent ?? 1) * 100).toFixed(0)}%`}
		</text>
	)
}
