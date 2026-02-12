import { useHomeContext } from '@/components/pages/Home/provider'
import type { StatementType } from '@/components/pages/Home/types'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { formatMoney } from '@/lib/utils'

export default function DialogInfo({ item }: { item: StatementType }) {
	const {
		showValue: [value]
	} = useHomeContext()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' disabled={item.yields.length === 0 || !value}>
					Info
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Balances</DialogTitle>
				{item.yields.map((yieldItem) => (
					<Card key={`${yieldItem.statement_id}:${yieldItem.id}`}>
						<CardTitle className='px-6'>{yieldItem.name}</CardTitle>
						<CardContent>
							<p>{yieldItem.desc}</p>
							<p>{formatMoney(yieldItem.value)}</p>
						</CardContent>
					</Card>
				))}
			</DialogContent>
		</Dialog>
	)
}
