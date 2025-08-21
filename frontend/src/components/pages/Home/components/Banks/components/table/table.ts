import type { BankType } from '@/components/pages/Home/types';

export type TableInfoType = {
	id: keyof BankType;
	label: string;
};

export const TableInfo = [
	{
		label: 'Id',
		id: 'id',
	},
	{
		label: 'Account Id',
		id: 'account_id',
	},
	{
		label: 'Name',
		id: 'name',
	},
] satisfies TableInfoType[];
