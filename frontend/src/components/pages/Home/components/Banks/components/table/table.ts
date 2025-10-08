import type { BankType, TableInfoType } from '@/components/pages/Home/types'

export const TableInfo = [
	{
		label: 'Id',
		id: 'id'
	},

	{
		label: 'Name',
		id: 'name'
	},
	{
		label: 'Account Type',
		id: 'account_type'
	},
	{
		label: 'Account Id',
		id: 'account_id'
	},

	{
		label: 'Bank Id',
		id: 'bank_id'
	},
	{
		label: 'Branch Id',
		id: 'branch_id'
	},
	{
		label: 'Options',
		id: 'options'
	}
] satisfies TableInfoType<keyof BankType>[]
