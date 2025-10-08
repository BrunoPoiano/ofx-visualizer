import { AppTable } from '@/components/global/appTable'
import { useHomeContext } from '@/components/pages/Home/provider'
import { parseDate } from '@/lib/utils'
import { useTransactionContext } from '../../provider'
import { DialogInfo } from './components/DialogInfo'
import { TableInfo, TableInfoSmall } from './table'

export const Table = ({ small = false }: { small?: boolean }) => {
	const {
		transactions: [transactions],
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination],
	} = useTransactionContext()
	const {
		showValue: [showValue],
	} = useHomeContext()

	const tableData = transactions.map((item) => {
		return {
			id: item.id,
			date: parseDate(item.date),
			type: item.type,
			value: item.value.toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			}),
			desc: item.desc,
			options: <DialogInfo item={item} />,
		}
	})

	return (
		<AppTable<(typeof tableData)[number]>
			orderBy={[orderBy, setOrderBy]}
			pagination={[pagination, setPagination]}
			tableData={tableData}
			showValue={showValue}
			tableContentSmall={TableInfoSmall}
			tableContent={TableInfo}
			small={small}
		/>
	)
}
