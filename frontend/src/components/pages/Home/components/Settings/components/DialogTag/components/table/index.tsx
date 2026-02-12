import { AppTable } from '@/components/global/appTable'
import { useHomeContext } from '@/components/pages/Home/provider'
import { TableInfo } from './table'
import { useDialogTagContext } from '../../provider'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

export default function Table() {
	const { tags, deleteItem, paginationState } = useDialogTagContext()

	const {
		showValue: [showValue]
	} = useHomeContext()

	const tableData = tags.map((item) => {
		return {
			name: item.name,
			options: (
				<div className='flex justify-end'>
					<Button
						className='bg-destructive'
						onClick={() => deleteItem(item.id)}
					>
						<Trash />
					</Button>
				</div>
			)
		}
	})

	return (
		<AppTable<(typeof tableData)[number]>
			tableData={tableData}
			showValue={showValue}
			pagination={paginationState}
			tableContent={TableInfo}
			small
		/>
	)
}
