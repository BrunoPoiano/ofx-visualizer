import { Cards } from './components/cards/cards'
import { Filter } from './components/filter'
import { Table } from './components/table'
import { StatementProvider } from './provider'

export const StatementsSection = () => {
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
