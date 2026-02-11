import { lazy, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useLocalStorage from '@/lib/localstorage'
import { AppHeader } from './components/header'
import { HomeProvider } from './provider'
import type { HomeTabs } from './types'

const TransactionSection = lazy(() => import('./components/Transaction'))
const StatementsSection = lazy(() => import('./components/Statement'))
const BanksSection = lazy(() => import('./components/Banks'))
const SettingsSection = lazy(() => import('./components/Settings'))

const homePageTabs: (HomeTabs & { label: string })[] = [
	{
		label: 'Transactions',
		tab: 'transaction',
		content: <TransactionSection />
	},
	{
		label: 'Statements',
		tab: 'statement',
		content: <StatementsSection />
	},
	{
		label: 'Banks',
		tab: 'bank',
		content: <BanksSection />
	},
	{
		label: 'Settings',
		tab: 'settings',
		content: <SettingsSection />
	}
]

export const HomePage = () => {
	const [tab, setTab] = useLocalStorage('TAB', 'transaction')
	const [tabKey, setTabKey] = useState(1)

	const onTabChange = (value: string) => {
		setTab(value)
	}

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
	)
}
