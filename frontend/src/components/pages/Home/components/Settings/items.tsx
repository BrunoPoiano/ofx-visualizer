import { ModeSelect } from '@/components/ui/mode-select'
import type { ReactNode } from 'react'

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
		setting: <ModeSelect />
	}
]
