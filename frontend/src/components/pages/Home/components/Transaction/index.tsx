import { AppToggle } from '@/components/global/appToggle'
import useLocalStorage from '@/lib/localstorage'
import { Cards } from './components/cards/cards'
import { TransactionProvider } from './provider'
import { lazy } from 'react'

const Filter = lazy(() => import('./components/filter'))
const Table = lazy(() => import('./components/table'))
const AreaChart = lazy(() => import('./components/charts/AreaChart'))
const PieChartCredit = lazy(() => import('./components/charts/PieChartCredit'))
const PieChartDebit = lazy(() => import('./components/charts/PieChartDebit'))

export default function TransactionSection() {
	return (
		<TransactionProvider>
			<section className='@container grid w-full gap-2.5'>
				<Filter />
				<Cards />

				<TransactionsSection />
			</section>
		</TransactionProvider>
	)
}

const TransactionsSection = () => {
	const [toggle, setToggle] = useLocalStorage('toggle', false)

	const card = 'w-full max-h-[500px] p-0 mb-[20px]  break-inside-avoid'

	return (
		<>
			<div className='flex justify-end'>
				<AppToggle
					toggle={[toggle, setToggle]}
					frontLabel='Graph Mode'
					backLabel='Table Mode'
				/>
			</div>
			{toggle ? (
				<Table />
			) : (
				<div className='gap-x-2.5 p-0 md:columns-1 lg:columns-2'>
					<div className={card}>
						<AreaChart />
					</div>
					<div className={card}>
						<PieChartCredit />
					</div>
					<div className={card}>
						<Table small={true} />
					</div>
					<div className={card}>
						<PieChartDebit />
					</div>
				</div>
			)}
		</>
	)
}
