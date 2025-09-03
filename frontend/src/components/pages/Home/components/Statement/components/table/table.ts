import type {
	StatementType,
	TableInfoType,
} from '@/components/pages/Home/types';

export const TableInfo = [
	{
		label: 'Date',
		id: 'start_date',
		showValue: true,
	},
	{
		label: 'Ledger balance',
		id: 'ledger_balance',
	},
	{
		label: 'Yields',
		id: 'yields',
	},
] satisfies TableInfoType<keyof StatementType>[];
