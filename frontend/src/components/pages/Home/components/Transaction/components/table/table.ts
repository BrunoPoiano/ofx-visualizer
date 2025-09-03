import type { TransactionType } from '@/components/pages/Home/types';

export type TableInfoType = {
	id: keyof TransactionType;
	label: string;
};

export const TableInfo = [
	{
		label: 'Date',
		id: 'date',
	},
	{
		label: 'Type',
		id: 'type',
	},
	{
		label: 'Value',
		id: 'value',
	},
	{
		label: 'Description',
		id: 'desc',
	},
	{
		label: 'Info',
		id: 'source_id',
	},
] satisfies TableInfoType[];

export const TableInfoSmall = [
	{
		label: 'Date',
		id: 'date',
	},
	{
		label: 'Type',
		id: 'type',
	},
	{
		label: 'Value',
		id: 'value',
	},
] satisfies TableInfoType[];
