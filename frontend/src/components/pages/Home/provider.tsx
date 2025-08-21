import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useDebounce } from '@/lib/debounce';
import useLocalStorage from '@/lib/localstorage';
import { getBanks } from './functions';
import type { BankType, DefaultFilterType, GetBanksFuncParams } from './types';

export type HomeProviderState = {
	showValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	defaultFilter: [
		DefaultFilterType,
		React.Dispatch<React.SetStateAction<DefaultFilterType>>,
	];
	banks: [BankType[], React.Dispatch<React.SetStateAction<BankType[]>>];
	getBanksFunc: (params?: GetBanksFuncParams) => void;
};

const HomeProviderContext = createContext<HomeProviderState>(
	{} as HomeProviderState,
);

export function HomeProvider({ children }: { children: React.ReactNode }) {
	const [showValue, setShowValue] = useState(true);
	const [banks, setBanks] = useState<BankType[]>([]);
	const [defaultFilter, setDefaultFilter] = useLocalStorage<DefaultFilterType>(
		'DEFAULT_FILTER',
		{
			date: undefined,
			bank_id: '',
		},
	);
	const getBanksFunc = useDebounce(
		// biome-ignore lint/correctness/useExhaustiveDependencies: setDefaultFilter remove to prevent infinity loop
		useCallback(async () => {
			const requestParams = {
				current_page: '1',
				per_page: '1000',
			};

			const { data } = await getBanks(requestParams);

			setBanks(() => {
				if (defaultFilter.bank_id === '' && data.length > 0) {
					setDefaultFilter((prev_filter) => ({
						...prev_filter,
						bank_id: data[0].id.toString(),
					}));
				}
				return data;
			});
		}, []),
		500,
	);

	useEffect(() => {
		getBanksFunc();
	}, [getBanksFunc]);

	return (
		<HomeProviderContext.Provider
			value={{
				showValue: [showValue, setShowValue],
				defaultFilter: [defaultFilter, setDefaultFilter],
				banks: [banks, setBanks],
				getBanksFunc,
			}}
		>
			{children}
		</HomeProviderContext.Provider>
	);
}

export const useHomeContext = () => {
	const context = useContext(HomeProviderContext);

	if (context === undefined)
		throw new Error('useHomeContext must be used within a HomeProviderContext');

	return context;
};
