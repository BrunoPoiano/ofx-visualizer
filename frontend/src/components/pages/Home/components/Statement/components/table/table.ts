import type { StatementType } from '@/components/pages/Home/types';

export type TableInfoType = {
	id: keyof StatementType;
	label: string;
};

export const TableInfo = <TableInfoType[]>[
	{
		label: 'Date',
		id: 'start_date',
	},
	{
		label: 'Ledger balance',
		id: 'ledger_balance',
	},
	{
		label: 'Balance',
		id: 'balance',
	},
];
