import { AppTable } from '@/components/global/appTable';
import { useHomeContext } from '@/components/pages/Home/provider';
import { parseDate } from '@/lib/utils';
import { useStatementContext } from '../../provider';
import { DialogInfo } from './components/DialogIngfo';
import { TableInfo, type TableInfoType } from './table';

export const Table = ({ small = false }: { small?: boolean }) => {
	const {
		statements: [statements],
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination],
	} = useStatementContext();
	const {
		showValue: [showValue],
	} = useHomeContext();

	const tableData = statements.map((item) => {
		return {
			start_date: parseDate(item.start_date, item.end_date),
			ledger_balance: item.ledger_balance.toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			}),
			balance: <DialogInfo item={item} />,
		};
	});

	return (
		<AppTable<(typeof tableData)[number], TableInfoType>
			orderBy={[orderBy, setOrderBy]}
			pagination={[pagination, setPagination]}
			tableData={tableData}
			showValue={showValue}
			tableContent={TableInfo}
			small={small}
		/>
	);
};
