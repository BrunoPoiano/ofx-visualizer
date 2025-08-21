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
import { getBanks } from '../../functions';
import { parseFilterDate } from '../../parsers';
import { useHomeContext } from '../../provider';
import type { BankType, OrderBy } from '../../types';
import type { BanksProviderState, FilterType } from './types';

const BanksProviderContext = createContext<BanksProviderState>(
	{} as BanksProviderState,
);

export function BanksProvider({ children }: { children: React.ReactNode }) {
	const {
		defaultFilter: [defaultFilter, setDefaultFilter],
		banks: [homeBanks],
	} = useHomeContext();

	const [filter, setFilter] = useLocalStorage<FilterType>('FILTER_BANK', {
		search: '',
	});

	const [banks, setBanks] = useState<BankType[]>(homeBanks || []);

	const [orderBy, setOrderBy] = useLocalStorage<OrderBy>('ORDERBY_BANK', {
		direction: 'DESC',
		order: 'start_date',
	});

	const [pagination, setPagination] = useLocalStorage<PaginationType>(
		'PAGINATION_BANK',
		{
			per_page: 5,
			total_items: 0,
			last_page: 1,
			current_page: 1,
		},
	);

	const getBanksFunc = useDebounce(
		useCallback(async () => {
			const { data, paginationContent } = await getBanks({
				current_page: pagination.current_page.toString(),
				per_page: pagination.per_page.toString(),
				search: filter.search,
				...(defaultFilter.date ? parseFilterDate(defaultFilter.date) : {}),
				...(defaultFilter.bank_id ? { bank_id: defaultFilter.bank_id } : {}),
				...(orderBy.order ? { order: orderBy.order } : {}),
				...(orderBy.direction ? { direction: orderBy.direction } : {}),
			});
			setPagination(paginationContent);
			setBanks(data);
		}, [
			defaultFilter.bank_id,
			defaultFilter.date,
			pagination.current_page,
			pagination.per_page,
			filter,
			orderBy,
			setPagination,
		]),
		500,
	);

	const clearFilter = () => {
		setFilter({
			search: '',
		});

		setOrderBy({
			order: 'start_date',
			direction: 'DESC',
		});

		setDefaultFilter({
			date: undefined,
			bank_id: banks[0].id.toString() || '',
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getBanksFunc();
	}, [
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
		<BanksProviderContext.Provider
			value={{
				orderBy: [orderBy, setOrderBy],
				filter: [filter, setFilter],
				pagination: [pagination, setPagination],
				banks: [banks, setBanks],
				clearFilter,
			}}
		>
			{children}
		</BanksProviderContext.Provider>
	);
}

export const useBankContext = () => {
	const context = useContext(BanksProviderContext);

	if (context === undefined)
		throw new Error(
			'useBankContext must be used within a BanksProviderContext',
		);

	return context;
};
