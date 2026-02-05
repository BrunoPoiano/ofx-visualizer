import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'
import { useDebounce } from '@/lib/debounce'
import useLocalStorage from '@/lib/localstorage'
import { getSources } from './functions'
import type { BankType, DefaultFilterType, SourceType } from './types'
import { tryCatch } from '@/lib/tryCatch'
import { toast } from 'sonner'

export type HomeProviderState = {
	showValue: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	defaultFilter: [
		DefaultFilterType,
		React.Dispatch<React.SetStateAction<DefaultFilterType>>
	]
	banks: [
		Array<BankType>,
		React.Dispatch<React.SetStateAction<Array<BankType>>>
	]
	getSourcesFunc: () => void
	sources: Array<SourceType>
}

const HomeProviderContext = createContext<HomeProviderState>(
	{} as HomeProviderState
)

export function HomeProvider({ children }: { children: React.ReactNode }) {
	const [showValue, setShowValue] = useState(true)
	const [banks, setBanks] = useState<BankType[]>([])
	const [sources, setSources] = useState<SourceType[]>([])
	const [defaultFilter, setDefaultFilter] = useLocalStorage<DefaultFilterType>(
		'DEFAULT_FILTER',
		{
			date: undefined,
			source_id: ''
		}
	)

	const getSourcesFunc = useDebounce(
		// biome-ignore lint/correctness/useExhaustiveDependencies: <prevent loop>
		useCallback(async () => {
			const [data, error] = await tryCatch(getSources())

			if (error) {
				toast.error('Error getting Bank list.', {
					style: { background: 'var(--destructive)' }
				})
			} else {
				setSources(() => {
					if (defaultFilter.source_id === '' && data.length > 0) {
						setDefaultFilter((prev_filter) => ({
							...prev_filter,
							source_id: data[0].id.toString()
						}))
					}

					return data
				})
			}
		}, []),
		500
	)

	useEffect(() => {
		getSourcesFunc()
	}, [getSourcesFunc])

	return (
		<HomeProviderContext.Provider
			value={{
				sources,
				showValue: [showValue, setShowValue],
				defaultFilter: [defaultFilter, setDefaultFilter],
				banks: [banks, setBanks],
				getSourcesFunc
			}}
		>
			{children}
		</HomeProviderContext.Provider>
	)
}

export const useHomeContext = () => {
	const context = useContext(HomeProviderContext)

	if (context === undefined)
		throw new Error('useHomeContext must be used within a HomeProviderContext')

	return context
}
