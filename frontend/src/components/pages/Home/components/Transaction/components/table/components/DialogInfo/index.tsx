import { useHomeContext } from '@/components/pages/Home/provider'
import type { TransactionType } from '@/components/pages/Home/types'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
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
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' disabled={!value}>
					Info
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{item.id}</DialogTitle>
					<b>{source_name}</b>

					<div className='flex gap-[0.5ch]'>
						<span>{item.type}</span>
						<span>{formatMoney(item.value)}</span>
						<span className='ml-auto'>{parseDate(item.date)}</span>
					</div>
					<DialogDescription>{item.desc}</DialogDescription>
					<div className='flex gap-1'>
						{item.tags.map((item) => (
							<Badge variant='outline' key={item}>
								{item}
							</Badge>
						))}
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
