import { lazy } from 'react'
import { Filter } from './components/filter'
import { BanksProvider } from './provider'

const Table = lazy(() => import('./components/table'))

export default function BanksSection() {
	return (
		<BanksProvider>
			<section className='@container grid w-full gap-2.5'>
				<Filter />
				<Table />
			</section>
		</BanksProvider>
	)
}
