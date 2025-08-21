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
import type { BankType, OrderBy } from '../../types';
import type { BanksProviderState, FilterType } from './types';

const BanksProviderContext = createContext<BanksProviderState>(
	{} as BanksProviderState,
);

export function BanksProvider({ children }: { children: React.ReactNode }) {
	const [banks, setBanks] = useState<BankType[]>([]);
	const [filter, setFilter] = useLocalStorage<FilterType>('FILTER_BANK', {
		search: '',
	});

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: Every change on the filters, the pagination returns to page 1
	useEffect(() => {
		setPagination((prev) => ({ ...prev, current_page: 1 }));
	}, [filter]);

	const getBanksFunc = useDebounce(
		useCallback(async () => {
			const requestParams = {
				current_page: pagination.current_page?.toString(),
				per_page: pagination.per_page?.toString(),
				...(orderBy.order ? { order: orderBy.order?.toString() } : {}),
				...(orderBy.direction
					? { direction: orderBy.direction?.toString() }
					: {}),
				...(filter.search ? { search: filter.search } : {}),
			};

			const { data } = await getBanks(requestParams);

			setBanks(data);
		}, [pagination.current_page, pagination.per_page, filter, orderBy]),
		500,
	);

	useEffect(() => {
		getBanksFunc();
	}, [getBanksFunc]);

	return (
		<BanksProviderContext.Provider
			value={{
				banks: [banks, setBanks],
				orderBy: [orderBy, setOrderBy],
				filter: [filter, setFilter],
				pagination: [pagination, setPagination],
				getBanksFunc,
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
