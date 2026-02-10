import { AppTable } from '@/components/global/appTable'
import { useHomeContext } from '@/components/pages/Home/provider'
import { formatMoney, parseDate } from '@/lib/utils'
import { useTransactionContext } from '../../provider'
import { TableInfo, TableInfoSmall } from './table'
import { lazy } from 'react'

const DialogInfo = lazy(() => import('./components/DialogInfo'))

export default function Table({ small = false }: { small?: boolean }) {
	const {
		transactions: [transactions],
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination]
	} = useTransactionContext()
	const {
		showValue: [showValue]
	} = useHomeContext()

	const tableData = transactions.map((item) => {
		return {
			id: item.id,
			date: parseDate(item.date),
			type: item.type,
			value: formatMoney(item.value),
			desc: item.desc,
			tags: item.tags.join(','),
			options: <DialogInfo item={item} />
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
