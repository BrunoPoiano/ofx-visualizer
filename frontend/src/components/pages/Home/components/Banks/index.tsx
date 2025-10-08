import { Filter } from './components/filter'
import { Table } from './components/table'
import { BanksProvider } from './provider'

export const BanksSection = () => {
	return (
		<BanksProvider>
			<section className='@container grid w-full gap-2.5'>
				<Filter />
				<Table />
			</section>
		</BanksProvider>
	)
}
