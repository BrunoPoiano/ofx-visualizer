import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLocalStorage from '@/lib/localstorage';
import { StatementsSection } from './components/Statement';
import { TransactionSection } from './components/Transaction';
import { AppHeader } from './components/header';
import { HomeProvider } from './provider';

export const HomePage = () => {
	const [tab, setTab] = useLocalStorage('TAB', 'transaction');

	const onTabChange = (value: string) => {
		setTab(value);
	};
	return (
		<HomeProvider>
			<AppHeader />
			<Tabs
				value={tab}
				onValueChange={onTabChange}
				defaultValue="transaction"
				className="w-full"
			>
				<TabsList>
					<TabsTrigger value="transaction">Transactions</TabsTrigger>
					<TabsTrigger value="statement">Statements</TabsTrigger>
				</TabsList>
				<TabsContent value="transaction">
					{tab === 'transaction' ? <TransactionSection /> : ''}
				</TabsContent>
				<TabsContent value="statement">
					{tab === 'statement' ? <StatementsSection /> : ''}
				</TabsContent>
			</Tabs>
		</HomeProvider>
	);
};
