import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLocalStorage from '@/lib/localstorage';
import { BanksSection } from './components/Banks';
import { AppHeader } from './components/header';
import { StatementsSection } from './components/Statement';
import { TransactionSection } from './components/Transaction';
import { HomeProvider } from './provider';
import type { HomeTabs } from './types';

const homePageTabs: (HomeTabs & { label: string })[] = [
	{
		label: 'Transactions',
		tab: 'transaction',
		content: <TransactionSection />,
	},
	{
		label: 'Statements',
		tab: 'statement',
		content: <StatementsSection />,
	},
	{
		label: 'Banks',
		tab: 'banks',
		content: <BanksSection />,
	},
];

export const HomePage = () => {
	const [tab, setTab] = useLocalStorage('TAB', 'transaction');
	const [tabKey, setTabKey] = useState(1);

	const onTabChange = (value: string) => {
		setTab(value);
	};

	return (
		<HomeProvider>
			<AppHeader setTabKey={setTabKey} />
			<Tabs
				value={tab}
				onValueChange={onTabChange}
				defaultValue='transaction'
				className='w-full'
			>
				<TabsList>
					{homePageTabs.map((item) => (
						<TabsTrigger key={item.tab} value={item.tab}>
							{item.label}
						</TabsTrigger>
					))}
				</TabsList>

				{homePageTabs.map((item) => (
					<TabsContent key={`${item.tab}-${tabKey}`} value={item.tab}>
						{item.content}
					</TabsContent>
				))}
			</Tabs>
		</HomeProvider>
	);
};
