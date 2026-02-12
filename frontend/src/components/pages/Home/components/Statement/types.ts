import type { PaginationType } from '@/types'
import type { OrderBy, StatementType, TypeAndSetState } from '../../types'

export type StatementProviderState = {
	orderBy: TypeAndSetState<OrderBy>
	filter: TypeAndSetState<FilterType>
	pagination: TypeAndSetState<PaginationType>
	statements: TypeAndSetState<StatementType[]>
	currentBalance: StatementType | null
	largestBalance: StatementType | null
	clearFilter: () => void
}

export type FilterType = {
	search: string
	minValue?: number
	maxValue?: number
}
