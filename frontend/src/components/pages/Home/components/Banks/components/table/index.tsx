import { AppTable } from '@/components/global/appTable';
import { useHomeContext } from '@/components/pages/Home/provider';
import { useBankContext } from '../../provider';
import { TableInfo, type TableInfoType } from './table';

export const Table = ({ small = false }: { small?: boolean }) => {
	const {
		banks: [banks],
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination],
	} = useBankContext();

	const {
		showValue: [showValue],
	} = useHomeContext();

	return (
		<AppTable<(typeof banks)[number], TableInfoType>
			orderBy={[orderBy, setOrderBy]}
			pagination={[pagination, setPagination]}
			tableData={banks}
			showValue={showValue}
			tableContent={TableInfo}
			small={small}
		/>
	);
};
