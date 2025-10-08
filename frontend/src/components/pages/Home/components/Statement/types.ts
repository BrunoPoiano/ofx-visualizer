import type { PaginationType } from '@/types'
import type { OrderBy, StatementType } from '../../types'

export type StatementProviderState = {
	orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>]
	filter: [FilterType, React.Dispatch<React.SetStateAction<FilterType>>]
	pagination: [
		PaginationType,
		React.Dispatch<React.SetStateAction<PaginationType>>,
	]
	statements: [
		StatementType[],
		React.Dispatch<React.SetStateAction<StatementType[]>>,
	]
	currentBalance: StatementType | null
	largestBalance: StatementType | null
	clearFilter: () => void
}

export type FilterType = {
	search: string
	minValue?: number
	maxValue?: number
}
