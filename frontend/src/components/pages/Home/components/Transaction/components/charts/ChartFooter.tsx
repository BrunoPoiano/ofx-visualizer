import { formatMoney, generateKey } from '@/lib/utils'
import type { ChartType } from './types'
import { CardFooter } from '@/components/ui/card'

export const ChartFooter = ({ chartData }: { chartData: ChartType[] }) => (
	<CardFooter>
		<ul className='w-full'>
			{chartData.map((item, index) => (
				<li
					key={generateKey()}
					title={item.to.replace(/-/g, ' ')}
					className='flex cursor-default items-center gap-1.5'
				>
					<div
						className='h-3.5 w-3.5'
						style={{
							background: `var(--chart-${index + 1})`,
							borderRadius: '100%'
						}}
					/>
					<div className='w-[25ch] truncate text-left'>
						{item.to.replace(/-/g, ' ')}
					</div>
					<span className='ml-auto'>{formatMoney(item.value)}</span>
				</li>
			))}
		</ul>
	</CardFooter>
)
