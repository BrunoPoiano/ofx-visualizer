import type {
	TableInfoType,
	TransactionType
} from '@/components/pages/Home/types'

export const TableInfo: TableInfoType<keyof TransactionType>[] = [
	{
		label: 'Date',
		id: 'date',
		showValue: true
	},
	{
		label: 'Type',
		id: 'type'
	},
	{
		label: 'Value',
		id: 'value'
	},
	{
		label: 'Description',
		id: 'desc',
		class: 'text-left',
		style: { maxWidth: '30ch' }
	},
	{
		label: 'Tags',
		id: 'tags'
	},
	{
		label: 'Info',
		id: 'options'
	}
]

export const TableInfoSmall: TableInfoType<keyof TransactionType>[] = [
	{
		label: 'Date',
		id: 'date'
	},
	{
		label: 'Type',
		id: 'type'
	},
	{
		label: 'Value',
		id: 'value'
	}
]
