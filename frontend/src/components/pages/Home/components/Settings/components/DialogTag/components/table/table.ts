import type { TableInfoType, TagType } from '@/components/pages/Home/types'

export const TableInfo = [
	{
		label: 'Label',
		id: 'name'
	},
	{
		label: '',
		id: 'options'
	}
] satisfies TableInfoType<keyof TagType>[]
