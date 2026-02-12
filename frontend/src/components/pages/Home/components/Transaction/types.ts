import type { PaginationType } from '@/types'
import type {
	OrderBy,
	TransactionInfoType,
	TransactionType,
	TypeAndSetState
} from '../../types'

export type TransactionProviderState = {
	orderBy: TypeAndSetState<OrderBy>
	filter: TypeAndSetState<FilterType>
	pagination: TypeAndSetState<PaginationType>
	transactions: TypeAndSetState<TransactionType[]>
	transactionsInfo: TypeAndSetState<TransactionInfoType | undefined>
	setTag: (tag: string) => void
	clearFilter: () => void
	getTransactionsFunc: () => void
	getTransactionInfoFunc: () => void
}

export type TransactionProviderProps = {
	children: React.ReactNode
}

export type FilterType = {
	search: string
	minValue?: number
	maxValue?: number
	type: string
	tag: string
}
