import { AppTable } from '@/components/global/appTable'
import { useHomeContext } from '@/components/pages/Home/provider'
import { useBankContext } from '../../provider'
import { TableInfo } from './table'
import { lazy } from 'react'
import { tryCatch } from '@/lib/tryCatch'
import { toast } from 'sonner'
import { deleteBanks } from '../../functions'

const DeleteModal = lazy(() => import('@/components/global/deleteModal'))
const DialogEdit = lazy(() => import('./components/DialogEdit'))

export default function Table({ small = false }: { small?: boolean }) {
	const {
		showValue: [showValue],
		getSourcesFunc
	} = useHomeContext()

	const {
		orderBy: [orderBy, setOrderBy],
		pagination: [pagination, setPagination],
		banks: [banks],
		getBanksFunc
	} = useBankContext()

	const deletefunc = async (id: number) => {
		const [, error] = await tryCatch(deleteBanks(id))
		if (error) {
			toast.error('Error deleting Bank.', {
				style: { background: 'var(--destructive)' }
			})
		} else {
			getSourcesFunc()
			getBanksFunc()
			toast.success('Bank deleted sucessifully.', {
				style: { background: 'var(--chart-2)' }
			})
		}
	}

	const tableData = banks.map((item) => {
		return {
			...item,
			options: (
				<div className='justify-center-safe flex gap-1'>
					<DialogEdit item={item} />
					<DeleteModal onClick={() => deletefunc(item.id)} />
				</div>
			)
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
