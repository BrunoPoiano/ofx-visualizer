import type { PaginationType } from '@/types'
import type { BankType, OrderBy, TypeAndSetState } from '../../types'

export type BanksProviderState = {
	orderBy: TypeAndSetState<OrderBy>
	filter: TypeAndSetState<FilterType>
	pagination: TypeAndSetState<PaginationType>
	banks: TypeAndSetState<BankType[]>
	getBanksFunc: () => void
}

export type FilterType = {
	search: string
}
