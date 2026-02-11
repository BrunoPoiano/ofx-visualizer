import { useHomeContext } from '@/components/pages/Home/provider'
import type { TransactionType } from '@/components/pages/Home/types'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatMoney, parseDate } from '@/lib/utils'

export default function DialogInfo({ item }: { item: TransactionType }) {
	const {
		sources,
		showValue: [value]
	} = useHomeContext()

	const source_name = sources.filter(
		(source) => source.id === item.source_id
	)[0].name

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='outline' disabled={!value}>
					Info
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{item.id}</AlertDialogTitle>
					<b>{source_name}</b>
					<div className='flex gap-1'>
						{item.tags.map((item) => (
							<Badge variant='outline' key={item}>
								{item}
							</Badge>
						))}
					</div>
					<div className='flex gap-[0.5ch]'>
						<span>{item.type}</span>
						<span>{formatMoney(item.value)}</span>
						<span className='ml-auto'>{parseDate(item.date)}</span>
					</div>
					<AlertDialogDescription>{item.desc}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>OK</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
