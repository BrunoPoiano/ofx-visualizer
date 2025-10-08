import type { PaginationType } from '@/types'
import type { BankType, OrderBy } from '../../types'

export type BanksProviderState = {
	orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>]
	filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>]
	pagination: [
		PaginationType,
		React.Dispatch<React.SetStateAction<PaginationType>>
	]
	banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>]
	getBanksFunc: () => void
}

export type FilterType = {
	search: string
}
