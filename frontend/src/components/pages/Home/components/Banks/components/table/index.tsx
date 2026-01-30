import { AppTable } from '@/components/global/appTable'
import { useHomeContext } from '@/components/pages/Home/provider'
import { useBankContext } from '../../provider'
import { DialogEdit } from './components/DialogEdit'
import { TableInfo } from './table'

export default function Table({ small = false }: { small?: boolean }) {
	const {
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination],
		banks: [banks]
	} = useBankContext()

	const {
		showValue: [showValue]
	} = useHomeContext()

	const tableData = banks.map((item) => {
		return {
			...item,
			options: <DialogEdit item={item} />
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
