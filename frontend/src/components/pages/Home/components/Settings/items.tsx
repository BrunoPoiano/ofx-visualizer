import { ModeSelect } from '@/components/ui/mode-select'
import { lazy, type ReactNode } from 'react'
const DialogTag = lazy(() => import('./components/DialogTag'))

type Items = {
	label: string
	setting: ReactNode
}

export const Items: Array<Items> = [
	{
		label: 'Mode',
		setting: <ModeSelect />
	},
	{
		label: 'Tags',
		setting: <DialogTag />
	}
]
