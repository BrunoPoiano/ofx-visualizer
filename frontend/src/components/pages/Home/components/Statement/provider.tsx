import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import { toast } from 'sonner'
import { useDebounce } from '@/lib/debounce'
import useLocalStorage from '@/lib/localstorage'
import { tryCatch } from '@/lib/tryCatch'
import type { PaginationType } from '@/types'
import { getStatesments, getStatesmentsInfo } from '../../functions'
import { parseFilterDate } from '../../parsers'
import { useHomeContext } from '../../provider'
import type { OrderBy, StatementType } from '../../types'
import type { FilterType, StatementProviderState } from './types'

const StatementProviderContext = createContext<StatementProviderState>(
	{} as StatementProviderState,
)

export function StatementProvider({ children }: { children: React.ReactNode }) {
	const {
		defaultFilter: [defaultFilter, setDefaultFilter],
		banks: [banks],
		sources,
	} = useHomeContext()

	const [filter, setFilter] = useLocalStorage<FilterType>('FILTER_STATEMENT', {
		search: '',
		maxValue: undefined,
		minValue: undefined,
	})

	const [orderBy, setOrderBy] = useLocalStorage<OrderBy>('ORDERBY_STATEMENT', {
		direction: 'DESC',
		order: 'start_date',
	})

	const [pagination, setPagination] = useLocalStorage<PaginationType>(
		'PAGINATION_STATEMENT',
		{
			per_page: 5,
			total_items: 0,
			last_page: 1,
			current_page: 1,
		},
	)

	const [statements, setStatements] = useState<StatementType[]>([])
	const [currentBalance, setCurrentBalance] = useState<StatementType | null>(
		null,
	)
	const [largestBalance, setLargestBalance] = useState<StatementType | null>(
		null,
	)

	const getStatementFunc = useDebounce(
		useCallback(async () => {
			const [response, error] = await tryCatch(
				getStatesments({
					current_page: pagination.current_page.toString(),
					per_page: pagination.per_page.toString(),
					search: filter.search,
					...(defaultFilter.date ? parseFilterDate(defaultFilter.date) : {}),
					...(defaultFilter.source_id
						? { source_id: defaultFilter.source_id }
						: {}),
					...(filter.minValue ? { min_value: filter.minValue.toString() } : {}),
					...(filter.maxValue ? { max_value: filter.maxValue.toString() } : {}),
					...(orderBy.order ? { order: orderBy.order } : {}),
					...(orderBy.direction ? { direction: orderBy.direction } : {}),
				}),
			)
			if (error) {
				toast.error('Error getting Statesments.', {
					style: { background: 'var(--destructive)' },
				})
				return
			}

			setPagination(response.paginationContent)
			setStatements(response.data)
		}, [
			defaultFilter.source_id,
			defaultFilter.date,
			pagination.current_page,
			pagination.per_page,
			filter,
			orderBy,
			setPagination,
		]),
		500,
	)

	const clearFilter = () => {
		setFilter({
			search: '',
			maxValue: undefined,
			minValue: undefined,
		})

		setOrderBy({
			order: 'start_date',
			direction: 'DESC',
		})

		setDefaultFilter({
			date: undefined,
			source_id: sources[0].id.toString() || '',
		})
	}

	const getStatesmentsInfoFunc = useCallback(async () => {
		if (!defaultFilter.source_id) return

		const [response, error] = await tryCatch(
			getStatesmentsInfo(defaultFilter.source_id),
		)

		if (error) {
			toast.error('Error getting Statesments Info.', {
				style: { background: 'var(--destructive)' },
			})
			return
		}

		setCurrentBalance(response.currentBalance)
		setLargestBalance(response.largestBalance)
	}, [defaultFilter.source_id])

	useEffect(() => {
		getStatesmentsInfoFunc()
	}, [getStatesmentsInfoFunc])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Run getStatementFunc every time something important changes>
	useEffect(() => {
		getStatementFunc()
	}, [
		banks,
		pagination.current_page,
		pagination.per_page,
		filter,
		orderBy,
		defaultFilter,
	])

	// biome-ignore lint/correctness/useExhaustiveDependencies: Every change on the filters, the pagination returns to page 1
	useEffect(() => {
		setPagination((prev) => ({ ...prev, current_page: 1 }))
	}, [filter])

	return (
		<StatementProviderContext.Provider
			value={{
				orderBy: [orderBy, setOrderBy],
				filter: [filter, setFilter],
				pagination: [pagination, setPagination],
				statements: [statements, setStatements],
				clearFilter,
				currentBalance,
				largestBalance,
			}}
		>
			{children}
		</StatementProviderContext.Provider>
	)
}

export const useStatementContext = () => {
	const context = useContext(StatementProviderContext)

	if (context === undefined)
		throw new Error(
			'useStatementContext must be used within a StatementProviderContext',
		)

	return context
}
