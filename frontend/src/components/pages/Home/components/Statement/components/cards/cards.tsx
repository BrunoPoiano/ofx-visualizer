import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'

import { useHomeContext } from '@/components/pages/Home/provider'
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from '@/components/ui/card'
import { parseDate } from '@/lib/utils'
import { useStatementContext } from '../../provider'

export const Cards = () => {
	const {
		defaultFilter: [defaultFilter, setDefaultFilter],
		showValue: [showValue],
	} = useHomeContext()

	const { currentBalance, largestBalance } = useStatementContext()

	return (
		<div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2.5'>
			<Calendar
				defaultMonth={defaultFilter.date?.from || new Date()}
				mode='range'
				className='rounded-md border shadow'
				style={{ gridArea: 'span 2 / 1' }}
				selected={defaultFilter.date}
				onSelect={(e: DateRange | undefined) => {
					setDefaultFilter((prev) => ({ ...prev, date: e }))
				}}
			/>
			{largestBalance && (
				<Card>
					<CardTitle>Largest Balance</CardTitle>
					<CardContent
						className='font-bold text-2xl'
						style={{ color: 'var(--chart-2)' }}
					>
						{showValue
							? `${largestBalance.ledger_balance.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								})}`
							: '****'}
					</CardContent>
					<CardDescription>
						{parseDate(largestBalance.start_date, largestBalance.end_date)}
					</CardDescription>
				</Card>
			)}
			{currentBalance && (
				<Card>
					<CardTitle>Latest Balance</CardTitle>
					<CardContent
						className='font-bold text-2xl'
						style={{ color: 'var(--chart-2)' }}
					>
						{showValue
							? `${currentBalance.ledger_balance.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								})}`
							: '****'}
					</CardContent>
					<CardDescription>
						{parseDate(currentBalance.start_date, currentBalance.end_date)}
					</CardDescription>
				</Card>
			)}
		</div>
	)
}
