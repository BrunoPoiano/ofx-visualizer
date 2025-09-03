import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useDebounce } from '@/lib/debounce';
import useLocalStorage from '@/lib/localstorage';
import type { PaginationType } from '@/types';
import { getTransactions, getTransactionsInfo } from '../../functions';
import { parseFilterDate } from '../../parsers';
import { useHomeContext } from '../../provider';
import type {
	OrderBy,
	TransactionInfoType,
	TransactionType,
} from '../../types';
import type {
	FilterType,
	TransactionProviderProps,
	TransactionProviderState,
} from './types';

const TransactionProviderContext = createContext<TransactionProviderState>(
	{} as TransactionProviderState,
);

export function TransactionProvider({ children }: TransactionProviderProps) {
	const { sources } = useHomeContext();
	const [transactionsInfo, setTransactionsInfo] =
		useState<TransactionInfoType>();

	const [filter, setFilter] = useLocalStorage<FilterType>(
		'FILTER_TRANSACTION',
		{
			search: '',
			minValue: undefined,
			maxValue: undefined,
			type: '',
		},
	);

	const [orderBy, setOrderBy] = useLocalStorage<OrderBy>(
		'ORDERBY_TRANSACTION',
		{
			direction: 'DESC',
			order: 'date',
		},
	);

	const [pagination, setPagination] = useState<PaginationType>({
		per_page: 5,
		total_items: 0,
		last_page: 1,
		current_page: 1,
	});

	const {
		defaultFilter: [defaultFilter, setDefaultFilter],
		banks: [banks],
	} = useHomeContext();

	const [transactions, setTransactions] = useState<TransactionType[]>([]);

	const getTransactionsFunc = useDebounce(
		useCallback(async () => {
			const { data, paginationContent } = await getTransactions({
				current_page: pagination.current_page.toString(),
				per_page: pagination.per_page.toString(),
				search: filter.search,
				...(filter.minValue ? { min_value: filter.minValue.toString() } : {}),
				...(filter.maxValue ? { max_value: filter.maxValue.toString() } : {}),
				...(defaultFilter.date ? parseFilterDate(defaultFilter.date) : {}),
				...(filter.type ? { type: filter.type } : {}),
				...(defaultFilter.source_id
					? { source_id: defaultFilter.source_id }
					: {}),
				...(orderBy.order ? { order: orderBy.order } : {}),
				...(orderBy.direction ? { direction: orderBy.direction } : {}),
			});
			setPagination(paginationContent);
			setTransactions(data);
		}, [
			pagination.current_page,
			pagination.per_page,
			filter,
			orderBy,
			defaultFilter,
		]),
		500,
	);

	const getTransactionInfoFunc = useCallback(async () => {
		if (!defaultFilter.source_id) return;
		const response = await getTransactionsInfo({
			source_id: defaultFilter.source_id,
		});
		setTransactionsInfo(response);
	}, [defaultFilter.source_id]);

	const clearFilter = () => {
		setFilter({
			search: '',
			minValue: undefined,
			maxValue: undefined,
			type: '',
		});

		setOrderBy({
			order: 'date',
			direction: 'DESC',
		});

		setDefaultFilter({
			date: undefined,
			source_id: sources[0].id.toString() || '',
		});
	};

	useEffect(() => {
		getTransactionInfoFunc();
	}, [getTransactionInfoFunc]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Run getTransactionsFunc every time something important changes>
	useEffect(() => {
		getTransactionsFunc();
	}, [
		banks,
		pagination.current_page,
		pagination.per_page,
		filter,
		orderBy,
		defaultFilter,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Every change on the filters, the pagination returns to page 1
	useEffect(() => {
		setPagination((prev) => ({ ...prev, current_page: 1 }));
	}, [filter]);

	return (
		<TransactionProviderContext.Provider
			value={{
				orderBy: [orderBy, setOrderBy],
				filter: [filter, setFilter],
				pagination: [pagination, setPagination],
				transactions: [transactions, setTransactions],
				transactionsInfo: [transactionsInfo, setTransactionsInfo],
				clearFilter,
				getTransactionsFunc,
				getTransactionInfoFunc,
			}}
		>
			{children}
		</TransactionProviderContext.Provider>
	);
}

export const useTransactionContext = () => {
	const context = useContext(TransactionProviderContext);

	if (context === undefined)
		throw new Error(
			'useTransactionContext must be used within a TransactionProviderContext',
		);

	return context;
};
