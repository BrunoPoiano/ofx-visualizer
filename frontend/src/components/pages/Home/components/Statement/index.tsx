import { lazy } from 'react'
import { Cards } from './components/cards/cards'
import { Filter } from './components/filter'
import { StatementProvider } from './provider'

const Table = lazy(() => import('./components/table'))

export default function StatementsSection() {
	return (
		<StatementProvider>
			<section className='@container grid w-full gap-2.5'>
				<Filter />
				<Cards />
				<Table />
			</section>
		</StatementProvider>
	)
}
