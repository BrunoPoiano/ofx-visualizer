import type { PaginationType } from '@/types'
import type { OrderBy, TransactionInfoType, TransactionType } from '../../types'

export type TransactionProviderState = {
	orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>]
	filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>]
	pagination: [
		PaginationType,
		React.Dispatch<React.SetStateAction<PaginationType>>,
	]
	transactions: [
		TransactionType[],
		React.Dispatch<React.SetStateAction<TransactionType[]>>,
	]

	transactionsInfo: [
		TransactionInfoType | undefined,
		React.Dispatch<React.SetStateAction<TransactionInfoType | undefined>>,
	]
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
}
