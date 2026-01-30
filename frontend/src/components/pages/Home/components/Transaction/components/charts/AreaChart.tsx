import moment from 'moment'
import { useEffect, useState } from 'react'
import { AppToggle } from '@/components/global/appToggle'
import { AreaChartComponent } from '@/components/global/chart/areaChart'
import { CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import useLocalStorage from '@/lib/localstorage'
import { useTransactionContext } from '../../provider'

type ChartType = {
	key: string
	positive: number
	negative: number
	total: number
}

export default function AreaChart() {
	const {
		transactions: [transactions]
	} = useTransactionContext()
	const [chartData, setChartData] = useState<ChartType[]>([])
	const [toggle, setToggle] = useLocalStorage('toggle', false)

	const chartConfig = {
		positive: {
			label: 'Positive',
			color: 'var(--chart-2)'
		},
		negative: {
			label: 'Negative',
			color: 'var(--destructive)'
		},
		total: {
			label: 'Total',
			color: 'var(--chart-1)'
		}
	} satisfies ChartConfig

	useEffect(() => {
		const cData: ChartType[] = []

		const format = toggle ? 'MM/YYYY' : 'DD/MM'

		for (const item of transactions) {
			const date = moment(item.date).format(format)
			const key = cData.find((el) => el.key === date)
			if (key) {
				if (item.value > 0) {
					key.positive += item.value
				} else {
					key.negative += Math.abs(item.value)
				}
				key.total += item.value
			} else {
				if (item.value > 0) {
					cData.push({
						key: date,
						positive: item.value,
						negative: 0,
						total: item.value
					})
				} else {
					cData.push({
						key: date,
						positive: 0,
						negative: Math.abs(item.value),
						total: item.value
					})
				}
			}
		}

		cData.sort((a, b) => {
			const monthA = moment(a.key, format)
			const monthB = moment(b.key, format)
			return monthA.isBefore(monthB) ? -1 : 1
		})

		setChartData(cData)
	}, [transactions, toggle])

	return (
		<AreaChartComponent
			header={
				<CardHeader className='items-center pb-0'>
					<CardTitle>Filtered Financial Overview</CardTitle>
					<div className='flex justify-end'>
						<AppToggle
							toggle={[toggle, setToggle]}
							frontLabel='Day'
							backLabel='Month'
						/>
					</div>
				</CardHeader>
			}
			chartData={chartData}
			chartConfig={chartConfig}
			dataKey='key'
		/>
	)
}
