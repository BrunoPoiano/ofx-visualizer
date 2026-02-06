import { AppTable } from '@/components/global/appTable'
import { useHomeContext } from '@/components/pages/Home/provider'
import { formatMoney, parseDate } from '@/lib/utils'
import { useStatementContext } from '../../provider'
import { TableInfo } from './table'
import { lazy } from 'react'

const DialogInfo = lazy(() => import('./components/DialogIngfo'))

export default function Table({ small = false }: { small?: boolean }) {
	const {
		statements: [statements],
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination]
	} = useStatementContext()
	const {
		showValue: [showValue]
	} = useHomeContext()

	const tableData = statements.map((item) => {
		return {
			start_date: parseDate(item.start_date, item.end_date),
			ledger_balance: formatMoney(item.ledger_balance),
			yields: <DialogInfo item={item} />
		}
	})

	return (
		<AppTable<(typeof tableData)[number]>
			orderBy={[orderBy, setOrderBy]}
			pagination={[pagination, setPagination]}
			tableData={tableData}
			showValue={showValue}
			tableContent={TableInfo}
			small={small}
		/>
	)
}
